import FreightLayout from '@/components/freight/FreightLayout';
import s from '@/styles/Enquiry.module.css';
export default function Privacy() {
  return <FreightLayout title="Enquiry Privacy & Cookies | Midnight Express" description="How Midnight handles freight enquiry details, shipment documents and browser drafts." path="/privacy">
    <section className={s.container}><h1>Enquiry privacy and cookies</h1>
      <p>Midnight Express Europe Ltd uses the contact and shipment information you supply to assess your request, prepare a quotation and coordinate your enquiry. Please supply only information needed for the movement.</p>
      <h2>Information you provide</h2><p>An enquiry can include your name, company, email, telephone, locations, timing, freight and dangerous-goods details, notes and optional shipment documents. Required fields are marked on the form. Do not upload payment-card details, passwords or unrelated personal information.</p>
      <h2>Stored enquiries and notifications</h2><p>When online submission is available, the server validates and stores the enquiry with a reference. Stored enquiries and documents are restricted to authorised operations administrators. An email notification may be sent to operations when that service is enabled. A notification failure does not remove an already stored enquiry.</p>
      <p>Hosting, database and configured email providers process information needed to provide these services. Shipment coordination may require relevant details to be shared with the transport or forwarding parties involved in your requested movement. Operations can explain the arrangements for a particular enquiry.</p>
      <h2>Browser drafts and essential storage</h2><p>The enquiry page uses this browser tab's session storage to recover a draft for up to 24 hours. Drafts include typed enquiry details and the submission result; uploaded document contents are not saved in the draft. Clear your draft when finished, particularly on a shared device. Closing the tab normally removes session storage, although browser session restoration can restore it.</p>
      <p>Account sign-in uses essential authentication cookies. Protected previews also use Vercel access cookies. This freight enquiry flow does not add advertising or analytics cookies. External email applications and services have their own privacy settings.</p>
      <h2>Security and retention</h2><p>The service uses request limits and restricted access to protect enquiry records. Abuse controls use keyed hashes of contact and network identifiers. Records are retained for handling the enquiry and any resulting business obligations; operations should be contacted about an individual record or a removal request.</p>
      <h2>Questions and requests</h2><p>Contact <a href="mailto:freight@midnight-express.org">freight@midnight-express.org</a> about access, correction or deletion of your details. Include your enquiry reference where available. Identity checks may be needed before information can be disclosed or changed.</p>
    </section>
  </FreightLayout>;
}
Privacy.freightMarketing=true;
