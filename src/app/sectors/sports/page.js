export const metadata = {
    title: 'Sports & Motorsport | ADR Carriers Ltd',
    description: 'ADR-compliant logistics for motorsport teams and sporting events. Delivery of fuels, gases, and lithium batteries across the UK and Europe.',
};

export default function SportsSectorPage() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-5 py-20 overflow-hidden">
            {/* 🏁 Background image */}
            <div
                className="absolute inset-0 bg-[url('/images/EV.jpg')] bg-no-repeat bg-center bg-cover opacity-90"
                aria-hidden="true"
            />

            {/* 🧊 Frosted glass container */}
            <div className="relative z-10 max-w-4xl w-full bg-white/50 rounded-xl p-10 shadow-xl backdrop-blur-sm text-gray-800">
                <h1 className="text-4xl font-bold text-center border-b-2 pb-4 mb-6 border-blue-500">
                    ADR Transport for the Sports & Motorsport Sector
                </h1>

                <p className="text-lg mb-4 leading-relaxed">
                    <strong>ADR Carriers Ltd</strong> delivers specialist logistics support to professional motorsport teams, event organisers, and sports infrastructure providers. Whether it’s transporting racing fuels, gas cylinders, or lithium-ion batteries — we ensure everything arrives safely, on time, and fully compliant.
                </p>

                <p className="text-lg mb-4 leading-relaxed">
                    Our team is trusted by high-performance sectors that demand precision, reliability, and full adherence to international regulations like ADR, IMDG, and IATA for dangerous goods. We support both domestic race events and international competitions.
                </p>

                <ul className="list-disc list-inside text-base space-y-2 mb-6">
                    <li>Delivery of Class 3 fuels, oils & flammable liquids</li>
                    <li>Transport of pressurised gas cylinders — Class 2</li>
                    <li>Handling & storage of lithium-ion batteries — Class 9</li>
                    <li>Customs-ready documentation for cross-border race logistics</li>
                    <li>Rapid support for breakdowns, spares & returns</li>
                    <li>Event staging materials, pyrotechnics & generator fuels</li>
                </ul>

                <p className="text-lg mb-8 leading-relaxed">
                    From the paddock to the podium, we understand the speed and scrutiny of the motorsport world — and we’re ready to deliver when it counts.
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
