const { test } = require('node:test');
const assert = require('node:assert/strict');
const { bootstrap, projectConfig, verifiedIdentity, hasAuthority } = require('../lib/server/adminAuthority.cjs');
const project = 'abcdefghijklmnopqrst';
const now = Date.now();
const subject = '12345678-1234-4234-8234-123456789abc';
const user = { id: subject, email: 'stuart@adrcarriers.net', email_confirmed_at: new Date(now-1000).toISOString() };
const env = { MIDNIGHT_AUTH_PROJECT_REF: project, NEXT_PUBLIC_SUPABASE_URL: `https://${project}.supabase.co`, MIDNIGHT_ADMIN_BOOTSTRAP_EXPIRES_AT: new Date(now+300000).toISOString() };
test('bootstrap rejects shared projects, mismatched provider and expired or excessive window', async () => {
  for (const ref of ['', 'rdxolzuofkslgsvvvmrq', 'llxliojjtofqdmddbdud']) assert.throws(() => projectConfig({ ...env, MIDNIGHT_AUTH_PROJECT_REF: ref }));
  assert.throws(() => projectConfig({ ...env, NEXT_PUBLIC_SUPABASE_URL: 'https://other.supabase.co' }));
  for (const deadline of ['',new Date(now-1).toISOString(),new Date(now+3600001).toISOString()]) {
    await assert.rejects(bootstrap({ env: {...env,MIDNIGHT_ADMIN_BOOTSTRAP_EXPIRES_AT:deadline}, now }), /window/);
  }
});
test('only the provider-verified authorised identity is eligible; metadata cannot elevate', async () => {
  for (const value of [null,{...user,email:'attacker@example.invalid'},{...user,email_confirmed_at:null},{...user,is_anonymous:true},{...user,banned_until:new Date(now+100000).toISOString()},{...user,email_confirmed_at:new Date(now+100000).toISOString()}]) {
    assert.equal(verifiedIdentity(value, now), false);
    await assert.rejects(bootstrap({ env, now, subject, auth:{getUserById:async()=>({data:{user:value}})}, db:{query(){throw Error('Must not reach database');}} }), /identity/);
  }
  assert.equal(verifiedIdentity({...user,user_metadata:{role:'customer'}},now),true);
});
test('parallel and repeated bootstrap return one immutable grant without creating accounts', async () => {
  let row;
  const db = {async query(sql,values) {
    if (sql.startsWith('INSERT')) {
      if (row) return {rowCount:0,rows:[]};
      row={provider_project:values[0],subject:values[1],grant_id:values[4]}; return {rowCount:1,rows:[row]};
    }
    return {rowCount:row ? 1:0,rows:row?[row]:[]};
  }};
  const input={env,now,subject,auth:{getUserById:async()=>({data:{user}})},db};
  const results=await Promise.all(Array.from({length:10},()=>bootstrap(input)));
  assert.equal(results.filter(r=>r.created).length,1);
  assert.equal(new Set(results.map(r=>r.grantId)).size,1);
  assert.equal(await hasAuthority(user,env,db),true);
  row.subject='00000000-0000-4000-8000-000000000000';
  await assert.rejects(bootstrap(input),/already bound/);
});
