// Account provisioning uses the existing authenticated invitation workflow.
// Public enquiries never create profile passwords or approve accounts.
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(410).json({ error: 'Public account creation is unavailable. Contact operations to discuss account setup.' });
}
