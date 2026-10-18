// Local actual-component regression; no provider, database or email requests.
// npm install --prefix /tmp/midnight-component-tools react@18.3.1 react-dom@18.3.1 esbuild@0.25.0 jsdom@26.1.0
// NODE_PATH=/tmp/midnight-component-tools/node_modules node scripts/operations-record-component.cjs
const assert=require('node:assert/strict');
const path=require('node:path');
const {build}=require('esbuild');
const {JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..');
(async()=>{
  const bundle=await build({stdin:{contents:`import React from 'react';import{createRoot}from'react-dom/client';import Detail from './pages/operations/enquiries/[reference].js';const root=createRoot(document.getElementById('root'));window.renderFixture=row=>root.render(<Detail row={row} canNotify={false}/>);`,resolveDir:root,loader:'jsx'},bundle:true,write:false,format:'iife',platform:'browser',jsx:'automatic',nodePaths:(process.env.NODE_PATH||'').split(path.delimiter).filter(Boolean),plugins:[{name:'fixtures',setup(b){
    b.onResolve({filter:/^react(?:\/.*)?$/},({path:p})=>({path:require.resolve(p)}));
    b.onLoad({filter:/pages\/operations\/enquiries\/\[reference\]\.js$/},({path:p})=>({contents:require('node:fs').readFileSync(p,'utf8').split('export async function getServerSideProps')[0],loader:'jsx'}));
    b.onResolve({filter:/^next\/(head|link)$|^@\/styles\/|^@\/lib\/server\//},({path:p})=>({path:p,namespace:'fixture'}));
    b.onResolve({filter:/^@\/lib\//},({path:p})=>({path:path.join(root,p.slice(2))}));
    b.onResolve({filter:/^@\/components\//},({path:p})=>({path:path.join(root,p.slice(2))}));
    b.onLoad({filter:/components\/.*\.js$/},({path:p})=>({contents:require('node:fs').readFileSync(p,'utf8'),loader:'jsx'}));
    b.onLoad({filter:/.*/,namespace:'fixture'},({path:p})=>({resolveDir:root,loader:'jsx',contents:p==='next/link'?`export default function Link({children,href}){return <a href={href}>{children}</a>}`:p==='next/head'?`export default function Head(){return null}`:p.includes('/styles/')?`export default {}`:`export const releaseRouteAccess=()=>{},repository=()=>{},emailConfigured=()=>{};`}));
  }}]});
  const tick=()=>new Promise(resolve=>setTimeout(resolve,25));
  const row=(reference,status)=>({reference,status,created_at:'Synthetic fixture',notification:'disabled',details:{name:'Synthetic person'},attachments:[],audit:[]});
  for(const scenario of ['navigation','late-status-response']){
    const dom=new JSDOM('<div id="root"></div>',{url:'https://midnight.example.invalid',runScripts:'outside-only'});const {window}=dom,{document}=window;
    let pending;window.fetch=(url,options)=>new Promise(resolve=>{pending={url,body:JSON.parse(options.body),resolve};});
    try{
      window.eval(bundle.outputFiles[0].text);window.renderFixture(row('MID-'+ 'A'.repeat(32),'new'));await tick();
      if(scenario==='late-status-response'){
        const select=document.querySelector('select');select.value='reviewing';select.dispatchEvent(new window.Event('change',{bubbles:true}));await tick();
        document.querySelector('form').dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));await tick();
        assert(pending.url.includes('A'.repeat(32)));assert.equal(pending.body.expected,'new');
      }
      window.renderFixture(row('MID-'+ 'B'.repeat(32),'closed'));await tick();
      if(pending){pending.resolve({ok:true,json:async()=>({status:'reviewing',message:'Status saved'})});await tick();}
      assert.equal(document.querySelector('h1').textContent,'MID-'+ 'B'.repeat(32));
      assert.equal(document.querySelector('select').value,'closed','New record must use its own status');
      assert(document.querySelector('form button').disabled,'New record must not offer to save the old record status');
      assert.match(document.querySelector('main > p').textContent,/closed/);
      assert.equal(document.querySelector('[role="status"]').textContent,'','An earlier record response must not become the current record acknowledgement');
      console.log('PASS actual operations component '+scenario);
    }finally{window.close();}
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
