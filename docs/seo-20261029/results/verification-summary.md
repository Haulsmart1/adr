# Verification results

This report describes the tested development candidate, not a deployed release. See `../release-review.md` for the production-source mismatch and release gates.

| Check | Result / boundary |
| --- | --- |
| Production build | PASS: `npm run build`, including generation of 46 static build entries. Root project on the accessible GitHub baseline; no live credentials supplied. |
| Lint | PASS: no ESLint warnings or errors. |
| Focused tests | PASS: 5 tests covering routable guides, unique content metadata, internal related-page targets, sitemap exclusions, safe JSON-LD, regional publication limits and deployed enquiry validation. |
| Public rendered crawl | PASS: zero issues across 37 pages tested. Employment deliberately excluded because historical GitHub main reads application records; requires recovered public source and isolated backend. |
| Internal links | PASS: no broken links among the requested destinations. 55 distinct local link destinations enumerated, including policy PDFs. Employment link recorded but not requested. No live backend is queried. |
| Metadata | Unique page titles/descriptions; exact `.com` canonicals, one H1, no unwanted public noindex; JSON-LD parsed. |
| Sitemap | 38 public URLs; admin/auth/completion routes excluded. Robots advertises the primary `.com` sitemap. |
| Accessibility | PASS: zero Axe WCAG A/AA violations on 14 conversion-focused pages, plus viewport overflow checks. Automated checks do not replace manual assistive-technology testing. |
| Mobile visual review | Homepage checked at 320, 375, 390, 768 and 1440 px; mobile and desktop screenshots saved. Quote/contact decorative background images removed. Privacy notice no longer overlays the hero CTA. |
| Quote form | Browser requests intercepted locally: invalid whitespace name, successful response/reset, provider rejection and network failure/input retention. Optional telephone verified. No real mail sent; provider delivery remains unverified. |
| Private routes and missing pages | Admin login and thank-you carry noindex; missing URL returns 404. Authentication, admin authorisation, uploads and data writes are not certified by these SEO tests. |
| Live research crawl | 95 read-only public page fetches across `.com`, `.co.uk` and selected ADR Direct pages; no fetch errors. Booking action endpoints were not invoked. |
| Domain variants | HTTP/HTTPS and apex/www final destinations recorded in `../domain-observations.json`. No live redirect or DNS changes. |
| Regulatory references | Government dangerous-goods link resolves successfully to `/moving-dangerous-goods`; UNECE automated fetch returns 403 and needs manual review, not a conclusion that the link is broken. |
| Search performance | All rankings, impressions and clicks UNVERIFIED; no Search Console access. |
| Production identity | Confirmed again during verification: `.com` still points to original deployment `dpl_B4hopTZJGPZEMx4TqvfN67zSPpgt`. |

Final browser and Lighthouse results are recorded in `browser-crawl.json`, `performance-summary.json` and the raw `lighthouse-*.json` files. The production baseline and local candidate use different framework versions and different network paths; their lab scores are not a controlled before/after experiment or field Core Web Vitals. No traffic, revenue or ranking uplift is claimed.

Reproduce from the project root:

```sh
npm ci
npm run build
npm run test:seo
npm run lint
npm run start
```

For browser checks in another shell, install the testing tools in a separate tools directory (the captured run used `/workspace/seo-tools`):

```sh
npm install --prefix /workspace/seo-tools playwright @axe-core/playwright lighthouse
NODE_PATH=/workspace/seo-tools/node_modules node scripts/verify-competitive-seo.cjs
```

The browser script defaults to `/usr/bin/chromium`; set `CHROMIUM_PATH` for another installed Chromium. It refuses a non-local test target and blocks external page requests. `SEO_REPORT_DIR` controls report output. Raw Lighthouse reports include the actual Lighthouse/Chrome versions and mobile settings used. Run Lighthouse against the local production server, not `next dev`.

## Unresolved release gates

Recover the exact deployed source; preserve production’s patched dependency versions and operational code; reconcile historical ancillary-page claims with current live copy; review operating scope and regulatory copy; retest the integrated candidate, including isolated employment/admin/upload flows; obtain Stuart’s explicit release approval. The current GitHub baseline’s Next 14.1.0 emits a known-vulnerability warning during install and must not replace production’s Next 15.5.27. No framework downgrade is proposed.

Final isolated mobile Lighthouse runs: homepage **100/100/100/100**, quote page **100/100/100/100** (performance/accessibility/best practices/SEO). Live homepage baseline: **95/100/100/92**. The local/remote and framework differences prevent treating this as a controlled improvement measurement. See the raw metrics and caveat above.
