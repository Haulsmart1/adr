const { test } = require('node:test');
const assert = require('node:assert/strict');
const { normalize, brief } = require('../lib/freight/enquiry.cjs');
const { createHandler, configured } = require('../lib/server/enquiryDelivery.cjs');
const input = () => ({ mode: 'Air', urgency: 'Urgent', dangerousGoods: 'Unsure', collection: 'Paris, France', delivery: 'Oslo, Norway', description: 'Machine parts', name: 'Test Person', email: 'test@example.invalid' });
const env = { MIDNIGHT_ENQUIRY_ENABLED: 'true', MIDNIGHT_ENQUIRY_REDIS_URL: 'rediss://example.invalid', MIDNIGHT_ENQUIRY_HASH_SECRET: 'offline-test-value-'.repeat(3), MIDNIGHT_ENQUIRY_SMTP_HOST: 'example.invalid', MIDNIGHT_ENQUIRY_SMTP_USER: 'test', MIDNIGHT_ENQUIRY_SMTP_PASS: 'test', MIDNIGHT_ENQUIRY_FROM: 'sender@example.invalid', MIDNIGHT_ENQUIRY_TO: 'operations@example.invalid' };
const request = (body = input()) => ({ method: 'POST', headers: { host: 'localhost:3000', origin: 'http://localhost:3000', 'content-type': 'application/json' }, socket: { remoteAddress: '127.0.0.1' }, body });
const response = () => ({ headers: {}, setHeader(k,v) { this.headers[k]=v; }, status(code) { this.statusCode=code; return this; }, json(body) { this.body=body; return this; } });
function setup(overrides = {}) {
  const values = new Map(), counts = new Map(), sent = [];
  const store = { async eval(_, n, key) { const value=(counts.get(key)||0)+1; counts.set(key,value); return value; }, async get(key) { return values.get(key); }, async set(key,value,ex,ttl,nx) { assert.equal(ex,'EX'); assert.equal(ttl,172800); if(nx==='NX'&&values.has(key))return null; values.set(key,value);return 'OK'; } };
  const handler = createHandler({ env, store: async()=>store, send: async message => { sent.push(message); return { accepted: [env.MIDNIGHT_ENQUIRY_TO], rejected: [] }; }, ...overrides });
  return { values, counts, sent, store, async call(req=request()) { const res=response(); await handler(req,res);return res; } };
}
test('minimal multimodal enquiry accepts unknown optional shipment details', () => {
  for(const mode of ['Road','Air','Sea','Please advise']) assert.equal(normalize({...input(),mode}).mode,mode);
  assert(brief(normalize(input())).includes('Paris, France'));
});
test('validation rejects malformed, excessive, missing and header-injection values', () => {
  assert.throws(()=>normalize({...input(),email:'a,b@example.invalid'}));
  for(const patch of [{email:'a@example.invalid\r\nBcc: victim@example.invalid'}, {name:''}, {collection:'x'.repeat(201)}, {notes:{}}, {description:'a\u0000b'}, {mode:'Aircraft owned by Midnight'}, {urgency:'fake'}, {dangerousGoods:''}]) assert.throws(()=>normalize({...input(),...patch}));
  for(const body of [null,[],42])assert.throws(()=>normalize(body));
});
test('DG data appears only when applicable and never implies acceptance', () => {
  const data=normalize({...input(),dangerousGoods:'Yes',unNumber:'UN 3480',shippingName:'Lithium ion batteries',dgClass:'9',documents:'SDS available'});
  assert(brief(data).includes('UN 3480')); assert(brief(data).includes('must be confirmed individually'));
  assert(!brief(normalize({...data,dangerousGoods:'No'})).includes('UN 3480'));
});
test('disabled or incomplete delivery configuration fails closed before provider access', async () => {
  for(const setting of [{}, {...env,MIDNIGHT_ENQUIRY_ENABLED:'false'}, {...env,MIDNIGHT_ENQUIRY_REDIS_URL:'redis://insecure'}, {...env,MIDNIGHT_ENQUIRY_HASH_SECRET:'short'}]) {
    assert.equal(configured(setting),false);
    const r=await setup({env:setting,store:()=>{throw Error('must not connect');}}).call();assert.equal(r.statusCode,503);
  }
});
test('method, content type, origin and validation gates precede external access', async () => {
  const s=setup({store:()=>{throw Error('must not connect');}});
  for(const [patch,code] of [[{method:'GET'},405],[{headers:{...request().headers,origin:'https://evil.invalid'}},403],[{headers:{...request().headers,'content-type':'text/plain'}},415],[{body:{}},400]]) assert.equal((await s.call({...request(),...patch})).statusCode,code);
});
test('operations acceptance is explicit; duplicate requests send once with same reference', async () => {
  const s=setup();const first=await s.call();const second=await s.call();
  assert.equal(first.body.state,'accepted');assert.equal(second.body.reference,first.body.reference);assert.equal(s.sent.length,1);
  assert.equal(s.sent[0].replyTo,input().email);assert.equal(s.sent[0].to,env.MIDNIGHT_ENQUIRY_TO);assert(s.sent[0].text.includes('Originating product: MIDNIGHT'));assert.equal(s.sent[0].html,undefined);
  for(const key of [...s.values.keys(),...s.counts.keys()])assert(!key.includes(input().email));
});
test('concurrent instances sharing the store cannot send duplicate enquiries', async () => {
  let release;const gate=new Promise(resolve=>{release=resolve;});let sends=0;
  const s=setup({send:async()=>{sends++;await gate;return {accepted:[env.MIDNIGHT_ENQUIRY_TO]};}});
  const pending=s.call(); await new Promise(resolve=>setImmediate(resolve));
  const other=setup({store:async()=>s.store,send:async()=>{sends++;}});
  assert.equal((await other.call()).body.state,'unconfirmed');release();await pending;assert.equal(sends,1);
});
test('SMTP timeout or rejection remains uncertain and cannot be automatically resent', async () => {
  for(const send of [async()=>{throw Error('provider password must never leak');},async()=>({accepted:[],rejected:[env.MIDNIGHT_ENQUIRY_TO]}),async()=>({accepted:['other@example.invalid']})]) {
    let calls=0;const s=setup({send:async m=>{calls++;return send(m);}});
    const first=await s.call();assert.equal(first.statusCode,202);assert.equal(first.body.state,'unconfirmed');assert(!JSON.stringify(first.body).includes('password'));
    assert.equal((await s.call()).body.state,'unconfirmed');assert.equal(calls,1);
  }
});
test('storage failure before reservation sends nothing', async () => {
  let sends=0;const s=setup({store:async()=>{throw Error('private redis URI');},send:async()=>{sends++;}});
  assert.equal((await s.call()).statusCode,503);assert.equal(sends,0);
});
test('storage failure after SMTP acceptance keeps the uncertain reservation', async () => {
  const s=setup();const set=s.store.set;
  s.store.set=async (...args)=>{if(args[1]==='accepted')throw Error('offline');return set(...args);};
  assert.equal((await s.call()).body.state,'unconfirmed');assert.equal((await s.call()).body.state,'unconfirmed');assert.equal(s.sent.length,1);
});
test('email and IP rate limits prevent repeated or varied requests without leaking identity', async () => {
  const s=setup();for(let i=0;i<5;i++)await s.call();const limited=await s.call();assert.equal(limited.statusCode,429);assert.equal(limited.headers['Retry-After'],'600');assert.equal(s.sent.length,1);
  const varied=setup();for(let i=0;i<10;i++)assert.equal((await varied.call(request({...input(),email:`test${i}@example.invalid`}))).statusCode,200);
  assert.equal((await varied.call(request({...input(),email:'final@example.invalid'}))).statusCode,429);
});
