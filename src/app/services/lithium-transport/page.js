export const metadata = {
    title: 'Lithium Battery Transport | ADR & UN3480/UN3090 | ADR Carriers Ltd',
    description:
        'Specialist transport of lithium-ion and lithium-metal batteries (UN3480/UN3090) by road and air under ADR and IATA regulations.',
};

export default function LithiumTransportPage() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-5 py-20 overflow-hidden">
            {/* 🔋 Background Image */}
            <div
                className="absolute inset-0 bg-[url('/images/EV.jpg')] bg-no-repeat bg-center bg-cover opacity-80"
                aria-hidden="true"
            />

            {/* 🧊 Frosted Glass Container */}
            <div className="relative z-10 max-w-5xl w-full bg-white/2 rounded-xl p-10 shadow-xl backdrop-blur-md text-gray-800 space-y-6">
                <h1 className="text-4xl font-bold border-b-2 border-blue-600 pb-4">
                    Lithium Battery Transport – UN3480 & UN3090
                </h1>

                <p className="text-lg leading-relaxed">
                    ADR Carriers Ltd is a UK-based specialist in the compliant, secure transport of lithium-ion and lithium-metal batteries. Whether you're a battery manufacturer, EV developer, or recycling partner, we offer safe, DGSA-overseen carriage of lithium goods across the UK and Europe by road, and globally via air freight.
                </p>

                <h2 className="text-2xl font-semibold pt-4">Certified to Handle Class 9 Lithium Goods</h2>
                <ul className="list-disc list-inside text-base pl-4 space-y-2">
                    <li><strong>UN3480</strong> – Lithium-ion batteries (standalone)</li>
                    <li><strong>UN3481</strong> – Lithium-ion batteries packed with or in equipment</li>
                    <li><strong>UN3090</strong> – Lithium-metal batteries (standalone)</li>
                    <li><strong>UN3091</strong> – Lithium-metal batteries with or in equipment</li>
                    <li>All handled under full ADR, IATA DGR, and IMDG compliance</li>
                </ul>

                <p className="text-lg leading-relaxed">
                    We provide end-to-end service — including packaging compliance, labelling, vehicle suitability, documentation, and route planning for full and part loads. Dangerous Goods Safety Advisors (DGSA) oversee every shipment.
                </p>

                <h2 className="text-2xl font-semibold pt-4">Why ADR Carriers?</h2>
                <ul className="list-disc list-inside text-base pl-4 space-y-2">
                    <li>ADR-equipped EXII and EXIII vehicles for Class 9 transport</li>
                    <li>IATA-approved documentation for global air freight</li>
                    <li>Packing instructions PI965–PI970 (including Section I/II compliance)</li>
                    <li>Handling of damaged, recalled, or waste batteries (ADR Special Provision 376)</li>
                    <li>Collection from factories, OEMs, test labs, and recycling sites</li>
                    <li>Cross-border customs clearance and timed deliveries</li>
                </ul>

                <p className="text-lg leading-relaxed">
                    From the safe movement of lithium batteries for electric vehicles and aerospace testing to the disposal of damaged stock, ADR Carriers ensures legal, traceable, and secure delivery every time.
                </p>

                <div className="text-center pt-4">
                    <a
                        href="/get-a-quote"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-md shadow transition transform hover:scale-105"
                    >
                        Request a Lithium Transport Quote →
                    </a>
                </div>
            </div>
        </section>
    );
}
