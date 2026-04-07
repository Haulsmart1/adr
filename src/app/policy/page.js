import Link from 'next/link'

const policies = [
    {
        title: 'Anti Bribery, Corruption and Fraud Policy',
        file: '/policy/Anti-Bribery-Corruption-and-Fraud-Policy.pdf',
    },
    {
        title: 'Anti Facilitation of Tax Evasion Policy',
        file: '/policy/Anti-Facilitation-of-Tax-Evasion-Policy.pdf',
    },
    {
        title: 'Carbon Management Policy',
        file: '/policy/Carbon-Management-Policy.pdf',
    },
    {
        title: 'Data Breach Response Procedure',
        file: '/policy/Data-Breach-Response-Procedure.pdf',
    },
    {
        title: 'Data Retention Schedule',
        file: '/policy/Data-Retention-Schedule.pdf',
    },
    {
        title: 'Data Subject Access Request',
        file: '/policy/Data-Subject-Access-Request.pdf',
    },
    {
        title: 'Energy Policy',
        file: '/policy/Energy-Policy.pdf',
    },
    {
        title: 'Environmental Policy',
        file: '/policy/Environmental-Policy.pdf',
    },
    {
        title: 'Equity, Diversity and Inclusion Policy',
        file: '/policy/Equity-Diversity-and-Inclusion-Policy.pdf',
    },
    {
        title: 'GDPR Policy',
        file: '/policy/GDPR-policy.pdf',
    },
    {
        title: 'Health and Safety Policy',
        file: '/policy/Health-and-Safety-Policy.pdf',
    },
    {
        title: 'Mobile Phone Policy',
        file: '/policy/Mobile-Phone.pdf',
    },
    {
        title: 'Modern Slavery and Human Trafficking Policy',
        file: '/policy/Modern-Slavery-and-Human-Trafficking-Policy.pdf',
    },
    {
        title: 'Quality Management Policy',
        file: '/policy/Quality-Management-Policy.pdf',
    },
    {
        title: 'Security Management Policy and Code',
        file: '/policy/Security-Management-Policy-and-Code.pdf',
    },
    {
        title: 'Subcontractor Terms and Conditions',
        file: '/policy/Subcontractor Terms and Conditions.pdf',
    },
    {
        title: 'Sustainable Procurement Policy',
        file: '/policy/Sustainable-Procurement-Policy.pdf',
    },
]

export default function PolicyPage() {
    return (
        <main className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Company Policies</h1>
                <p className="text-gray-600 mb-10">
                    View or download our policy documents below.
                </p>

                <div className="grid gap-4">
                    {policies.map((policy) => (
                        <div
                            key={policy.file}
                            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    {policy.title}
                                </h2>

                                <div className="flex gap-3">
                                    <Link
                                        href={policy.file}
                                        target="_blank"
                                        className="inline-block bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                                    >
                                        Open PDF
                                    </Link>

                                    <a
                                        href={policy.file}
                                        download
                                        className="inline-block border border-black text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                                    >
                                        Download
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}