// Validate before constructing a pool; never include connection strings in errors.
function databaseConnection(env) {
  const value = env.MIDNIGHT_ENQUIRY_DATABASE_URL;
  try {
    if (typeof value !== 'string' || value.trim() !== value) throw Error();
    const target = new URL(value);
    if (!['postgres:', 'postgresql:'].includes(target.protocol) || !target.hostname ||
        target.pathname !== '/midnight_enquiries' || target.hash) throw Error();
    // pg-connection-string can let query parameters override the URL authority.
    for (const key of target.searchParams.keys()) {
      if (['host', 'hostaddr', 'port', 'database', 'dbname', 'user', 'password'].includes(key.toLowerCase())) throw Error();
    }
    return value;
  } catch {
    throw Error('Dedicated Midnight enquiry database configuration required');
  }
}
module.exports = { databaseConnection };
