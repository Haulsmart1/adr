import QuoteForm from '../../components/ContactForm';

export const metadata = {
    title: 'Get a Quote | ADR Carriers Ltd',
    description: 'Request a courier quote for ADR transport in the UK and Europe.',
};

export default function QuotePage() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-2 py-8 overflow-hidden">

            {/* background image */}
            <div
                className="absolute inset-0 bg-[url('/quote-bg.jpg')] bg-cover bg-center"
                aria-hidden="true"
            />

            {/* dark overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            {/* form container */}
            <div className="relative z-10 max-w-2xl w-full bg-white/85 rounded-xl shadow-xl p-10">

                <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
                    Get a Quote
                </h1>

                <p className="text-center text-gray-700 mb-6">
                    Fill in your shipment details and our team will respond promptly with a tailored quote.
                </p>

                <QuoteForm />

            </div>

        </section>
    );
}