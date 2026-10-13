const { createHmac } = require('node:crypto');
const { normalize, brief, emailPattern } = require('../freight/enquiry.cjs');
function configured(env) {
  return env.MIDNIGHT_ENQUIRY_ENABLED === 'true' &&
    ['MIDNIGHT_ENQUIRY_REDIS_URL', 'MIDNIGHT_ENQUIRY_HASH_SECRET', 'MIDNIGHT_ENQUIRY_SMTP_HOST', 'MIDNIGHT_ENQUIRY_SMTP_USER', 'MIDNIGHT_ENQUIRY_SMTP_PASS', 'MIDNIGHT_ENQUIRY_FROM', 'MIDNIGHT_ENQUIRY_TO'].every(key => Boolean(env[key])) &&
    env.MIDNIGHT_ENQUIRY_HASH_SECRET.length >= 32 && /^rediss:\/\//.test(env.MIDNIGHT_ENQUIRY_REDIS_URL) &&
    [env.MIDNIGHT_ENQUIRY_FROM, env.MIDNIGHT_ENQUIRY_TO].every(value => emailPattern.test(value));
}
const rateScript = "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]); end; return n";
const digest = (secret, value) => createHmac('sha256', secret).update(value).digest('hex');
const result = (status, state, message, reference) => ({ status, body: { state, message, ...(reference ? { reference } : {}) } });
const unavailable = () => result(503, 'unavailable', 'Online delivery is unavailable. Your details remain on this page. Please email or call operations.');
function createHandler({ env, store, send }) {
  return async function handle(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    const reply = value => res.status(value.status).json(value.body);
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return reply(result(405, 'invalid', 'Use POST')); }
    if (!(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) return reply(result(415, 'invalid', 'Use JSON'));
    let origin;
    try { origin = new URL(req.headers.origin); } catch { return reply(result(403, 'invalid', 'Use the enquiry page')); }
    if (origin.host !== req.headers.host || !['http:', 'https:'].includes(origin.protocol)) return reply(result(403, 'invalid', 'Use the enquiry page'));
    let data;
    try { data = normalize(req.body); } catch (error) { return reply(result(400, 'invalid', error.message)); }
    if (!configured(env)) return reply(unavailable());
    const secret = env.MIDNIGHT_ENQUIRY_HASH_SECRET;
    const hash = digest(secret, JSON.stringify(data));
    const key = 'midnight:enquiry:v1:' + hash;
    const reference = 'MID-' + hash.slice(0, 16).toUpperCase();
    const unknown = () => result(202, 'unconfirmed', 'Delivery has not been confirmed. Please contact operations with this reference before sending again.', reference);
    let redis;
    try {
      redis = await store();
      // Vercel overwrites x-real-ip; other deployments use the socket.
      const ip = env.VERCEL === '1' ? req.headers['x-real-ip'] || 'unknown' : req.socket?.remoteAddress || 'unknown';
      for (const [kind, value, limit] of [['ip', ip, 10], ['email', data.email, 5]]) {
        const count = await redis.eval(rateScript, 1, 'midnight:enquiry:rate:' + kind + ':' + digest(secret, value), 600);
        if (count > limit) { res.setHeader('Retry-After', '600'); return reply(result(429, 'limited', 'Too many attempts. Please wait ten minutes or call operations.')); }
      }
      const existing = await redis.get(key);
      if (existing === 'accepted') return reply(result(200, 'accepted', 'The mail server already accepted this enquiry for operations. No second email was sent.', reference));
      if (existing) return reply(unknown());
      if (!await redis.set(key, 'pending', 'EX', 172800, 'NX')) return reply(unknown());
    } catch { return reply(unavailable()); }
    // Retain the reservation on every uncertain outcome, including process death.
    // SMTP cannot guarantee exactly-once delivery after losing its acknowledgement.
    try {
      const info = await send({
        from: env.MIDNIGHT_ENQUIRY_FROM, to: env.MIDNIGHT_ENQUIRY_TO, replyTo: data.email,
        subject: reference + ' | ' + data.mode + ' freight enquiry',
        text: 'Originating product: MIDNIGHT\nReference: ' + reference + '\n\n' + brief(data),
        headers: { 'X-Midnight-Reference': reference, 'X-Originating-Product': 'MIDNIGHT' },
        disableFileAccess: true, disableUrlAccess: true,
      });
      if (!info?.accepted?.some(address => address.toLowerCase() === env.MIDNIGHT_ENQUIRY_TO.toLowerCase()) || info?.rejected?.length) return reply(unknown());
      await redis.set(key, 'accepted', 'EX', 172800);
      return reply(result(200, 'accepted', 'The mail server accepted your enquiry for operations. This is not a quotation or booking confirmation. For urgent freight, please call.', reference));
    } catch { return reply(unknown()); }
  };
}
module.exports = { configured, createHandler };
