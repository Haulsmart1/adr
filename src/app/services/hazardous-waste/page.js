export const metadata = {
    title: 'Hazardous Waste Carrier Services | ADR Waste Transport UK & Europe | ADR Carriers Ltd',
    description:
        'Specialist hazardous waste carriers licensed to transport chemical, biological, and radioactive waste under full ADR regulations across the UK and Europe.',
};

export default function HazardousWastePage() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-5 py-20 overflow-hidden">
            {/* 🌍 Background Image */}
            <div
                className="absolute inset-0 bg-[url('/haz-waste-bg.png')] bg-no-repeat bg-center bg-cover opacity-80"
                aria-hidden="true"
            />

            {/* 🧊 Frosted Glass Container */}
            <div className="relative z-10 max-w-5xl w-full bg-white/40 rounded-xl p-10 shadow-xl backdrop-blur-md text-gray-800 space-y-6">
                <h1 className="text-4xl font-bold border-b-2 border-blue-500 pb-2">
                    Hazardous Waste Carrier Services
                </h1>

                <p className="text-lg leading-relaxed">
                    <strong>ADR Carriers Ltd</strong> is a fully licensed and compliant hazardous waste carrier, offering nationwide and cross-border transport of regulated waste materials under ADR regulations.
                    We work closely with waste producers, environmental consultants, and regulatory bodies to ensure safe and traceable collection, handling, and delivery of hazardous waste across all nine ADR classes.
                </p>

                <h2 className="text-2xl font-semibold mt-8">What We Transport</h2>
                <ul className="list-disc list-inside space-y-2 text-base pl-2">
                    <li>Chemical waste (flammables, toxics, oxidisers, corrosives)</li>
                    <li>Expired or damaged ADR products and packaging</li>
                    <li>Contaminated materials, spill clean-up residues</li>
                    <li>Laboratory and pharmaceutical waste (including Class 6.2)</li>
                    <li>Radioactive waste (Class 7 – low and medium level)</li>
                    <li>Waste aerosols, batteries (UN3480/UN3090), pressurised gases</li>
                    <li>Clinical waste and rejected dangerous goods shipments</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-8">Licensed & Fully Compliant</h2>
                <p className="text-lg leading-relaxed">
                    We hold a valid <strong>Upper Tier Waste Carrier Licence</strong> and operate under the oversight of Dangerous Goods Safety Advisors (DGSA). All movements are fully documented with consignment notes, packing declarations, and route risk assessments.
                    Our vehicles are ADR-certified and equipped for secure transport of hazardous substances, including containment for spills and segregation systems.
                </p>

                <h2 className="text-2xl font-semibold mt-8">Why Choose ADR Carriers Ltd?</h2>
                <ul className="list-disc list-inside space-y-2 text-base pl-2">
                    <li>Environment Agency–licensed hazardous waste carrier</li>
                    <li>Experienced in Class 6.2 and Class 7 waste transport</li>
                    <li>Fleet of ventilated, spill-contained, and EX-certified vehicles</li>
                    <li>UK-wide collection and scheduled export to Europe & NI</li>
                    <li>Full ADR documentation and regulatory compliance</li>
                    <li>Same-day and emergency response available</li>
                </ul>

                <p className="text-lg mt-6">
                    From industrial clean-up operations to recurring clinical or radioactive waste collections, ADR Carriers Ltd ensures safe, legal, and efficient handling from origin to destination.
                </p>

                <div className="text-center pt-4">
                    <a
                        href="/get-a-quote"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-md shadow transition"
                    >
                        Request Waste Collection →
                    </a>
                </div>
            </div>
        </section>
    );
}
