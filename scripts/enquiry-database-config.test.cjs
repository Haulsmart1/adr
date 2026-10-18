const { test } = require('node:test');
const assert = require('node:assert/strict');
const { databaseConnection } = require('../lib/server/enquiryDatabaseConfig.cjs');
const { configured } = require('../lib/server/enquiryCapture.cjs');
const settings = value => ({ MIDNIGHT_ENQUIRY_DATABASE_URL: value, MIDNIGHT_ENQUIRY_ENABLED: 'true', MIDNIGHT_ENQUIRY_HASH_SECRET: 'synthetic-'.repeat(8) });

test('dedicated enquiry database URLs accept direct/pooler TLS options without connecting', () => {
  for (const url of ['postgres://example.invalid/midnight_enquiries', 'postgresql://capture:synthetic@example.invalid:5432/midnight_enquiries?sslmode=require&channel_binding=require']) {
    assert.equal(databaseConnection(settings(url)), url);
    assert.equal(configured(settings(url)), true);
  }
});

test('malformed, ambiguous and other database targets fail readiness with a redacted error', () => {
  for (const value of [undefined, '', 'postgresql://', 'postgresql:///midnight_enquiries', 'postgresql://example.invalid/postgres', 'postgresql://example.invalid/', 'https://example.invalid/midnight_enquiries', 'postgresql://example.invalid/midnight_enquiries#fragment', ' postgresql://example.invalid/midnight_enquiries', 'postgresql://example.invalid/midnight_enquiries/']) {
    assert.throws(() => databaseConnection(settings(value)), {message:'Dedicated Midnight enquiry database configuration required'});
    assert.equal(configured(settings(value)), false);
  }
});

test('query parameters cannot redirect pg connection away from validated authority/database', () => {
  for (const key of ['host', 'hostaddr', 'port', 'database', 'dbname', 'user', 'password', 'HOST', '%64atabase']) {
    const url = `postgresql://capture:synthetic@example.invalid/midnight_enquiries?${key}=other`;
    assert.throws(() => databaseConnection(settings(url)), {message:'Dedicated Midnight enquiry database configuration required'});
    assert.equal(configured(settings(url)), false);
  }
});

test('runtime pool refuses invalid configuration before a network client can be constructed', () => {
  const { getPool } = require('../lib/server/enquiryRepository.cjs');
  const previous = process.env.MIDNIGHT_ENQUIRY_DATABASE_URL;
  try {
    process.env.MIDNIGHT_ENQUIRY_DATABASE_URL = 'postgresql://example.invalid/legacy_operations';
    assert.throws(() => getPool(), {message:'Dedicated Midnight enquiry database configuration required'});
  } finally {
    if (previous === undefined) delete process.env.MIDNIGHT_ENQUIRY_DATABASE_URL;
    else process.env.MIDNIGHT_ENQUIRY_DATABASE_URL = previous;
  }
});
