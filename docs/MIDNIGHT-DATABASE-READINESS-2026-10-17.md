# Midnight combined candidate: database readiness

This candidate combines ADR PRs #1 (receipt retries), #2 (source guard), #3 (uncertain draft preservation), and #4 (SMTP TLS) above authority snapshot `830cf3ad0bab4244e09af0aa9506255a05dcd717`. It targets the Midnight authority branch, not ADR main. It does not activate production.

## Verified existing resources

Read-only checks on 17 October 2026 found the existing Neon project `square-base-33952656`, named `midnight-enquiries-private-preview`, branch `br-bold-fog-b9qorznb` (`preview-development`), database `midnight_enquiries`, region `aws-eu-central-1`. Preserve this store; do not create a duplicate. The enquiries, attachments, audit, and rate_limits tables and expected columns exist; four migrations are recorded. There are 39 enquiry rows; their contents were not inspected. Earlier preview documentation describes synthetic records. Initial administrator authority has zero rows.

Runtime role `midnight_capture` has SELECT/INSERT on attachments and audit, and SELECT/INSERT/UPDATE on enquiries and rate_limits. No DELETE table grant was present. This is a private server-side SQL store, not a browser Data API.

The connected Supabase project `jrhvorrsppjzbkropmub` is healthy legacy ADR infrastructure and contains no Midnight enquiry schema. Do not point the dedicated enquiry repository at that operational database.

## Exact remaining wiring gates

Vercel project `prj_ssFhW39cgBpDO7aZsP5ifUnj0iJw` project-environment metadata did not contain `MIDNIGHT_ENQUIRY_DATABASE_URL` or `MIDNIGHT_AUTH_PROJECT_REF`. Supabase public URL/anon and service-role keys were listed, but no secret values were retrieved. This metadata check does not establish values injected by another deployment mechanism.

An authorised operator must securely bind the existing limited Neon runtime connection to the intended private preview, establish the dedicated Auth project identity, and follow `MIDNIGHT-ADMIN-BOOTSTRAP.md` for verified mailbox binding. Do not copy ADR/TMS service keys or put credentials in documentation, chat, or source.

Then perform controlled isolated acceptance: submit a synthetic enquiry with notifications disabled, recover its unchanged receipt repeatedly, verify attachments/audit and independent-process persistence, reject changed-payload retries, test authorised operations access and ordinary-account denial, then logout/login. This audit made no data writes and did not perform that acceptance.

SMTP provider acceptance is separate; follow `SHARED-TMS-MAIL-SETUP-2026-10-17.md`. No email, paid provisioning, billing, deposits, schema migration, production configuration, alias, or deployment was changed.
