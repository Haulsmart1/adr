# Midnight commercial enquiry candidate — 13 October 2026

Recovered `C:\Users\StuartDargue\midnight-development`, branch
`stu-homepage-preview`, clean at `a8f5c1b87bc0cfc9dd1fc9cbf02679775533fdc3`.
The contact fix at `c80c1eb` and Square boundary at `ca9b531` were already committed.
No reset, clean, rollback or recreation was performed. Three commits were local
relative to the available remote refs. The checkout initially had no Vercel link.

Vercel's API and named CLI project inspection confirmed `haulsmart/midex-clean-midex`,
project `prj_ssFhW39cgBpDO7aZsP5ifUnj0iJw`, Node 22. Production was re-inspected at
`www.midnight-xpress.com`: deployment `dpl_HEwd5hHJQem5LjDCho3CWh485UKF`, commit
`696047c3c9db2958f42e8d1e606ba6c55af009d3`, READY. Preview access protection remains
enabled (`all_except_custom_domains`). No production mutation is part of this work.

## Changes

- Added `/enquiry` for Road, Air, Sea and advice requests, with shipment/contact
  details, optional DG information, copyable email brief, tab draft recovery and
  honest delivery states. Contact, service and road quote pages link to it.
- Replaced the legacy insecure contact mail endpoint with the isolated, validated
  enquiry boundary. TLS verification, shared rate limits, atomic duplicate locks,
  bounded requests and no automatic retries after uncertain SMTP outcomes.
- Added the enquiry canonical, sitemap entry and shared marketing-document handling.
- Preserved homepage, map, article datasets, all historical route patterns, account
  architecture and Square source/schema. Service copy is unchanged; only its enquiry
  link changed. No freight pricing or payment terms were introduced.
- Removed unused `react-stepper-horizontal`, `react-cookie-consent`,
  `i18next-http-backend`, and the Vercel CLI from application dependencies. The
  external installed CLI remains available. Applied compatible audit fixes, scoped
  UUID 11.1.1 overrides and Next's PostCSS 8.5.30 override. No Next major migration.

## Current evidence

Evidence files are in `artifacts/enquiry-candidate`.

| Gate | Result |
| --- | --- |
| Application tests | 90 passed, 0 failed, including 21 Square and 11 enquiry tests |
| Root and application TypeScript | Passed with Node 22 |
| Production build | 162/162 static pages; enquiry is server-rendered |
| Dependency audit | 0 vulnerabilities; recovered baseline audit reported 48 |
| Dependency tree | No npm dependency-tree problems |
| Route preservation | All 23 historical patterns verified |
| Article crawl | All 2,352 unique article URLs returned HTTP 200, with canonical and sitemap presence |
| Public HTTP/navigation | 12 pages, 25 internal links, four shared-host homepage variants |
| Existing commercial browser journey | 20 page/viewport checks, no exceptions or automated WCAG violations |
| Homepage browser | Desktop/mobile, keyboard skip/menu, no overflow/broken images/automated WCAG violations |
| Enquiry browser | 320/390/1440 widths; DG, draft/refresh, unavailable mail, accepted/uncertain fixtures, real 25-second browser abort |
| Known private-value scan | No matches in current source or generated browser assets |
| Git whitespace | `git diff --check` passed |

The homepage has existing image-backed contrast checks that axe marks incomplete;
zero automated violations is not a claim of complete accessibility certification.
SMTP acceptance/uncertain browser responses use intercepted fixtures. The disabled
and unavailable API states use real local handlers; no email was sent. The enabled
local server uses synthetic credentials and blocks external network access. Real
Redis persistence and SMTP inbox delivery are not established by those tests.

The generic history scanner retains 93 candidate locations across 35 commits at
recovery verification. Nine current-tree candidates are runtime expressions or
synthetic tests, not private credential literals. Historical exposure still requires
credential-owner rotation; no history rewrite or shared credential rotation occurred.

## External gates

Dedicated enquiry SMTP/Redis configuration and controlled inbox verification are
documented in [ENQUIRY-DELIVERY.md](ENQUIRY-DELIVERY.md). Preview keeps delivery disabled.
Square Sandbox application, isolated payment database and provider end-to-end checks
remain external gates from [SQUARE-PAYMENT-BOUNDARY.md](SQUARE-PAYMENT-BOUNDARY.md).
Final legal approval, commercial pricing decisions and production promotion remain
reserved. No customer charges, uncontrolled emails, DNS changes or TMS writes.

Preview deployment evidence is recorded separately after the local checkpoint.

## Protected preview verified

Source checkpoint: `fb42d783882d0844287d76f24bc83827dd6216cd`.
[Open protected preview](https://midex-clean-midex-ks55z99mc-haulsmart.vercel.app).
Vercel deployment `dpl_C9fKdBMtsipU8kRwAfHSL9vSY6m1` is READY, Preview only,
Next.js 15.5.27 / Node 22; build approximately 65 seconds. Hosted checks passed
12 public pages, all 23 historical route examples, all 2,352 sitemap article links,
22 commercial page/viewport checks and two homepage viewports. No detected browser
exceptions or automated accessibility violations. The final preview screenshots
show the final customer-facing brief notice; earlier local images predate that
copy adjustment. Both enquiry endpoints, Square and legacy checkout return 503
while disabled. Production was re-inspected after verification and remains
`696047c`, deployment `dpl_HEwd5hHJQem5LjDCho3CWh485UKF`. Preview evidence is
saved in `artifacts/enquiry-candidate/preview-*.json` and matching screenshots.
