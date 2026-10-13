'use client';

import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import LegacyPartnerBookings from '@/components/recovered/LegacyPartnerBookings';
import { releaseRouteAccess } from '@/lib/server/releaseRouteAccess';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styles from '@/styles/BookingSliderForm.module.css';
import quoteStyles from '@/styles/PublicQuote.module.css';
import { isUsablePublicQuote } from '@/lib/freight/publicQuote.cjs';


const RoadRouteMap = dynamic(() => import('@/components/maps/ORSRouteMap'), {
  ssr: false,
  loading: () => <div style={{ height: '400px', background: '#eee' }} />,
});

const defaultPallet = { type: 'Standard', weight: '', height: '' };

const initialForm = {
  from: '',
  to: '',
  pickupDate: '',
  pickupTime: '',
  pallets: [defaultPallet],
  forkliftPickup: null,
  forkliftDelivery: null,
  adr: false,
  adrClassSpecial: false,
  contactName: '',
  company: '',
  contactEmail: '',
  contactPhone: '',
  notes: '',
};

function BookingPage() {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(0);
  const [quote, setQuote] = useState(null);
  const [quoteError, setQuoteError] = useState('');
  const [breakdown, setBreakdown] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [mapLoading, setMapLoading] = useState(false);

  const update = (field, value) => setForm({ ...form, [field]: value });

  const updatePallet = (index, field, value) => {
    const pallets = [...form.pallets];
    pallets[index] = { ...pallets[index], [field]: value };
    setForm({ ...form, pallets });
  };

  const addPallet = () => {
    setForm({ ...form, pallets: [...form.pallets, { ...defaultPallet }] });
  };

  useEffect(() => {
    let active = true;
    setQuote(null); setBreakdown(null); setQuoteError(''); setRouteCoords([]);
    if (!form.from.trim() || !form.to.trim() || !form.pallets.every(pallet => Number(pallet.weight) > 0 && Number(pallet.height) > 0)) { setMapLoading(false); return; }
    setMapLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch('/api/quote', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ from: form.from, to: form.to, pallets: form.pallets, adr: form.adr, adrClassSpecial: form.adrClassSpecial, forkliftPickup: form.forkliftPickup, forkliftDelivery: form.forkliftDelivery }),
        });
        const data = await response.json();
        if (!response.ok || !isUsablePublicQuote(data)) throw new Error('A reliable route estimate is unavailable. Please ask operations for a quotation');
        if (active) { setQuote(data.totalIncVat); setBreakdown(data); setRouteCoords(data.routeInfo?.polyline || []); }
      } catch (error) { if (active) setQuoteError(error.message); }
      finally { if (active) setMapLoading(false); }
    }, 350);
    return () => { active = false; clearTimeout(timer); };
  }, [form.from, form.to, form.pallets, form.adr, form.adrClassSpecial, form.forkliftPickup, form.forkliftDelivery]);

  const enquiryBody = [
    'Road freight enquiry — availability and quotation to be confirmed by operations',
    `Collection: ${form.from}`, `Delivery: ${form.to}`,
    `Cargo-ready date/time: ${form.pickupDate || 'Please discuss'} ${form.pickupTime}`,
    ...form.pallets.map((p, i) => `Pallet ${i + 1}: ${p.type}; ${p.weight} kg; ${p.height} cm high`),
    `Forklift at collection: ${form.forkliftPickup === null ? 'To be confirmed' : form.forkliftPickup ? 'Yes' : 'No'}`,
    `Forklift at delivery: ${form.forkliftDelivery === null ? 'To be confirmed' : form.forkliftDelivery ? 'Yes' : 'No'}`,
    `Dangerous goods declared: ${form.adr ? 'Yes — classification and acceptance to be confirmed' : 'No'}`,
    `Class 1 or 7 declared: ${form.adrClassSpecial ? 'Yes — operational review required' : 'No'}`,
    `Indicative road estimate: ${quote === null ? 'To be discussed' : 'GBP ' + quote.toFixed(2)} including VAT`,
    `Name: ${form.contactName}`, `Company: ${form.company}`,
    `Email: ${form.contactEmail}`, `Phone: ${form.contactPhone}`, `Shipment details: ${form.notes}`,
    'Please confirm loading access, dimensions, customs requirements and delivery availability.'
  ].join('\n');
  const enquiryUrl = 'mailto:freight@midnight-express.org?subject=' + encodeURIComponent('Road freight enquiry: ' + form.from + ' to ' + form.to) + '&body=' + encodeURIComponent(enquiryBody);
  const stepReady = step === 0 ? Boolean(form.from.trim() && form.to.trim()) : form.pallets.every(p => Number(p.weight) > 0 && Number(p.height) > 0);

  return (
    <div className={`${styles.formWrapper} ${quoteStyles.publicQuote}`}>
      <Head><title>Road Freight Quote & Enquiry | Midnight Express</title><meta name="description" content="Prepare a UK, Ireland or European road freight enquiry with collection, delivery and pallet details. Review an indicative quote and contact Midnight operations."/><link rel="canonical" href="https://www.midnight-xpress.com/booking"/></Head>
      <nav aria-label="Quote navigation"><Link href="/">Midnight Express home</Link> · <Link href="/contact">Contact operations</Link></nav>
      <div className={styles.card}>
        <h1 className={quoteStyles.heading}>Road freight quote & enquiry</h1>
        <p><Link href="/enquiry">For air, sea, non-palletised freight or a quotation from operations, prepare a freight enquiry.</Link></p>
        <p>Prepare your shipment details and discuss the movement with operations. An estimate does not reserve a vehicle or confirm a booking.</p>

        {step === 0 && (
          <>
            <h2 className={styles.stepHeader}>Step 1: Collection & Delivery</h2>
            <label htmlFor="quote-from">Collection postcode</label><input id="quote-from" autoComplete="off" className={styles.input} placeholder="From Postcode" value={form.from} onChange={(e) => update('from', e.target.value)} />
            <label htmlFor="quote-to">Delivery postcode</label><input id="quote-to" autoComplete="off" className={styles.input} placeholder="To Postcode" value={form.to} onChange={(e) => update('to', e.target.value)} />
            {form.from && form.to && (
              <div className="my-4">
                <RoadRouteMap routeLine={{ coordinates: routeCoords.map(([lat, lon]) => [lon, lat]) }} />
              </div>
            )}
          </>
        )}

        {step === 1 && (
          <>
            <h2 className={styles.stepHeader}>Step 2: Freight Details</h2>
            {form.pallets.map((p, i) => (
              <div key={i} className={styles.row}>
                <label htmlFor={`pallet-type-${i}`}>Pallet {i + 1} type</label><select id={`pallet-type-${i}`} value={p.type} onChange={(e) => updatePallet(i, 'type', e.target.value)} className={styles.input}>
                  <option value="Standard">Standard</option>
                  <option value="Double">Double</option>
                </select>
                <label htmlFor={`pallet-weight-${i}`}>Pallet {i + 1} weight (kg)</label><input id={`pallet-weight-${i}`} type="number" min="1" inputMode="decimal" className={styles.input} placeholder="Weight (kg)" value={p.weight} onChange={(e) => updatePallet(i, 'weight', e.target.value)} />
                <label htmlFor={`pallet-height-${i}`}>Pallet {i + 1} height (cm)</label><input id={`pallet-height-${i}`} type="number" min="1" inputMode="decimal" className={styles.input} placeholder="Height (cm)" value={p.height} onChange={(e) => updatePallet(i, 'height', e.target.value)} />
              </div>
            ))}
            <button className={styles.addBtn} onClick={addPallet}>+ Add Pallet</button>
            {['forkliftPickup', 'forkliftDelivery'].map((field, index) => <div key={field}>
              <label htmlFor={field}>Forklift available at {index === 0 ? 'collection' : 'delivery'}?</label>
              <select id={field} className={styles.input} value={form[field] === null ? '' : String(form[field])} onChange={e => update(field, e.target.value === '' ? null : e.target.value === 'true')}>
                <option value="">To be confirmed</option><option value="true">Yes</option><option value="false">No</option>
              </select>
            </div>)}
            <label><input type="checkbox" checked={form.adr} onChange={e => setForm(current => ({ ...current, adr: e.target.checked, adrClassSpecial: e.target.checked && current.adrClassSpecial }))}/> Shipment includes dangerous goods</label>
            {form.adr && <label><input type="checkbox" checked={form.adrClassSpecial} onChange={e => update('adrClassSpecial', e.target.checked)}/> Includes Class 1 or Class 7 goods</label>}
            <p>Declare the classification and handling requirements in your shipment notes. Operations must confirm acceptance.</p>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className={styles.stepHeader}>Step 3: Review & contact operations</h2>
            {quote && breakdown && (
              <div className={quoteStyles.estimate}>
                <h3>Indicative road freight quote</h3>
                <p><strong>Total:</strong> £{quote.toFixed(2)}</p>
                <ul>
                  <li>Base: £{(breakdown.middleFee + breakdown.palletTotal + breakdown.ferryTotal).toFixed(2)}</li>
                  <li>Collection: £{breakdown.collectionFee.toFixed(2)}</li>
                  <li>Delivery: £{breakdown.deliveryFee.toFixed(2)}</li>
                  <li>Customs: £{breakdown.customsTotal.toFixed(2)}</li>
                </ul>
              </div>
            )}
            <label htmlFor="quote-name">Your name</label><input id="quote-name" className={styles.input} autoComplete="name" value={form.contactName} onChange={e => update('contactName', e.target.value)}/>
            <label htmlFor="quote-company">Company</label><input id="quote-company" className={styles.input} autoComplete="organization" value={form.company} onChange={e => update('company', e.target.value)}/>
            <label htmlFor="quote-email">Email</label><input id="quote-email" type="email" className={styles.input} autoComplete="email" value={form.contactEmail} onChange={e => update('contactEmail', e.target.value)}/>
            <label htmlFor="quote-phone">Telephone</label><input id="quote-phone" type="tel" className={styles.input} autoComplete="tel" value={form.contactPhone} onChange={e => update('contactPhone', e.target.value)}/>
            <label htmlFor="quote-date">Cargo-ready date</label><input id="quote-date" type="date" className={styles.input} value={form.pickupDate} onChange={e => update('pickupDate', e.target.value)}/>
            <label htmlFor="quote-time">Cargo-ready time (local collection time)</label><input id="quote-time" type="time" className={styles.input} value={form.pickupTime} onChange={e => update('pickupTime', e.target.value)}/>
            <label htmlFor="quote-notes">Dimensions, delivery window, loading access, customs or regulated goods</label><textarea id="quote-notes" className={styles.input} rows="4" maxLength={1500} value={form.notes} onChange={e => update('notes', e.target.value)}/>
            <p>This page does not send an enquiry. Open the email link to prepare your shipment brief in your email app, then send it there. Operations must confirm the route, final quotation and shipment availability.</p>
            <a className={quoteStyles.primaryLink} href={enquiryUrl}>Open shipment enquiry in your email app</a>
            <label htmlFor="quote-brief">Your shipment brief — copy into your own email if needed</label><textarea id="quote-brief" className={styles.input} readOnly rows="9" value={enquiryBody}/>
            <p>No email app? Call <a href="tel:+448009991263">0800 999 1263</a> or email freight@midnight-express.org with the details above.</p>
          </>
        )}

        {mapLoading && <p role="status">Calculating an indicative quote…</p>}
        {quoteError && <p role="alert">{quoteError}. You can still email your shipment details or <a href="tel:+448009991263">call operations</a>.</p>}
        <div className={styles.actions}>
          {step > 0 && <button onClick={() => setStep(step - 1)}>⬅ Back</button>}
          {step < 2 ? (
            <button disabled={!stepReady} onClick={() => setStep(step + 1)}>Next ➡</button>
          ) : (
            <Link href="/contact">Operations contact details</Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function getServerSideProps(context) {
 if (context.query.partner) return releaseRouteAccess({ ...context, params: { partner: String(context.query.partner) } }, ['partner'], true).then(result => result.props ? { ...result, props: { ...result.props, preserveSharedHomepage: true } } : result);
 return { props: {} };
}
export default function BookingReleasePage() {
 const router = useRouter();
 return router.query.partner ? <LegacyPartnerBookings /> : <BookingPage />;
}
BookingReleasePage.freightMarketing = true;
