import Link from 'next/link';
import FreightLayout, { QuoteLink, operationsPhone, operationsEmail } from '@/components/freight/FreightLayout';
import s from '@/styles/Freight.module.css';

export default function About() {
  return <FreightLayout title="About Midnight Express | UK Ireland & European Freight" description="Discuss dedicated road freight, UK and Ireland movements, European transport, customs requirements and international air or sea enquiries with Midnight Express." path="/about">
    <section className={s.section}><div className={s.container}>
      <p className={s.eyebrow}>MIDNIGHT EXPRESS EUROPE LTD</p><h1>Freight with a direct operational conversation.</h1>
      <p>Midnight Express handles enquiries for UK, Ireland and European road freight, dedicated movements and international air or sea requirements. Start with the shipment, collection point, destination and delivery window.</p>
      <h2>Road, air and sea</h2><p>For road freight, use the existing quote journey or speak to operations about the right vehicle and loading requirements. For air and sea, contact operations with the cargo, proposed airports or ports, and any onward delivery needs.</p>
      <p><Link href="/road-freight">Road freight</Link> · <Link href="/air-freight">Air freight</Link> · <Link href="/sea-freight">Sea freight</Link></p>
      <h2>When timing matters</h2><p>Discuss time-critical freight directly with operations. Dedicated road movements, crossings and customs need individual planning. Collection times, transit expectations and shipment availability must be confirmed for the proposed movement.</p>
      <h2>Customs and regulated goods</h2><p>Bring goods descriptions, commercial information and any customs arrangements into the first conversation. Declare dangerous goods and their classification so eligibility and handling requirements can be assessed before booking.</p>
      <h2>Quotes, accounts and payment</h2><p>An online estimate or emailed enquiry does not confirm a booking. Ask operations to confirm the final quotation, availability and applicable shipment terms. Account and payment arrangements are agreed with operations; this website does not currently collect online payments.</p>
      <h2>European coverage</h2><p>The European map shows illustrative connections. It is not a live route-status display, a timetable or a promise of automatic availability.</p><p><Link href="/european-freight">Explore European freight</Link> · <Link href="/company-information">Company and website information</Link></p>
      <div className={s.actions}><QuoteLink/><a href={operationsPhone}>Call 0800 999 1263</a><a href={operationsEmail}>Email operations</a></div>
    </div></section>
  </FreightLayout>;
}
About.freightMarketing = true;
