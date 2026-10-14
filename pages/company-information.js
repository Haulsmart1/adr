import Link from 'next/link';
import FreightLayout, { operationsPhone, operationsEmail } from '@/components/freight/FreightLayout';
import s from '@/styles/Freight.module.css';

export default function CompanyInformation() {
  return <FreightLayout title="Company & Freight Enquiry Information | Midnight Express" description="Company details for Midnight Express Europe Ltd and how freight quotes, enquiries and shipment confirmation work." path="/company-information">
    <section className={s.section}><div className={s.container}>
      <h1>Company and website information</h1>
      <h2>Midnight Express Europe Ltd</h2>
      <p>Registered in England and Wales. Company number 16353948.</p>
      <p>Registered office: Church View, Newton Arlosh, Wigton, Cumbria, England, CA7 5ET. This is the registered office address; it is not a published freight drop-off point.</p>
      <p><a href="https://find-and-update.company-information.service.gov.uk/company/16353948">View the Companies House record</a></p>
      <p>Operations: <a href={operationsPhone}>0800 999 1263</a> · <a href={operationsEmail}>freight@midnight-express.org</a></p>
      <h2>Freight quotes and enquiries</h2>
      <p>Online road freight estimates help start a conversation. They do not reserve a vehicle, confirm a shipment or guarantee a transit time. Provide the complete cargo and location details so operations can confirm the final quotation, availability and applicable terms.</p>
      <p>Air, sea, customs and regulated-goods arrangements require individual operational confirmation. Do not send freight to a collection point or terminal without agreed instructions.</p>
      <h2>Booking and shipment terms</h2>
      <p>Request the applicable shipment terms from operations before accepting a quotation. Confirm collection and delivery arrangements, handling responsibilities, customs information, payment arrangements and any cancellation requirements for your movement.</p>
      <h2>Payments and enquiries</h2>
      <p>This website does not currently collect online payments. Arrange invoice and payment requirements directly with operations. Opening an email link does not send a message; send your enquiry from your email app or call the team.</p>
      <h2>Questions or a service concern</h2>
      <p>Contact operations with your shipment or invoice reference and a description of the issue so the team can review it.</p>
      <p><Link href="/contact">Contact operations</Link> · <Link href="/enquiry">Prepare a freight enquiry</Link> · <Link href="/privacy">Privacy and cookies</Link></p>
    </div></section>
  </FreightLayout>;
}
CompanyInformation.freightMarketing = true;
