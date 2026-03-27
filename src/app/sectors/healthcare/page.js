export const metadata = {
    title: 'Healthcare & Biopharma | ADR Carriers Ltd',
    description:
        'Specialist transport of diagnostic chemicals, cytotoxic substances, lithium devices, and Class 6.2 & 7 materials for hospitals, labs, and pharma facilities.',
};

export default function HealthcareSectorPage() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-5 py-20 overflow-hidden">
            {/* 🏥 Background Image */}
            <div
                className="absolute inset-0 bg-[url('/radioactive-bg.jpg')] bg-no-repeat bg-center bg-cover opacity-80"
                aria-hidden="true"
            />

            {/* 🔲 Frosted Glass Container */}
            <div className="relative z-10 max-w-4xl w-full bg-white/50 rounded-xl p-10 shadow-xl backdrop-blur-sm text-gray-800">
                <h1 className="text-4xl font-bold border-b-2 pb-4 mb-6 text-center border-blue-500">
                    Healthcare & Biopharma Logistics
                </h1>

                <p className="text-lg mb-4 leading-relaxed">
                    ADR Carriers Ltd specialises in the secure movement of regulated materials for the healthcare and pharmaceutical industries. From laboratory reagents to cytotoxic agents and radioactive isotopes — we ensure full compliance under ADR, IATA, and IMDG rules.
                </p>

                <p className="text-lg mb-4 leading-relaxed">
                    Our expertise covers the transport of high-risk substances such as:
                    <strong> Class 6.1 (toxic)</strong>, <strong>6.2 (infectious)</strong>, <strong>Class 7 (radioactive)</strong>, and
                    <strong> Class 9 (lithium-powered devices)</strong>.
                </p>

                <ul className="list-disc list-inside text-base space-y-2 mb-6">
                    <li>Specialist carriage of diagnostic kits, cytotoxic waste, and controlled drugs</li>
                    <li>Licensed movement of radiopharmaceuticals & diagnostic isotopes (Class 7)</li>
                    <li>Secure lithium battery transport for critical medical devices (UN3480 / UN3090)</li>
                    <li>Time-sensitive delivery to NHS Trusts, private hospitals & pharma labs</li>
                    <li>DGSA guidance, chain of custody tracking, and compliant documentation</li>
                </ul>

                <p className="text-lg leading-relaxed mb-8">
                    Whether supporting healthcare logistics during emergencies or handling tightly regulated biological specimens, our team ensures safe, documented, and on-time delivery — every time.
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
