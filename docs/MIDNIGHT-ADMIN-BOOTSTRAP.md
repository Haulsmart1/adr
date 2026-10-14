# Midnight initial administrator

Authorised identity: `stuart@adrcarriers.net`. Authority: `SUPER_ADMIN` (session compatibility spelling `super_admin`). No password is accepted by the bootstrap script. No browser endpoint grants this authority.

## Current external gate

The dedicated Midnight Neon enquiry database already exists. Preserve it; do not create a second application database. The connected Supabase projects discovered on 14 October 2026 are ADR and TMS, neither established as dedicated Midnight Auth. Both project references are explicitly refused by the bootstrap. No Stuart account has been created, verified or granted access in either shared project. Real Stuart login cannot be accepted until a dedicated Auth provider identity is available and Stuart verifies his email and sets a new password securely.

Keep existing Supabase Auth architecture; dedicated Auth provisioning needs the correct account/organisation selection. Do not copy shared project service keys. Authentication scaffolding is not permission to send customer emails. Public application signup remains disabled pending dedicated provider configuration and verification/recovery acceptance.

## Versioned authority and migrations

`node scripts/migrate-midnight.cjs` applies the ordered migrations in a transaction under an advisory lock. It records SHA-256 checksums and refuses changed applied migrations. Set server-only `MIDNIGHT_MIGRATION_DATABASE_URL` to the dedicated migration-owner connection and `MIDNIGHT_MIGRATION_EXPECTED_HOST` to the explicitly verified database host. It refuses production execution and unrelated database names. Runtime connections never use the migration owner.

The initial grant lives in the private `midnight_authority.initial_admin` table. A singleton primary key prevents multiple initial administrators. Identity, verified timestamp, provider project, grant UUID, grant timestamp and authorising instruction are recorded together. UPDATE/DELETE triggers reject mutation. Runtime has SELECT only, no grant/UPDATE/DELETE/TRUNCATE authority. A database owner remains a trusted infrastructure administrator, not a cryptographic immutability guarantee.

## Trusted bind procedure

1. Create Stuart's identity through the dedicated provider's secure registration/invitation flow. Do not mark email verified administratively. Stuart must prove mailbox control and choose a NEW password directly with the provider. Never supply a password to this repository's bootstrap.
2. Set `MIDNIGHT_AUTH_PROJECT_REF`, `NEXT_PUBLIC_SUPABASE_URL` and the matching publishable/anon key for the dedicated provider. The URL must exactly match the pinned project. Runtime requires only the publishable key plus the limited dedicated enquiry database connection.
3. In an offline server environment, set `MIDNIGHT_AUTH_SERVICE_ROLE_KEY`, `MIDNIGHT_ADMIN_DATABASE_URL` (migration owner), `MIDNIGHT_ADMIN_EXPECTED_DATABASE_HOST`, `MIDNIGHT_ADMIN_SUBJECT` (provider UUID) and `MIDNIGHT_ADMIN_BOOTSTRAP_EXPIRES_AT` (UTC, within the next hour). Do not put these in browser code, CLI arguments or committed files.
4. Run `node scripts/bootstrap-midnight-admin.cjs`. It fetches the provider identity, checks verified email, authorised email, subject and ban status, then atomically inserts or returns the existing grant. It cannot create a duplicate provider account because it only binds an existing verified identity. An existing grant for another subject/project fails closed. Output contains only grant UUID and whether it was created. Remove offline bootstrap credentials when finished.
5. Verify actual provider login, operations access, ordinary-account denial, expiry and logout in private preview. Provider identity and durable authority are rechecked for privileged sessions. Profile role and editable user metadata cannot confer super-admin access.

## Verification boundaries

Unit tests cover shared-project refusal, wrong/unverified/anonymous/banned identity, expired bootstrap, concurrency, repeat invocation, caller role injection, provider outage and revoked authority. Real PostgreSQL acceptance reconstructs an empty isolated database, tests concurrent grant uniqueness and runtime permission rejection. Synthetic provider fixtures in the acceptance database are explicitly test records; they are not a verified Stuart account and never enter the application authority table.

Legacy password-generation/admin-email paths are retired. The provider owns password hashing, update and recovery. Dedicated provider registration/recovery and real Stuart login remain configuration/identity gates, not claimed passes.

## Production instruction resolved

Stuart explicitly instructed retention of the current separately promoted production deployment. Do not restore `696047c`, change aliases, promote or change DNS. The earlier rollback question is closed. New work remains local/test/private-preview only.

Legacy invoice/booking mail endpoints also return a truthful retired response without constructing SMTP clients. Original enquiry submissions are database-immutable; status changes retain original details and append an actor-attributed audit. Operations filtering is parameterized and paginated.
