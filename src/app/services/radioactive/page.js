export const metadata = {
    title: 'Radioactive Goods Courier | ADR Carriers Ltd',
    description: 'Safe, compliant transport of Class 7 radioactive materials including medical isotopes and X-ray equipment.',
};

export default function RadioactivePage() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
            {/* 🌄 Background Image */}
            <div
                className="absolute inset-0 bg-[url('/radioactive-bg.jpg')] bg-cover bg-center"
                aria-hidden="true"
            />

            {/* 🔲 Frosted Glass Container */}
            <div className="relative z-10 max-w-5xl w-full bg-white/70 rounded-xl p-10 shadow-xl backdrop-blur-sm text-gray-800 space-y-6">
                <h1 className="text-3xl font-bold border-b-2 pb-2 border-gray-300">
                    Class 7 Radioactive Courier
                </h1>

                <p className="text-lg leading-relaxed">
                    ADR Carriers Ltd offers highly secure and fully compliant transportation for Class 7 radioactive materials across the UK and Europe.
                    Our operations meet the strictest international safety standards.
                </p>

                <p className="text-lg leading-relaxed">
                    Our fleet is operated by a trained and HSE-registered team, ensuring proper handling, containment, and delivery of sensitive materials including:
                </p>

                <ul className="list-disc list-inside pl-4 text-base space-y-1">
                    <li>Medical isotopes (e.g., for cancer treatment)</li>
                    <li>Industrial X-ray machines</li>
                    <li>Density gauges</li>
                    <li>Nuclear medicine transport</li>
                </ul>

                <p className="text-lg leading-relaxed">
                    With EXII/EXIII-certified vehicles and expert route planning, we help clients meet all ADR and IMDG compliance regulations for dangerous goods.
                </p>
            </div>
        </section>
    );
}
