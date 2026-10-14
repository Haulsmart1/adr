import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { releaseRouteAccess } from '@/lib/server/releaseRouteAccess';
import { repository } from '@/lib/server/enquiryRepository.cjs';
import { emailConfigured } from '@/lib/server/enquiryCapture.cjs';
import { labels } from '@/lib/freight/enquiry.cjs';
import s from '@/styles/Enquiry.module.css';
export default function EnquiryDetail({ row, error, canNotify }) {
  const [message,setMessage]=useState(''),[busy,setBusy]=useState(false);
  return <main className={s.container}><Head><title>Stored enquiry | Midnight Operations</title><meta name="robots" content="noindex,nofollow"/></Head>
    <Link href="/operations/enquiries">All enquiries</Link><h1>{row?.reference || 'Enquiry unavailable'}</h1>
    {error && <p role="alert">The stored enquiry could not be loaded. Please retry.</p>}
    {row && <><p>{row.created_at} · {row.status} · Notification: {row.notification}</p>
      <dl>{Object.entries(row.details).filter(([,value])=>value).map(([key,value])=><div key={key}><dt>{labels[key] || key}</dt><dd style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{String(value)}</dd></div>)}</dl>
      <h2>Shipment documents</h2><p>Customer-supplied files. Download only on a managed device with current document protection.</p>
      {!row.attachments.length && <p>No documents supplied.</p>}
      <ul>{row.attachments.map(file=><li key={file.id}><a href={'/api/operations/enquiries/'+row.reference+'/attachments/'+file.id}>{file.name}</a> ({Math.ceil(file.size/1024)} KB)</li>)}</ul>
      {canNotify && <button disabled={busy} onClick={async()=>{setBusy(true);try{const r=await fetch('/api/operations/enquiries/'+row.reference+'/notify',{method:'POST'});const data=await r.json();setMessage(data.message);}catch{setMessage('Notification result is unknown. Reload the enquiry before retrying.');}finally{setBusy(false);}}}>Attempt operations notification</button>}
      {!canNotify && <p>Notification retry is unavailable while email is disabled, acceptance is uncertain, or the retry limit is reached.</p>}
      <p role="status">{message}</p><h2>Audit</h2><ul>{row.audit.map((event,i)=><li key={i}>{event.occurred_at}: {event.event}</li>)}</ul>
    </>}
  </main>;
}
export async function getServerSideProps(context) {
  context.res.setHeader('Cache-Control','private, no-store');context.res.setHeader('X-Robots-Tag','noindex, nofollow');
  const access=await releaseRouteAccess(context,['super_admin']);if(!access.props)return access;
  if(!/^MID-[A-F0-9]{32}$/.test(context.params.reference))return {notFound:true};
  try {const row=await repository().detail(context.params.reference);if(!row)return {notFound:true};
    return {props:{row:JSON.parse(JSON.stringify(row)),canNotify:emailConfigured(process.env)&&['pending','disabled','failed'].includes(row.notification)&&row.attempts<3}};
  }catch{context.res.statusCode=503;return {props:{error:true}};}
}
EnquiryDetail.freightMarketing=true;
