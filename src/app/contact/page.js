import ContactForm from '../../components/ContactForm';

export const metadata = {
    alternates: { canonical: "https://adrcarriers.com/contact" },
    title: 'Contact Us | ADR Carriers Ltd',
    description: 'Get in touch with ADR Carriers for courier services in the UK and Europe.',
};

export default function ContactPage() {
    return (
        <section className="mx-auto max-w-3xl px-5 py-12">
            <div className="w-full">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
                    Contact ADR Carriers Ltd
                </h1>

                <p className="text-center text-gray-700 mb-6">
                    Discuss your shipment by phone, email or the form below. Acceptance and collection timing must be confirmed for your consignment.
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

                <p className="mb-6 text-center"><a className="underline break-words" href="mailto:stuart@adrcarriers.net">stuart@adrcarriers.net</a></p>
                <ContactForm />
            </div>
        </section>
    );
}