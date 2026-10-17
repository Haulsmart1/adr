# Midnight complete review candidate

Combines candidate PR #5 with sibling database-target guard #6 and refresh-token
redaction #7, preserving the original branches. The separate authority snapshot
remains the base; this is never an ADR main release.

The shared-project deny list also includes the currently connected legacy ADR
project `jrhvorrsppjzbkropmub`, which the readiness evidence identified but the
older deny list did not include. The regression supplies a matching URL, ensuring
that rejection comes from the shared-project rule rather than a URL mismatch.

## Secure private-preview wiring

1. Verify Vercel team/project `team_4s3slf7RDwc6sdOHUHIp2NoJ` /
   `prj_ssFhW39cgBpDO7aZsP5ifUnj0iJw` and exact reviewed candidate commit.
2. Bind `MIDNIGHT_ENQUIRY_DATABASE_URL` securely to existing Neon project
   `square-base-33952656`, branch `br-bold-fog-b9qorznb`, database
   `midnight_enquiries`, limited runtime role `midnight_capture`. Confirm its
   actual host, branch, role and grants; the URL-name guard alone cannot do that.
3. Set `MIDNIGHT_ENQUIRY_ENABLED=true` and a securely generated, stable
   `MIDNIGHT_ENQUIRY_HASH_SECRET` of at least 32 characters. Rotating the secret
   changes retry fingerprints; do not rotate during acceptance/retry recovery.
4. Keep `MIDNIGHT_ENQUIRY_EMAIL_ENABLED=false` for capture acceptance. Verify
   durable receipt recovery, changed-payload rejection, attachments/audit and
   independent-process persistence using labelled synthetic records only.
5. Establish a dedicated Supabase Auth project. Set matching
   `MIDNIGHT_AUTH_PROJECT_REF`, `NEXT_PUBLIC_SUPABASE_URL`, and
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, plus secure `NEXTAUTH_SECRET` and exact preview
   `NEXTAUTH_URL`. Existing legacy ADR/TMS identity is not an acceptable substitute.
6. Follow `MIDNIGHT-ADMIN-BOOTSTRAP.md` separately for mailbox verification and
   one-time authority binding; never give the runtime migration-owner/service keys.
7. Test owner login, ordinary-account denial, authority revocation, logout and
   expired sessions. Session JSON must omit refresh credentials. Short-lived
   access tokens remain necessary for the existing application session clients.
8. Only after separate authorization, configure the intended verified SMTP
   provider using `MIDNIGHT_ENQUIRY_SMTP_HOST`, `_USER`, `_PASS`, optional `_PORT`
   (465 implicit TLS or 587 required STARTTLS), `MIDNIGHT_ENQUIRY_FROM` and `_TO`.
   Enable notifications separately and distinguish provider acceptance from
   final delivery. Never reuse the previously exposed HaulSmart password.

No configuration, deployment, migration, authority grant, real enquiry, email,
payment or production action is part of preparing this candidate.
