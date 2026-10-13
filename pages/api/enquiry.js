import Redis from 'ioredis';
import nodemailer from 'midnight-nodemailer';
import { createHandler } from '@/lib/server/enquiryDelivery.cjs';

let redis;
const handler = createHandler({
  env: process.env,
  store: async () => {
    if (!redis) {
      redis = new Redis(process.env.MIDNIGHT_ENQUIRY_REDIS_URL, { lazyConnect: true, enableOfflineQueue: false, maxRetriesPerRequest: 0, connectTimeout: 3000, commandTimeout: 3000, retryStrategy: () => null });
      redis.on('error', () => {});
    }
    if (redis.status === 'wait' || redis.status === 'end') await redis.connect();
    return redis;
  },
  send: async message => {
    const transport = nodemailer.createTransport({
      host: process.env.MIDNIGHT_ENQUIRY_SMTP_HOST, port: 465, secure: true,
      auth: { user: process.env.MIDNIGHT_ENQUIRY_SMTP_USER, pass: process.env.MIDNIGHT_ENQUIRY_SMTP_PASS },
      connectionTimeout: 5000, greetingTimeout: 5000, socketTimeout: 10000,
      tls: { rejectUnauthorized: true, minVersion: 'TLSv1.2' },
    });
    try { return await transport.sendMail(message); } finally { transport.close(); }
  },
});
export const config = { api: { bodyParser: { sizeLimit: '16kb' } }, maxDuration: 30 };
export default handler;
