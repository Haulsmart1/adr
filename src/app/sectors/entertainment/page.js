export const metadata = {
    title: 'Entertainment & Events | ADR Carriers Ltd',
    description: 'Hazardous materials transport for film sets, stage pyrotechnics, and touring production teams.',
};

export default function EntertainmentSectorPage() {
    return (
        <section
            className="relative min-h-screen bg-cover bg-center bg-no-repeat py-16 px-6"
            style={{
                backgroundImage: "url('/images/fireworks.jpg')", // 🔁 Make sure this file exists in /public/images/
            }}
        >
            <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-10 space-y-8 text-gray-800">
                <h1 className="text-3xl md:text-4xl font-bold border-b-2 pb-3 border-gray-300">
                    Entertainment & Events
                </h1>

                <p className="text-lg leading-relaxed">
                    <strong>ADR Carriers Ltd</strong> provides compliant hazardous goods logistics for the entertainment industry — supporting film sets, concert tours, stage productions, and broadcast events across the UK and Europe.
                </p>

                <p className="text-lg leading-relaxed">
                    Our expertise covers the safe transport of <strong>pyrotechnics</strong>, <strong>compressed gases</strong>, and <strong>lithium-powered AV gear</strong>. We regularly handle explosives classified under{' '}
                    <strong className="text-red-600">Class 1.4G</strong> and <strong className="text-red-600">1.4C</strong>, such as theatrical fireworks, flares, and effect cartridges, in full compliance with{' '}
                    <a href="/services/explosives" className="text-blue-700 underline hover:text-blue-900 transition">
                        ADR Dangerous Goods regulations
                    </a>.
                </p>

                <ul className="list-disc list-inside space-y-2 text-base pl-2">
                    <li>Transport of pyrotechnics and propellants (1.4G / 1.4C)</li>
                    <li>Movement of lighting gases, flame effects & cryogenics</li>
                    <li>Lithium-ion battery transport for broadcast & AV equipment</li>
                    <li>Waste collections from production sites and venues</li>
                    <li>Support for major festivals, live shows, and film locations</li>
                </ul>

                <p className="text-lg leading-relaxed">
                    With certified ADR vehicles and security-cleared drivers, we’re a trusted partner for production teams and technical crews requiring discreet, on-time, and regulation-ready transport services.
                </p>

                <div className="pt-4 text-center">
                    <a
                        href="/get-a-quote"
                        className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-md shadow hover:bg-blue-700 transition"
                    >
                        Request a Quote
                    </a>
                </div>
            </div>
        </section>
    );
}
