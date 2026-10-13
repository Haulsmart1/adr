// Production-build browser gate. Requires Chrome and local axe-core fixture.
// Never contacts SMTP; accepted/uncertain states are explicitly intercepted fixtures.
const fs = require('node:fs'), path = require('node:path'), cp = require('node:child_process');
const assert = require('node:assert/strict'), WebSocket = require('ws');
let base = process.argv[2] || 'http://127.0.0.1:3031';
const enabledBase = process.argv[3] || 'http://127.0.0.1:3032';
if (!['localhost', '127.0.0.1'].includes(new URL(base).hostname)) throw Error('Local test server required');
if (!['localhost', '127.0.0.1'].includes(new URL(enabledBase).hostname)) throw Error('Local enabled test server required');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const output = path.resolve('.cache/validation/enquiry-browser'); fs.mkdirSync(output, { recursive: true });
const browser = cp.spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=9261', '--user-data-dir=' + path.join(output, 'profile'), 'about:blank'], { stdio: 'ignore', windowsHide: true });
let ws, id = 0, outcome = null, posts = 0;
const pending = new Map(), errors = [], results = [];
const watchdog = setTimeout(() => { browser.kill(); process.exit(1); }, 60000);
(async () => { try {
  let targets; for (let n=0;n<40;n++) { try { targets=await (await fetch('http://127.0.0.1:9261/json')).json(); break; } catch { await sleep(200); } }
  ws = new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
  const send = (method,params={}) => new Promise((resolve,reject)=>{const key=++id;pending.set(key,{resolve,reject});ws.send(JSON.stringify({id:key,method,params}));});
  ws.onmessage = async event => {
    const message=JSON.parse(event.data);
    if(message.id){const p=pending.get(message.id);pending.delete(message.id);message.error?p?.reject(Error(message.error.message)):p?.resolve(message.result);return;}
    if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
    if(message.method==='Fetch.requestPaused') {
      const p=message.params, url=new URL(p.request.url);
      if(url.origin!==new URL(base).origin){await send('Fetch.failRequest',{requestId:p.requestId,errorReason:'BlockedByClient'});return;}
      if(p.request.method==='POST') {
        assert.equal(url.pathname,'/api/enquiry');posts++;
        if(outcome==='timeout') return; // Leave paused until the browser's AbortController fires.
        if(outcome){await send('Fetch.fulfillRequest',{requestId:p.requestId,responseCode:outcome==='accepted'?200:202,responseHeaders:[{name:'Content-Type',value:'application/json'}],body:Buffer.from(JSON.stringify({state:outcome,reference:'MID-BROWSER-FIXTURE',message:outcome==='accepted'?'The mail server accepted your enquiry for operations.':'Delivery has not been confirmed. Contact operations before sending again.'})).toString('base64')});return;}
      }
      await send('Fetch.continueRequest',{requestId:p.requestId});
    }
  };
  await send('Page.enable');await send('Runtime.enable');await send('Fetch.enable',{patterns:[{urlPattern:'*',requestStage:'Request'}]});
  const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.text);return r.result.value;};
  const fill=(key,value)=>evaluate(`(()=>{const e=document.querySelector('#enquiry-${key}');Object.getOwnPropertyDescriptor(e.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:e.tagName==='SELECT'?HTMLSelectElement.prototype:HTMLInputElement.prototype,'value').set.call(e,${JSON.stringify(value)});e.dispatchEvent(new Event(e.tagName==='SELECT'?'change':'input',{bubbles:true}));})()`);
  const clear=()=>evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent==='Clear draft').click()");
  for(const width of [320,390,1440]) {
    await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<700});
    await send('Page.navigate',{url:base+'/enquiry'});await sleep(500);await clear();
    await fill('mode','Sea');await fill('collection','Antwerp, Belgium');await fill('delivery','Helsinki, Finland');await fill('description','Three crates of machinery');await fill('name','Browser Test');await fill('email','test@example.invalid');await fill('dangerousGoods','Yes');await fill('unNumber','UN 3480');
    assert((await evaluate("document.querySelector('#enquiry-brief').value")).includes('UN 3480'));
    await fill('dangerousGoods','No');assert.equal(await evaluate("document.querySelector('#enquiry-unNumber')"),null);
    assert(!(await evaluate("document.querySelector('#enquiry-brief').value")).includes('UN 3480'));
    assert.equal(await evaluate("document.querySelector('button[type=submit]')"),null);
    await send('Page.reload');await sleep(500);assert.equal(await evaluate("document.querySelector('#enquiry-collection').value"),'Antwerp, Belgium');
    assert(await evaluate("document.querySelector('a[href^=\"mailto:freight@midnight-express.org?\"]').href.includes('Helsinki')"));
    await evaluate(fs.readFileSync('.cache/validation/package/axe.min.js','utf8'));
    const violations=await evaluate("axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}).then(r=>r.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})))");
    assert.deepEqual(violations,[]);assert(await evaluate('document.documentElement.scrollWidth<=innerWidth'));
    const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(output,`${width}.png`),Buffer.from(shot.data,'base64'));
    results.push({width,violations,overflow:false,draftRestore:true,dgConditional:true});
  }
  assert.deepEqual(errors,[]);
  base=enabledBase;
  await send('Page.navigate',{url:base+'/enquiry'});await sleep(500);
  await clear();await fill('mode','Air');await fill('collection','Antwerp, Belgium');await fill('delivery','Helsinki, Finland');await fill('description','Machine parts');await fill('name','Browser Test');await fill('email','test@example.invalid');
  await evaluate("document.querySelector('form').requestSubmit()");await sleep(500);
  assert(await evaluate("document.querySelector('[role=status]').textContent.includes('unavailable')"));
  assert.equal(await evaluate("document.querySelector('#enquiry-collection').value"),'Antwerp, Belgium');
  outcome='unconfirmed';await evaluate("document.querySelector('form').requestSubmit()");await sleep(300);
  assert(await evaluate("document.querySelector('button[type=submit]').disabled"));
  const before=posts;await send('Page.reload');await sleep(500);assert.equal(posts,before);assert(await evaluate("document.querySelector('button[type=submit]').disabled"));
  await fill('notes','Fixture-only accepted response');outcome='accepted';await evaluate("document.querySelector('form').requestSubmit()");await sleep(300);
  assert(await evaluate("document.querySelector('[role=status]').textContent.includes('mail server accepted')"));
  assert(await evaluate("document.querySelector('button[type=submit]').disabled"));
  await fill('notes','Fixture-only network timeout');outcome='timeout';await evaluate("document.querySelector('form').requestSubmit()");await sleep(100);
  assert(await evaluate("document.querySelector('button[type=submit]').disabled"));
  await sleep(25300);
  assert(await evaluate("document.querySelector('[role=status]').textContent.includes('not been confirmed')"));
  assert(await evaluate("document.querySelector('button[type=submit]').disabled"));
  await clear();assert.equal(await evaluate("document.querySelector('#enquiry-email').value"),'');assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({results,errors,posts,actualEmails:0,apiUnavailable:true,acceptedState:'intercepted fixture',unconfirmedState:'intercepted fixture',networkTimeout:'25 second abort verified',refreshDoesNotResend:true},null,2));
  console.log(JSON.stringify({viewports:results.length,errors,posts,actualEmails:0,passed:true}));
} catch(error) { console.error(error);process.exitCode=1; } finally {clearTimeout(watchdog);ws?.close();browser.kill();} })();
