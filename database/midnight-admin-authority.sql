-- Apply only to the dedicated Midnight database with the migration owner.
BEGIN;
CREATE SCHEMA IF NOT EXISTS midnight_authority;
REVOKE ALL ON SCHEMA midnight_authority FROM PUBLIC;
CREATE TABLE IF NOT EXISTS midnight_authority.initial_admin (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  provider_project text NOT NULL CHECK (provider_project ~ '^[a-z]{20}$'),
  subject uuid NOT NULL UNIQUE,
  email text NOT NULL CHECK (email = 'stuart@adrcarriers.net'),
  role text NOT NULL DEFAULT 'SUPER_ADMIN' CHECK (role = 'SUPER_ADMIN'),
  verified_at timestamptz NOT NULL,
  granted_at timestamptz NOT NULL DEFAULT now(),
  authority text NOT NULL DEFAULT 'Stuart explicit initial administrator authority',
  grant_id uuid NOT NULL UNIQUE
);
CREATE OR REPLACE FUNCTION midnight_authority.reject_grant_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'Administrator authority is append-only'; END $$;
REVOKE ALL ON FUNCTION midnight_authority.reject_grant_mutation() FROM PUBLIC;
DROP TRIGGER IF EXISTS immutable_initial_admin ON midnight_authority.initial_admin;
CREATE TRIGGER immutable_initial_admin BEFORE UPDATE OR DELETE ON midnight_authority.initial_admin
FOR EACH ROW EXECUTE FUNCTION midnight_authority.reject_grant_mutation();
REVOKE ALL ON ALL TABLES IN SCHEMA midnight_authority FROM PUBLIC;
-- Runtime can read authority, never issue a grant. Bootstrap uses an offline owner connection.
GRANT USAGE ON SCHEMA midnight_authority TO midnight_capture;
GRANT SELECT ON midnight_authority.initial_admin TO midnight_capture;
COMMIT;
