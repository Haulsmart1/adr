import ContactForm from '../../components/ContactForm';

export const metadata = {
    title: 'Contact Us | ADR Carriers Ltd',
    description: 'Get in touch with ADR Carriers for courier services in the UK and Europe.',
};

export default function ContactPage() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-2 py-8 overflow-hidden">
            <div
                className="absolute inset-0 bg-[url('/contact-bg.jpg')] bg-cover bg-center"
                aria-hidden="true"
            />

            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            <div className="relative z-10 max-w-2xl w-full bg-white/85 rounded-xl shadow-xl p-10">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
                    Contact ADR Carriers Ltd
                </h1>

                <p className="text-center text-gray-700 mb-6">
                    Fill in the form below and our team will respond quickly.
                </p>

                <div className="text-center text-gray-900 mb-8 leading-relaxed">
                    <p className="font-semibold">ADR Carriers Ltd</p>
                    <p>Church View</p>
                    <p>Newton, Arlosh</p>
                    <p>Wigton</p>
                    <p>CA7 5ET</p>

                    <p className="pt-2 font-medium">
                        Tel:
                        <a
                            href="tel:+448009991263"
                            className="text-blue-700 font-semibold ml-1 hover:underline"
                        >
                            +44 (0) 800 999 1263
                        </a>
                    </p>
                </div>

                <ContactForm />
            </div>
        </section>
    );
}