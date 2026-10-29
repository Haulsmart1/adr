export const metadata = {
    alternates: { canonical: "https://adrcarriers.com/adr-resources" },
    title: 'ADR Resources | Dangerous Goods Regulations & Authorities',
    description:
        'Official ADR resources, regulatory bodies, and dangerous goods compliance information for UK and Europe.',
}

const resources = {
    "UK Regulatory Bodies": [
        {
            name: "Health and Safety Executive (HSE)",
            url: "https://www.hse.gov.uk",
        },
        {
            name: "Department for Transport (DfT)",
            url: "https://www.gov.uk/government/organisations/department-for-transport",
        },
        {
            name: "Driver and Vehicle Standards Agency (DVSA)",
            url: "https://www.gov.uk/government/organisations/driver-and-vehicle-standards-agency",
        },
        {
            name: "Environment Agency",
            url: "https://www.gov.uk/government/organisations/environment-agency",
        },
    ],

    "ADR & European Regulations": [
        {
            name: "UNECE ADR Agreement",
            url: "https://unece.org/transport/dangerous-goods/adr",
        },
        {
            name: "European Commission Transport DG",
            url: "https://transport.ec.europa.eu",
        },
        {
            name: "European Chemicals Agency (ECHA)",
            url: "https://echa.europa.eu",
        },
    ],

    "International Dangerous Goods Authorities": [
        {
            name: "IATA Dangerous Goods Regulations",
            url: "https://www.iata.org/en/programs/cargo/dgr/",
        },
        {
            name: "ICAO Technical Instructions",
            url: "https://www.icao.int/safety/DangerousGoods",
        },
        {
            name: "IMO IMDG Code",
            url: "https://www.imo.org/en/OurWork/Safety/Pages/DangerousGoods-default.aspx",
        },
    ],

    "Guidance & Safety Information": [
        {
            name: "UN Recommendations on Dangerous Goods",
            url: "https://unece.org/transport/dangerous-goods/un-model-regulations",
        },
        {
            name: "UK Dangerous Goods Emergency Action Codes",
            url: "https://www.ncec.com",
        },
        {
            name: "Chemical Hazards Emergency Medical Management (CHEMM)",
            url: "https://chemm.hhs.gov",
        },
    ],
}

export default function ADRResourcesPage() {
    return (
        <main className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-5xl mx-auto">

                <h1 className="text-4xl font-bold mb-4 text-gray-900">
                    ADR & Dangerous Goods Resources
                </h1>
                <section className="my-8 bg-white rounded-xl p-6 text-gray-900">
                    <h2 className="text-2xl font-bold mb-4">Prepare your dangerous goods transport enquiry</h2>
                    <p className="mb-4">Provide collection and delivery addresses, dates and the required delivery window. Include the UN number, proper shipping name, class or division, packing group where applicable, package count and type, quantity, dimensions and gross weight.</p>
                    <p className="mb-4">For Class 1, include compatibility group and net explosive quantity. For lithium batteries, state chemistry, configuration and condition. For Class 7, supply material, activity and package details confirmed by the consignor or competent adviser. Explain any missing information and the available loading equipment.</p>
                    <p>Use current official rules and competent advice for classification and shipment preparation. This website is enquiry guidance, not a determination of compliance or acceptance. <a className="underline font-semibold" href="/get-a-quote">Discuss your shipment</a>.</p>
                </section>


                <p className="text-gray-600 mb-10">
                    Useful links to official regulatory bodies, legislation and guidance
                    relating to ADR hazardous goods transport in the UK and Europe.
                </p>

                {Object.entries(resources).map(([category, links]) => (
                    <section key={category} className="mb-10">

                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                            {category}
                        </h2>

                        <div className="grid gap-3">

                            {links.map((link) => (
                                <a
                                    key={link.url}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition hover:border-gray-300"
                                >
                                    {link.name}
                                </a>
                            ))}

                        </div>

                    </section>
                ))}

            </div>
        </main>
    )
}