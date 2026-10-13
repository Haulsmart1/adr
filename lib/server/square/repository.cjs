'use strict';
const { BoundaryError, validatePayment } = require('./boundary.cjs');
const FIELDS = 'reference_id, product, environment, application_id, merchant_id, location_id, company_id, account_id, customer_id, invoice_id, internal_order_id, square_customer_id, amount_minor, currency, approved, idempotency_key, payment_id, status, provider_updated_at';
function repository(pool) {
  return {
    async find(reference) {
      return (await pool.query(`SELECT ${FIELDS} FROM midnight_square.invoice_payments WHERE reference_id=$1`, [reference])).rows[0];
    },
    async event(id) {
      return (await pool.query('SELECT body_hash FROM midnight_square.events WHERE event_id=$1', [id])).rows[0];
    },
    async claimSource(reference, sourceHash) {
      const result = await pool.query("UPDATE midnight_square.invoice_payments SET source_hash=$2 WHERE reference_id=$1 AND approved=true AND payment_id IS NULL AND status='AWAITING_VERIFICATION' AND (source_hash IS NULL OR source_hash=$2) RETURNING reference_id", [reference, sourceHash]);
      if (!result.rowCount) throw new BoundaryError('PAYMENT_INTENT_REQUIRES_RECONCILIATION', 409);
    },
    async bind(reference, paymentId) {
      const result = await pool.query('UPDATE midnight_square.invoice_payments SET payment_id=$2 WHERE reference_id=$1 AND (payment_id IS NULL OR payment_id=$2) RETURNING reference_id', [reference, paymentId]);
      if (!result.rowCount) throw new BoundaryError('PAYMENT_MAPPING_MISMATCH', 409);
    },
    async apply({ event, payment, bodyHash, config }) {
      const db = await pool.connect();
      try {
        await db.query('BEGIN');
        await db.query("SET LOCAL statement_timeout = '5s'");
        const row = (await db.query(`SELECT ${FIELDS} FROM midnight_square.invoice_payments WHERE reference_id=$1 FOR UPDATE`, [payment.reference_id])).rows[0];
        validatePayment(payment, row, config);
        const added = await db.query('INSERT INTO midnight_square.events(event_id, reference_id, body_hash, event_type, provider_created_at) VALUES($1,$2,$3,$4,$5) ON CONFLICT(event_id) DO NOTHING RETURNING event_id', [event.event_id, row.reference_id, bodyHash, event.type, event.created_at]);
        if (!added.rowCount) {
          const previous = (await db.query('SELECT body_hash FROM midnight_square.events WHERE event_id=$1', [event.event_id])).rows[0];
          if (previous.body_hash !== bodyHash) throw new BoundaryError('EVENT_ID_COLLISION', 409);
          await db.query('COMMIT');
          return { outcome: 'duplicate' };
        }
        const stale = row.provider_updated_at && Date.parse(payment.updated_at) <= Date.parse(row.provider_updated_at);
        const terminal = ['COMPLETED', 'CANCELED', 'FAILED'].includes(row.status);
        if (terminal && payment.status !== row.status && !stale) throw new BoundaryError('INVALID_PAYMENT_TRANSITION', 409);
        if (!stale) await db.query('UPDATE midnight_square.invoice_payments SET payment_id=$2, status=$3, provider_updated_at=$4 WHERE reference_id=$1', [row.reference_id, payment.id, payment.status, payment.updated_at]);
        await db.query('INSERT INTO midnight_square.audit(event_id, reference_id, payment_id, provider_status, applied) VALUES($1,$2,$3,$4,$5)', [event.event_id, row.reference_id, payment.id, payment.status, !stale]);
        await db.query('COMMIT');
        return { outcome: stale ? 'stale' : 'applied' };
      } catch (error) { await db.query('ROLLBACK'); throw error; }
      finally { db.release(); }
    }
  };
}
let pool;
function productionRepository(config) {
  if (config.environment !== 'sandbox') throw new BoundaryError('PAYMENTS_DISABLED', 503);
  const { Pool } = require('pg');
  pool ||= new Pool({ connectionString: config.database_url, max: 2, connectionTimeoutMillis: 3000, idleTimeoutMillis: 10000 });
  return repository(pool);
}
module.exports = { repository, productionRepository };
