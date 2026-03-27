export const metadata = {
    title: 'ADR Dangerous Goods Courier | Transport of Classes 1–9 | ADR Carriers Ltd',
    description: 'Certified ADR courier services for all 9 classes of hazardous goods. UK & Europe transport of explosives, flammables, corrosives, toxics, and more.',
};

export default function ADRDangerousGoodsPage() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-5 py-20 overflow-hidden">
            {/* 🌍 Background Image Layer */}
            <div
                className="absolute inset-0 bg-[url('/education-bg.jpg')] bg-no-repeat bg-center bg-cover opacity-80"
                aria-hidden="true"
            />

            {/* 🧊 Frosted Glass Container */}
            <div className="relative z-10 max-w-5xl w-full bg-white/80 rounded-xl p-10 shadow-xl backdrop-blur-md text-gray-800 space-y-6">
                <h1 className="text-4xl font-bold border-b-2 border-gray-300 pb-2">
                    ADR Dangerous Goods Transport (Class 1–9)
                </h1>

                <p className="text-lg leading-relaxed">
                    At <strong>ADR Carriers Ltd</strong>, we provide fully certified transportation services for all 9 classes of dangerous goods under the ADR (Accord Dangereux Routier) regulations. Our operations meet international safety standards for the secure movement of hazardous materials by road across the UK, Europe, Northern Ireland, and the Channel Islands.
                </p>

                <p className="text-lg leading-relaxed">
                    Whether you're shipping high-risk explosives or regulated chemical substances, we deliver complete compliance — from correct classification, labelling, and vehicle suitability to documentation and driver qualifications.
                </p>

                <h2 className="text-2xl font-semibold mt-8">Classes We Transport</h2>
                <ul className="list-disc list-inside space-y-2 text-base pl-2">
                    <li><strong>Class 1:</strong> <a href="/services/explosives" className="text-blue-700 underline hover:text-blue-900">Explosives</a> – including fireworks, ammunition, detonators (EXII / EXIII vehicles)</li>
                    <li><strong>Class 2:</strong> Gases – flammable (LPG), non-flammable, or toxic gases in cylinders or tanks</li>
                    <li><strong>Class 3:</strong> Flammable liquids – including fuels, solvents, and alcohols</li>
                    <li><strong>Class 4:</strong> Flammable solids, self-reactive and spontaneously combustible materials</li>
                    <li><strong>Class 5:</strong> Oxidising substances and organic peroxides</li>
                    <li><strong>Class 6:</strong> Toxic and infectious substances – including pesticides and biohazards</li>
                    <li><strong>Class 7:</strong> Radioactive materials – transported under strict security and HSE protocols</li>
                    <li><strong>Class 8:</strong> Corrosives – including battery acid, alkalis, and industrial cleaners</li>
                    <li><strong>Class 9:</strong> Miscellaneous dangerous goods – including lithium batteries, asbestos, and dry ice</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-8">Why Choose ADR Carriers Ltd?</h2>
                <ul className="list-disc list-inside space-y-2 text-base pl-2">
                    <li>EXII / EXIII vehicle fleet with full ADR equipment</li>
                    <li>Trained, qualified drivers with Class 1–9 coverage</li>
                    <li>DGSA oversight and compliance assurance</li>
                    <li>Route risk assessments and safe transit planning</li>
                    <li>Same-day and scheduled delivery options</li>
                    <li>UK-wide and cross-border operations</li>
                </ul>

                <p className="text-lg mt-6">
                    Every consignment is handled with strict adherence to ADR rules, giving our clients full peace of mind when transporting hazardous goods. Whether it’s a single drum or a multi-pallet load of mixed classes, we deliver secure and reliable service at every stage.
                </p>

                <div className="text-center pt-4">
                    <a
                        href="/get-a-quote"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-md shadow transition"
                    >
                        Get an ADR Transport Quote →
                    </a>
                </div>
            </div>
        </section>
    );
}
