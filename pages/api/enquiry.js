import { createHandler } from '@/lib/server/enquiryCapture.cjs';
import { repository } from '@/lib/server/enquiryRepository.cjs';
import { send } from '@/lib/server/enquiryMail.cjs';
export const config = { api: { bodyParser: { sizeLimit: '4300kb' } }, maxDuration: 60 };
export default createHandler({ env: process.env, repository, send });
