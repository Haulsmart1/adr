export const metadata = {
    title: 'Offshore Energy | ADR Carriers Ltd',
    description: 'Specialist hazardous goods delivery to offshore oil, gas, and renewable platforms, including Class 2, 3, 5 and 8 materials.',
};

export default function OffshoreSectorPage() {
    return (
        <section className="relative min-h-screen px-5 py-20 flex items-center justify-center overflow-hidden">
            {/* 🌊 Background */}
            <div
                className="absolute inset-0 bg-[url('/rig.jpg')] bg-no-repeat bg-center bg-contain md:bg-[length:120%]"
                aria-hidden="true"
            />

            {/* 📦 Container */}
            <div className="relative z-10 max-w-5xl w-full bg-white/60 rounded-xl p-10 shadow-xl backdrop-blur">
                <h1 className="text-4xl font-bold text-gray-800 mb-6 border-b pb-2 border-gray-300">
                    Offshore Energy Logistics
                </h1>

                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    We provide compliant and secure transport of hazardous goods to offshore platforms and support vessels throughout Europe. From gas and oil to renewable installations, our expertise ensures materials arrive safely — by road, ferry, or vessel transfer.
                </p>

                <h2 className="text-2xl font-semibold text-blue-800 mt-6 mb-2">
                    Dangerous Goods for Offshore Use
                </h2>
                <p className="text-base text-gray-700 mb-4">
                    We regularly handle dangerous goods classes essential to offshore drilling and maintenance:
                </p>

                <ul className="list-disc list-inside space-y-2 text-gray-700 pl-4">
                    <li><strong>Class 1 (Explosives)</strong> – Small quantities of detonators and pyrotechnics (on approval)</li>
                    <li><strong>Class 2 (Gases)</strong> – Oxygen, acetylene, nitrogen, refrigerant gases</li>
                    <li><strong>Class 3 (Flammable Liquids)</strong> – Fuel additives, cleaning solvents, drilling lubricants</li>
                    <li><strong>Class 4.1 / 4.3</strong> – Pyrophoric solids, reactive metals for specialised operations</li>
                    <li><strong>Class 5.1 / 5.2</strong> – Thermite, peroxides, oxidising agents for emergency repair</li>
                    <li><strong>Class 8 (Corrosives)</strong> – Acids, cleaning chemicals, anti-fouling treatments</li>
                    <li><strong>Class 9 (Miscellaneous)</strong> – Lithium batteries for lighting, tools, and comms</li>
                </ul>

                <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-2">
                    Ports We Serve Across Europe
                </h2>
                <p className="text-base text-gray-700 mb-4">
                    ADR Carriers Ltd delivers to all major offshore staging and supply bases, including:
                </p>

                <ul className="list-disc list-inside space-y-1 pl-4 text-gray-700">
                    <li><strong>United Kingdom</strong> – Aberdeen, Peterhead, Great Yarmouth, Lerwick, Heysham</li>
                    <li><strong>Norway</strong> – Stavanger, Bergen, Hammerfest</li>
                    <li><strong>Netherlands</strong> – Den Helder, IJmuiden, Rotterdam (Europoort)</li>
                    <li><strong>Denmark</strong> – Esbjerg</li>
                    <li><strong>Germany</strong> – Cuxhaven, Emden</li>
                    <li><strong>France</strong> – Dunkirk, Cherbourg</li>
                    <li><strong>Ireland</strong> – Cork, Galway</li>
                </ul>

                <p className="text-base mt-6 text-gray-700">
                    We coordinate load transfers, ferry schedules, and compliance documentation through our DGSA and marine logistics team.
                </p>

                {/* 💬 Quote Link */}
                <div className="mt-10 text-center">
                    <a
                        href="/get-a-quote"
                        className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
                    >
                        Get a Quote for Offshore Delivery →
                    </a>
                </div>
            </div>
        </section>
    );
}

