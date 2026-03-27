export const metadata = {
    title: 'Agriculture & Chemicals | ADR Carriers Ltd',
    description:
        'Compliant carriage of fertilisers, pesticides, flammable liquids, and agrochemicals to farms and distributors across the UK and Europe.',
};

export default function AgricultureSectorPage() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-5 py-80 overflow-hidden">
            {/* 🌾 Background Image */}
            <div
                className="absolute inset-0 bg-[url('/fert.jpg')] bg-no-repeat bg-center bg-cover opacity-80"
                aria-hidden="true"
            />

            {/* 🌐 Content Container */}
            <div className="relative z-10 max-w-4xl w-full bg-white/40 rounded-xl p-10 shadow-xl backdrop-blur-sm text-gray-800">
                <h1 className="text-4xl font-bold border-b-2 pb-4 mb-6 text-center border-green-400">
                    Agriculture & Chemicals
                </h1>

                <p className="text-lg mb-4 leading-relaxed">
                    At <strong>ADR Carriers Ltd</strong>, we provide expert and fully compliant transport solutions for the agriculture and farming sectors.
                    From fertilisers and pesticides to liquid fuels and agrochemicals, our ADR-certified service ensures the safe and timely delivery of hazardous materials
                    essential to modern food production and agribusiness across the UK and Europe.
                </p>

                <p className="text-lg mb-4 leading-relaxed">
                    We operate with certified ADR vehicles and trained drivers to manage the carriage of dangerous goods in Classes 2, 3, 5.1, 6, and 8. Whether delivering to remote rural farms
                    or major distribution centres, our team understands the urgency and environmental responsibility tied to agricultural logistics.
                </p>

                <ul className="list-disc list-inside text-base space-y-2 mb-6">
                    <li>Flammable liquids and fuels (e.g. diesel, heating oil)</li>
                    <li>Nitrogen-based and oxidising fertilisers (Class 5.1)</li>
                    <li>Pesticides, herbicides, and crop treatment chemicals</li>
                    <li>Corrosive substances used in irrigation and cleaning</li>
                    <li>Environmentally sensitive delivery with full DGSA oversight</li>
                </ul>

                <p className="text-lg leading-relaxed mb-8">
                    As regulatory pressures increase and climate resilience becomes a global priority, safe handling of agricultural hazardous materials is more important than ever.
                    Trust ADR Carriers to deliver with safety, speed and environmental responsibility in mind.
                </p>

                <div className="text-center">
                    <a
                        href="/get-a-quote"
                        className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-md transition shadow-md"
                    >
                        Get a Quote
                    </a>
                </div>
            </div>
        </section>
    );
}
