const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { sessionIsCurrent } = require('../lib/server/sessionPolicy.cjs');
const expiry = Math.floor(Date.now() / 1000) + 3600;
const access = `header.${Buffer.from(JSON.stringify({ exp: expiry })).toString('base64url')}.signature`;
const validSession = { user: { id: 'owner', supabaseAccessToken: access } };
async function load(relative, mocks = {}, env = {}) {
  const context = vm.createContext({ console: { log() {}, error() {} }, process: { env }, Buffer, Date });
  const module = new vm.SourceTextModule(fs.readFileSync(path.join(__dirname, '..', relative), 'utf8'), { context });
  await module.link((name) => {
    const exports = mocks[name];
    if (!exports) throw new Error(`Unexpected import: ${name}`);
    return new vm.SyntheticModule(Object.keys(exports), function () { for (const [key, value] of Object.entries(exports)) this.setExport(key, value); }, { context });
  });
  await module.evaluate();
  return module.namespace;
}
function response() {
  return { code: null, body: null, headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
}
async function bookingHandler(session, client) {
  return (await load('pages/api/bookings/index.js', {
    '@/lib/server/supabaseForSession': { supabaseForSession: () => client },
    'next-auth': { getServerSession: async () => session },
    '@/lib/authOptions': { authOptions: {} },
    '@/lib/server/sessionPolicy.cjs': { sessionIsCurrent },
  })).default;
}

test('public registration never accepts passwords, caller roles or approval flags', async () => {
  const handler = (await load('pages/api/register.js')).default;
  for (const method of ['GET', 'POST', 'PUT', 'DELETE']) {
    const res = response();
    await handler({ method, body: { password: 'must-not-store', role: 'super_admin', approved: true } }, res);
    assert.equal(res.code, 410);
    assert.equal(res.headers['Cache-Control'], 'no-store');
    assert(!JSON.stringify(res.body).includes('must-not-store'));
  }
});
test('booking methods and unauthenticated access fail before database access', async () => {
  const handler = await bookingHandler(null, null);
  for (const [method, code] of [['DELETE', 405], ['GET', 401], ['POST', 401]]) {
    const res = response(); await handler({ method, query: {} }, res); assert.equal(res.code, code);
  }
});
test('booking GET refuses another owner and scopes database query', async () => {
  const filters = [];
  const query = { select() { return this; }, eq(k, v) { filters.push([k, v]); return this; }, async order() { return { data: [{ id: 'b1' }], error: null }; } };
  const handler = await bookingHandler(validSession, { from: () => query });
  let res = response(); await handler({ method: 'GET', query: { user_id: 'other' } }, res); assert.equal(res.code, 403); assert.equal(filters.length, 0);
  res = response(); await handler({ method: 'GET', query: {} }, res); assert.equal(res.code, 200); assert.deepEqual(filters, [['user_id', 'owner']]);
});
test('invalid pallets and costs produce 400 rather than a crash or insert', async () => {
  const handler = await bookingHandler(validSession, { from() { throw new Error('Must not insert'); } });
  for (const pallets of [undefined, 'invalid', [null], [[]]]) {
    const res = response(); await handler({ method: 'POST', body: { pallets, collectionPoints: [{}], deliveryPoints: [{}], collection_cost: 0, delivery_cost: 0, total_cost: -1 }, query: {} }, res); assert.equal(res.code, 400);
  }
});
test('booking owner cannot be supplied by caller; insert failures are handled', async () => {
  let inserted;
  const query = { insert(rows) { inserted = rows[0]; return this; }, select() { return this; }, async single() { return { data: { id: 'b1' }, error: null }; } };
  const body = { user_id: 'attacker', pallets: [{}], collectionPoints: [{}], deliveryPoints: [{}], collection_cost: 0, delivery_cost: 0, total_cost: 0 };
  let handler = await bookingHandler(validSession, { from: () => query });
  let res = response(); await handler({ method: 'POST', body, query: {} }, res); assert.equal(res.code, 200); assert.equal(inserted.user_id, 'owner');
  handler = await bookingHandler(validSession, { from() { throw new Error('private backend detail'); } });
  res = response(); await handler({ method: 'POST', body, query: {} }, res); assert.equal(res.code, 500); assert.equal(JSON.stringify(res.body).includes('private backend detail'), false);
});
test('retired endpoints report disabled or unimplemented without importing services', async () => {
  for (const [file, code] of [['haulsync', 410], ['test-supabase-login', 410], ['submit-booking', 501], ['downloads/[filename]', 410], ['add-user', 410], ['employees/reset-password', 410], ['reset-user-password', 410]]) {
    const handler = (await load(`pages/api/${file}.js`)).default;
    const res = response(); await handler({ method: 'POST' }, res); assert.equal(res.code, code);
  }
});
test('global account guard ignores caller roles and rejects expired or ordinary sessions', async () => {
  let session;
  let unavailable = false;
  const guard = (await load('lib/server/requireSuperAdmin.js', {
    'next-auth': { getServerSession: async () => { if (unavailable) throw new Error('backend private detail'); return session; } },
    '@/lib/authOptions': { authOptions: {} },
    './sessionPolicy.cjs': { sessionIsCurrent },
  })).requireSuperAdmin;
  for (const [value, code] of [[null, 401], [validSession, 403], [{ user: { ...validSession.user, role: 'super_admin', supabaseAccessToken: 'expired' } }, 401]]) {
    session = value; const res = response(); assert.equal(await guard({ body: { role: 'super_admin' } }, res), null); assert.equal(res.code, code);
  }
  for (const roleData of [{ role: 'super_admin' }, { roles: ['super_admin'] }]) {
    session = { user: { ...validSession.user, ...roleData } }; const res = response(); assert.equal(await guard({}, res), session); assert.equal(res.code, null);
  }
  unavailable = true; const res = response(); assert.equal(await guard({}, res), null); assert.equal(res.code, 503);
});
test('profile lookup exposes only the signed-in account and never constructs a service client', async () => {
  let session = null;
  const handler = (await load('pages/api/get-user-profile.js', {
    'next-auth': { getServerSession: async () => session },
    '@/lib/authOptions': { authOptions: {} },
    '@/lib/server/sessionPolicy.cjs': { sessionIsCurrent },
  })).default;
  let res = response(); await handler({ method: 'POST', body: { email: 'other@example.invalid' } }, res); assert.equal(res.code, 401);
  session = { user: { ...validSession.user, email: 'owner@example.invalid', role: 'user' } };
  res = response(); await handler({ method: 'POST', body: { email: 'other@example.invalid' } }, res); assert.equal(res.code, 403);
  res = response(); await handler({ method: 'POST', body: { email: 'OWNER@example.invalid' } }, res); assert.equal(res.code, 200); assert.equal(res.body.role, 'user'); assert.equal(res.body.supabaseAccessToken, undefined);
});
test('user listing authorizes before constructing a privileged client', async () => {
  let allowed = false;
  let clients = 0;
  const handler = (await load('pages/api/users.js', {
    '@/lib/server/requireSuperAdmin': { requireSuperAdmin: async (_req, res) => { if (allowed) return validSession; res.status(403).json({ error: 'Forbidden' }); return null; } },
    '@supabase/supabase-js': { createClient: () => { clients += 1; return { from: () => ({ select: async () => ({ data: [{ id: 'u1' }], error: null }) }) }; } },
  })).default;
  let res = response(); await handler({ method: 'POST' }, res); assert.equal(res.code, 405); assert.equal(clients, 0);
  res = response(); await handler({ method: 'GET' }, res); assert.equal(res.code, 403); assert.equal(clients, 0);
  allowed = true; res = response(); await handler({ method: 'GET' }, res); assert.equal(res.code, 200); assert.equal(clients, 1);
});
test('delete-user rejects unauthorized, malformed and self requests; reports partial failures', async () => {
  const target = '12345678-1234-1234-1234-123456789abc';
  let authorized = false;
  let self = false;
  let cleanupError = null;
  let clients = 0;
  let authDeletes = 0;
  const handler = (await load('pages/api/delete-user.js', {
    '@/lib/server/requireSuperAdmin': { requireSuperAdmin: async (_req, res) => { if (authorized) return { user: { id: self ? target : 'owner' } }; res.status(403).json({ error: 'Forbidden' }); return null; } },
    '@supabase/supabase-js': { createClient: () => { clients += 1; return { auth: { admin: { deleteUser: async () => { authDeletes += 1; return { error: null }; } } }, from: () => ({ delete: () => ({ eq: async () => ({ error: cleanupError }) }) }) }; } },
  })).default;
  let res = response(); await handler({ method: 'POST', body: { id: target } }, res); assert.equal(res.code, 403); assert.equal(clients, 0);
  authorized = true;
  for (const id of [undefined, [], 'invalid']) { res = response(); await handler({ method: 'POST', body: { id } }, res); assert.equal(res.code, 400); }
  self = true; res = response(); await handler({ method: 'POST', body: { id: target } }, res); assert.equal(res.code, 409); assert.equal(clients, 0);
  self = false; res = response(); await handler({ method: 'POST', body: { id: target } }, res); assert.equal(res.code, 200); assert.equal(authDeletes, 1);
  cleanupError = { message: 'private backend detail' }; res = response(); await handler({ method: 'POST', body: { id: target } }, res); assert.equal(res.code, 500); assert.equal(res.body.partial, true); assert.equal(JSON.stringify(res.body).includes('private backend detail'), false);
});
test('quote writes require owner verification before route calculation', async () => {
  let routeCalls = 0;
  let priceInput;
  let activeSession = null;
  let owned = false;
  let updateError = null;
  const filters = [];
  const client = { from() {
    let updating = false;
    return { select() { return this; }, eq(key, value) { filters.push([key, value]); return this; }, update() { updating = true; return this; }, async maybeSingle() { return { data: owned ? { id: 'b1' } : null, error: updating ? updateError : null }; } };
  } };
  const handler = (await load('pages/api/quote.js', {
    '@/utils/pricingEngine': { default: (input) => { priceInput = input; return { totalIncVat: 123 }; } },
    '@/utils/resolveRoute': { resolveRoute: async () => { routeCalls += 1; return { totalMiles: 100, legs: [{}], collectionMiles: 100, deliveryMiles: 0, middleMiles: 0, ferryMiles: 0, ferryRoute: null }; } },
    'next-auth': { getServerSession: async () => activeSession },
    '@/lib/authOptions': { authOptions: {} },
    '@/lib/server/supabaseForSession': { supabaseForSession: () => client },
    '@/lib/server/sessionPolicy.cjs': { sessionIsCurrent },
  })).default;
  const req = { method: 'POST', body: { bookingId: 'b1', from: 'M1', to: 'SW1', pallets: [{}] } };
  let res = response(); await handler(req, res); assert.equal(res.code, 401); assert.equal(routeCalls, 0);
  activeSession = validSession;
  res = response(); await handler(req, res); assert.equal(res.code, 404); assert.equal(routeCalls, 0);
  owned = true;
  res = response(); await handler(req, res); assert.equal(res.code, 200); assert.equal(priceInput.collectionMiles, 100); assert.equal(res.body.routeInfo.routeType, 'internal');
  assert.ok(filters.filter(([key, value]) => key === 'user_id' && value === 'owner').length >= 3);
  updateError = { message: 'private detail' };
  res = response(); await handler(req, res); assert.equal(res.code, 500); assert.equal(JSON.stringify(res.body).includes('private detail'), false);
});
test('auth config uses independent login clients and no plaintext password lookup', async () => {
  let clients = 0;
  const user = { id: 'owner', email: 'demo@example.invalid', email_confirmed_at: '2026-01-01T00:00:00Z' };
  const config = (await load('lib/server/authConfig.js', {
    './adminAuthority.cjs': { hasAuthority: async () => false, projectConfig: () => { throw Error('Not configured'); } },
    './enquiryRepository.cjs': { getPool: () => null },
    'next-auth/providers/credentials': { default: (options) => options },
    '@supabase/supabase-js': { createClient: () => {
      clients += 1;
      return { auth: { signInWithPassword: async () => ({ data: { user, session: { access_token: access, refresh_token: 'not-a-real-token' } } }) }, from: () => ({ select() { return this; }, eq() { return this; }, async maybeSingle() { return { data: { name: 'Demo', role: 'user' } }; } }) };
    } },
    './sessionPolicy.cjs': { sessionIsCurrent },
  })).authOptions;
  assert.equal(clients, 0);
  const authorize = config.providers[0].authorize;
  assert.equal(await authorize(undefined), null);
  await Promise.all([authorize({ email: user.email, password: 'demo' }), authorize({ email: user.email, password: 'demo' })]);
  assert.equal(clients, 2);
  const expired = await config.callbacks.jwt({ token: { id: 'owner', supabaseAccessToken: 'bad', supabaseRefreshToken: 'private' } });
  assert.equal(expired.error, 'ReauthenticationRequired'); assert.equal(expired.supabaseAccessToken, undefined); assert.equal(expired.supabaseRefreshToken, undefined);
  assert.equal(config.secret, undefined);
});

test('retired admin email cannot transmit passwords or send uncontrolled email', async () => {
  const handler = (await load('pages/api/send-new-admin-email.js')).default;
  const res = response();
  await handler({ body: JSON.stringify({ name: 'Demo', email: 'recipient@example.invalid', password: 'dummy' }) }, res);
  assert.equal(res.code, 410);
  assert.equal(JSON.stringify(res.body).includes('dummy'), false);
});

test('historical account-creation URLs use the protected provider-only setup page',()=>{
  for(const relative of ['admin/admins/create.js','super/admins/create.js','admin/users/create.js']) {
    const source=fs.readFileSync(path.join(__dirname,'../pages/dashboard',relative),'utf8');
    assert(source.includes("export { default, getServerSideProps } from '@/pages/dashboard/admin/add-admin'"));
    assert(!/bcrypt|rawPassword|\.insert\(/.test(source));
  }
});

test('dedicated provider login grants only authoritative verified admin; session rechecks fail closed', async () => {
  let verified=true, granted=true, available=true;
  const user=()=>({id:'provider-user',email:'stuart@adrcarriers.net',email_confirmed_at:verified?'2026-01-01T00:00:00Z':null,user_metadata:{role:'super_admin'}});
  const config=(await load('lib/server/authConfig.js',{
    'next-auth/providers/credentials':{default:options=>options},
    '@supabase/supabase-js':{createClient:()=>({auth:{
      signInWithPassword:async()=>({data:{user:user(),session:{access_token:access,refresh_token:'synthetic-refresh'}}}),
      getUser:async()=>{if(!available)throw Error('private provider detail');return {data:{user:user()}};},
    }})},
    './sessionPolicy.cjs':{sessionIsCurrent},
    './adminAuthority.cjs':{projectConfig:()=>({url:'https://dedicated.example.invalid'}),hasAuthority:async identity=>Boolean(granted&&identity.email_confirmed_at)},
    './enquiryRepository.cjs':{getPool:()=>({})},
  },{MIDNIGHT_AUTH_PROJECT_REF:'synthetic'})).authOptions;
  const login=()=>config.providers[0].authorize({email:'stuart@adrcarriers.net',password:'synthetic-test-only'});
  verified=false;assert.equal(await login(),null);
  verified=true;granted=false;assert.equal((await login()).role,'customer');
  granted=true;const admin=await login();assert.equal(admin.role,'super_admin');
  const token=await config.callbacks.jwt({token:{},user:admin});assert.equal(token.role,'super_admin');
  granted=false;assert.equal((await config.callbacks.jwt({token})).role,'user');
  granted=true;available=false;const unavailable=await config.callbacks.jwt({token:{},user:admin});assert.equal(unavailable.role,'user');assert.equal(unavailable.error,'ReauthenticationRequired');
});

test('operations status API enforces origin, server role, validation and concurrent-update conflict',async()=>{
  let allowed=false,calls=0,conflict=false;
  const handler=(await load('pages/api/operations/enquiries/[reference]/status.js',{
    '@/lib/server/requireSuperAdmin':{requireSuperAdmin:async(req,res)=>{if(allowed)return {user:{id:'operator'}};res.status(403).json({message:'Denied'});return null;}},
    '@/lib/server/enquiryCapture.cjs':{sameOrigin:req=>req.headers.origin==='https://preview.example.invalid'},
    '@/lib/server/enquiryRepository.cjs':{repository:()=>({changeStatus:async(ref,expected,status,actor)=>{calls++;assert.equal(actor,'operator');return conflict?{conflict:true}:{status};}})},
  })).default;
  const req={method:'POST',headers:{origin:'https://preview.example.invalid'},query:{reference:'MID-'+'A'.repeat(32)},body:{status:'reviewing',expected:'new',role:'super_admin',actor:'attacker'}};
  let res=response();await handler(req,res);assert.equal(res.code,403);assert.equal(calls,0);
  allowed=true;res=response();await handler({...req,headers:{origin:'https://evil.invalid'}},res);assert.equal(res.code,403);assert.equal(calls,0);
  res=response();await handler({...req,body:{status:'automatically-accepted',expected:'new'}},res);assert.equal(res.code,400);
  res=response();await handler(req,res);assert.equal(res.code,200);
  conflict=true;res=response();await handler(req,res);assert.equal(res.code,409);
});
