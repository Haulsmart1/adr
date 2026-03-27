export const metadata = {
    title: 'Automotive Sector | ADR Carriers Ltd',
    description:
        'Hazardous goods transport for the automotive industry including EV battery logistics, workshop chemicals, and OEM distribution — ADR-compliant Class 1–9.',
};

export default function AutomotiveSectorPage() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-5 py-20 overflow-hidden">
            {/* 🚗 Background image layer */}
            <div
                className="absolute inset-0 bg-[url('/flame.jpg')] bg-no-repeat bg-center bg-cover opacity-90"
                aria-hidden="true"
            />

            {/* 🔲 Frosted glass content box */}
            <div className="relative z-10 max-w-4xl w-full bg-white/50 rounded-xl p-10 shadow-xl backdrop-blur-sm text-gray-800">
                <h1 className="text-4xl font-bold text-center border-b-2 pb-4 mb-6 border-blue-500">
                    ADR Transport for the Automotive Sector
                </h1>

                <p className="text-lg mb-4 leading-relaxed">
                    <strong>ADR Carriers Ltd</strong> delivers tailored hazardous goods logistics for the automotive industry — supporting OEM manufacturers, dealership networks, component suppliers, and EV innovators with compliant, secure transport of ADR-regulated substances.
                </p>

                <p className="text-lg mb-4 leading-relaxed">
                    From lithium battery carriage to workshop chemical deliveries, our certified fleet and trained ADR drivers handle Class 1–9 materials with precision. Whether you're transporting airbag units, paints, oils, or aerosols — we offer full DGSA oversight and nationwide coverage.
                </p>

                <ul className="list-disc list-inside text-base space-y-2 mb-6">
                    <li>EV battery logistics (UN3480 / UN3090) — <strong>ADR Class 9</strong></li>
                    <li>Oils, lubricants, brake fluids & coolants — <strong>Classes 3 & 8</strong></li>
                    <li>
                        Airbags & pre-tensioners — <strong>
                            <a href="/services/explosives" className="text-red-600 underline">
                                Class 1.4G (Explosives)
                            </a>
                        </strong>
                    </li>
                    <li>Aerosols & gas-based cleaners — <strong>Class 2.1 / 2.2</strong></li>
                    <li>Paints, resins, adhesives — <strong>Class 3 & Class 5.2</strong></li>
                    <li>Waste returns & reverse logistics for parts recovery</li>
                </ul>

                <p className="text-lg leading-relaxed mb-8">
                    Our automotive ADR services include timed delivery slots, secure packaging consultation, and full transport documentation. Trusted by Tier 1 suppliers and distribution hubs across the UK & EU.
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
