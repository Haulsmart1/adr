export const metadata = {
    title: 'Defence & Aerospace | ADR Carriers Ltd',
    description:
        'Secure ADR transport of explosives, oxidisers, lithium batteries, and critical materials to defence, aerospace, and military sites — compliant with ADR, IMDG & IATA.',
};

export default function DefenceSectorPage() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-5 py-20 overflow-hidden">
            {/* 🛡️ Background Image */}
            <div
                className="absolute inset-0 bg-[url('/c130.jpg')] bg-no-repeat bg-center bg-cover opacity-80"
                aria-hidden="true"
            />

            {/* 🔲 Frosted Glass Container */}
            <div className="relative z-10 max-w-4xl w-full bg-white/40 rounded-xl p-10 shadow-xl backdrop-blur-sm text-gray-800">
                <h1 className="text-4xl font-bold border-b-2 pb-4 mb-6 text-center border-blue-500">
                    Defence & Aerospace Logistics
                </h1>

                <p className="text-lg mb-4 leading-relaxed">
                    ADR Carriers Ltd delivers mission-critical materials to government defence contractors, military facilities, and aerospace engineering partners across the UK and EU.
                </p>

                <p className="text-lg mb-4 leading-relaxed">
                    We are licensed and experienced in the secure movement of sensitive and dangerous goods — including:
                    <strong> Class 1 (explosives)</strong>, <strong>Class 5.1 (oxidisers)</strong>, and <strong>Class 9 (lithium batteries)</strong>.
                </p>

                <ul className="list-disc list-inside text-base space-y-2 mb-6">
                    <li>Secure ADR transport of ammunition, igniters, pyrotechnics, and oxidising agents</li>
                    <li>Specialist support for dual-use and ITAR-restricted components</li>
                    <li>Vehicles certified to EXII/EXIII and escort-ready configurations</li>
                    <li>Dedicated drivers cleared for high-risk and sensitive goods</li>
                    <li>Timed collection and delivery to secure military and aerospace zones</li>
                </ul>

                <p className="text-lg leading-relaxed mb-8">
                    With DGSA oversight, military logistics experience, and full documentation support, ADR Carriers ensures safe, compliant, and traceable transport at every stage of the supply chain.
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
