const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.argv[2] || 'http://127.0.0.1:3031';
if (!['127.0.0.1', 'localhost'].includes(new URL(base).hostname)) throw Error('Use a local production build for the full article crawl');
const posts = require('../data/recovered-production-blog.json');
const slugs = [...new Set(posts.map(post => post.slug))];
assert.equal(slugs.length, 2352);
let cursor = 0, successful = 0;
const failures = [];
(async () => {
  const sitemap = await (await fetch(base + '/api/sitemap')).text();
  await Promise.all(Array.from({ length: 6 }, async () => {
    while (cursor < slugs.length) {
      const slug = slugs[cursor++];
      try {
        assert(sitemap.includes('https://www.midnight-xpress.com/blog/' + slug + '</loc>'));
        const response = await fetch(base + '/blog/' + slug, { signal: AbortSignal.timeout(30000), redirect: 'manual' });
        assert.equal(response.status, 200);
        const html = await response.text();
        assert(html.includes('https://www.midnight-xpress.com/blog/' + slug));
        assert(/<h1[\s>]/.test(html));
        successful++;
      } catch(error) { failures.push({ slug, error: error.message }); }
    }
  }));
  const report = { articles: slugs.length, successful, failures, sitemapIncluded: true, base };
  fs.mkdirSync('artifacts/enquiry-candidate', { recursive: true });
  fs.writeFileSync('artifacts/enquiry-candidate/article-crawl.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ articles: slugs.length, successful, failures: failures.length }));
  assert.equal(failures.length, 0);
})().catch(error => { console.error(error.message); process.exitCode = 1; });
