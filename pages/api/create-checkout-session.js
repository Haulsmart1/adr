export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // Retained URL; browser-supplied amounts must never initiate a charge.
  return res.status(503).json({ error: 'Online payment collection is disabled. Contact operations.' });
}
