ADR Carriers’ dedicated dangerous-goods proposition and specialist service journeys need clearer commercial copy, stronger enquiry requirements and consistent technical SEO. This adds an original homepage, nine transport guides covering the ten requested intents, a Cumbria enquiry page, specialist internal links, phone/quote actions, customer FAQs and clearer quote-form behaviour. Existing core service URLs are retained.

**Draft only — blocked for release.** Authenticated Vercel inspection identifies `Haulsmart1/adr`, but the live `.com` deployment is a CLI upload of `stu-development` commit `603e019e8f16f208d488894db8e51403a9ac25ba`, which is absent from GitHub. GitHub main has different operational code and older dependencies. This branch is an integration candidate against the accessible source, not permission to replace production. Recover the exact deployed source, reconcile this public SEO patch while retaining production’s patched framework and operational code, then rerun integrated regression checks before approval.

Validation:

- Production build and lint pass; five focused tests pass.
- Local rendered crawl: 37 public pages, unique titles/descriptions, exact canonicals, one H1 per page and no crawl issues.
- 55 internal link destinations enumerated; employment deliberately not requested. Policy PDF links repaired.
- Axe WCAG checks pass on 14 conversion-focused pages; responsive checks cover 320–1440 px.
- Quote success, invalid input, provider rejection and network failure tested with requests intercepted locally. No real submission or live database access.
- Mobile Lighthouse reports, screenshots, research evidence and the URL-by-URL consolidation proposal are in `docs/seo-20261029/`.

`vercel.json` disables Git-triggered deployment for this development branch. No preview or production deployment is requested; no DNS, live redirects or live data are changed. The existing production deployment remains unchanged.

Content gates: confirm current specialist operating scope and regulatory guidance with Stuart and the appropriate adviser. Additional city pages and case studies are deferred until service-area evidence and permissioned operational records exist. Historic ancillary-page claims on main must be reconciled with current live copy before release. Search Console was unavailable: all rankings, impressions and clicks remain unverified.

Commercial opportunities are better-qualified dedicated ADR, battery, Class 1/Class 7, Ireland and time-critical enquiries; no numeric ranking or lead uplift is promised. See `release-review.md`, `content-evidence-and-approvals.md`, `competitive-benchmark.md`, `url-consolidation-plan.csv` and `results/verification-summary.md` for review evidence and release gates. Stuart’s explicit approval is required before deployment or domain consolidation.
