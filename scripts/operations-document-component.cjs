// Actual operations-page regressions using synthetic files and mocked HTTP only.
// NODE_PATH=../midex-component-tools/node_modules node scripts/operations-document-component.cjs
const assert = require('node:assert/strict');
const path = require('node:path');
const { build } = require('esbuild');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '..');
(async () => {
  const bundle = await build({ stdin: { contents: `import React from 'react';import{createRoot}from'react-dom/client';import Detail from './pages/operations/enquiries/[reference].js';const root=createRoot(document.getElementById('root'));window.renderFixture=row=>root.render(<Detail row={row} canNotify={false}/>);`, resolveDir: root, loader: 'jsx' }, bundle: true, write: false, format: 'iife', platform: 'browser', jsx: 'automatic', nodePaths: (process.env.NODE_PATH || '').split(path.delimiter).filter(Boolean), plugins: [{ name: 'fixtures', setup(b) {
    b.onResolve({ filter: /^react(?:\/.*)?$/ }, ({ path: p }) => ({ path: require.resolve(p) }));
    b.onLoad({ filter: /pages\/operations\/enquiries\/\[reference\]\.js$/ }, ({ path: p }) => ({ contents: require('node:fs').readFileSync(p, 'utf8').split('export async function getServerSideProps')[0], loader: 'jsx' }));
    b.onResolve({ filter: /^next\/(head|link)$|^@\/styles\/|^@\/lib\/server\// }, ({ path: p }) => ({ path: p, namespace: 'fixture' }));
    b.onResolve({ filter: /^@\// }, ({ path: p }) => ({ path: path.join(root, p.slice(2)) }));
    b.onLoad({ filter: /.*/, namespace: 'fixture' }, ({ path: p }) => ({ resolveDir: root, loader: 'jsx', contents: p === 'next/link' ? `export default function Link({children,href}){return <a href={href}>{children}</a>}` : p === 'next/head' ? `export default function Head(){return null}` : p.includes('/styles/') ? `export default {}` : `export const releaseRouteAccess=()=>{},repository=()=>{},emailConfigured=()=>{};` }));
    b.onLoad({ filter: /components\/.*\.js$/ }, ({ path: p }) => ({ contents: require('node:fs').readFileSync(p, 'utf8'), loader: 'jsx' }));
  } }] });
  const tick = () => new Promise(resolve => setTimeout(resolve, 25));
  const row = reference => ({ reference, status: 'new', created_at: 'Synthetic fixture', notification: 'disabled', details: {}, attachments: [{ id: '11111111-1111-4111-8111-111111111111', name: 'synthetic.pdf', size: 8 }], audit: [] });
  const tests = [
    [401, /Sign in again/], [403, /permission/], [404, /no longer available/], [503, /temporarily unavailable/],
    ['html', /could not be confirmed/], ['network', /could not be confirmed/],
    ['timeout', /timed out/], ['success', /Check your browser downloads/], ['navigation', null],
  ];
  for (const [scenario, message] of tests) {
    const dom = new JSDOM('<div id="root"></div>', { url: 'https://midnight.example.invalid', runScripts: 'outside-only' });
    const { window } = dom, { document } = window;
    let pending, request, downloads = 0, blobs = 0, timeout;
    const originalSetTimeout = window.setTimeout.bind(window);
    window.setTimeout = (callback, delay, ...args) => delay === 30000 ? (timeout = callback, 99999) : originalSetTimeout(callback, delay, ...args);
    window.URL.createObjectURL = () => { blobs++; return 'blob:synthetic'; };
    window.URL.revokeObjectURL = () => {};
    window.HTMLAnchorElement.prototype.click = function () { downloads++; assert.equal(this.download, 'synthetic.pdf'); };
    window.fetch = (url, options) => { request = { url, options }; return new Promise((resolve, reject) => { pending = { resolve, reject }; options.signal.addEventListener('abort', () => reject(new window.DOMException('Aborted', 'AbortError'))); }); };
    try {
      window.eval(bundle.outputFiles[0].text); window.renderFixture(row('MID-' + 'A'.repeat(32))); await tick();
      const button = Array.from(document.querySelectorAll('button')).find(element => element.textContent.includes('synthetic.pdf'));
      assert(button, 'Document download must preserve the enquiry page and show access errors in context');
      button.click(); await tick(); assert(button.disabled);
      assert(request.url.includes('A'.repeat(32)));
      assert.equal(request.options.cache, 'no-store');
      assert.equal(request.options.redirect, 'error');
      if (scenario === 'navigation') { window.renderFixture(row('MID-' + 'B'.repeat(32))); await tick(); assert(request.options.signal.aborted, 'Leaving an enquiry must abort its download'); }
      else if (scenario === 'timeout') { timeout(); }
      else if (scenario === 'network') pending.reject(new Error('Synthetic offline'));
      else pending.resolve({ ok: scenario === 'success' || scenario === 'html', status: typeof scenario === 'number' ? scenario : 200, headers: { get: () => scenario === 'html' ? 'text/html' : 'application/octet-stream' }, blob: async () => new window.Blob(['%PDF-test']) });
      await tick();
      if (message) assert.match(document.body.textContent, message);
      assert.equal(downloads, scenario === 'success' ? 1 : 0);
      assert.equal(blobs, scenario === 'success' ? 1 : 0);
      assert(document.querySelector('h1').textContent.startsWith('MID-'));
      if (scenario !== 'navigation') assert(!button.disabled, 'Failed downloads must remain retryable');
      console.log('PASS actual operations document ' + scenario);
    } finally { window.close(); }
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
