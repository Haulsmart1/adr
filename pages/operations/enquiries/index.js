import Head from 'next/head';
import Link from 'next/link';
import { releaseRouteAccess } from '@/lib/server/releaseRouteAccess';
import { repository } from '@/lib/server/enquiryRepository.cjs';
import s from '@/styles/Enquiry.module.css';
export default function Operations({ rows = [], error, next }) {
  return <main className={s.container}><Head><title>Enquiries | Midnight Operations</title><meta name="robots" content="noindex,nofollow"/></Head>
    <h1>Operations enquiries</h1><p>Stored freight enquiries. Notification status reports provider acceptance, not inbox delivery.</p>
    {error && <p role="alert">Enquiries are temporarily unavailable. Reload to try again.</p>}
    {!error && !rows.length && <p>No enquiries found.</p>}
    {rows.map(row=><article key={row.reference} className={s.notice}><h2><Link href={'/operations/enquiries/'+row.reference}>{row.reference}</Link></h2>
      <p>{row.created_at} · {row.status} · Notification: {row.notification}</p>
      <p><strong>{row.details.mode}: {row.details.collection} → {row.details.delivery}</strong><br/>{row.details.description}</p>
      <p>{row.details.name} · {row.details.company || 'Company not supplied'}<br/>{row.details.email} · {row.details.phone || 'Telephone not supplied'}</p>
      <p>Required delivery: {row.details.deadline || 'To confirm'} · Dangerous goods: {row.details.dangerousGoods}</p>
    </article>)}
    {next && <Link href={'/operations/enquiries?before='+encodeURIComponent(next.time)+'&reference='+next.reference}>Older enquiries</Link>}
  </main>;
}
export async function getServerSideProps(context) {
  context.res.setHeader('Cache-Control','private, no-store');
  context.res.setHeader('X-Robots-Tag','noindex, nofollow');
  const access=await releaseRouteAccess(context,['super_admin']);
  if (!access.props) return access;
  try {
    const before=typeof context.query.before==='string' && !Number.isNaN(Date.parse(context.query.before)) ? context.query.before : null;
    const reference=typeof context.query.reference==='string' ? context.query.reference : '';
    const rows=await repository().list(before,reference);
    const next=rows.length>50 ? {time:rows[49].cursor_time,reference:rows[49].reference} : null;
    return {props:{rows:JSON.parse(JSON.stringify(rows.slice(0,50))),next}};
  } catch {context.res.statusCode=503;return {props:{error:true}};}
}
Operations.freightMarketing=true;
