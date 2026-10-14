import { requireSuperAdmin } from '@/lib/server/requireSuperAdmin';
import { repository } from '@/lib/server/enquiryRepository.cjs';
import { sameOrigin } from '@/lib/server/enquiryCapture.cjs';
export const config={api:{bodyParser:{sizeLimit:'2kb'}}};
export default async function handler(req,res) {
  res.setHeader('Cache-Control','private, no-store');
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).end();}
  if(!sameOrigin(req))return res.status(403).json({message:'Use the operations page'});
  const session=await requireSuperAdmin(req,res);if(!session)return;
  if(typeof req.query.reference!=='string'||!/^MID-[A-F0-9]{32}$/.test(req.query.reference))return res.status(404).end();
  const statuses=['new','open','reviewing','quoted','booked','closed','declined'];
  if(!statuses.includes(req.body?.status)||!statuses.includes(req.body?.expected))return res.status(400).json({message:'Choose a valid status'});
  try {
    const result=await repository().changeStatus(req.query.reference,req.body.expected,req.body.status,String(session.user.id));
    if(result.missing)return res.status(404).end();
    if(result.conflict)return res.status(409).json({message:'Another operator changed this enquiry. Reload before updating.'});
    return res.status(200).json({message:'Status saved',status:result.status});
  } catch {return res.status(503).json({message:'Status could not be confirmed. Reload before retrying.'});}
}
