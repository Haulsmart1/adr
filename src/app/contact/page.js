import ContactForm from '../../components/ContactForm';

export const metadata = {
    title: 'Contact Us | ADR Carriers Ltd',
    description: 'Get in touch with ADR Carriers for courier services in the UK and Europe.',
};

export default function ContactPage() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-2 py-8 overflow-hidden">
            {/* 📷 Background image */}
            <div
                className="absolute inset-0 bg-[url('/contact-bg.jpg')] bg-cover bg-center"
                aria-hidden="true"
            />
            {/* 🔳 Overlay for readability */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

            {/* 🧾 Content container */}
            <div className="relative z 12 max-w-2xl w-full bg-white/20 backdrop-blur-md rounded-xl shadow-lg p-10">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
                    Contact ADR Carriers Ltd
                </h1>
                <p className="text-center text-gray-700 mb-8">
                    Fill in the form below and our team will respond quickly.
                </p>

                <ContactForm />
            </div>
        </section>
    );
}
