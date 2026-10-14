const {test}=require('node:test');
const assert=require('node:assert/strict');
const {Pool}=require('pg');
const {migrate}=require('./migrate-midnight.cjs');
const {bootstrap}=require('../lib/server/adminAuthority.cjs');
const {repository}=require('../lib/server/enquiryRepository.cjs');
const url=process.env.MIDNIGHT_MIGRATION_TEST_DATABASE_URL;
test('empty isolated database reconstructs migrations; authority is immutable and concurrent bootstrap is idempotent',{skip:!url},async()=>{
  assert.match(new URL(url).pathname,/^\/midnight_migration_acceptance_/);
  const db=new Pool({connectionString:url,max:6});
  try {
    const client=await db.connect();try{await migrate(client);await migrate(client);}finally{client.release();}
    assert.equal((await db.query('SELECT * FROM midnight_migrations.applied')).rowCount,4);
    const project='abcdefghijklmnopqrst',subject='12345678-1234-4234-8234-123456789abc';
    const env={MIDNIGHT_AUTH_PROJECT_REF:project,NEXT_PUBLIC_SUPABASE_URL:`https://${project}.supabase.co`,MIDNIGHT_ADMIN_BOOTSTRAP_EXPIRES_AT:new Date(Date.now()+300000).toISOString()};
    const auth={getUserById:async()=>({data:{user:{id:subject,email:'stuart@adrcarriers.net',email_confirmed_at:'2026-01-01T00:00:00Z'}}})};
    // Synthetic provider fixture in a separate acceptance database, never the application database.
    const results=await Promise.all(Array.from({length:6},()=>bootstrap({env,auth,db,subject})));
    assert.equal(new Set(results.map(r=>r.grantId)).size,1);
    assert.equal((await db.query('SELECT * FROM midnight_authority.initial_admin')).rowCount,1);
    await assert.rejects(db.query("UPDATE midnight_authority.initial_admin SET email=email"),/append-only/);
    await assert.rejects(db.query('DELETE FROM midnight_authority.initial_admin'),/append-only/);
    const limited=new (require('pg').Client)({connectionString:process.env.MIDNIGHT_MIGRATION_TEST_RUNTIME_URL});try {
      await limited.connect();
      await assert.rejects(limited.query('TRUNCATE midnight_authority.initial_admin'),/permission/);
      await assert.rejects(limited.query("INSERT INTO midnight_authority.initial_admin SELECT * FROM midnight_authority.initial_admin"),/permission/);
      await assert.rejects(limited.query('UPDATE midnight_authority.initial_admin SET email=email'),/permission/);
    }finally{await limited.end();}
    const repo=repository(db),key=require('node:crypto').randomUUID();
    const row=await repo.capture({requestKey:key,fingerprint:key,data:{mode:'Road',name:'Synthetic operator test',company:'Migration acceptance',dangerousGoods:'Yes'},files:[],rates:[],notification:'disabled'});
    const changed=await Promise.all([repo.changeStatus(row.reference,'new','reviewing','synthetic-operator'),repo.changeStatus(row.reference,'new','quoted','other-operator')]);
    assert.equal(changed.filter(v=>v.conflict).length,1);
    assert.equal((await repo.detail(row.reference)).audit.filter(v=>v.event==='status_changed').length,1);
    await assert.rejects(db.query("UPDATE midnight_enquiries.enquiries SET reference=$2 WHERE reference=$1",[row.reference,'MID-'+'F'.repeat(32)]),/immutable/);
    await assert.rejects(db.query("UPDATE midnight_enquiries.enquiries SET details='{}'::jsonb WHERE reference=$1",[row.reference]),/immutable/);
    assert((await repo.list(null,null,{q:row.reference,mode:'Road'})).some(v=>v.reference===row.reference));
    assert.equal((await repo.list(null,null,{q:row.reference,mode:'Sea'})).length,0);
    assert.equal((await repo.list(null,null,{q:"' OR 1=1 --"})).length,0);
  }finally{await db.end();}
});
