-- Unapplied migration: dedicated Midnight Sandbox Postgres database only.
BEGIN;
CREATE SCHEMA midnight_square;
REVOKE ALL ON SCHEMA midnight_square FROM PUBLIC;
CREATE TABLE midnight_square.invoice_payments (
  reference_id text PRIMARY KEY CHECK(reference_id ~ '^MID:[0-9a-f-]{36}$'),
  product text NOT NULL DEFAULT 'MIDNIGHT' CHECK(product='MIDNIGHT'),
  environment text NOT NULL DEFAULT 'sandbox' CHECK(environment='sandbox'),
  application_id text NOT NULL, merchant_id text NOT NULL, location_id text NOT NULL,
  company_id text NOT NULL CHECK(company_id<>''), account_id text NOT NULL CHECK(account_id<>''),
  customer_id text NOT NULL CHECK(customer_id<>''), invoice_id text NOT NULL CHECK(invoice_id<>''),
  internal_order_id text NOT NULL CHECK(internal_order_id<>''), square_customer_id text NOT NULL CHECK(square_customer_id<>''),
  amount_minor bigint NOT NULL CHECK(amount_minor>0 AND amount_minor<=9007199254740991),
  currency text NOT NULL CHECK(currency ~ '^[A-Z]{3}$'), approved boolean NOT NULL DEFAULT false,
  idempotency_key uuid NOT NULL UNIQUE,
  source_hash text CHECK(length(source_hash)=64),
  payment_id text UNIQUE,
  status text NOT NULL DEFAULT 'AWAITING_VERIFICATION' CHECK(status IN ('AWAITING_VERIFICATION','APPROVED','PENDING','COMPLETED','CANCELED','FAILED')),
  provider_updated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(environment, company_id, invoice_id)
);
CREATE TABLE midnight_square.events (
  event_id text PRIMARY KEY,
  reference_id text NOT NULL REFERENCES midnight_square.invoice_payments(reference_id),
  body_hash text NOT NULL CHECK(length(body_hash)=64), event_type text NOT NULL,
  provider_created_at timestamptz NOT NULL, received_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE midnight_square.audit (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event_id text NOT NULL UNIQUE REFERENCES midnight_square.events(event_id),
  reference_id text NOT NULL REFERENCES midnight_square.invoice_payments(reference_id),
  payment_id text NOT NULL, provider_status text NOT NULL, applied boolean NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX square_events_reference ON midnight_square.events(reference_id);
CREATE INDEX square_audit_reference ON midnight_square.audit(reference_id);
CREATE VIEW midnight_square.reconciliation AS
SELECT p.product, p.environment, p.application_id, p.merchant_id, p.location_id,
       p.company_id, p.account_id, p.customer_id, p.invoice_id, p.internal_order_id,
       NULL::text AS subscription_id, p.reference_id, p.square_customer_id,
       p.currency, p.amount_minor, p.status AS payment_status, p.payment_id AS square_payment_id,
       p.provider_updated_at, a.event_id, a.provider_status, a.applied, a.recorded_at
FROM midnight_square.invoice_payments p JOIN midnight_square.audit a USING(reference_id);
REVOKE ALL ON ALL TABLES IN SCHEMA midnight_square FROM PUBLIC;
COMMIT;
