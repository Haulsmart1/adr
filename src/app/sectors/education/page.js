export const metadata = {
    title: 'Education Sector | ADR Carriers Ltd',
    description:
        'ADR-compliant transport of hazardous materials for universities, research labs, and educational institutions. Safe delivery of chemicals, batteries, and lab waste.',
};

export default function EducationSectorPage() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-5 py-20 overflow-hidden">
            {/* 🧪 Background Image */}
            <div
                className="absolute inset-0 bg-[url('/education-bg.jpg')] bg-no-repeat bg-center bg-cover opacity-80"
                aria-hidden="true"
            />

            {/* 🔲 Frosted Glass Container */}
            <div className="relative z-10 max-w-4xl w-full bg-white/60 rounded-xl p-10 shadow-xl backdrop-blur-sm text-gray-800">
                <h1 className="text-4xl font-bold border-b-2 pb-4 mb-6 text-center border-blue-500">
                    ADR Logistics for the Education Sector
                </h1>

                <p className="text-lg mb-4 leading-relaxed">
                    <strong>ADR Carriers Ltd</strong> provides fully compliant hazardous goods transport for the education sector — including universities, colleges, schools, and research institutions across the UK and EU.
                </p>

                <p className="text-lg mb-4 leading-relaxed">
                    Our ADR-certified fleet supports academic science departments, engineering faculties, and R&D laboratories with the safe delivery and collection of regulated substances. These include:
                    <strong> Class 3 flammables</strong>, <strong>Class 6 toxics</strong>, <strong>Class 8 corrosives</strong>, and
                    <strong> Class 9 lithium batteries</strong> used in devices and experiments.
                </p>

                <ul className="list-disc list-inside text-base space-y-2 mb-6">
                    <li>Compliant transport for laboratory and research chemicals</li>
                    <li>Delivery and return of solvents, reagents, and samples</li>
                    <li>Expert handling of lithium batteries (UN3480 / UN3090)</li>
                    <li>Collection of lab waste under Waste Carrier Licence</li>
                    <li>Serving schools, colleges, universities & private training centres</li>
                </ul>

                <p className="text-lg leading-relaxed mb-8">
                    With full DGSA oversight, secure documentation, and sector-experienced drivers, we support safe and timely hazardous goods logistics for the education industry.
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
