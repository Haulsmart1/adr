// app/privacy-policy/page.js
export const metadata = {
    title: 'Privacy Policy | ADR Carriers Ltd',
    description: 'Learn how we collect, use, and protect your personal data at ADR Carriers Ltd.',
}

export default function PrivacyPolicyPage() {
    return (
        <section className="relative min-h-screen flex items-center justify-center bg-gray-5 overflow-hidden">
            {/* 🌄 Background Image */}
            <div className="absolute inset-0 bg-[url('/privacy-bg.jpg')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />

            {/* 📄 Content Container */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-2 bg-white/2 backdrop-blur-md rounded-lg shadow-lg text-gray-800 space-y-6 animate-fade-in-up">
                <h1 className="text-3xl md:text-4xl font-bold border-b-2 pb-2 border-gray-300">
                    Privacy Policy
                </h1>

                <p className="text-lg leading-relaxed">
                    We respect your privacy. This page outlines how we collect, use, and protect your data. We do not share your information with third parties without your explicit consent.
                </p>

                <div className="space-y-6 text-base leading-relaxed">
                    <div>
                        <h2 className="text-xl font-semibold mt-4">1. What Data We Collect</h2>
                        <ul className="list-disc list-inside pl-4">
                            <li>Contact details: name, email, phone number</li>
                            <li>Message contents submitted through our contact form</li>
                            <li>Cookies and usage data for analytics</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mt-4">2. How We Use Your Data</h2>
                        <ul className="list-disc list-inside pl-4">
                            <li>To respond to your inquiries</li>
                            <li>To provide logistics services and quotes</li>
                            <li>To improve website performance and usability</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mt-4">3. Your Rights</h2>
                        <p>
                            You may request access, correction, or deletion of your personal data at any time.
                            Contact us via the information on our{' '}
                            <a href="/contact" className="text-blue-600 underline hover:text-blue-800 transition">
                                Contact page
                            </a>.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mt-4">4. Cookie Usage</h2>
                        <p>
                            Our site uses cookies to enhance the user experience. By using our site, you agree to the use of cookies in accordance with this policy.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mt-4">5. Data Retention</h2>
                        <p>
                            Data is retained only as long as necessary for business or legal purposes and then securely deleted.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
