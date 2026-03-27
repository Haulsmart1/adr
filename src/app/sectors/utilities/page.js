export const metadata = {
    title: 'Utilities & Infrastructure | ADR Carriers Ltd',
    description:
        'Compliant transport of corrosives, batteries, and chemicals for utility providers, national grid, telecoms and infrastructure projects.',
};

export default function UtilitiesSectorPage() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-5 py-20 overflow-hidden">
            {/* 🏗️ Background Image */}
            <div
                className="absolute inset-0 bg-[url('/marine.jpg')] bg-no-repeat bg-center bg-cover opacity-80"
                aria-hidden="true"
            />

            {/* 🧊 Content Container */}
            <div className="relative z-10 max-w-4xl w-full bg-white/40 rounded-xl p-10 shadow-xl backdrop-blur-sm text-gray-800">
                <h1 className="text-4xl font-bold border-b-2 pb-4 mb-6 text-center border-blue-500">
                    Utilities & Infrastructure
                </h1>

                <p className="text-lg mb-4 leading-relaxed">
                    <strong>ADR Carriers Ltd</strong> provides compliant and reliable transport of hazardous goods for the UK’s vital utilities sector —
                    supporting projects in energy, water, gas, telecommunications, and infrastructure.
                </p>

                <p className="text-lg mb-4 leading-relaxed">
                    Our team specialises in the safe movement of dangerous goods including <strong>corrosives</strong>, <strong>lithium batteries</strong>,
                    <strong>oxidisers</strong>, and <strong>industrial chemicals</strong> for use in power plants, substations, data centres, and maintenance projects.
                    Whether supporting National Grid upgrades, water treatment facilities, or telecom rollouts, we deliver with precision and compliance.
                </p>

                <ul className="list-disc list-inside text-base space-y-2 mb-6">
                    <li>Transport of Class 2, 3, 5, 6, 8 and 9 hazardous goods</li>
                    <li>Specialist handling of batteries, corrosives & oxidisers</li>
                    <li>Fully ADR-compliant fleet with EXII/EXIII vehicles</li>
                    <li>Real-time tracking, route planning, and delivery windows</li>
                    <li>DGSA oversight and full transport documentation</li>
                </ul>

                <p className="text-lg leading-relaxed mb-8">
                    With critical services depending on continuity, we provide dependable and regulation-ready logistics that ensure materials reach utility providers
                    and contractors safely — every time.
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
