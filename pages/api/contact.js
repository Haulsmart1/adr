// Preserve the historical URL behind the isolated, validated enquiry boundary.
export { default } from './enquiry';
export const config = { api: { bodyParser: { sizeLimit: '16kb' } }, maxDuration: 30 };
