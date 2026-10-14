const { randomUUID } = require('node:crypto');
const EMAIL = 'stuart@adrcarriers.net';
const SHARED_PROJECTS = new Set(['rdxolzuofkslgsvvvmrq','llxliojjtofqdmddbdud']);
function projectConfig(env) {
  const project = env.MIDNIGHT_AUTH_PROJECT_REF;
  if (!/^[a-z]{20}$/.test(project || '') || SHARED_PROJECTS.has(project)) throw Error('Dedicated Midnight Auth configuration required');
  const url = `https://${project}.supabase.co`;
  if (env.NEXT_PUBLIC_SUPABASE_URL !== url) throw Error('Midnight Auth project mismatch');
  return { project, url };
}
function verifiedIdentity(user, now = Date.now()) {
  const verified = Date.parse(user?.email_confirmed_at);
  return Boolean(user && /^[a-f0-9-]{36}$/i.test(user.id || '') && user.email?.toLowerCase() === EMAIL &&
    Number.isFinite(verified) && verified <= now && !user.is_anonymous &&
    !(Date.parse(user.banned_until) > now));
}
async function bootstrap({ env, auth, db, subject, now = Date.now() }) {
  const { project } = projectConfig(env);
  const deadline = Date.parse(env.MIDNIGHT_ADMIN_BOOTSTRAP_EXPIRES_AT);
  if (!Number.isFinite(deadline) || deadline <= now || deadline > now + 3600000) throw Error('Bootstrap window must be current and at most one hour');
  if (!/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(subject || '')) throw Error('Provider subject required');
  // Fetch authoritative provider identity. Never trust user_metadata, browser roles or supplied email.
  const { data, error } = await auth.getUserById(subject);
  if (error || data?.user?.id !== subject || !verifiedIdentity(data.user, now)) throw Error('Verified authorised identity required');
  const inserted = await db.query(`INSERT INTO midnight_authority.initial_admin
    (provider_project,subject,email,verified_at,grant_id) VALUES ($1,$2,$3,$4,$5)
    ON CONFLICT (singleton) DO NOTHING RETURNING grant_id`, [project,subject,EMAIL,data.user.email_confirmed_at,randomUUID()]);
  const result = await db.query('SELECT provider_project,subject,grant_id FROM midnight_authority.initial_admin WHERE singleton=true');
  const grant = result.rows[0];
  if (!grant || grant.subject !== subject || grant.provider_project !== project) throw Error('Initial administrator is already bound to another identity');
  return { grantId: grant.grant_id, created: Boolean(inserted.rowCount) };
}
async function hasAuthority(user, env, db) {
  const { project } = projectConfig(env);
  if (!verifiedIdentity(user)) return false;
  const result = await db.query('SELECT 1 FROM midnight_authority.initial_admin WHERE provider_project=$1 AND subject=$2 AND email=$3', [project,user.id,EMAIL]);
  return result.rowCount === 1;
}
module.exports = { projectConfig, verifiedIdentity, bootstrap, hasAuthority };
