export const metadata = {
    title: 'Marine & Ports | ADR Carriers Ltd',
    description:
        'IMDG and ADR-compliant hazardous goods transport for ports, shipping vessels, offshore support, and marine logistics — including lithium batteries, flammables, and gases.',
};

export default function MarineSectorPage() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-5 py-20 overflow-hidden">
            {/* 🌊 Background Image */}
            <div
                className="absolute inset-0 bg-[url('/flares2.jpg')] bg-no-repeat bg-center bg-cover opacity-80"
                aria-hidden="true"
            />

            {/* 🧊 Frosted Glass Container */}
            <div className="relative z-10 max-w-4xl w-full bg-white/50 rounded-xl p-10 shadow-xl backdrop-blur-sm text-gray-800">
                <h1 className="text-4xl font-bold border-b-2 pb-4 mb-6 text-center border-blue-500">
                    Marine & Port Logistics
                </h1>

                <p className="text-lg mb-4 leading-relaxed">
                    <strong>ADR Carriers Ltd</strong> provides specialist hazardous goods transport for the marine industry — serving port authorities, vessel operators,
                    offshore contractors, and ship chandlers with safe, certified delivery of dangerous cargo.
                </p>

                <p className="text-lg mb-4 leading-relaxed">
                    Our operations are fully compliant with <strong>IMDG</strong>, <strong>ADR</strong>, and <strong>IATA</strong> regulations — enabling us to transport
                    dangerous goods between land and sea interfaces with complete regulatory coverage.
                </p>

                <ul className="list-disc list-inside text-base space-y-2 mb-6">
                    <li>Delivery of lithium batteries (UN3480/3481), flammable liquids, gas cylinders, and chemicals</li>
                    <li>Timed drop-offs to RoRo terminals, freight docks, and offshore supply bases</li>
                    <li>IMDG documentation, placarding, and port security coordination included</li>
                    <li>Service for Class 1–9 materials including explosive and corrosive goods</li>
                </ul>

                <p className="text-lg leading-relaxed mb-8">
                    Whether supplying critical spares to offshore installations or coordinating bulk DG movements through commercial ports,
                    ADR Carriers delivers with accuracy, compliance, and experience.
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
