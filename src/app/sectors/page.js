export const metadata = {
    title: 'Sectors | ADR Carriers Ltd',
    description:
        'ADR Carriers Ltd supports critical sectors such as offshore, energy, healthcare, automotive, defence, and more — with safe and compliant dangerous goods logistics.',
};

export default function SectorsPage() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-5 py-20 overflow-hidden">
            {/* 🌄 Background Image */}
            <div
                className="absolute inset-0 bg-[url('/services-bg.png')] bg-no-repeat bg-center bg-contain md:bg-[length:120%]"
                aria-hidden="true"
            />

            {/* 🔲 Frosted Glass Container */}
            <div className="relative z-10 max-w-7xl w-full bg-white/80 rounded-xl p-10 shadow-2xl backdrop-blur">
                <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12">
                    Sectors We Serve
                </h1>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {sectorCards.map(({ href, title, description }) => (
                        <a
                            key={href}
                            href={href}
                            className="block bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 ease-in-out"
                        >
                            <h2 className="text-xl font-semibold text-blue-700 mb-2">{title}</h2>
                            <p className="text-gray-600">{description}</p>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}

// 🧩 Sector Cards Data
const sectorCards = [
    {
        href: "/sectors/offshore",
        title: "Offshore Energy",
        description: "ADR logistics for rigs, wind farms & platforms — time-critical Class 1–9 deliveries.",
    },
    {
        href: "/sectors/utilities",
        title: "Utilities & Infrastructure",
        description: "Batteries, corrosives & chemicals for power, water, and telecom upgrades.",
    },
    {
        href: "/sectors/petrochemical",
        title: "Petrochemical",
        description: "Transport of flammables, solvents, oxidisers & cylinders to refineries and terminals.",
    },
    {
        href: "/sectors/marine",
        title: "Marine & Port Logistics",
        description: "IMDG-compliant shipping and ADR support for vessels, docks, and offshore supply.",
    },
    {
        href: "/sectors/defence",
        title: "Defence & Aerospace",
        description: "Explosives and lithium logistics for MOD, aerospace contractors, and suppliers.",
    },
    {
        href: "/sectors/healthcare",
        title: "Healthcare & Biopharma",
        description: "Transport of cytotoxics, lab chemicals, waste & lithium-powered medical devices.",
    },
    {
        href: "/sectors/education",
        title: "Education & Research",
        description: "Safe ADR delivery of lab chemicals, gases, and hazardous kits to academic institutions.",
    },
    {
        href: "/sectors/automotive",
        title: "Automotive & EV",
        description: "Lithium batteries, airbags & Class 3 materials moved securely for OEMs & motorsport.",
    },
    {
        href: "/sectors/agriculture",
        title: "Agriculture",
        description: "Fertiliser, pesticide & chemical transport — ADR Class 3, 5, 6, and 8 covered.",
    },
    {
        href: "/sectors/energy",
        title: "Energy & Renewables",
        description: "Transport for hydrogen, solar, and large lithium storage cells for grid-scale supply.",
    },
    {
        href: "/sectors/entertainment",
        title: "Entertainment & Events",
        description: "Pyrotechnics, FX chemicals & compressed gases for shows, events, and venues.",
    },
    {
        href: "/sectors/sports",
        title: "Sports & Motorsport",
        description: "Fuel & lithium shipping for F1, touring cars, rally, cycling & endurance racing.",
    },
];
