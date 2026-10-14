# Midnight consolidated commercial candidate

## Source reconciliation

Source A was recovered clean at `dd89669814aebef1a13410e74d8299f7a089722c` on `stu-homepage-preview` in `Haulsmart1/midex-clean-midex`. Source B was verified remotely at `d7abb0ecbbfff6dc97a7df31226fc7d7b39a036b`, `Haulsmart1/adr`, `preview/midnight-road-air-sea-enquiries`. Their application source trees are identical; Source A adds hosted demo evidence. No newer alternate homepage exists in the recovered local history.

The approved presentation is the `9f067f8` homepage with `b467e4f` Portugal/Nordic and `7bca27f` Poland/Baltic coverage corrections. Approval and scope are recorded in `HOMEPAGE-PREVIEW.md`. Homepage, map assets and shared visual layout remain unchanged. Contact correction `c80c1eb` and enquiry checkpoints `fb42d78` / `45c2cc1` are preserved. The public ADR snapshot deliberately omits credential-bearing historical commits; consolidated source publication must retain that clean ancestry rather than push the older private history.

## Durable capture

`database/midnight-enquiries.sql` creates a private PostgreSQL schema. Enquiry details, up to three bounded documents, a stable reference and capture audit commit together. A transaction-scoped advisory lock and unique HMAC request key provide cross-instance idempotency. Changing payload under an existing key returns conflict; it cannot overwrite the stored enquiry. References are random UUID-derived identifiers. IP and email limits use keyed hashes in the same database. Redis is not required.

The browser retains the request UUID in its tab draft for safe retries after a lost response. Drafts expire after 24 hours and are cleared when authenticated identity changes. Documents are not copied into browser storage: reselect the same files after refresh before retrying an uncertain submission. Separate browser sessions have independent drafts. Shared-device users should clear drafts when finished.

PDF, JPEG and PNG uploads require matching extensions and signatures, strict base64, safe filenames and a maximum of 1 MiB each, three per enquiry. Binary contents are private database rows, bound to the enquiry transaction. Only authenticated super-admin download endpoints serve them, as attachments with `nosniff` and a restrictive CSP. File-type validation is not malware certification; operations must use managed document protection when opening customer files.

## Operations and notification

`/operations/enquiries` and its reference detail pages reuse the existing signed, unexpired super-admin session policy. No new public role, test login or authentication bypass is added. List pagination, customer/shipment detail, notification state, document downloads and audit history are available. Anonymous, ordinary and expired sessions are rejected before storage access. Download queries require both reference and file ID.

Email is independent of capture. Notifications contain the stable reference, full shipment brief and instructions for the protected document view. TLS SMTP has bounded timeouts. A database claim prevents simultaneous sends. Explicit SMTP rejection is retryable (one-minute spacing, three attempts maximum); uncertain acceptance and interrupted `sending` states require operator investigation and are never automatically resent. Provider acceptance is not proof of inbox delivery. Notification failure or audit acknowledgement failure cannot erase the captured enquiry.

## Dedicated preview configuration

Provisioned isolated Neon project: `square-base-33952656`, name `midnight-enquiries-private-preview`, region `aws-eu-central-1`, database `midnight_enquiries`. This contains synthetic preview records only. It is independent of production and TMS. Runtime role `midnight_capture` has schema usage, SELECT/INSERT, limited UPDATE and sequence usage; it cannot create tables or delete enquiries. Migration-owner credentials are never deployed. Application connections use the pooled endpoint; migrations use the direct endpoint.

Server-only deployment variables:

- `MIDNIGHT_ENQUIRY_ENABLED=true`
- `MIDNIGHT_ENQUIRY_DATABASE_URL`: dedicated runtime PostgreSQL URI with TLS
- `MIDNIGHT_ENQUIRY_HASH_SECRET`: independently generated random secret, at least 32 characters; keep stable for the lifetime of retained idempotency records
- `MIDNIGHT_ENQUIRY_EMAIL_ENABLED=false` for this preview
- `MIDNIGHT_SQUARE_ENABLED=false`
- `NEXTAUTH_SECRET`: independent preview-only authentication secret

Future authorised email configuration additionally needs `MIDNIGHT_ENQUIRY_SMTP_HOST`, `MIDNIGHT_ENQUIRY_SMTP_USER`, `MIDNIGHT_ENQUIRY_SMTP_PASS`, `MIDNIGHT_ENQUIRY_FROM` and `MIDNIGHT_ENQUIRY_TO`, then an explicit email enable flag. Never use production/TMS credentials for testing. Preview capture is intentionally real; notification remains disabled. A stored receipt therefore says notification is pending and advises calling for urgent freight.

## Release evidence and remaining gates

Current exact-candidate evidence is recorded under `artifacts/consolidated-candidate`. Full application/Square tests, a real dedicated-database integration test, types, changed-source lint, build, dependency audit, secret checks, hosted browser and full article crawl form the release gate. Evidence from the older demo is retained as provenance, not substituted for consolidated acceptance.

Production promotion, live payments and outbound production email are not authorised by this candidate. Final commercial/legal review must confirm the privacy notice, retention schedule, provider arrangements and shipment terms before public launch. Real operations account access follows existing account administration; synthetic signed sessions used in preview verification do not establish a production account.

## Verified hosted milestone

Release branch `preview/midnight-consolidated-release`, commit `da43ab5626060af5bba1aa7585276d4a7c45fc50`, deployment `dpl_9xFBmrZmhVAav8Jam2XmYcjyD6iX`: https://midex-clean-midex-8xnq6rrzj-haulsmart.vercel.app . Vercel Authentication remains enabled.

Hosted acceptance: six Road/Air/Sea desktop/mobile flows; 36 public page/viewports; six authenticated operations page/viewports; desktop/mobile homepage screenshots and keyboard checks; all 23 retained routes; all 2,352 articles HTTP 200 with retained canonicals and sitemap entries. Durable capture, private attachments, role/expiry/IDOR controls, real browser timeout after commit, same-reference retry and account-change draft clearing pass. A dedicated database restart preserved all 19 records present at that test point.

The final local build generated 163 pages; 99 application tests plus the real PostgreSQL integration test pass; both TypeScript checks and lint pass; dependency audit has zero findings; known secret values have no source/client matches. The operations-page inherited background contrast was corrected and manually rechecked. Automated accessibility scans report zero violations; image-backed homepage contrast incomplete results remain explicitly recorded, not treated as certification.

Email and Square remain disabled. Provider configuration and final legal/commercial approval remain external gates. ADR main is unchanged. Final production comparison detected a separate API promotion at 05:49:59 UTC, using a different token from the preview CLI. It created production deployment `dpl_FbeSPSVbBMFTa3EyN9hbYrjBKB6s` from the verified preview and reassigned seven live aliases. This session issued no promotion. The previous production was `dpl_HEwd5hHJQem5LjDCho3CWh485UKF`. Owner confirmation is needed before reversing a separate live deployment; see `artifacts/consolidated-candidate/production-change-investigation.json`. Post-deployment evidence is preserved locally without moving the published branch away from its deployed commit.

## Hospital-mode continuation

Stuart has explicitly resolved the separate production promotion: retain current production. No rollback, promotion, alias or DNS change is authorised during this mission. The earlier confirmation request is closed.

Dedicated Midnight persistence already exists and has been retained. Versioned migrations now also prepare immutable initial administrator authority and audited operations workflow/search. Dedicated Auth provisioning and Stuart mailbox verification remain external gates; no real account grant is claimed. See `docs/MIDNIGHT-ADMIN-BOOTSTRAP.md`.
