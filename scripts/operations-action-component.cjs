// Actual operations component; synthetic HTTP only, no email or database calls.
// NODE_PATH=../midex-component-tools/node_modules node scripts/operations-action-component.cjs
const assert=require('node:assert/strict');
const path=require('node:path');
const {build}=require('esbuild');
const {JSDOM}=require('jsdom');
const fs=require('node:fs');
const root=path.resolve(__dirname,'..');
(async()=>{
  const bundle=await build({stdin:{contents:`import React from 'react';import{createRoot}from'react-dom/client';import Detail from './pages/operations/enquiries/[reference].js';const root=createRoot(document.getElementById('root'));window.renderFixture=row=>root.render(<Detail row={row} canNotify={true}/>);`,resolveDir:root,loader:'jsx'},bundle:true,write:false,format:'iife',platform:'browser',jsx:'automatic',nodePaths:(process.env.NODE_PATH||'').split(path.delimiter).filter(Boolean),plugins:[{name:'fixtures',setup(b){
    b.onResolve({filter:/^react(?:\/.*)?$/},({path:p})=>({path:require.resolve(p)}));
    b.onLoad({filter:/pages\/operations\/enquiries\/\[reference\]\.js$/},({path:p})=>({contents:fs.readFileSync(p,'utf8').split('export async function getServerSideProps')[0],loader:'jsx'}));
    b.onResolve({filter:/^next\/(head|link)$|^@\/styles\/|^@\/lib\/server\//},({path:p})=>({path:p,namespace:'fixture'}));
    b.onResolve({filter:/^@\//},({path:p})=>({path:path.join(root,p.slice(2))}));
    b.onLoad({filter:/components\/.*\.js$/},({path:p})=>({contents:fs.readFileSync(p,'utf8'),loader:'jsx'}));
    b.onLoad({filter:/.*/,namespace:'fixture'},({path:p})=>({resolveDir:root,loader:'jsx',contents:p==='next/link'?`export default function Link({children,href}){return <a href={href}>{children}</a>}`:p==='next/head'?`export default function Head(){return null}`:p.includes('/styles/')?`export default {}`:`export const releaseRouteAccess=()=>{},repository=()=>{},emailConfigured=()=>{};`}));
  }}]});
  const tick=()=>new Promise(resolve=>setTimeout(resolve,25));
  let failures=0;
  for(const action of ['status','notify']) for(const scenario of ['401','401-html','403','503','malformed','wrong-success','timeout','timeout-body','navigation','success']){
    const dom=new JSDOM('<div id="root"></div>',{url:'https://midnight.example.invalid',runScripts:'outside-only'}),{window}=dom,{document}=window;
    let calls=0,request,pending,timeout;
    const originalTimeout=window.setTimeout.bind(window);
    window.setTimeout=(callback,delay,...args)=>delay===15000?(timeout=callback,99999):originalTimeout(callback,delay,...args);
    window.fetch=(url,options)=>{calls++;request={url,options};return new Promise((resolve,reject)=>{pending={resolve,reject};options?.signal?.addEventListener('abort',()=>reject(new window.DOMException('Aborted','AbortError')));});};
    try{
      window.eval(bundle.outputFiles[0].text);window.renderFixture({reference:'MID-'+'A'.repeat(32),status:'new',created_at:'Fixture',notification:'pending',details:{},attachments:[],audit:[]});await tick();
      const select=document.querySelector('select');select.value='reviewing';select.dispatchEvent(new window.Event('change',{bubbles:true}));await tick();
      const button=action==='status'?document.querySelector('form button'):Array.from(document.querySelectorAll('button')).find(b=>b.textContent==='Attempt operations notification');
      button.click();button.click();await tick();assert.equal(calls,1,'Same-turn clicks must not submit twice');assert(button.disabled);
      if(scenario==='navigation'){
        window.renderFixture({reference:'MID-'+'B'.repeat(32),status:'closed',created_at:'Fixture B',notification:'pending',details:{},attachments:[],audit:[]});await tick();
        pending.resolve({ok:true,status:200,json:async()=>({message:'Mail server accepted the notification.',status:'reviewing'})});await tick();
        assert(request.options.signal?.aborted,'Leaving a record must cancel its pending browser request');
        assert.equal(document.querySelector('[role="status"]').textContent,'');assert.equal(document.querySelector('select').value,'closed');
        console.log('PASS actual operations '+action+' '+scenario);continue;
      }
      if(scenario==='timeout'||scenario==='timeout-body'){
        if(scenario==='timeout-body'){pending.resolve({ok:true,status:200,json:()=>new Promise((resolve,reject)=>request.options.signal?.addEventListener('abort',()=>reject(Error('Aborted body'))))});await tick();}
        assert(timeout,'Operations requests must have a finite timeout');timeout();
      }
      else pending.resolve({ok:['success','malformed','wrong-success'].includes(scenario),status:scenario==='401-html'?401:Number(scenario)||200,json:async()=>{
        if(scenario==='401-html')throw Error('HTML sign-in response');
        if(scenario==='success')return {message:action==='status'?'Status saved':'Mail server accepted the notification.',...(action==='status'?{status:'reviewing'}:{})};
        if(scenario==='wrong-success')return {message:'INTERNAL_SYNTHETIC_PROVIDER_ERROR',status:'closed'};
        return scenario==='malformed'?{}:{error:'INTERNAL_SYNTHETIC_PROVIDER_ERROR'};
      }});
      await tick();
      const message=document.querySelector('[role="status"]').textContent;
      if(scenario==='401'||scenario==='401-html')assert.match(message,/Sign in again/i);
      else if(scenario==='403')assert.match(message,/permission/i);
      else if(scenario==='success')assert.match(message,action==='status'?/Status saved/:/Mail server accepted/);
      else assert.match(message,/not be confirmed|unknown|unavailable/i);
      assert(!message.includes('INTERNAL_SYNTHETIC_PROVIDER_ERROR'));
      if(scenario!=='success')assert.match(document.querySelector('main > p').textContent,/new/,'An unconfirmed response must not mark status saved');
      assert.equal(calls,1,'No automatic resubmission');
      if(action==='notify'||scenario!=='success')assert(!button.disabled,'Controls must recover after failure');
      if(scenario.startsWith('timeout'))assert(request.options.signal.aborted);
      console.log('PASS actual operations '+action+' '+scenario);
    }catch(error){failures++;console.error('FAIL actual operations '+action+' '+scenario+': '+error.message);}
    finally{window.close();}
  }
  assert.equal(failures,0,failures+' operation action regressions failed');
})().catch(error=>{console.error(error);process.exitCode=1;});
