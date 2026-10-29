// Run against a local production build only. Browser requests to external services are blocked.
const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const routes = require('../src/data/public-routes.json');
const guides = require('../src/data/transport-pages.json');
const base = process.env.SEO_BASE_URL || 'http://127.0.0.1:3000';
if (!['127.0.0.1', 'localhost'].includes(new URL(base).hostname)) throw Error('Local verification only');
const out = process.env.SEO_REPORT_DIR || 'docs/seo-20261029/results';
fs.mkdirSync(out, { recursive: true });
(async () => {
 const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args:['--no-sandbox']});
 const context = await browser.newContext({ viewport:{width:390,height:844}, isMobile:true, deviceScaleFactor:1 });
 await context.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
 const page = await context.newPage();
 const consoleErrors=[];page.on('pageerror', e => consoleErrors.push(e.message));
 const report={base, date:new Date().toISOString(), crawl:[], issues:[], links:[], accessibility:[], forms:[], skipped:[{route:'/employment',reason:'Historic main branch reads application records; production source and isolated test backend are required. No live data queried.'}]};
 const links=new Set();
 const titles=new Set(),descriptions=new Set();
 for(const route of routes.filter(r => r !== '/employment')) {
  const response=await page.goto(base+route,{waitUntil:'networkidle'});
  const data=await page.evaluate(() => ({title:document.title,description:document.querySelector('meta[name="description"]')?.content,canonical:document.querySelector('link[rel="canonical"]')?.href,h1:document.querySelectorAll('h1').length,overflow:document.documentElement.scrollWidth>innerWidth,robots:document.querySelector('meta[name="robots"]')?.content,links:[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')),schema:[...document.querySelectorAll('script[type="application/ld+json"]')].map(s=>JSON.parse(s.textContent))}));
  const result={route,status:response.status(),...data}; delete result.links;report.crawl.push(result);
  for(const href of data.links)if(href.startsWith('/')&&!href.startsWith('//'))links.add(href.split('#')[0]);
  if(response.status()!==200)report.issues.push(`${route}: HTTP ${response.status()}`);
  if(!data.title || titles.has(data.title))report.issues.push(`${route}: missing/duplicate title`);titles.add(data.title);
  if(!data.description || descriptions.has(data.description))report.issues.push(`${route}: missing/duplicate description`);descriptions.add(data.description);
  if(data.canonical!== 'https://adrcarriers.com'+route)report.issues.push(`${route}: canonical ${data.canonical}`);
  if(data.h1!==1)report.issues.push(`${route}: ${data.h1} H1s`);
  if(data.overflow)report.issues.push(`${route}: horizontal overflow`);
  if(/noindex/.test(data.robots||''))report.issues.push(`${route}: public noindex`);
 }
 for(const href of links){
  if(href==='/employment'){report.links.push({href,status:'not requested',reason:'backend isolation required'});continue;}
  const response=await context.request.get(base+href);const result={href,status:response.status()};report.links.push(result);if(response.status()>=400)report.issues.push(`Broken link ${href}: ${response.status()}`);
 }
 const targets=['/','/get-a-quote','/contact','/services','/areas/cumbria',...guides.map(g=>'/services/'+g.slug)];
 for(const route of targets){
  await page.goto(base+route,{waitUntil:'networkidle'});
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  report.accessibility.push({route,violations:axe.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>n.target)}))});
  if(axe.violations.length)report.issues.push(`${route}: ${axe.violations.length} accessibility violations`);
 }
 for(const width of [320,375,390,768,1440]){
  await page.setViewportSize({width,height:900});await page.goto(base,{waitUntil:'networkidle'});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`Homepage overflow at ${width}`);
  if([375,1440].includes(width))await page.screenshot({path:`${out}/home-${width}.png`,fullPage:true});
 }
 await page.setViewportSize({width:390,height:844});await page.goto(base+'/get-a-quote',{waitUntil:'networkidle'});
 await page.screenshot({path:`${out}/quote-390.png`,fullPage:true});
 let requests=0;
 await page.route('https://formsubmit.co/ajax/**', async route=>{requests++;await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({success:true})});});
 async function fill(){await page.getByLabel('Full Name',{exact:true}).fill('SYNTHETIC LOCAL TEST');await page.getByLabel('Email Address',{exact:true}).fill('synthetic@example.invalid');await page.getByLabel('Shipment Details',{exact:true}).fill('LOCAL TEST ONLY — never transmitted.');}
 await fill();await page.getByLabel('Full Name',{exact:true}).fill('   ');await page.getByRole('button',{name:'Submit Request'}).click();await page.getByRole('status').filter({hasText:'Please provide'}).waitFor();assert.equal(requests,0);report.forms.push('Whitespace-only name rejected before submission');
 await fill();await page.getByRole('button',{name:'Submit Request'}).click();await page.getByRole('status').filter({hasText:'sent successfully'}).waitFor();assert.equal(requests,1);assert.equal(await page.getByLabel('Full Name',{exact:true}).inputValue(),'');report.forms.push('Success: one intercepted request, optional phone, acknowledgement and reset');
 await page.unroute('https://formsubmit.co/ajax/**');
 await page.route('https://formsubmit.co/ajax/**',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({success:false,message:'Synthetic rejection'})}));
 await fill();await page.getByRole('button',{name:'Submit Request'}).click();await page.getByRole('status').filter({hasText:'Something went wrong'}).waitFor();assert.equal(await page.getByLabel('Full Name',{exact:true}).inputValue(),'SYNTHETIC LOCAL TEST');report.forms.push('Provider rejection: error displayed and input preserved');
 await page.unroute('https://formsubmit.co/ajax/**');
 await page.route('https://formsubmit.co/ajax/**',route=>route.abort());await page.getByRole('button',{name:'Submit Request'}).click();await page.getByRole('status').filter({hasText:'Something went wrong'}).waitFor();assert.equal(await page.getByLabel('Full Name',{exact:true}).inputValue(),'SYNTHETIC LOCAL TEST');report.forms.push('Network failure: error displayed and input preserved');
 for(const route of ['/admin/login','/thank-you']){await page.goto(base+route);assert.match(await page.locator('meta[name="robots"]').getAttribute('content'),/noindex/);}
 const sitemap=await (await context.request.get(base+'/sitemap.xml')).text();assert.equal((sitemap.match(/<loc>/g)||[]).length,routes.length);assert.ok(!/\/admin|\/auth|\/thank-you/.test(sitemap));
 const missing=await context.request.get(base+'/this-page-does-not-exist');assert.equal(missing.status(),404);
 report.consoleErrors=consoleErrors;report.sitemap={urls:routes.length,privateRoutesExcluded:true};
 fs.writeFileSync(out+'/browser-crawl.json',JSON.stringify(report,null,2));
 await browser.close();console.log(JSON.stringify({pages:report.crawl.length,links:report.links.length,axePages:report.accessibility.length,issues:report.issues,forms:report.forms,skipped:report.skipped},null,2));
 if(report.issues.length || consoleErrors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
