export const metadata = {
    title: 'Hazardous Goods Storage | ADR Warehousing UK | ADR Carriers Ltd',
    description:
        'Secure ADR-compliant storage for hazardous goods (Classes 1–6, 8, 9). Licensed warehousing, Class 1 via partners. 3PL services, EXII/EXIII, DGSA oversight.',
};

export default function HazardousStoragePage() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-5 py-20 overflow-hidden">
            {/* 🌄 Background Image */}
            <div
                className="absolute inset-0 bg-[url('/haz-storage-bg.png')] bg-no-repeat bg-center bg-cover opacity-80"
                aria-hidden="true"
            />

            {/* 🧊 Frosted Container */}
            <div className="relative z-10 max-w-5xl w-full bg-white/85 rounded-xl p-10 shadow-xl backdrop-blur-md text-gray-800 space-y-6">
                <h1 className="text-4xl font-bold border-b-2 border-blue-500 pb-2">
                    Hazardous Goods Storage (Classes 1–6, 8 & 9)
                </h1>

                <p className="text-lg leading-relaxed">
                    <strong>ADR Carriers Ltd</strong> offers secure, compliant storage solutions for ADR-classified goods across the UK. We provide short- and long-term warehousing for Classes 2 through 6, 8, and 9 — as well as specialist <a href="/class-1-storage" className="text-blue-600 underline font-semibold">Class 1 explosives storage</a> via licensed third-party partners.
                </p>

                <p className="text-lg leading-relaxed">
                    Our 3PL warehousing services include inventory control, pick & pack, nationwide collection & delivery, and full DGSA oversight. With EXII and EXIII vehicle compliance, we support round-the-clock logistics — 24/7, 365 days a year — with certified ADR handling and security protocols.
                </p>

                <h2 className="text-2xl font-semibold mt-6">ADR Classes We Store</h2>
                <ul className="list-disc list-inside space-y-2 text-base pl-2">
                    <li><strong>Class 1:</strong> Explosives – via accredited storage partner (secured with EXII/EXIII logistics)</li>
                    <li><strong>Class 2:</strong> Gases – flammable, non-flammable, and toxic</li>
                    <li><strong>Class 3:</strong> Flammable liquids – fuels, solvents, etc.</li>
                    <li><strong>Class 4:</strong> Flammable solids and reactive materials</li>
                    <li><strong>Class 5:</strong> Oxidising agents and organic peroxides</li>
                    <li><strong>Class 6:</strong> Toxic substances (6.1)</li>
                    <li><strong>Class 8:</strong> Corrosives – acids, alkalis, detergents</li>
                    <li><strong>Class 9:</strong> Miscellaneous – lithium batteries, dry ice, etc.</li>
                </ul>

                <div className="text-sm italic text-red-600">
                    ⚠️ Note: Radioactive Class 7 goods are not stored at this time.
                </div>

                <h2 className="text-2xl font-semibold mt-8">3PL Warehouse Features</h2>
                <ul className="list-disc list-inside text-base space-y-2 pl-2">
                    <li>Pick & Pack fulfilment services for hazardous goods</li>
                    <li>Certified fire-rated & segregated storage zones</li>
                    <li>EXII/EXIII compliant vehicles for secure transport</li>
                    <li>24/7 collection and delivery across the UK & EU</li>
                    <li>On-site DGSA (Dangerous Goods Safety Advisor)</li>
                    <li>Full inventory traceability, CCTV and access control</li>
                </ul>

                <div className="text-center pt-4">
                    <a
                        href="/get-a-quote"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-md shadow transition"
                    >
                        Request Storage Quote →
                    </a>
                </div>
            </div>
        </section>
    );
}
