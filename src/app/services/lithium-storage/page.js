export const metadata = {
    title: 'Lithium Battery Storage | Fire-Rated Secure Warehousing | ADR Carriers Ltd',
    description:
        'Secure, ventilated, and fire-rated storage for lithium batteries (Class 9) under ADR warehousing standards. Long-term storage for UN3480 & UN3090.',
};

export default function LithiumStoragePage() {
    return (
        <section className="relative min-h-screen px-6 py-20 overflow-hidden flex items-center">
            {/* 🔋 Background image */}
            <div
                className="absolute inset-0 bg-[url('/images/bg-lithium-battery-storage.jpg')] bg-center bg-cover bg-no-repeat opacity-80"
                aria-hidden="true"
            />

            {/* 🧊 Frosted container - LEFT aligned */}
            <div className="relative z-10 max-w-5xl w-full bg-white/10 rounded-xl p-10 shadow-xl backdrop-blur-md text-gray-800 space-y-6">
                <h1 className="text-4xl font-bold border-b-2 border-blue-500 pb-4">
                    Lithium Battery Storage Solutions
                </h1>

                <p className="text-lg leading-relaxed">
                    <strong>ADR Carriers Ltd</strong> offers fully secure, temperature-controlled warehousing for lithium batteries under ADR Class 9 standards — including <strong>UN3480</strong> lithium-ion and <strong>UN3090</strong> lithium-metal types. Whether you're importing EV components or storing industrial packs, we provide safe, scalable logistics.
                </p>

                <h2 className="text-2xl font-semibold pt-4">Facility Capabilities</h2>
                <ul className="list-disc list-inside text-base pl-4 space-y-2">
                    <li>Fire-rated and segregated storage zones</li>
                    <li>24/7 monitored facilities with access control & CCTV</li>
                    <li>Explosion-vented storage and containment protocols</li>
                    <li>Ventilation and temperature control systems</li>
                    <li>Full DGSA compliance with ADR and HSE standards</li>
                    <li>Flexible warehousing – short and long term</li>
                </ul>

                <p className="text-lg leading-relaxed">
                    Our sites are approved for the storage of lithium batteries both loose and integrated into equipment. We also accommodate <strong>damaged batteries</strong> (under SP376) with special handling provisions.
                </p>

                <h2 className="text-2xl font-semibold pt-4">Integrated 3PL Support</h2>
                <ul className="list-disc list-inside text-base pl-4 space-y-2">
                    <li>Inventory management & tracking</li>
                    <li>Pick, pack & dispatch fulfilment</li>
                    <li>Returns processing and repackaging</li>
                    <li>Transport collection & final-mile delivery</li>
                    <li>Integration with lithium <a href="/services/lithium-transport" className="text-blue-600 underline hover:text-blue-800">transport services</a></li>
                </ul>

                <p className="text-lg leading-relaxed">
                    We work with battery manufacturers, solar and EV brands, aerospace companies, and logistics hubs to deliver secure lithium warehousing solutions across the UK and Europe.
                </p>

                <div className="text-left pt-4">
                    <a
                        href="/get-a-quote"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-md shadow transition transform hover:scale-105"
                    >
                        Enquire About Lithium Storage →
                    </a>
                </div>
            </div>
        </section>
    );
}
