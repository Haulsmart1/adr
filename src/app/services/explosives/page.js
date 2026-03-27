export const metadata = {
    title: 'Explosives Courier | ADR Carriers Ltd',
    description: 'EXIII-certified courier services for ADR Class 1 explosives across UK & Europe.',
};

export default function ExplosivesPage() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
            {/* 🌄 Background Image */}
            <div
                className="absolute inset-0 bg-[url('/explosives-bg.jpg')] bg-cover bg-center"
                aria-hidden="true"
            />

            {/* 🔲 Frosted Glass Container */}
            <div className="relative z-10 max-w-5xl w-full bg-white/90 rounded-xl p-10 shadow-xl backdrop-blur-sm text-gray-800 space-y-6">
                <h1 className="text-3xl font-bold border-b-2 pb-2 border-gray-300">
                    Class 1 Explosives Courier
                </h1>

                <p className="text-lg leading-relaxed">
                    We specialize in the transportation of high-risk ADR Class 1 explosive materials across the UK and Europe using our certified EXIII fleet.
                    Each vehicle is built and maintained to the highest safety standards and operated by specially trained drivers.
                </p>

                <p className="text-lg leading-relaxed">
                    With decades of experience and deep regulatory knowledge, our logistics experts ensure that each shipment is fully compliant with ADR and IMDG protocols, including documentation and routing through approved corridors.
                </p>

                <ul className="list-disc list-inside space-y-2 text-base pl-2">
                    <li>EXIII-certified vehicle fleet</li>
                    <li>Class 1.1 to 1.6 explosive handling compliance</li>
                    <li>IMDG compliance for marine transport</li>
                    <li>Customs clearance & international routing support</li>
                </ul>
            </div>
        </section>
    );
}
