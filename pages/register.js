import Link from 'next/link';
import FreightLayout, { operationsPhone } from '@/components/freight/FreightLayout';
import s from '@/styles/Freight.module.css';

export default function Register() {
  const accountEmail = 'mailto:freight@midnight-express.org?subject=Midnight%20Express%20account%20enquiry';
  return <FreightLayout title="Request a Freight Account | Midnight Express" description="Discuss a Midnight Express freight account, your shipment requirements and account arrangements directly with operations." path="/register">
    <section className={s.section}><div className={s.container}>
      <p className={s.eyebrow}>CUSTOMER ACCOUNTS</p>
      <h1>Discuss a freight account with operations.</h1>
      <p>Tell us about your business and the freight you need to move. Operations will discuss account setup, access and payment arrangements with you. Account and credit approval are confirmed individually.</p>
      <div className={s.actions}><a href={accountEmail}>Email an account enquiry</a><a href={operationsPhone}>Call 0800 999 1263</a></div>
      <p>The email link opens your email app. Send your enquiry there; opening the link does not submit an application or create an account.</p>
      <h2>What to include</h2>
      <ul><li>Your company name and business contact details</li><li>Collection and delivery areas, including international requirements</li><li>Typical goods, shipment sizes and frequency</li><li>Any customs requirements and the account arrangements you want to discuss</li></ul>
      <p>Do not include passwords or card details in your enquiry.</p>
      <h2>Already have access?</h2>
      <p><Link href="/login">Sign in to your customer account</Link>, or <Link href="/contact">contact operations</Link> for help.</p>
      <p>For an individual shipment, <Link href="/booking">prepare a road freight enquiry</Link>.</p>
    </div></section>
  </FreightLayout>;
}
Register.freightMarketing = true;
