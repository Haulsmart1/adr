export const metadata = {
    title: 'Services | ADR Carriers Ltd',
    description:
        'Explore our hazardous goods courier services, including same-day pallet delivery, ADR logistics, lithium battery transport, 3PL warehousing, and hazardous waste carrier solutions.',
};

export default function ServicesPage() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-5 py-20 overflow-hidden">
            {/* 🌄 Background Image */}
            <div
                className="absolute inset-0 bg-[url('/services-bg.png')] bg-no-repeat bg-center bg-contain md:bg-[length:120%]"
                aria-hidden="true"
            />

            {/* 🔲 Frosted Glass Container */}
            <div className="relative z-10 max-w-6xl w-full bg-white/70 rounded-xl p-10 shadow-xl backdrop-blur-sm">
                <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12">
                    Our Specialist Services
                </h1>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {/* Existing service cards */}
                    <ServiceCard href="/services/express-europe-ni" title="Express Pallet Delivery">
                        Same-day and overnight pallet courier service across the UK, Europe & Northern Ireland — fully ADR-compliant for time-critical deliveries.
                    </ServiceCard>

                    <ServiceCard href="/services/adr-dangerous-goods" title="ADR Dangerous Goods (Class 1–9)">
                        Specialist transport of ADR Classes 1 to 9, including explosives, flammables, toxics, and corrosives — operated with EXII/EXIII-certified vehicles.
                    </ServiceCard>

                    <ServiceCard href="/services/3pl-distribution" title="Hazardous Goods 3PL Distribution">
                        End-to-end 3PL solutions for ADR freight: warehousing, inventory control, and scheduled delivery across the UK and Europe — fully DGSA-compliant.
                    </ServiceCard>

                    <ServiceCard href="/services/hazardous-storage" title="Hazardous Goods Storage">
                        Secure storage facilities for Classes 2.3, 4, 5, 6, 7, 8 & 9. Fire-rated, ventilated, and licensed warehouses monitored 24/7 with full ADR segregation.
                    </ServiceCard>

                    <ServiceCard href="/services/hazardous-waste" title="Hazardous Waste Carrier Service">
                        Registered hazardous waste carriers for compliant movement of chemical waste, contaminated materials, and expired stock — licensed by Environment Agency.
                    </ServiceCard>

                    <ServiceCard href="/services/lithium-transport" title="Lithium Battery Transport">
                        Road and air-compliant carriage of lithium-ion and lithium-metal batteries (UN3480/UN3090), including Class 9 handling under ADR and IATA regulations.
                    </ServiceCard>

                    <ServiceCard href="/services/lithium-storage" title="Lithium Battery Storage">
                        Fire-rated, monitored storage for lithium batteries — with specialist ventilation, segregation, and spill prevention for safe long-term warehousing.
                    </ServiceCard>

                    <ServiceCard href="/services/customs" title="Customs & Brexit Support">
                        Full documentation and customs clearance services for ADR and general freight — covering UK, EU, Northern Ireland & post-Brexit border protocols.
                    </ServiceCard>

                    <ServiceCard href="/sectors" title="Industries We Serve">
                        Learn how ADR Carriers supports offshore, marine, defence, petrochemical, utilities and healthcare sectors with fully compliant dangerous goods logistics.
                    </ServiceCard>
                </div>
            </div>
        </section>
    );
}

// 💡 Reusable Card Component
function ServiceCard({ href, title, children }) {
    return (
        <a
            href={href}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition block"
        >
            <h2 className="text-xl font-semibold mb-2 text-blue-700">{title}</h2>
            <p className="text-gray-600">{children}</p>
        </a>
    );
}
