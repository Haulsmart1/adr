const test = require('node:test');
const assert = require('node:assert/strict');
const { smtpOptions } = require('../lib/server/enquirySmtpOptions.cjs');
test('existing implicit TLS configuration keeps port 465 and verified certificates', () => {
  const options = smtpOptions({});
  assert.equal(options.port, 465);
  assert.equal(options.secure, true);
  assert.equal(options.tls.rejectUnauthorized, true);
});
test('submission port 587 requires STARTTLS instead of implicit TLS', () => {
  const options = smtpOptions({ MIDNIGHT_ENQUIRY_SMTP_PORT: '587' });
  assert.equal(options.port, 587);
  assert.equal(options.secure, false);
  assert.equal(options.requireTLS, true);
  assert.equal(options.tls.rejectUnauthorized, true);
  assert.equal(options.tls.minVersion, 'TLSv1.2');
});
test('plaintext, malformed and unsupported ports are refused', () => {
  for (const port of ['25', '0', '587oops', ' 587', '2525']) {
    assert.throws(() => smtpOptions({ MIDNIGHT_ENQUIRY_SMTP_PORT: port }));
  }
});
