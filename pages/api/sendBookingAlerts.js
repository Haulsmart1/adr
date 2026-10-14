// Legacy non-durable email delivery is retired. Use the durable enquiry journey.
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(410).json({ error: 'This legacy email route is unavailable. Submit a freight enquiry at /enquiry. No message was sent.' });
}
