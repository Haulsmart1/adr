# Midnight runtime database guard

The enquiry readiness check and runtime pool now share validation of the dedicated
`MIDNIGHT_ENQUIRY_DATABASE_URL`. The URL must use Postgres, include a host, and name
the existing `midnight_enquiries` database. Fragments and query parameters that can
override the parsed host, port, database or credentials are refused. Errors never
echo the URL or credentials. Ordinary TLS connection options remain supported.

This guards accidental use of a default or legacy database. A database name alone
does not verify the Neon project, branch, runtime role, schema or grants. Secure
preview wiring must still verify those against the recorded enquiry database and
separate Auth project before hosted acceptance. No new environment variables,
database resources, migrations, records or role grants are introduced.

Synthetic validation: `npm run test:database-config`, the receipt/capture/authority
tests and `npm run test:local`. These checks do not connect to a hosted database or
send email. Hosted capture/read-back and notification acceptance remain pending.
