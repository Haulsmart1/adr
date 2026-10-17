# Shared TMS mail provider: setup handoff

Status: code preparation only. No credentials copied, hosting configuration changed, or messages sent.

The user authorises HaulSmart and Midnight to use TMS's working mail provider. This does not establish that a password saved in Supabase can be read by a Vercel application. Authentication email and application notifications have separate configuration stores.

## HaulSmart authentication

The current `pages/login.js` uses Supabase `signInWithOtp`. Configure custom SMTP in **HaulSmart's own Supabase project**, not in Vercel's `EMAIL_USER` / `EMAIL_PASS` variables. A provider administrator must securely enter the working TMS provider's host, submission port, fresh authentication credential and permitted sender. Confirm the HaulSmart project identity and sender authorisation before saving. Do not change the TMS project or its URL configuration.

## Midnight enquiry notifications

The durable enquiry path uses `lib/server/enquiryMail.cjs`, with these server-only variables in the hosting project for the authoritative deployed repository:

| Variable | Secure setup source |
| --- | --- |
| `MIDNIGHT_ENQUIRY_SMTP_HOST` | Working TMS provider host |
| `MIDNIGHT_ENQUIRY_SMTP_PORT` | Provider's verified submission port: 465 or 587 |
| `MIDNIGHT_ENQUIRY_SMTP_USER` | Provider-authorised sending identity |
| `MIDNIGHT_ENQUIRY_SMTP_PASS` | Fresh secret entered directly into hosting secret storage |
| `MIDNIGHT_ENQUIRY_FROM` | Mailbox or alias this identity is authorised to send as |
| `MIDNIGHT_ENQUIRY_TO` | Verified operations recipient |

Port 465 uses implicit TLS. Port 587 requires STARTTLS with certificate verification. Default remains 465 for existing configurations. No provider host is guessed. Shared credentials must never use a `NEXT_PUBLIC_` prefix or be committed.

`SMTP_*`, `EMAIL_*` and `NODEMAILER_*` are not aliases for these enquiry variables. Legacy invoice/export transports remain separate; this patch does not switch them. Enquiry email enablement and durable storage gates remain unchanged. Do not enable email until the recipient, sender permission, durable capture and controlled acceptance test are verified.

## Credential incident

The exposed HaulSmart credential must be revoked or rotated by the mailbox/provider owner, even if the new provider replaces it. Removing it from current repository files does not revoke copies in history. Do not recover or reuse the exposed value.

## Acceptance

First verify settings in an isolated environment using separately scoped secrets. When authorised for controlled sending, confirm delivery to the verified test recipient, then confirm enquiry persistence and retry behaviour. SMTP acceptance alone is not mailbox delivery. Confirm HaulSmart register / verify / login / logout / login separately. Production release remains a separate action.
