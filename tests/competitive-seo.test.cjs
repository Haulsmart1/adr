const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const pages = require('../src/data/transport-pages.json');
const routes = require('../src/data/public-routes.json');
const config = require('../next-sitemap.config.js');

test('every transport guide has a routable page, unique metadata and distinct content', () => {
  for (const key of ['slug', 'title', 'description', 'heading']) assert.equal(new Set(pages.map(p => p[key])).size, pages.length, key);
  for (const p of pages) {
    assert.ok(fs.existsSync(`src/app/services/${p.slug}/page.js`));
    assert.ok(routes.includes(`/services/${p.slug}`));
    assert.ok(p.sections.length >= 3 && p.faqs.length >= 2);
    for (const slug of p.related) assert.ok(pages.some(p => p.slug === slug));
  }
});
test('sitemap uses only explicit public routes and excludes completion and private routes', async () => {
  const actual = (await config.additionalPaths()).map(item => item.loc);
  assert.deepEqual(actual, routes);
  assert.equal(new Set(routes).size, routes.length);
  for (const r of routes) assert.ok(!/^\/(admin|auth|thank-you)(\/|$)/.test(r));
  assert.equal(config.generateIndexSitemap, false);
});
test('JSON-LD serialization prevents script termination and metadata stays on the primary host', () => {
  const code = fs.readFileSync('src/lib/seo.js', 'utf8').replace(/export /g, '');
  const context = vm.createContext({ URL });
  vm.runInContext(code + '\nthis.serialize = serializeStructuredData;this.meta=pageMetadata;', context);
  const dangerous = { text: '</script><script>alert(1)</script>' };
  const result = context.serialize(dangerous);
  assert.ok(!result.includes('<'));
  assert.deepEqual(JSON.parse(result), dangerous);
  assert.equal(context.meta('/services/lithium-transport', 'Battery', 'Description').alternates.canonical, 'https://adrcarriers.com/services/lithium-transport');
});
test('regional publication is limited to the evidenced Cumbria contact area', () => {
  assert.deepEqual(routes.filter(r => r.startsWith('/areas/')), ['/areas/cumbria']);
});
test('deployed enquiry validation rejects malformed input and preserves optional phone', () => {
  const code = fs.readFileSync('src/lib/enquiryValidation.js', 'utf8').replace(/export /g, '');
  const context = vm.createContext({});
  vm.runInContext(code + '\nthis.validate=validateEnquiry;', context);
  const valid = { fullName:' Test ', email:'test@example.invalid', phone:'', shipmentDetails:' Test shipment ' };
  assert.equal(context.validate(valid).fullName, 'Test');
  assert.equal(context.validate({...valid,fullName:'   '}), null);
  assert.equal(context.validate({...valid,email:'x\r\n@example.invalid'}), null);
  assert.equal(context.validate({...valid,shipmentDetails:'x'.repeat(6001)}), null);
});
