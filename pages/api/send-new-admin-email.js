// Retired password-bearing mail path. Account credentials belong to the Auth provider.
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(410).json({ error: 'Use the secure provider account setup flow.' });
}
