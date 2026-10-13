import boundary from '@/lib/server/square/boundary.cjs';
import storage from '@/lib/server/square/repository.cjs';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const settings = boundary.configuration();
    const chunks = [];
    let length = 0;
    for await (const chunk of req) {
      const bytes = Buffer.from(chunk);
      length += bytes.length;
      if (length > boundary.MAX_BODY) throw new boundary.BoundaryError('BODY_TOO_LARGE', 413);
      chunks.push(bytes);
    }
    const result = await boundary.handleWebhook({ raw: Buffer.concat(chunks), signature: req.headers['x-square-hmacsha256-signature'] }, {
      config: settings, repository: storage.productionRepository(settings), client: boundary.squareClient(settings)
    });
    return res.status(200).json(result);
  } catch (error) {
    const known = error instanceof boundary.BoundaryError;
    const status = known ? error.status : 503;
    if (status === 503) res.setHeader('Retry-After', '30');
    return res.status(status).json({ error: known ? error.code : 'PAYMENT_PROCESSING_UNAVAILABLE' });
  }
}
