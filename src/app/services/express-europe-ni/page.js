export const metadata = {
    title: 'Express Pallet Courier to Europe & NI | ADR Carriers Ltd',
    description:
        'Same-day and overnight pallet courier services across Europe and Northern Ireland. Fully ADR-compliant transport for hazardous goods, including customs clearance and real-time tracking.',
};

export default function ExpressEuropeNIPage() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-5 py-20 overflow-hidden">
            {/* 🌍 Background Image */}
            <div
                className="absolute inset-0 bg-[url('/express-pallets.png')] bg-no-repeat bg-center bg-contain md:bg-cover opacity-80"
                aria-hidden="true"
            />

            {/* 🧊 Frosted Glass Container */}
            <div className="relative z-10 max-w-5xl w-full bg-white/10 rounded-xl p-10 shadow-xl backdrop-blur-md text-gray-800 space-y-6">
                <h1 className="text-4xl font-bold border-b-2 pb-4 border-blue-500">
                    Express Pallet Delivery to Europe & Northern Ireland
                </h1>

                <p className="text-lg leading-relaxed">
                    At <strong>ADR Carriers Ltd</strong>, we specialise in urgent pallet deliveries across Europe and Northern Ireland — offering same-day, overnight, full-load, and part-load options tailored to your schedule. Whether you're shipping general freight or ADR-classified goods, we deliver with full compliance, speed, and precision.
                </p>

                <p className="text-lg leading-relaxed">
                    Our modern fleet, operated by trained ADR drivers, is equipped for rapid cross-border movement of hazardous goods. We handle everything from flammable liquids and lithium batteries to chemicals and industrial cargo — with all necessary documentation and customs clearance included.
                </p>

                <ul className="list-disc list-inside text-base space-y-2">
                    <li>Same-day & overnight express delivery</li>
                    <li>Full trailer loads & groupage (part loads)</li>
                    <li>Fully ADR-compliant (Class 1–9)</li>
                    <li>Customs cleared for EU & Northern Ireland</li>
                    <li>Real-time vehicle tracking & digital PODs</li>
                    <li>Collection within 60–90 mins UK-wide</li>
                </ul>

                <p className="text-lg leading-relaxed">
                    Whether you're a freight forwarder, chemicals distributor, or manufacturer — we provide rapid, reliable delivery across France, Germany, Ireland, the Netherlands, Belgium, and more. Trust ADR Carriers Ltd to move your urgent loads safely and compliantly.
                </p>

                <div className="text-center pt-4">
                    <a
                        href="/get-a-quote"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-md shadow transition"
                    >
                        Request a Quote →
                    </a>
                </div>
            </div>
        </section>
    );
}
