export const metadata = {
    title: 'Class 1 Explosives Storage | ADR Carriers Ltd',
    description:
        'Secure explosives storage via accredited partners. EXII/EXIII transport, security plans, DGSA oversight & 24/7 access. Fully ADR compliant.',
};

export default function Class1StoragePage() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-5 py-20 overflow-hidden">
            {/* Background */}
            <div
                className="absolute inset-0 bg-[url('/explosives-bg.jpg')] bg-no-repeat bg-center bg-cover opacity-80"
                aria-hidden="true"
            />

            <div className="relative z-10 max-w-4xl w-full bg-white/85 rounded-xl p-10 shadow-xl backdrop-blur-md text-gray-800 space-y-6">
                <h1 className="text-4xl font-bold border-b-2 border-orange-600 pb-2">
                    Class 1 Explosives Storage (EXII / EXIII)
                </h1>

                <p className="text-lg leading-relaxed">
                    <strong>ADR Carriers Ltd</strong> provides secure and compliant logistics for Class 1 dangerous goods (explosives), working closely with fully licensed third-party explosive storage facilities across the UK.
                </p>

                <p className="text-lg leading-relaxed">
                    We manage the end-to-end process, from certified vehicle transport (EXII / EXIII), to DGSA-supervised handling and secure warehousing for:
                </p>

                <ul className="list-disc list-inside space-y-2 text-base pl-2">
                    <li>UN 1.1–1.6 explosives including fireworks, detonators, charges</li>
                    <li>Class 1.4G / 1.4C items such as airbags & pre-tensioners</li>
                    <li>Mining, quarrying and demolition products</li>
                    <li>Military / defence logistics (under authorisation)</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6">Secure Storage Includes:</h2>
                <ul className="list-disc list-inside space-y-2 text-base pl-2">
                    <li>Licensed & HSE-regulated explosives depots</li>
                    <li>EXII & EXIII transport with trained ADR drivers</li>
                    <li>Security plans and movement tracking</li>
                    <li>24/7 availability for urgent collection or delivery</li>
                    <li>Full Dangerous Goods documentation & compliance</li>
                </ul>

                <p className="text-lg leading-relaxed">
                    Our team ensures that every consignment is treated with the highest level of security, compliance, and reliability. For more details on explosive logistics or to arrange secure storage, get in touch today.
                </p>

                <div className="text-center pt-4">
                    <a
                        href="/get-a-quote"
                        className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-3 rounded-md shadow transition"
                    >
                        Request Explosives Quote →
                    </a>
                </div>
            </div>
        </section>
    );
}
