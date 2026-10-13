# Midnight enquiry delivery

The customer journey is service/contact/road quote → `/enquiry` → shipment brief →
operations. Road, air, sea and advice requests share the same optional cargo and
DG fields. No price, booking or DG acceptance is promised. The approved homepage
and European map are unchanged.

`/api/enquiry` and historical `/api/contact` use one validated delivery boundary.
The historical endpoint now requires the full enquiry contract; its old unvalidated
name/email/message payload is rejected. No current page uses that old payload.

## Configuration (server only)

All of these must be supplied independently for Midnight:

| Variable | Required value |
| --- | --- |
| `MIDNIGHT_ENQUIRY_ENABLED` | `true` only after the environment's mail test succeeds |
| `MIDNIGHT_ENQUIRY_REDIS_URL` | Dedicated TLS `rediss://` connection, persistent storage, no eviction |
| `MIDNIGHT_ENQUIRY_HASH_SECRET` | Independently generated random secret, at least 32 characters |
| `MIDNIGHT_ENQUIRY_SMTP_HOST` | Verified SMTP host supporting implicit TLS on port 465 |
| `MIDNIGHT_ENQUIRY_SMTP_USER` | Dedicated authenticated SMTP username |
| `MIDNIGHT_ENQUIRY_SMTP_PASS` | Dedicated SMTP credential |
| `MIDNIGHT_ENQUIRY_FROM` | Single verified sender mailbox |
| `MIDNIGHT_ENQUIRY_TO` | Single operations mailbox; use a controlled test inbox in Preview |

Do not copy TMS credentials or recovered generic SMTP credentials. No `NEXT_PUBLIC_`
setting is used. Do not enable Preview against a customer inbox. Production enablement
and deployment remain external release gates. If any setting is missing, the page
offers a copyable brief and explicit email-app action; the API fails closed.

## Delivery and retry semantics

Only explicit SMTP acceptance for the configured recipient produces `accepted`.
The wording says **mail server accepted**, not inbox delivery, quote issuance or
confirmed booking. No customer acknowledgement email is generated. Text-only mail
has fixed sender/recipient/subject structure, validated reply-to, MIDNIGHT attribution
and an opaque reference. No provider exception or credential is returned or logged.

A normalized content HMAC is atomically reserved in Redis before contacting SMTP.
Identical enquiries share a 48-hour reservation across instances. Completed requests
return the same reference without a second send. Concurrent or uncertain requests
return `unconfirmed`. A timeout, process interruption, rejected recipient or failed
post-send storage write retains the reservation. There are no automatic SMTP retries.
Operations must inspect the reference/mail logs before arranging a resend. After
48 hours the deduplication window expires; this is not permanent exactly-once delivery.
Changing content creates a different enquiry. Redis data loss, eviction or changing
the hash secret can remove duplicate protection, so verify persistence/no-eviction
and do not rotate the secret during the window without an operational plan.

Rate limits are shared across instances: 10 attempts per IP and 5 per email per ten
minutes. Vercel's overwritten `x-real-ip` is trusted only on Vercel; other deployments
use socket identity. Keys contain HMACs, not raw email/IP or shipment content. Redis
failure prevents a send. SMTP uses certificate validation, TLS 1.2 minimum and bounded
connection/idle timeouts. The browser times out after 25 seconds without retrying.
The API has a 30-second platform limit and a 16 KB body limit.

The current tab saves its draft and delivery state in sessionStorage; drafts older
than 24 hours are discarded on page load. Clear draft removes it immediately. The
UI explains this storage. Refresh after an uncertain send retains the caution and
does not send again. No attachment upload or sensitive document storage is offered.

## Verification before enablement

Run `npm run test:local` and the browser gate against a production build. In an isolated
environment with a controlled mailbox and dedicated Redis, verify actual SMTP
acceptance, inbox receipt, bounce handling, simultaneous duplicate submissions,
connection loss and Redis restart/persistence. Confirm sender SPF/DKIM/DMARC and
operations ownership. Local mocks do not establish real inbox receipt.

Implementation references: [Nodemailer SMTP](https://nodemailer.com/smtp),
[SMTP acceptance results](https://nodemailer.com/extras/smtp-connection),
[Redis SET NX/EX](https://redis.io/docs/latest/commands/set/),
[Redis eviction](https://redis.io/docs/latest/develop/reference/eviction/).
