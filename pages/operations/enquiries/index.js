import Head from 'next/head';
import Link from 'next/link';
import { releaseRouteAccess } from '@/lib/server/releaseRouteAccess';
import { repository } from '@/lib/server/enquiryRepository.cjs';
import s from '@/styles/Enquiry.module.css';
export default function Operations({ rows = [], error, next, filters = {} }) {
  return <main className={s.container}><Head><title>Enquiries | Midnight Operations</title><meta name="robots" content="noindex,nofollow"/></Head>
    <h1>Operations enquiries</h1><p>Stored freight enquiries. Notification status reports provider acceptance, not inbox delivery.</p>
    <form method="get" className={s.notice}>
      <label>Reference, customer or company<input name="q" maxLength={100} defaultValue={filters.q}/></label>
      <label>Mode<select name="mode" defaultValue={filters.mode}><option value="">All modes</option>{['Road','Air','Sea'].map(v=><option key={v}>{v}</option>)}</select></label>
      <label>Status<select name="status" defaultValue={filters.status}><option value="">All statuses</option>{['new','open','reviewing','quoted','booked','closed','declined'].map(v=><option key={v}>{v}</option>)}</select></label>
      <label>Dangerous goods<select name="dg" defaultValue={filters.dg}><option value="">All enquiries</option><option value="Yes">Yes</option><option value="No">No</option><option value="Unsure">Unsure</option></select></label>
      <label>From date (UTC)<input type="date" name="from" defaultValue={filters.from}/></label>
      <label>To date (UTC)<input type="date" name="to" defaultValue={filters.to}/></label>
      <button type="submit">Filter enquiries</button> <Link href="/operations/enquiries">Clear filters</Link>
    </form>
    {error && <p role="alert">Enquiries are temporarily unavailable. Reload to try again.</p>}
    {!error && !rows.length && <p>No enquiries found.</p>}
    {rows.map(row=><article key={row.reference} className={s.notice}><h2><Link href={'/operations/enquiries/'+row.reference}>{row.reference}</Link></h2>
      <p>{row.created_at} · {row.status} · Notification: {row.notification}</p>
      <p><strong>{row.details.mode}: {row.details.collection} → {row.details.delivery}</strong><br/>{row.details.description}</p>
      <p>{row.details.name} · {row.details.company || 'Company not supplied'}<br/>{row.details.email} · {row.details.phone || 'Telephone not supplied'}</p>
      <p>Required delivery: {row.details.deadline || 'To confirm'} · Dangerous goods: {row.details.dangerousGoods}</p>
    </article>)}
    {next && <Link href={'/operations/enquiries?'+new URLSearchParams({...filters,before:next.time,reference:next.reference}).toString()}>Older enquiries</Link>}
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
    const filters={};
    for(const key of ['q','mode','status','dg','from','to']) filters[key]=typeof context.query[key]==='string' ? context.query[key].slice(0,100) : '';
    for(const key of ['from','to']) if(!/^\d{4}-\d{2}-\d{2}$/.test(filters[key])||Number.isNaN(Date.parse(filters[key]))) filters[key]='';
    const rows=await repository().list(before,reference,filters);
    const next=rows.length>50 ? {time:rows[49].cursor_time,reference:rows[49].reference} : null;
    return {props:{rows:JSON.parse(JSON.stringify(rows.slice(0,50))),next,filters}};
  } catch {context.res.statusCode=503;return {props:{error:true}};}
}
Operations.freightMarketing=true;
