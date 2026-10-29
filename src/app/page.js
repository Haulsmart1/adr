import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { TransportActions } from '@/components/TransportPage';

export const metadata = pageMetadata('/', 'Dedicated Dangerous Goods Transport UK & Europe | ADR Carriers', 'Discuss dedicated ADR road transport across the UK and Europe. Specialist Class 1, Class 7 and lithium battery enquiries. Call 0800 999 1263 or request a quote.');
const services = [
  ['adr-dangerous-goods', 'Dedicated ADR transport', 'A road movement planned around your dangerous goods, collection site and delivery requirement.'],
  ['lithium-transport', 'Lithium battery transport', 'Standalone batteries, batteries with equipment and EV pack enquiries, with condition and handling assessed first.'],
  ['explosives', 'Class 1 explosives', 'Specialist enquiries using division, compatibility group and net explosive quantity to assess the movement.'],
  ['radioactive', 'Class 7 radioactive material', 'Material, activity and package information reviewed against the team’s confirmed operating scope.'],
];
export default function HomePage() {
  return <>
    <section className="bg-gray-950 text-white">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24 grid lg:grid-cols-3 gap-12 items-center">
        <div className="lg:col-span-2">
          <p className="text-blue-200 font-semibold mb-5">ADR Carriers Ltd · UK and European road transport</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">Dedicated dangerous goods road transport</h1>
          <p className="mt-6 text-xl leading-relaxed text-gray-200 max-w-2xl">Your load. Your route. A transport arrangement built around the goods you need to move.</p>
          <p className="mt-4 leading-relaxed text-gray-200">Discuss UK collections, European deliveries and specialist Class 1, Class 7 or lithium battery movements with ADR Carriers. Send the classification, load details and delivery window so the team can assess a suitable arrangement.</p>
          <TransportActions />
          <p className="text-sm text-gray-300">Acceptance, route and collection timing are confirmed for each consignment before booking.</p>
        </div>
        <aside className="border border-gray-600 rounded-xl p-6 bg-gray-900">
          <h2 className="text-xl font-bold">Have a shipment ready to discuss?</h2>
          <ol className="list-decimal pl-5 space-y-4 mt-5 text-gray-200"><li>Where is it collecting and delivering?</li><li>What is the UN number and classification?</li><li>How is it packed, and how much is there?</li><li>When must it arrive?</li></ol>
          <Link href="/get-a-quote" className="block mt-6 underline font-semibold">Send your shipment details</Link>
        </aside>
      </div>
    </section>
    <section className="mx-auto max-w-6xl px-5 py-14">
      <h2 className="text-3xl font-bold">Specialist services for the load you need to move</h2>
      <p className="mt-4 max-w-3xl leading-relaxed">Start with the service that matches your shipment. These guides explain the information needed for assessment; they do not replace the consignor’s classification or confirm acceptance.</p>
      <div className="grid md:grid-cols-2 gap-5 mt-8">{services.map(([slug, title, text]) => <article key={slug} className="border border-gray-300 rounded-xl p-7"><h3 className="text-2xl font-bold"><Link className="underline decoration-blue-600 underline-offset-4" href={`/services/${slug}`}>{title}</Link></h3><p className="mt-4 leading-relaxed">{text}</p></article>)}</div>
    </section>
    <section className="bg-blue-50 border-y border-blue-100"><div className="mx-auto max-w-6xl px-5 py-14 grid md:grid-cols-2 gap-10">
      <div><h2 className="text-3xl font-bold">UK, Europe and Ireland</h2><p className="mt-5 leading-relaxed">For cross-border transport, the road route, ferry leg and customs responsibilities need to work together. Share the full origin and destination before a crossing or delivery commitment is agreed.</p><ul className="mt-5 space-y-3"><li><Link className="underline" href="/services/express-europe-ni">UK–Europe ADR transport</Link></li><li><Link className="underline" href="/services/ireland-dangerous-goods">Republic of Ireland and Northern Ireland enquiries</Link></li><li><Link className="underline" href="/areas/cumbria">Dangerous goods transport enquiries from Cumbria</Link></li></ul></div>
      <div><h2 className="text-3xl font-bold">Working to a fixed deadline?</h2><p className="mt-5 leading-relaxed">Tell us the earliest collection readiness, latest delivery time and site opening hours. Urgency still needs the right shipment information and a feasible transport arrangement.</p><p className="mt-5"><Link className="underline font-semibold" href="/services/time-critical-transport">Discuss time-critical specialist transport</Link></p><TransportActions label="Request an urgent assessment" /></div>
    </div></section>
    <section className="mx-auto max-w-6xl px-5 py-14 grid md:grid-cols-2 gap-12">
      <div><h2 className="text-3xl font-bold">Practical detail before the goods move</h2><p className="mt-5 leading-relaxed">A battery’s condition, an explosive load’s net explosive quantity or a radioactive package’s details can change the assessment. Provide those details early so the conversation can focus on the actual movement.</p><ul className="mt-5 space-y-3"><li><Link className="underline" href="/services/un3480-un3481-transport">UN3480 and UN3481: describe the battery configuration</Link></li><li><Link className="underline" href="/services/damaged-defective-battery-transport">Damaged or defective batteries: request assessment first</Link></li></ul></div>
      <div><h2 className="text-3xl font-bold">Speak to ADR Carriers Ltd</h2><p className="mt-5 leading-relaxed">Discuss your requirements directly on <a className="underline" href="tel:+448009991263">0800 999 1263</a> or email <a className="underline break-words" href="mailto:stuart@adrcarriers.net">stuart@adrcarriers.net</a>. Include the route, classification, package details and timing. Explain what is still being confirmed.</p><TransportActions /><Link className="underline" href="/contact">Company contact details</Link></div>
    </section>
    <section className="mx-auto max-w-6xl px-5 pb-14"><h2 className="text-3xl font-bold mb-6">Before you request a quote</h2>
      <details className="border-b py-4"><summary className="font-semibold cursor-pointer py-2">Can I enquire before every document is ready?</summary><p className="mt-3 max-w-3xl leading-relaxed">Yes. Tell us what is available and what is missing. The relevant classification, packaging and transport information must be confirmed before the team accepts a booking.</p></details>
      <details className="border-b py-4"><summary className="font-semibold cursor-pointer py-2">Is collection confirmed when I send an enquiry?</summary><p className="mt-3 max-w-3xl leading-relaxed">No. A quote request starts an assessment. Acceptance, availability, the route and collection timing must be agreed for your consignment.</p></details>
      <details className="border-b py-4"><summary className="font-semibold cursor-pointer py-2">Do European enquiries include ferry acceptance?</summary><p className="mt-3 max-w-3xl leading-relaxed">Any ferry leg must be declared and considered separately. Road acceptance does not automatically establish acceptance by a ferry operator.</p></details>
    </section>
  </>;
}
