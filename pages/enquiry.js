import { useEffect, useRef, useState } from 'react';
import FreightLayout from '@/components/freight/FreightLayout';
import { fields, labels, dgFields, brief, normalize } from '@/lib/freight/enquiry.cjs';
import s from '@/styles/Enquiry.module.css';

const empty = { mode: 'Please advise', urgency: 'Standard', dangerousGoods: 'Unsure' };
const required = ['collection', 'delivery', 'description', 'name', 'email'];
export default function Enquiry({ deliveryEnabled }) {
  const [data, setData] = useState(empty);
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);
  const statusRef = useRef(null);
  const submitting = useRef(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem('midnight-enquiry') || 'null');
      if (saved && Date.now() - saved.savedAt < 86400000) { setData(saved.data); setStatus(saved.status); }
      else sessionStorage.removeItem('midnight-enquiry');
    } catch { /* Storage is optional; the email brief remains available. */ }
  }, []);
  function save(next, nextStatus) {
    try { sessionStorage.setItem('midnight-enquiry', JSON.stringify({ data: next, status: nextStatus, savedAt: Date.now() })); } catch {}
  }
  function update(key, value) {
    const next = { ...data, [key]: value };
    setData(next); setStatus(null); save(next, null);
  }
  function field(key, options) {
    const id = 'enquiry-' + key;
    const props = { id, name: key, value: data[key] || '', required: required.includes(key), onChange: event => update(key, event.target.value) };
    return <div className={s.field} key={key}><label htmlFor={id}>{labels[key]}{required.includes(key) ? ' (required)' : ''}</label>{options ? <select {...props}>{options.map(option => <option key={option}>{option}</option>)}</select> : ['description', 'notes'].includes(key) ? <textarea {...props} maxLength={fields[key]} rows={3}/> : <input {...props} maxLength={fields[key]} type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'} autoComplete={({ name: 'name', company: 'organization', email: 'email', phone: 'tel' })[key] || 'off'}/>}</div>;
  }
  async function submit(event) {
    event.preventDefault();
    if (submitting.current) return;
    let payload;
    try { payload = normalize(data); } catch (error) { setStatus({ state: 'invalid', message: error.message }); return; }
    submitting.current = true; setBusy(true);
    const pending = { state: 'unconfirmed', message: 'Delivery has not been confirmed. If this request is interrupted, contact operations before sending again.' };
    setStatus(pending); save(data, pending);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch('/api/enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: controller.signal });
      const result = await response.json();
      if (!['accepted', 'unconfirmed', 'unavailable', 'limited', 'invalid'].includes(result.state)) throw new Error('Unexpected response');
      if (result.state === 'accepted' && !response.ok) throw new Error('Unconfirmed response');
      setStatus(result); save(data, result);
    } catch { setStatus(pending); save(data, pending); }
    finally { clearTimeout(timer); setBusy(false); submitting.current = false; statusRef.current?.focus(); }
  }
  const text = brief(data);
  const uncertain = status?.state === 'unconfirmed';
  return <FreightLayout title="Request a Freight Quotation | Midnight Express" description="Prepare a road, air or sea freight enquiry for UK, European and international movements. Share locations, cargo details and delivery requirements with operations." path="/enquiry">
    <div className={s.container}>
      <h1>Tell us what needs to move</h1>
      <p>Road, air or sea. Share what you know; operations will confirm the practical options, availability and quotation. Fields marked required help us respond. Other details can follow.</p>
      <p>Time-critical? Call <a href="tel:+448009991263">0800 999 1263</a>.</p>
      {!deliveryEnabled && <p className={s.notice}>Prepare a shipment brief below, then send it using your email app or call operations. Your enquiry has not been sent.</p>}
      <form onSubmit={submit}>
        <fieldset disabled={busy}><legend>Your movement</legend><div className={s.grid}>
          {field('mode', ['Please advise', 'Road', 'Air', 'Sea'])}{field('urgency', ['Standard', 'Urgent', 'Time-critical'])}
          {field('collection')}{field('delivery')}{field('ready')}{field('deadline')}
        </div><p>Include the country and town, postcode, airport or port where known. Give dates, local times and any firm delivery deadline.</p></fieldset>
        <fieldset disabled={busy}><legend>Your freight</legend>{field('description')}<div className={s.grid}>{field('pieces')}{field('dimensions')}{field('weight')}{field('dangerousGoods', ['Unsure', 'No', 'Yes'])}</div>
          {data.dangerousGoods !== 'No' && <><p>If applicable, add the details you have. Leave unknown details blank. Acceptance must be confirmed for the proposed mode and route.</p><div className={s.grid}>{dgFields.map(key => field(key))}</div></>}
        </fieldset>
        <fieldset disabled={busy}><legend>Your contact details</legend><div className={s.grid}>{field('name')}{field('company')}{field('email')}{field('phone')}</div>{field('notes')}</fieldset>
        <p>We use these details to handle your freight enquiry. This tab saves a draft and restores it for up to 24 hours. Clear it below when finished, especially on a shared device. Do not include passwords, payment-card details or sensitive documents.</p>
        {deliveryEnabled && <button type="submit" disabled={busy || uncertain || status?.state === 'accepted'}>{busy ? 'Contacting mail server…' : 'Send enquiry to operations'}</button>}
      </form>
      <div ref={statusRef} tabIndex={-1} role="status" aria-live="polite" className={status ? s.notice : ''}>{status?.message}{status?.reference && <p>Reference: <strong>{status.reference}</strong></p>}</div>
      <h2>Your shipment brief</h2>
      <p>The email link opens your email app; you must send the message there. You can also copy the brief into your own email to <a href="mailto:freight@midnight-express.org">freight@midnight-express.org</a>.</p>
      {uncertain && <p>Delivery is uncertain. Call operations before resending to avoid a duplicate enquiry.</p>}
      <label htmlFor="enquiry-brief">Copyable shipment details</label><textarea id="enquiry-brief" readOnly rows={10} value={text}/>
      <div className={s.actions}><a href={'mailto:freight@midnight-express.org?subject=' + encodeURIComponent('Midnight freight enquiry') + '&body=' + encodeURIComponent(text)}>Open enquiry in email app</a><button type="button" disabled={busy} onClick={() => { setData(empty); setStatus(null); try { sessionStorage.removeItem('midnight-enquiry'); } catch {} }}>Clear draft</button></div>
    </div>
  </FreightLayout>;
}
export async function getServerSideProps({ res }) {
  const { configured } = require('../lib/server/enquiryDelivery.cjs');
  res.setHeader('Cache-Control', 'private, no-store');
  return { props: { deliveryEnabled: configured(process.env) } };
}
Enquiry.freightMarketing = true;
