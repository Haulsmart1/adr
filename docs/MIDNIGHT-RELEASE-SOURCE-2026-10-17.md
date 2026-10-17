# Midnight source and release handoff — 17 October 2026

This is a review proposal, not permission to deploy. Preserve the current production aliases and keep outbound email and Square disabled.

## Verified mapping

| Item | Exact source |
| --- | --- |
| Vercel project | `midex-clean-midex`, `prj_ssFhW39cgBpDO7aZsP5ifUnj0iJw` |
| Team | `team_4s3slf7RDwc6sdOHUHIp2NoJ` |
| Current production | ADR `preview/midnight-consolidated-release`, `da43ab5626060af5bba1aa7585276d4a7c45fc50`, deployment `dpl_FbeSPSVbBMFTa3EyN9hbYrjBKB6s`, READY |
| Latest authority preview | ADR `preview/midnight-authority-operations`, `830cf3ad0bab4244e09af0aa9506255a05dcd717`, deployment `dpl_HbLPK16iKFs4EjZioJM1F9uL8Fvh`, READY |
| Receipt repair | ADR PR #1, `531a30f4260d26d660d0fcd7f4982322ddb8ca62`; targets authority branch |
| Linked legacy repository | `Haulsmart1/midex-clean-midex`; main is an older application and is not the source of the two deployments above |

The deployments use CLI/redeploy sources. A Git connection to the legacy repository does not establish source equivalence or cause ADR PRs to deploy automatically. Do not merge the Midnight snapshot into ADR main, relink the live project, or publish private historical ancestry to resolve this mismatch. See `CONSOLIDATED-CANDIDATE.md` for provenance.

## Reproducible candidate verification

Use a fresh clone of `https://github.com/Haulsmart1/adr.git`. Checkout the exact reviewed candidate SHA, never a moving branch name. Apply the source-guard change and receipt repair to an isolated candidate branch through normal review before choosing its final SHA. The guard requires a clean checkout and a full explicit SHA:

```bash
node scripts/verify-midnight-source.cjs FULL_REVIEWED_COMMIT_SHA
npm ci
npm run test:local
npm run scan:secrets
npm run build
```

If the receipt repair is included, also run `npm run test:receipt-retry`. Run the dedicated PostgreSQL integration test only against its isolated preview database with runtime credentials delivered through the approved environment, never production/TMS. Do not print credentials or save pulled environment files in artifacts. Local checks do not establish hosted persistence or account access.

The application root is repository root (`.`), framework Next.js, Node `22.x`, install `npm ci`, build `npm run build`; keep default Next.js output handling. `vercel.json` has no rootDirectory key. Before any later authorised deployment, confirm the actual project settings and preview variables rather than assuming these are effective in Vercel.

## Separate release decision

After review, a release owner must explicitly select whether the authority/admin changes and the receipt repair are both intended for production. Obtain a private preview from the exact final candidate using the verified project/team and isolated resources; verify the emitted commit matches the candidate. Exercise enquiry capture, stable-reference retries, private attachments, authorised operations access and anonymous rejection, including mobile. Do not grant production authority using synthetic preview sessions.

No deploy workflow, Vercel setting, migration or production mutation is added here. A later production release requires explicit authorisation and verified production environment configuration. Retain current production until then.
