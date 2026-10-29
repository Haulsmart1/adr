import QuoteForm from '../../components/ContactForm';

export const metadata = {
    alternates: { canonical: "https://adrcarriers.com/get-a-quote" },
    title: 'Get a Quote | ADR Carriers Ltd',
    description: 'Request a courier quote for ADR transport in the UK and Europe.',
};

export default function QuotePage() {
    return (
        <section className="mx-auto max-w-3xl px-5 py-12">
            <h1 className="text-4xl font-bold mb-5">Request a dangerous goods transport quote</h1>
            <p className="leading-relaxed mb-5">Send the details below so ADR Carriers can assess the movement. Explain any information that is still being confirmed. Sending this form does not confirm a booking.</p>
            <a className="inline-block underline font-semibold py-3 mb-5" href="tel:+448009991263">Prefer to call? 0800 999 1263</a>
            <h2 className="text-2xl font-bold mb-4">Include in your shipment details</h2>
            <ul className="list-disc pl-5 space-y-2 mb-6"><li>Collection and delivery addresses, readiness and required arrival time.</li><li>UN number, proper shipping name, class or division, and packing group where applicable.</li><li>Package count and type, dimensions, quantity and gross weight.</li><li>For Class 1: net explosive quantity and compatibility group. For batteries: chemistry, configuration and condition. For Class 7: material and package information.</li><li>Loading equipment, access restrictions and any ferry or customs requirements.</li></ul>
            <p className="mb-7 leading-relaxed">Mention any available safety data sheets or transport documents; arrange document sharing with the team. Do not put sensitive security instructions in a general enquiry.</p>
            <QuoteForm />
            <p className="mt-6 leading-relaxed">If the form cannot be sent, call <a className="underline" href="tel:+448009991263">0800 999 1263</a> or email <a className="underline break-words" href="mailto:stuart@adrcarriers.net">stuart@adrcarriers.net</a>.</p>
        </section>
    );
}
