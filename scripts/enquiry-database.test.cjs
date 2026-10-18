// Opt-in integration gate: dedicated isolated test database only.
const {test}=require('node:test'),assert=require('node:assert/strict'),{randomUUID}=require('node:crypto');
const {Pool}=require('pg'),{repository}=require('../lib/server/enquiryRepository.cjs');
const url=process.env.MIDNIGHT_ENQUIRY_TEST_DATABASE_URL;
test('real PostgreSQL: concurrent capture, transactional documents, audit, conflict, rate limits and durable recovery',{skip:!url},async()=>{
  const db=new Pool({connectionString:url,max:5}),repo=repository(db),prefix=randomUUID();
  try {
    const args={requestKey:prefix,fingerprint:prefix,data:{name:'Synthetic database acceptance',mode:'Air'},notification:'disabled',rates:[],files:[{name:'test.pdf',mediaType:'application/pdf',digest:'synthetic',content:Buffer.from('%PDF-1.4\n%%EOF')}]};
    const rows=await Promise.all(Array.from({length:5},()=>repo.capture(args)));assert.equal(new Set(rows.map(r=>r.reference)).size,1);
    const retryArgs={...args,requestKey:randomUUID(),rates:[{key:'retry:'+prefix,limit:1}]};
    const receipt=await repo.capture(retryArgs);
    for(let i=0;i<7;i++)assert.equal((await repo.capture(retryArgs)).reference,receipt.reference);
    assert.equal((await repo.capture({...retryArgs,requestKey:randomUUID()})).limited,true);
    const ref=rows[0].reference,detail=await repo.detail(ref);assert.equal(detail.details.name,args.data.name);assert.equal(detail.attachments.length,1);assert.equal(detail.audit.length,1);
    assert.equal((await repo.download(ref,detail.attachments[0].id)).content.toString(),'%PDF-1.4\n%%EOF');assert.equal(await repo.download('MID-'+'0'.repeat(32),detail.attachments[0].id),undefined);
    assert.equal((await repo.capture({...args,fingerprint:'changed'})).conflict,true);
    assert.equal(await repo.claim(ref,'synthetic-operator'),true);assert.equal(await repo.claim(ref,'synthetic-operator'),false);await repo.finish(ref,'uncertain',null,'synthetic-operator');assert.equal(await repo.claim(ref,'synthetic-operator'),false);
    const limited={...args,requestKey:randomUUID(),rates:[{key:'test:'+prefix,limit:1}]};await repo.capture(limited);assert.equal((await repo.capture({...limited,requestKey:randomUUID()})).limited,true);
    const failedKey=randomUUID();await assert.rejects(repo.capture({...args,requestKey:failedKey,files:[{...args.files[0],content:Buffer.alloc(1048577)}]}));assert.equal((await db.query('SELECT reference FROM midnight_enquiries.enquiries WHERE request_key=$1',[failedKey])).rowCount,0);
    // A separate pool simulates another instance/process after the request finishes.
    const second=new Pool({connectionString:url,max:1});try{assert.equal((await repository(second).detail(ref)).notification,'uncertain');}finally{await second.end();}
    await assert.rejects(db.query('CREATE TABLE midnight_enquiries.forbidden (id int)'));
    await assert.rejects(db.query('DELETE FROM midnight_enquiries.enquiries WHERE false'));
  }finally{await db.end();}
});
