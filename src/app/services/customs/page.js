export const metadata = {
    title: 'Customs & Brexit Support | ADR Carriers Ltd',
    description:
        'Navigate post-Brexit hazardous goods regulations with ADR Carriers. Full support for TSS, CTC, and Northern Ireland transit.',
};

export default function CustomsPage() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
            {/* 🌄 Background image */}
            <div
                className="absolute inset-0 bg-[url('/customs-bg.jpg')] bg-cover bg-center bg-no-repeat opacity-80"
                aria-hidden="true"
            />

            {/* 🧾 Centered content container */}
            <div className="relative z-10 max-w-5xl w-full bg-white/75 rounded-xl shadow-lg p-10 text-gray-800 space-y-6">
                <h1 className="text-4xl font-bold border-b-2 pb-4 border-blue-500">
                    Customs & Regulatory Support for Hazardous Goods
                </h1>

                <p className="text-lg leading-relaxed">
                    At <strong>ADR Carriers Ltd</strong>, we provide 24/7 customs and border compliance services tailored to the movement of ADR-regulated freight. From GB–EU exports to Northern Ireland TSS entries and CTC transit, we ensure your shipments remain on track, compliant, and documented correctly.
                </p>

                <h2 className="text-2xl font-semibold pt-4">Real-Time Support, Real-World Solutions</h2>
                <p className="text-lg leading-relaxed">
                    Our customs agents operate <strong>24 hours a day, 7 days a week</strong>, including weekends and public holidays. This means we can respond instantly to unexpected customs holds, port delays, or urgent ADR compliance checks — day or night.
                </p>
                <p className="text-lg leading-relaxed">
                    In the event of <strong>bad weather, ferry cancellations, or disruption at key crossings</strong>, we maintain full control of the transport lane. We can dynamically reroute, reassign vehicles, or hold goods at bonded locations — ensuring minimal delay and maximum compliance.
                </p>

                <h2 className="text-2xl font-semibold pt-6">NI Protocol & TSS Support</h2>
                <ul className="list-disc list-inside text-base space-y-1 pl-4">
                    <li>TSS registration, ENS filing & MRN handling</li>
                    <li>High-risk vs Not-at-risk classification</li>
                    <li>Data submission and customs declaration completion</li>
                    <li>Clearance for ADR shipments across Irish Sea borders</li>
                </ul>

                <h2 className="text-2xl font-semibold pt-6">CTC Transit & Multinational Routing</h2>
                <ul className="list-disc list-inside text-base space-y-1 pl-4">
                    <li>Transit Accompanying Document (TAD) preparation</li>
                    <li>Office of Departure & Office of Transit coordination</li>
                    <li>Sealing and inspection compliance for ADR vehicles</li>
                    <li>Cross-border support for UK, EU, NI & Channel Islands</li>
                </ul>

                <h2 className="text-2xl font-semibold pt-6">Why ADR Carriers Ltd?</h2>
                <ul className="list-disc list-inside text-base space-y-1 pl-4">
                    <li>Class 1–9 ADR transport with DGSA oversight</li>
                    <li>24/7 customs support & document submission</li>
                    <li>Trusted by freight forwarders, 3PLs, and exporters</li>
                    <li>Control over diversions, lane access & routing</li>
                </ul>

                <div className="pt-6 text-lg leading-relaxed">
                    Whether it's a complex ADR consignment or a same-day emergency export, our customs experts and transport planners keep your goods compliant, cleared, and moving — every hour of every day.
                </div>

                <div className="text-center pt-6">
                    <a
                        href="/get-a-quote"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-md shadow transition transform hover:scale-105"
                    >
                        Speak to Customs Team →
                    </a>
                </div>
            </div>
        </section>
    );
}

