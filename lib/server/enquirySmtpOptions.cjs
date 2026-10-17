// Credentials stay in the hosting secret store; never log this object.
function smtpOptions(env = process.env) {
  const rawPort = env.MIDNIGHT_ENQUIRY_SMTP_PORT || '465';
  if (!['465', '587'].includes(rawPort)) throw Error('Enquiry SMTP must use port 465 or 587');
  const port = Number(rawPort);
  return {
    host: env.MIDNIGHT_ENQUIRY_SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: true,
    auth: { user: env.MIDNIGHT_ENQUIRY_SMTP_USER, pass: env.MIDNIGHT_ENQUIRY_SMTP_PASS },
    connectionTimeout: 3000,
    greetingTimeout: 3000,
    socketTimeout: 6000,
    tls: { rejectUnauthorized: true, minVersion: 'TLSv1.2' },
  };
}
module.exports = { smtpOptions };
