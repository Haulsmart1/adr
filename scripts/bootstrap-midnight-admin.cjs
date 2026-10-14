// Offline server-side bootstrap. No HTTP endpoint and no password argument.
const { createClient } = require('@supabase/supabase-js');
const { Client } = require('pg');
const { projectConfig, bootstrap } = require('../lib/server/adminAuthority.cjs');
async function main() {
  if (process.argv.length !== 2 || process.env.VERCEL_ENV === 'production') throw Error('Offline preview bootstrap only');
  const { url } = projectConfig(process.env);
  if (!process.env.MIDNIGHT_AUTH_SERVICE_ROLE_KEY || !process.env.MIDNIGHT_ADMIN_DATABASE_URL) throw Error('Dedicated bootstrap configuration required');
  const target=new URL(process.env.MIDNIGHT_ADMIN_DATABASE_URL);
  if (!process.env.MIDNIGHT_ADMIN_EXPECTED_DATABASE_HOST || target.hostname!==process.env.MIDNIGHT_ADMIN_EXPECTED_DATABASE_HOST || target.pathname!=='/midnight_enquiries') throw Error('Dedicated Midnight authority database required');
  const auth = createClient(url, process.env.MIDNIGHT_AUTH_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } }).auth.admin;
  const db = new Client({ connectionString: process.env.MIDNIGHT_ADMIN_DATABASE_URL, connectionTimeoutMillis: 5000, statement_timeout: 8000 });
  try {
    await db.connect();
    const result = await bootstrap({ env: process.env, auth, db, subject: process.env.MIDNIGHT_ADMIN_SUBJECT });
    console.log(JSON.stringify(result));
  } finally { await db.end(); }
}
main().catch(() => { console.error('Midnight administrator bootstrap refused or unavailable. Check dedicated configuration and verified provider identity.'); process.exitCode = 1; });
