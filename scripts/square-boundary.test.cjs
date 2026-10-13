const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const vm = require('node:vm');
const b = require('../lib/server/square/boundary.cjs');
const { repository } = require('../lib/server/square/repository.cjs');
const now = Date.parse('2026-10-12T12:00:00Z');
const c = { environment: 'sandbox', product: 'MIDNIGHT', application_id: 'midnight-test-app', merchant_id: 'shared-test-merchant', location_id: 'test-location', access_token: 'unit-test-only', webhook_signature_key: 'unit-test-key', webhook_url: 'https://preview.example.invalid/api/payments/square/webhook' };
const invoice = () => ({ product: 'MIDNIGHT', environment: 'sandbox', application_id: c.application_id, merchant_id: c.merchant_id, location_id: c.location_id, company_id: 'midnight-company', account_id: 'account-1', customer_id: 'customer-1', invoice_id: 'test-invoice', internal_order_id: 'test-order', square_customer_id: 'midnight-square-customer', amount_minor: 1234, currency: 'GBP', approved: true, reference_id: 'MID:00000000-0000-4000-8000-000000000001', idempotency_key: '00000000-0000-4000-8000-000000000002', payment_id: null, status: 'AWAITING_VERIFICATION', provider_updated_at: null });
const payment = () => ({ id: 'payment-1', application_details: { application_id: c.application_id }, location_id: c.location_id, reference_id: invoice().reference_id, customer_id: invoice().square_customer_id, amount_money: { amount: 1234, currency: 'GBP' }, status: 'COMPLETED', updated_at: new Date(now).toISOString() });
const event = () => ({ event_id: 'event-1', merchant_id: c.merchant_id, type: 'payment.updated', created_at: new Date(now).toISOString(), data: { id: 'payment-1', object: { payment: { id: 'payment-1', status: 'COMPLETED' } } } });
function signed(e = event(), url = c.webhook_url) {
  const raw = Buffer.from(JSON.stringify(e));
  return { raw, now, signature: crypto.createHmac('sha256', c.webhook_signature_key).update(url).update(raw).digest('base64') };
}
function harness(overrides = {}) {
  const calls = []; const events = new Map(); let row = invoice(); let sourceHash;
  const repository = {
    async find() { calls.push('find'); return row; },
    async event(id) { calls.push('event'); return events.get(id); },
    async claimSource(ref, hash) {
      calls.push('claim');
      if (sourceHash && sourceHash !== hash) throw new b.BoundaryError('PAYMENT_INTENT_REQUIRES_RECONCILIATION', 409);
      sourceHash = hash;
    },
    async bind(ref, id) { calls.push('bind'); row.payment_id = id; },
    async apply(args) { calls.push('apply'); events.set(args.event.event_id, { body_hash: args.bodyHash }); return { outcome: 'applied' }; }
  };
  const client = { async getPayment() { calls.push('get'); return payment(); }, async createPayment(body) { calls.push(body); return payment(); } };
  return { deps: { config: c, repository: { ...repository, ...overrides.repository }, client: { ...client, ...overrides.client } }, calls, events, setRow(value) { row = value; } };
}
test('default and production configurations cannot enable billing or use generic credentials', () => {
  for (const env of [{}, { MIDNIGHT_SQUARE_ENABLED: 'true', MIDNIGHT_SQUARE_ENVIRONMENT: 'production' }, { SQUARE_ACCESS_TOKEN: 'other-product-token', MIDNIGHT_SQUARE_ENABLED: 'true', MIDNIGHT_SQUARE_ENVIRONMENT: 'sandbox' }])
    assert.throws(() => b.configuration(env), /PAYMENTS_DISABLED|PAYMENTS_NOT_CONFIGURED/);
  assert.throws(() => b.squareClient({ ...c, environment: 'production' }), /PAYMENTS_DISABLED/);
});
test('Sandbox configuration requires a fixed exact HTTPS webhook URL', () => {
  const env = { MIDNIGHT_SQUARE_ENABLED: 'true', MIDNIGHT_SQUARE_ENVIRONMENT: 'sandbox' };
  for (const [key, value] of Object.entries(c)) if (!['environment', 'product'].includes(key)) env['MIDNIGHT_SQUARE_' + key.toUpperCase()] = value;
  env.MIDNIGHT_SQUARE_DATABASE_URL = 'postgresql://localhost/test';
  assert.equal(b.configuration(env).application_id, c.application_id);
  for (const url of ['http://example.invalid/api/payments/square/webhook', c.webhook_url + '/', c.webhook_url + '?x=1', 'https://user:password@example.invalid/api/payments/square/webhook', 'bad'])
    assert.throws(() => b.configuration({ ...env, MIDNIGHT_SQUARE_WEBHOOK_URL: url }), /INVALID_WEBHOOK_URL/);
});
test('raw-byte HMAC rejects body changes, wrong URL, missing/malformed/array signatures before storage', async () => {
  const h = harness(); const good = signed();
  for (const request of [{ ...good, raw: Buffer.concat([good.raw, Buffer.from(' ')]) }, signed(event(), c.webhook_url + '/'), { ...good, signature: null }, { ...good, signature: 'x' }, { ...good, signature: [good.signature] }])
    await assert.rejects(b.handleWebhook(request, h.deps), /INVALID_SIGNATURE/);
  assert.deepEqual(h.calls, []);
});
test('old and future replay timestamps rejected but 24-hour retries accepted', async () => {
  for (const age of [-49 * 3600000, 6 * 60000]) {
    const e = event(); e.created_at = new Date(now + age).toISOString();
    await assert.rejects(b.handleWebhook(signed(e), harness().deps), /EXPIRED_EVENT/);
  }
  const e = event(); e.created_at = new Date(now - 24 * 3600000).toISOString();
  assert.equal((await b.handleWebhook(signed(e), harness().deps)).outcome, 'applied');
});
test('same-merchant TMS event cannot change a Midnight transaction', async () => {
  const h = harness({ client: { async getPayment() { return { ...payment(), application_details: { application_id: 'tms-app' } }; } } });
  assert.equal((await b.handleWebhook(signed(), h.deps)).outcome, 'ignored');
  assert(!h.calls.includes('find')); assert(!h.calls.includes('apply'));
});
test('other merchant and unsupported subscription events ignored before provider access', async () => {
  for (const patch of [{ merchant_id: 'other' }, { type: 'subscription.updated' }]) {
    const h = harness(); assert.equal((await b.handleWebhook(signed({ ...event(), ...patch }), h.deps)).outcome, 'ignored'); assert.deepEqual(h.calls, []);
  }
});
test('authoritative Square state overrides browser/event claimed success', async () => {
  const h = harness({ client: { async getPayment() { return { ...payment(), status: 'FAILED' }; } }, repository: { async apply({ payment }) { assert.equal(payment.status, 'FAILED'); return { outcome: 'applied' }; } } });
  assert.equal((await b.handleWebhook(signed(), h.deps)).outcome, 'applied');
});
test('payment identity, amount, currency, customer and existing binding must match', async () => {
  for (const patch of [{ id: 'other-payment' }, { customer_id: 'tms-customer' }, { amount_money: { amount: 1235, currency: 'GBP' } }, { amount_money: { amount: 1234, currency: 'EUR' } }, { status: 'invented' }, { updated_at: 'invalid' }]) {
    const h = harness({ client: { async getPayment() { return { ...payment(), ...patch }; } } });
    await assert.rejects(b.handleWebhook(signed(), h.deps), /PAYMENT_MAPPING_MISMATCH/); assert(!h.calls.includes('apply'));
  }
  const h = harness(); h.setRow({ ...invoice(), payment_id: 'already-different' });
  await assert.rejects(b.handleWebhook(signed(), h.deps), /PAYMENT_MAPPING_MISMATCH/);
});
test('missing local mapping requests retry; unapproved or foreign mapping cannot settle', async () => {
  const h = harness(); h.setRow(null); await assert.rejects(b.handleWebhook(signed(), h.deps), e => e.status === 503);
  for (const patch of [{ approved: false }, { product: 'TMS' }, { account_id: '' }, { merchant_id: 'other' }, { environment: 'production' }]) {
    const x = harness(); x.setRow({ ...invoice(), ...patch }); await assert.rejects(b.handleWebhook(signed(), x.deps), /INVALID_INVOICE_MAPPING/);
  }
});
test('duplicate events have one effect; conflicting reuse of event ID fails', async () => {
  const h = harness(); assert.equal((await b.handleWebhook(signed(), h.deps)).outcome, 'applied');
  assert.equal((await b.handleWebhook(signed(), h.deps)).outcome, 'duplicate');
  assert.equal(h.calls.filter(x => x === 'apply').length, 1);
  const changed = event(); changed.data.object.payment.status = 'FAILED';
  await assert.rejects(b.handleWebhook(signed(changed), h.deps), /EVENT_ID_COLLISION/);
});
test('provider failure leaves event retryable without settlement', async () => {
  const h = harness({ client: { async getPayment() { throw new b.BoundaryError('SQUARE_UNAVAILABLE', 503); } } });
  await assert.rejects(b.handleWebhook(signed(), h.deps), e => e.status === 503);
  assert.equal(h.events.size, 0); assert(!h.calls.includes('apply'));
});
test('invoice payment uses persisted authoritative price and stable idempotency; no settlement', async () => {
  const h = harness(); const request = { referenceId: invoice().reference_id, actor: { companyId: 'midnight-company', accountId: 'account-1', customerId: 'customer-1' }, sourceId: 'sandbox-source', amount: 1, product: 'TMS' };
  const result = await b.paySandboxInvoice(request, h.deps);
  const body = h.calls.find(x => typeof x === 'object');
  assert.deepEqual(body.amount_money, { amount: 1234, currency: 'GBP' }); assert.equal(body.idempotency_key, invoice().idempotency_key);
  assert.equal(body.customer_id, invoice().square_customer_id); assert.equal(result.status, 'AWAITING_VERIFICATION');
  await b.paySandboxInvoice(request, h.deps);
  assert.equal(h.calls.filter(x => typeof x === 'object').length, 1); assert(!h.calls.includes('apply'));
});
test('different company/account/customer cannot initiate invoice payment', async () => {
  for (const patch of [{ companyId: 'other' }, { accountId: 'other' }, { customerId: 'other' }]) {
    const h = harness(); await assert.rejects(b.paySandboxInvoice({ referenceId: invoice().reference_id, sourceId: 'sandbox', actor: { companyId: 'midnight-company', accountId: 'account-1', customerId: 'customer-1', ...patch } }, h.deps), e => e.status === 403);
    assert(!h.calls.some(x => typeof x === 'object'));
  }
});
test('uncertain payment outcome retains intent; a changed source cannot retry or mint another key', async () => {
  const h = harness({ client: { async createPayment() { throw new Error('connection dropped after possible payment'); } } });
  const request = { referenceId: invoice().reference_id, actor: { companyId: 'midnight-company', accountId: 'account-1', customerId: 'customer-1' }, sourceId: 'original-sandbox-token' };
  await assert.rejects(b.paySandboxInvoice(request, h.deps), /connection dropped/);
  await assert.rejects(b.paySandboxInvoice({ ...request, sourceId: 'new-sandbox-token' }, h.deps), /PAYMENT_INTENT_REQUIRES_RECONCILIATION/);
  await assert.rejects(b.paySandboxInvoice(request, h.deps), /connection dropped/);
  assert(!h.calls.includes('bind')); assert(!h.calls.includes('apply'));
});
test('Sandbox transport pins host/version, refuses redirects, and suppresses provider secrets', async () => {
  const calls = []; const client = b.squareClient(c, async (url, options) => { calls.push({ url, options }); return { ok: true, json: async () => ({ payment: payment() }) }; });
  await client.getPayment('id/escape'); await client.createPayment({ source_id: 'test' });
  assert(calls.every(x => x.url.startsWith(b.API_ORIGIN + '/v2/payments')));
  assert.equal(calls[0].options.redirect, 'error'); assert(calls[0].url.endsWith('id%2Fescape'));
  await assert.rejects(b.squareClient(c, async () => ({ ok: false, json: async () => ({ secret: 'not-exposed' }) })).getPayment('test'), /SQUARE_UNAVAILABLE/);
});
// Exercise the transaction adapter with a query double; real PostgreSQL is checked separately.
function transactionHarness({ row = invoice(), duplicate = false, failAudit = false, previousHash = 'hash' } = {}) {
  const calls = []; const db = { async query(sql, values) {
    calls.push({ sql, values });
    if (sql.includes('FOR UPDATE')) return { rows: [row] };
    if (sql.startsWith('INSERT INTO midnight_square.events')) return { rowCount: duplicate ? 0 : 1 };
    if (sql.startsWith('SELECT body_hash')) return { rows: [{ body_hash: previousHash }] };
    if (failAudit && sql.startsWith('INSERT INTO midnight_square.audit')) throw new Error('database temporary failure');
    return { rows: [], rowCount: 1 };
  }, release() { calls.push({ sql: 'release' }); } };
  return { calls, repo: repository({ async connect() { return db; } }) };
}
test('event, settlement and audit commit atomically with lock held only for database work', async () => {
  const h = transactionHarness(); assert.equal((await h.repo.apply({ event: event(), payment: payment(), bodyHash: 'hash', config: c })).outcome, 'applied');
  assert(h.calls.some(x => x.sql.includes('FOR UPDATE'))); assert(h.calls.some(x => x.sql.startsWith('INSERT INTO midnight_square.audit')));
  assert.equal(h.calls.at(-2).sql, 'COMMIT'); assert.equal(h.calls.at(-1).sql, 'release');
});
test('database/audit failure rolls back event and settlement for safe retry', async () => {
  const h = transactionHarness({ failAudit: true }); await assert.rejects(h.repo.apply({ event: event(), payment: payment(), bodyHash: 'hash', config: c }), /temporary failure/);
  assert.equal(h.calls.at(-2).sql, 'ROLLBACK'); assert(!h.calls.some(x => x.sql === 'COMMIT'));
});
test('concurrent duplicate detected by unique event insertion produces no update/audit', async () => {
  const h = transactionHarness({ duplicate: true }); assert.equal((await h.repo.apply({ event: event(), payment: payment(), bodyHash: 'hash', config: c })).outcome, 'duplicate');
  assert(!h.calls.some(x => /^(UPDATE|INSERT INTO midnight_square.audit)/.test(x.sql)));
});
test('stale update retained in audit but does not regress settlement', async () => {
  const h = transactionHarness({ row: { ...invoice(), status: 'COMPLETED', provider_updated_at: new Date(now + 1000).toISOString() } });
  assert.equal((await h.repo.apply({ event: event(), payment: { ...payment(), status: 'PENDING' }, bodyHash: 'hash', config: c })).outcome, 'stale');
  assert(!h.calls.some(x => x.sql.startsWith('UPDATE'))); assert.equal(h.calls.find(x => x.sql.startsWith('INSERT INTO midnight_square.audit')).values[4], false);
});
test('newer update cannot revert terminal settlement', async () => {
  const h = transactionHarness({ row: { ...invoice(), status: 'COMPLETED', provider_updated_at: new Date(now - 1000).toISOString() } });
  await assert.rejects(h.repo.apply({ event: event(), payment: { ...payment(), status: 'PENDING' }, bodyHash: 'hash', config: c }), /INVALID_PAYMENT_TRANSITION/);
  assert.equal(h.calls.at(-2).sql, 'ROLLBACK');
});
async function loadRoute(path, imports = {}, env = {}) {
  const context = vm.createContext({ process: { env }, Buffer });
  const mod = new vm.SourceTextModule(fs.readFileSync(path, 'utf8'), { context });
  await mod.link(name => new vm.SyntheticModule(['default'], function () { this.setExport('default', imports[name]); }, { context }));
  await mod.evaluate(); return mod.namespace;
}
function response() { return { statusCode: null, headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(v) { this.statusCode = v; return this; }, json(v) { this.body = v; return this; } }; }
test('legacy checkout stays disabled and Square route performs no work without opt-in', async () => {
  const old = await loadRoute('pages/api/create-checkout-session.js'); const r = response(); await old.default({ method: 'POST', body: { amount: 1 } }, r); assert.equal(r.statusCode, 503);
  const route = await loadRoute('pages/api/payments/square/webhook.js', { '@/lib/server/square/boundary.cjs': { ...b, configuration: () => b.configuration({}) }, '@/lib/server/square/repository.cjs': { productionRepository() { throw new Error('must not connect'); } } });
  assert.equal(route.config.api.bodyParser, false);
  const res = response(); await route.default({ method: 'POST', headers: {} }, res); assert.equal(res.statusCode, 503); assert.equal(res.body.error, 'PAYMENTS_DISABLED');
  const get = response(); await route.default({ method: 'GET' }, get); assert.equal(get.statusCode, 405);
});
