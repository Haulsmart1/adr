import { requireSuperAdmin } from '@/lib/server/requireSuperAdmin';
import { repository } from '@/lib/server/enquiryRepository.cjs';
import { emailConfigured, sameOrigin, notify } from '@/lib/server/enquiryCapture.cjs';
import { send } from '@/lib/server/enquiryMail.cjs';
export const config={maxDuration:60};
export default async function handler(req,res) {
  res.setHeader('Cache-Control','private, no-store');
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).end();}
  if(!sameOrigin(req))return res.status(403).json({message:'Use the operations page'});
  const session=await requireSuperAdmin(req,res);if(!session)return;
  if(!emailConfigured(process.env))return res.status(503).json({message:'Email is disabled or not configured. The enquiry remains stored.'});
  if(typeof req.query.reference!=='string'||!/^MID-[A-F0-9]{32}$/.test(req.query.reference))return res.status(404).end();
  try{const repo=repository(),row=await repo.detail(req.query.reference);if(!row)return res.status(404).end();
    const state=await notify({env:process.env,repo,send,reference:row.reference,data:row.details,actor:String(session.user.id)});
    return res.status(200).json({message:state==='accepted'?'Mail server accepted the notification.':'No new acceptance confirmed. Reload to review the stored notification status.'});
  }catch{return res.status(503).json({message:'Notification unavailable. The enquiry remains stored.'});}
}
