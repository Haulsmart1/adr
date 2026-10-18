# Midnight consolidated release-review candidate — 18 October 2026

**DRAFT. Not permission to release, not hosted acceptance. NEVER merge into ADR main.**

## One review target, unchanged application

Target only `preview/midnight-authority-operations` in `Haulsmart1/adr`, verified at
`830cf3ad0bab4244e09af0aa9506255a05dcd717`. The candidate contains the complete
reviewed PR8 → PR9 → PR10 → PR11 → PR12 → PR13 → PR14 chain. PR8 already combines
PR5 with sibling database-target PR6 and private-session PR7; PR5 includes PR1–4.
No existing repair branch or PR has been modified or closed.

Application/test source checkpoint is PR14 commit
`66696d34a6d0ce17b1b29f679c2b0cec8a198363`, tree
`b36edef8cd179db541dae3a4921751ed87d6c71b`. This review branch changes only this
document, two offline review scripts and a separately locked review-tool package.
All application files, root package/lock, SQL migrations, build/deployment
configuration and production dependency versions remain identical to PR14.

| Included area | Review dependency |
| --- | --- |
| Durable capture, stable retries, uncertain notification and required SMTP TLS | PR1–5, retained in PR8 |
| Dedicated database guard, verified administrator binding and session redaction | PR6–8 |
| Customer draft identity/late callback isolation | PR9, PR13 |
| Per-record operations state, downloads, bounded actions and truthful acknowledgement | PR10–12 |
| Failed/obsolete replacement-file reads preserve prior documents | PR14 |

## Reproduce locally without any service credentials

Use a clean exact-SHA checkout with no `.env` files other than `.env.example`:

```bash
npm ci --ignore-scripts --no-audit --no-fund
npm ci --prefix tools/midnight-review --ignore-scripts --no-audit --no-fund
node scripts/verify-midnight-release.cjs FULL_REVIEWED_COMMIT_SHA
```

Use **Node22.x**. The gate requires a clean source checkout, pins the PR14 source
tree and rejects unexpected source drift. It runs existing server/domain/security
tests, six actual-component DOM suites, an actual-SQL embedded test, and the full
Next build. It deliberately strips application credentials and optional integration
database URLs from the child environment and disables Next telemetry. It does not
run a migration CLI, bootstrap an administrator or call any service.
Legacy inherited ADR page imports require nonempty Supabase public variables even
at static build time. The gate supplies a `.invalid` URL and synthetic non-credential
key only; without those fixtures the build fails during static page collection.
This is not real app wiring or proof that those legacy pages can log in.

Separate tools are exactly locked: PGlite0.5.10, esbuild0.25.12, jsdom26.1.0,
React/ReactDOM18.3.1. They are not application runtime dependencies.

## Verified locally in this review

- Existing server/domain/security suites: **117 tests passed**.
- Actual ReactDOM component scenarios: **52 passed** (4 owner, 6 unresolved-session,
  11 file-retention, 2 record-state, 9 downloads, 20 operations actions).
- One embedded-SQL scenario executes all four actual migrations twice and the real
  repository adapter under the restricted `midnight_capture` role. It verifies
  retry beyond rate limit, changed-payload conflict, attachment ownership/bytes,
  uncertain-notification non-retry, stale-status conflict, rollback after rejected
  attachment, audit counts, immutable submissions, and denied delete/truncate/DDL
  and administrator grants. This is one serialized in-memory backend, **not proof
  of real multi-session lock contention, network retry or process/restart durability**.
- Full Next15.5.27 build: **passed**, including all156 generated pages, with
  Node22.23.3 and the explicitly synthetic public fixtures. The entire clean-checkout
  gate passed: 117 server/domain cases,52 actual-component scenarios,one embedded
  SQL scenario and build. No hosted service was configured or accepted.
- No new production TypeScript claim: this Pages JavaScript app uses its existing
  Next build/lint/type configuration; there is no new blanket `tsc` acceptance gate.

## Hosted blockers and exact authority

Fresh Vercel reads on18October still show dedicated project
`prj_ssFhW39cgBpDO7aZsP5ifUnj0iJw`, team
`team_4s3slf7RDwc6sdOHUHIp2NoJ`, production `da43ab5626060af5bba1aa7585276d4a7c45fc50`
at `dpl_FbeSPSVbBMFTa3EyN9hbYrjBKB6s` READY; authority preview830cf3 at
`dpl_HbLPK16iKFs4EjZioJM1F9uL8Fvh` READY. Those deployments are unchanged.
The PR14 READY build `dpl_7i5fQFVwidDU1fBz9VQJcxuAxJ6o` belongs to the **ADR
source project**, not the dedicated Midnight project. A new ADR source preview
also cannot establish dedicated Midnight acceptance.

Remaining separately authorised setup is listed in `MIDNIGHT_COMPLETE_REVIEW.md`:
securely bind the existing isolated Neon `square-base-33952656` /
`br-bold-fog-b9qorznb` / `midnight_enquiries` restricted runtime role, stable hash
secret, intended dedicated Auth project and exact preview URL, and verified admin
authority. Do not substitute legacy ADR or TMS identities or recover exposed SMTP
passwords. Email stays disabled for capture acceptance; SMTP/provider acceptance
and final delivery require separate approval and verification. Current setup
absence is not a reason to create another database or paid service.

Then the release owner must authorise an exact-SHA **dedicated Midnight** private
preview and labelled synthetic hosted capture/retry/logout/login/operations and
attachment acceptance, including independent-process persistence, mobile and
ordinary-user denial. Keep current production aliases unchanged. Local fixtures
do not establish browser-provider login or actual delivery.

No production deployment, merge, live configuration/schema/data/storage write,
billing activation, notification, customer publishing or administrator grant was
performed. Documents remain memory-only until capture, and pending requests may
complete server-side. Readiness remains **65%** pending hosted acceptance.
