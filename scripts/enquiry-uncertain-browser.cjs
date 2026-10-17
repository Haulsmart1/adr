// Local-only browser regression. API responses are fixtures; no database or SMTP calls.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:3048';
if (!['localhost','127.0.0.1'].includes(new URL(base).hostname)) throw Error('Local test server required');
const requestId = 'ca9df5a1-5fad-4ccc-b213-c010a4ae5f99';
const data = {mode:'Road',urgency:'Standard',dangerousGoods:'No',collection:'Test collection',delivery:'Test delivery',description:'Test freight',name:'Test Person',email:'test@example.invalid'};
(async () => {
  const browser = await chromium.launch({headless:true});
  try {
    for (const width of [390,1440]) {
      const context = await browser.newContext({viewport:{width,height:900}});
      const page = await context.newPage();
      let outcome = 'invalid'; const requests = [];
      await page.route('**/api/auth/session', route => route.fulfill({json:{}}));
      await page.route('**/api/enquiry', route => {
        requests.push(route.request().postDataJSON());
        return route.fulfill({status:outcome==='received'?200:409,json:{state:outcome,message:'Fixture receipt response',...(outcome==='received'?{reference:'MID-FIXTURE'}:{})}});
      });
      await page.addInitScript(({data,requestId}) => sessionStorage.setItem('midnight-enquiry',JSON.stringify({data,requestId,owner:'guest',savedAt:Date.now(),status:{state:'unconfirmed',message:'Fixture lost response'}})),{data,requestId});
      await page.goto(base+'/enquiry');
      await page.getByText('Your details are locked',{exact:false}).waitFor();
      assert(await page.locator('#enquiry-collection').isDisabled());
      assert(!(await page.locator('#enquiry-files').isDisabled()),'Same-file reselection remains available');
      await page.getByRole('button',{name:'Submit enquiry'}).click();
      await page.getByText('Fixture receipt response',{exact:false}).waitFor();
      assert(await page.locator('#enquiry-collection').isDisabled(),'A rejected retry must not unlock an unresolved receipt');
      assert.equal(requests[0].requestId,requestId);
      assert.equal(requests[0].collection,data.collection);
      page.once('dialog',dialog=>dialog.dismiss());
      await page.getByRole('button',{name:'Clear draft'}).click();
      assert(await page.locator('#enquiry-collection').isDisabled(),'Cancelling clear preserves the uncertain draft');
      outcome='received';
      await page.getByRole('button',{name:'Submit enquiry'}).click();
      await page.getByText('MID-FIXTURE',{exact:true}).waitFor();
      assert.equal(requests[1].requestId,requestId,'Receipt recovery uses the original key');
      assert(!(await page.locator('#enquiry-collection').isDisabled()),'Confirmed receipt allows subsequent edits');
      await context.close();
      console.log('PASS uncertain enquiry recovery at '+width+'px');
    }
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
