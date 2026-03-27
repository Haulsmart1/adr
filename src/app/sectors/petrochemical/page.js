export const metadata = {
    title: 'Petrochemical | ADR Carriers Ltd',
    description:
        'Flammable, explosive, and toxic goods delivered to chemical plants, refineries, and fuel depots across the UK & EU — fully ADR, IMDG and IATA compliant.',
};

export default function PetrochemicalSectorPage() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-5 py-20 overflow-hidden">
            {/* 🛢️ Background Image */}
            <div
                className="absolute inset-0 bg-[url('/petro.jpg')] bg-no-repeat bg-center bg-cover opacity-80"
                aria-hidden="true"
            />

            {/* 🧊 Content Container */}
            <div className="relative z-10 max-w-4xl w-full bg-white/50 rounded-xl p-10 shadow-xl backdrop-blur-sm text-gray-800">
                <h1 className="text-4xl font-bold border-b-2 pb-4 mb-6 text-center border-blue-500">
                    Petrochemical Sector
                </h1>

                <p className="text-lg mb-4 leading-relaxed">
                    <strong>ADR Carriers Ltd</strong> provides specialist transport of hazardous materials to fuel terminals, refineries, blending plants,
                    tank farms, and chemical production sites across the UK and Europe.
                </p>

                <p className="text-lg mb-4 leading-relaxed">
                    Our fully ADR-compliant fleet is equipped for Class 1–9 goods including <strong>flammables (Class 3)</strong>,
                    <strong>gases (Class 2)</strong>, <strong>oxidising agents (Class 5.1)</strong>, <strong>toxic substances (Class 6)</strong>,
                    and <strong>explosives (Class 1)</strong>.
                </p>

                <ul className="list-disc list-inside text-base space-y-2 mb-6">
                    <li>Direct delivery to refineries, fuel depots, and chemical manufacturers</li>
                    <li>Transport of ADR-regulated solvents, pressurised gas cylinders, and corrosive acids</li>
                    <li>EXII and EXIII vehicles with trained drivers and DGSA oversight</li>
                    <li>Emergency ADR response planning and timed delivery slots</li>
                </ul>

                <p className="text-lg leading-relaxed mb-8">
                    We support both scheduled delivery chains and rapid response to unplanned outages — giving petrochemical clients the safety, reliability,
                    and compliance they demand for critical substances.
                </p>

                <div className="text-center">
                    <a
                        href="/get-a-quote"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-md transition shadow-md"
                    >
                        Get a Quote
                    </a>
                </div>
            </div>
        </section>
    );
}
