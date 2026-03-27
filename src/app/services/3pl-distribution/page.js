export const metadata = {
    title: '3PL Hazardous Goods Storage & Distribution | ADR Carriers Ltd',
    description: 'Specialist 3PL storage and distribution of ADR Classes 2.3, 4, 5, 6, 7, 8 & 9 hazardous goods across the UK and Europe. Secure, compliant warehousing and logistics.',
};

export default function HazardousGoods3PLPage() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-5 py-20 overflow-hidden">
            {/* 🖼️ Background image */}
            <div
                className="absolute inset-0 bg-[url('/haz-warehouse-bg.jpg')] bg-no-repeat bg-center bg-cover opacity-80"
                aria-hidden="true"
            />

            {/* 🧊 Frosted Glass Container */}
            <div className="relative z-10 max-w-5xl w-full bg-white/80 rounded-xl p-10 shadow-xl backdrop-blur-md text-gray-800 space-y-6">
                <h1 className="text-3xl font-bold border-b-2 pb-2 border-blue-500">
                    3PL Storage & Distribution of Hazardous Goods
                </h1>

                <p className="text-lg leading-relaxed">
                    <strong>ADR Carriers Ltd</strong> provides expert third-party logistics (3PL) for regulated dangerous goods across the UK and Europe. We manage secure warehousing, inventory control, and nationwide distribution of ADR Classes:
                </p>

                <ul className="list-disc list-inside text-base space-y-2 pl-2">
                    <li><strong>Class 2.3</strong>: Toxic gases</li>
                    <li><strong>Class 4</strong>: Flammable solids & self-reactive substances</li>
                    <li><strong>Class 5</strong>: Oxidizers & organic peroxides</li>
                    <li><strong>Class 6</strong>: Toxic and infectious substances</li>
                    <li><strong>Class 8</strong>: Corrosive substances</li>
                    <li><strong>Class 9</strong>: Miscellaneous dangerous goods (including lithium batteries, dry ice, etc.)</li>
                </ul>

                <p className="text-lg leading-relaxed">
                    Our purpose-built EXII and EXIII-certified vehicles allow us to safely manage collection, storage, and onward distribution — from warehouse to final destination — meeting all DGSA and ADR regulations.
                </p>

                <p className="text-lg leading-relaxed">
                    Whether you require bulk pallet warehousing, temperature-controlled holding, or scheduled distribution, ADR Carriers Ltd offers a complete 3PL solution tailored for hazardous materials logistics.
                </p>

                <div className="text-center pt-4">
                    <a
                        href="/get-a-quote"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-md shadow transition"
                    >
                        Request a 3PL Quote →
                    </a>
                </div>
            </div>
        </section>
    );
}
