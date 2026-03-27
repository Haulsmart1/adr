export const metadata = {
    title: 'Energy & Renewables | ADR Carriers Ltd',
    description:
        'Specialist delivery of lithium batteries, solar chemicals, and high-voltage components to energy hubs across the UK and EU.',
};

export default function EnergySectorPage() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-5 py-20 overflow-hidden">
            {/* 🔋 Background image layer */}
            <div
                className="absolute inset-0 bg-[url('/EVRENEW.jpg')] bg-no-repeat bg-center bg-cover opacity-80"
                aria-hidden="true"
            />

            {/* ⚡ Frosted glass container */}
            <div className="relative z-10 max-w-4xl w-full bg-white/50 rounded-xl p-10 shadow-xl backdrop-blur-sm text-gray-800">
                <h1 className="text-4xl font-bold text-center border-b-2 pb-4 mb-6 border-blue-500">
                    ADR Logistics for the Energy & Renewables Sector
                </h1>

                <p className="text-lg mb-4 leading-relaxed">
                    <strong>ADR Carriers Ltd</strong> delivers compliant transport solutions for the fast-growing energy sector — including solar, battery storage, wind power, and utility-scale infrastructure projects across the UK and EU.
                </p>

                <p className="text-lg mb-4 leading-relaxed">
                    We specialise in the movement of ADR-classified goods such as lithium-ion batteries (UN3480/UN3090), hydrogen cylinders, corrosive substances, and solar processing agents. All logistics are carried out in strict accordance with ADR, IMDG, and IATA guidelines.
                </p>

                <ul className="list-disc list-inside text-base space-y-2 mb-6">
                    <li>Transport of lithium-ion & lithium-metal batteries — Class 9</li>
                    <li>Delivery of solar chemicals & cell manufacturing reagents</li>
                    <li>Hydrogen, nitrogen & refrigerants — Class 2 cylinders</li>
                    <li>Movement of corrosives, adhesives & curing agents — Class 8</li>
                    <li>Support for onshore wind, battery farms & energy hubs</li>
                    <li>Reverse logistics for damaged or expired battery units</li>
                </ul>

                <p className="text-lg mb-8 leading-relaxed">
                    Our clients include energy developers, solar manufacturers, battery integrators, and utility contractors. From full trailer loads to time-critical spares, we ensure everything moves with care, compliance, and control.
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
