# Midnight Square payment boundary

Midnight is a freight/service business. One-off collection against an approved invoice is commercially appropriate; subscriptions, trials, SaaS entitlements and homepage checkout are not. The approved Road/Air/Sea homepage and European coverage remain unchanged. Production release `696047c` remains untouched.

## Current safety state

Live billing is disabled in code, even if someone sets the environment to `production`. Only Square Sandbox is supported by this implementation, and it defaults to disabled. No credentials were copied, no Square application or customer was created, no database migration was applied and no charge was submitted. The legacy `/api/create-checkout-session` URL now returns 503 instead of charging a browser-supplied amount. Its unused Stripe dependencies are retained to avoid unrelated changes to the recovered estate.

The internal `paySandboxInvoice` service is ready for an authenticated invoice workflow. It is deliberately not exposed as a public checkout endpoint: commercial invoice approval, account authorization and a customer-facing collection journey need separate activation. Server-side invoice mapping supplies amount, currency, company, account, internal customer, invoice/order, Square customer and stable idempotency key. No product prices have been invented. Browser success never changes settlement or grants access.

## Configuration

Use a separate **Midnight application** under the existing Square merchant relationship; never reuse the TMS application, secrets or customer/subscription mappings. Sandbox merchant/location/customer IDs come from that application's Sandbox environment, not the live merchant IDs. All settings below are server-only, with no `NEXT_PUBLIC_` equivalents:

- `MIDNIGHT_SQUARE_ENABLED`: default absent/false; `true` enables configured Sandbox only.
- `MIDNIGHT_SQUARE_ENVIRONMENT`: must be `sandbox`. `production` always fails closed.
- `MIDNIGHT_SQUARE_APPLICATION_ID`: Midnight-specific Sandbox application.
- `MIDNIGHT_SQUARE_MERCHANT_ID`: expected Sandbox seller.
- `MIDNIGHT_SQUARE_LOCATION_ID`: expected Sandbox location.
- `MIDNIGHT_SQUARE_ACCESS_TOKEN`: Midnight Sandbox access token.
- `MIDNIGHT_SQUARE_WEBHOOK_SIGNATURE_KEY`: Midnight webhook subscription signing key.
- `MIDNIGHT_SQUARE_WEBHOOK_URL`: exact HTTPS URL ending `/api/payments/square/webhook`; no query, fragment or trailing slash.
- `MIDNIGHT_SQUARE_DATABASE_URL`: dedicated Midnight Sandbox Postgres database connection with a restricted server role. There is no fallback to this app's Supabase or another product's database.

Apply `database/midnight-square-sandbox.sql` manually to that Sandbox database. Runtime role requires schema USAGE, SELECT on invoice mappings/events, INSERT on events/audit, sequence USAGE, and UPDATE only of `source_hash`, `payment_id`, `status`, `provider_updated_at` on invoice mappings. Do not grant UPDATE/DELETE on audit/events or write access to mapping identities/prices. Invoice approval and seeding belong to a separately authorized server role; customers receive no database grants. Once approved, do not mutate the amount, identities or idempotency key. Use TLS verification for a remote database; do not disable certificate checks. Keep migrations out of automatic Vercel builds.

An approved test mapping uses `MID:` plus a generated UUID (40 characters), a different persisted UUID idempotency key and a Midnight-specific Square Sandbox customer. One mapping per company/invoice is enforced by the database. Before sending a request, the source token's SHA256 fingerprint is durably claimed. The token itself is never stored or logged. A changed source on an unresolved intent is rejected; retry the same request or reconcile the reference, never issue a new key based on an unknown outcome. Failed/canceled payments are not automatically recharged; a future approved retry workflow must define attempts without duplicating collections.

## Webhook and reconciliation

Subscribe this application's endpoint to `payment.created` and `payment.updated`, API version `2026-09-16`. HMAC-SHA256 verifies the configured notification URL plus raw request bytes with timing-safe comparison. Limit request bodies to 256 KB. Signed events outside a 48-hour delivery window or more than five minutes ahead are rejected; this accommodates Square's documented 24-hour retry period. Database event IDs and body hashes prevent duplicate effects and conflicting ID reuse.

Merchant, application, location, reference, local company/account/customer/invoice and Square customer mappings all must match. Payment state is retrieved from Square's Sandbox API, not trusted from event/browser data. Another product's event is acknowledged as ignored without creating a Midnight transaction. Unknown Midnight mappings and transient API/database failures return retryable 503; invalid signatures return 401. Pending events do not settle invoices. A short row-lock transaction records event, status and append-only audit together; older provider timestamps cannot regress settlement. Provider/API errors never return credentials or raw payloads. Monitor non-2xx responses and reconcile after outages beyond the delivery window.

`midnight_square.reconciliation` exposes structured `product=MIDNIGHT`, environment, application, merchant/location, company/account/customer, invoice/internal order, currency, amount in minor units, status, Square payment reference and event audit history. `subscription_id` is null for freight invoices. Future Debbie ingestion should join through these identities and distinguish TMS/HAULSMART/CRYPTONINJA/SOCIAL/MIDNIGHT explicitly. Debbie is not connected. Refunds/disputes and actual invoice paid-state propagation require a separately approved workflow; this boundary records payment settlement only and does not modify existing operational invoice tables.

## Validation and future activation

Local verification: **71/71 tests**, including **21 Square boundary tests**; both TypeScript checks and production build passed with **161/161 static pages generated**. Real database execution was not available because WSL service access was denied. Git staging was also denied because repository metadata is read-only in this session, so payment source changes are saved locally and have not been committed or deployed. The approved homepage preview at `https://midex-clean-midex-bk7idyns6-haulsmart.vercel.app` remains the existing `7bca27f` release; no remote branch was changed. Evidence is in `artifacts/homepage-preview/square-boundary-verification.json`.

Run `node --experimental-vm-modules --test scripts/square-boundary.test.cjs` and `npm run test:local`. Tests exercise signatures, replay, cross-product isolation, trusted prices, customer authorization, idempotency, rollback, stale states and disabled API routes using test doubles without network calls. Test fixtures are fictional and are not prices. Actual Sandbox end-to-end testing requires the dedicated application, customer and database configuration; missing credentials are intentional and do not block delivery of the disabled boundary.

Before any future live activation: Stuart approves prices and invoice collection rules; review an authenticated/CSRF-protected collection endpoint and customer UI; provision Midnight-only production application credentials/webhook; verify merchant/location and account ownership; apply an independently reviewed live schema; test retries/concurrency/refunds/disputes/reconciliation and restricted database grants. A reviewed code change is necessary because this release cannot contact Square production. No live enable switch is supplied.

TMS reference reviewed read-only through GitHub at commit `9e9e8e8f25d6c027eab6ac71d8d5061386e8a4a5`: `lib/payments/square.ts`, `squareLookup.ts`, `lib/billing/periodPaymentServer.ts` and `docs/sql/billing_04_atomic_charge_record.sql`. Patterns retained here: server-only client/configuration, persisted intent before requests, stable idempotency/reference, no replacement request after an indeterminate outcome, and atomic settlement/audit. TMS subscriptions, prices, customer/card IDs and generic environment keys are not reused; TMS was not modified.

Sources: [Square webhook validation](https://developer.squareup.com/docs/webhooks/step3validate), [webhook retries](https://developer.squareup.com/docs/webhooks/overview), [CreatePayment](https://developer.squareup.com/reference/square/payments-api/CreatePayment), [application identity](https://developer.squareup.com/reference/square/objects/ApplicationDetails), [payment reference fields](https://developer.squareup.com/reference/square/objects/Payment).
