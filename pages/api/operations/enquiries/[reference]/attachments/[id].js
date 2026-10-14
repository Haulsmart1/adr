import { requireSuperAdmin } from '@/lib/server/requireSuperAdmin';
import { repository } from '@/lib/server/enquiryRepository.cjs';
export default async function handler(req,res) {
  res.setHeader('Cache-Control','private, no-store');
  if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).end();}
  if(!await requireSuperAdmin(req,res))return;
  const {reference,id}=req.query;
  if(typeof reference!=='string'||!/^MID-[A-F0-9]{32}$/.test(reference)||typeof id!=='string'||!/^[a-f0-9-]{36}$/i.test(id))return res.status(404).end();
  try{const file=await repository().download(reference,id);if(!file)return res.status(404).end();
    res.setHeader('Content-Type','application/octet-stream');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Content-Security-Policy',"default-src 'none'; sandbox");
    res.setHeader('Content-Disposition',"attachment; filename*=UTF-8''"+encodeURIComponent(file.name));
    return res.status(200).send(file.content);
  }catch{return res.status(503).json({error:'Document temporarily unavailable'});}
}
