'use strict';
const crypto = require('node:crypto');
const PRODUCT = 'MIDNIGHT';
const API_ORIGIN = 'https://connect.squareupsandbox.com';
const MAX_BODY = 256 * 1024;
class BoundaryError extends Error {
  constructor(code, status = 400) { super(code); this.code = code; this.status = status; }
}
function configuration(env = process.env) {
  if (typeof window !== 'undefined') throw new BoundaryError('SERVER_ONLY', 503);
  if (env.MIDNIGHT_SQUARE_ENABLED !== 'true' || env.MIDNIGHT_SQUARE_ENVIRONMENT !== 'sandbox')
    throw new BoundaryError('PAYMENTS_DISABLED', 503);
  const names = ['APPLICATION_ID', 'MERCHANT_ID', 'LOCATION_ID', 'ACCESS_TOKEN', 'WEBHOOK_SIGNATURE_KEY', 'WEBHOOK_URL', 'DATABASE_URL'];
  const c = { product: PRODUCT, environment: 'sandbox' };
  for (const name of names) {
    const value = env['MIDNIGHT_SQUARE_' + name];
    if (typeof value !== 'string' || !value.trim()) throw new BoundaryError('PAYMENTS_NOT_CONFIGURED', 503);
    c[name.toLowerCase()] = value;
  }
  let url;
  try { url = new URL(c.webhook_url); } catch { throw new BoundaryError('INVALID_WEBHOOK_URL', 503); }
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/api/payments/square/webhook')
    throw new BoundaryError('INVALID_WEBHOOK_URL', 503);
  return Object.freeze(c);
}
function verifySignature(raw, signature, c) {
  if (!Buffer.isBuffer(raw) || raw.length > MAX_BODY || typeof signature !== 'string' || !/^[A-Za-z0-9+/]{43}=$/.test(signature))
    throw new BoundaryError('INVALID_SIGNATURE', 401);
  const expected = crypto.createHmac('sha256', c.webhook_signature_key).update(c.webhook_url).update(raw).digest();
  const actual = Buffer.from(signature, 'base64');
  if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) throw new BoundaryError('INVALID_SIGNATURE', 401);
}
function parseEvent(raw, now = Date.now()) {
  let event;
  try { event = JSON.parse(raw.toString('utf8')); } catch { throw new BoundaryError('INVALID_EVENT'); }
  if (!event || typeof event.event_id !== 'string' || !event.event_id || event.event_id.length > 192 || typeof event.merchant_id !== 'string')
    throw new BoundaryError('INVALID_EVENT');
  const created = Date.parse(event.created_at);
  // Square retries for 24 hours; permit delivery delays without indefinite replay.
  if (!Number.isFinite(created) || created > now + 300000 || created < now - 48 * 60 * 60 * 1000)
    throw new BoundaryError('EXPIRED_EVENT', 401);
  return event;
}
function validateMapping(row, c) {
  if (!row || row.product !== PRODUCT || row.environment !== 'sandbox' || row.application_id !== c.application_id ||
      row.merchant_id !== c.merchant_id || row.location_id !== c.location_id ||
      !row.company_id || !row.account_id || !row.customer_id || !row.invoice_id || !row.internal_order_id || !row.square_customer_id ||
      !Number.isSafeInteger(Number(row.amount_minor)) || Number(row.amount_minor) <= 0 || !/^[A-Z]{3}$/.test(row.currency) ||
      !/^MID:[0-9a-f-]{36}$/.test(row.reference_id) || !row.idempotency_key || row.approved !== true)
    throw new BoundaryError('INVALID_INVOICE_MAPPING', 409);
}
function validatePayment(payment, row, c) {
  validateMapping(row, c);
  if (!payment || typeof payment.id !== 'string' || !payment.id || payment.application_details?.application_id !== c.application_id ||
      payment.location_id !== c.location_id || payment.reference_id !== row.reference_id || payment.customer_id !== row.square_customer_id ||
      (row.payment_id && payment.id !== row.payment_id) || payment.amount_money?.currency !== row.currency ||
      !Number.isSafeInteger(payment.amount_money?.amount) || payment.amount_money.amount !== Number(row.amount_minor) ||
      !['APPROVED', 'PENDING', 'COMPLETED', 'CANCELED', 'FAILED'].includes(payment.status) || !Number.isFinite(Date.parse(payment.updated_at)))
    throw new BoundaryError('PAYMENT_MAPPING_MISMATCH', 409);
}
function squareClient(c, fetcher = fetch) {
  if (typeof window !== 'undefined') throw new BoundaryError('SERVER_ONLY', 503);
  if (c.environment !== 'sandbox') throw new BoundaryError('PAYMENTS_DISABLED', 503);
  async function request(path, body) {
    const response = await fetcher(API_ORIGIN + path, {
      method: body ? 'POST' : 'GET', redirect: 'error', signal: AbortSignal.timeout(8000),
      headers: { Authorization: 'Bearer ' + c.access_token, 'Content-Type': 'application/json', 'Square-Version': '2026-09-16' },
      ...(body ? { body: JSON.stringify(body) } : {})
    });
    if (!response.ok) throw new BoundaryError('SQUARE_UNAVAILABLE', 503);
    const result = await response.json();
    if (!result.payment) throw new BoundaryError('SQUARE_INVALID_RESPONSE', 503);
    return result.payment;
  }
  return { getPayment: id => request('/v2/payments/' + encodeURIComponent(id)), createPayment: body => request('/v2/payments', body) };
}
// Internal service only: future authenticated invoice code supplies the actor.
// There is no browser-accessible charge endpoint or caller-supplied price.
async function paySandboxInvoice({ referenceId, actor, sourceId }, { config: c, repository, client }) {
  if (c.environment !== 'sandbox') throw new BoundaryError('PAYMENTS_DISABLED', 503);
  const row = await repository.find(referenceId);
  validateMapping(row, c);
  if (!actor || actor.companyId !== row.company_id || actor.accountId !== row.account_id || actor.customerId !== row.customer_id) throw new BoundaryError('FORBIDDEN', 403);
  if (row.payment_id) return { paymentId: row.payment_id, status: row.status };
  if (typeof sourceId !== 'string' || !sourceId || sourceId.length > 512) throw new BoundaryError('INVALID_SOURCE');
  // Persist intent before Square; a new token cannot silently change a retry's body.
  await repository.claimSource(row.reference_id, crypto.createHash('sha256').update(sourceId).digest('hex'));
  const payment = await client.createPayment({ source_id: sourceId, idempotency_key: row.idempotency_key,
    location_id: row.location_id, customer_id: row.square_customer_id, reference_id: row.reference_id,
    amount_money: { amount: Number(row.amount_minor), currency: row.currency }, autocomplete: true });
  validatePayment(payment, row, c);
  // Only the verified webhook records settlement; source tokens are never stored.
  await repository.bind(row.reference_id, payment.id);
  return { paymentId: payment.id, status: 'AWAITING_VERIFICATION' };
}
async function handleWebhook({ raw, signature, now }, { config: c, repository, client }) {
  if (c.environment !== 'sandbox') throw new BoundaryError('PAYMENTS_DISABLED', 503);
  verifySignature(raw, signature, c);
  const event = parseEvent(raw, now);
  if (event.merchant_id !== c.merchant_id || !['payment.created', 'payment.updated'].includes(event.type)) return { outcome: 'ignored' };
  const id = event.data?.object?.payment?.id;
  if (typeof id !== 'string' || !id || id.length > 192 || event.data?.id !== id) throw new BoundaryError('INVALID_EVENT');
  const digest = crypto.createHash('sha256').update(raw).digest('hex');
  const existing = await repository.event(event.event_id);
  if (existing) {
    if (existing.body_hash !== digest) throw new BoundaryError('EVENT_ID_COLLISION', 409);
    return { outcome: 'duplicate' };
  }
  const payment = await client.getPayment(id);
  if (payment.id !== id) throw new BoundaryError('PAYMENT_MAPPING_MISMATCH', 409);
  if (payment.application_details?.application_id !== c.application_id || payment.location_id !== c.location_id ||
      typeof payment.reference_id !== 'string' || !payment.reference_id.startsWith('MID:')) return { outcome: 'ignored' };
  const row = await repository.find(payment.reference_id);
  if (!row) throw new BoundaryError('INVOICE_MAPPING_NOT_READY', 503);
  validatePayment(payment, row, c);
  return repository.apply({ event, payment, bodyHash: digest, config: c });
}
module.exports = { PRODUCT, API_ORIGIN, MAX_BODY, BoundaryError, configuration, verifySignature, parseEvent, validateMapping, validatePayment, squareClient, paySandboxInvoice, handleWebhook };
