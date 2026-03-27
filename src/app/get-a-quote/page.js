'use client';

import { useState } from 'react';

export default function GetAQuotePage() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        details: '',
    });

    const [status, setStatus] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSending) return;

        setIsSending(true);
        setStatus('');

        try {
            const response = await fetch('/api/send-quote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setStatus('Quote request sent successfully!');
                setForm({
                    name: '',
                    email: '',
                    phone: '',
                    details: '',
                });
            } else {
                setStatus(result.message || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error(error);
            setStatus('Something went wrong. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center px-6 py-16 overflow-hidden">
            <div
                className="absolute inset-0 bg-[url('/quote-bg.jpg')] bg-cover bg-center opacity-80"
                aria-hidden="true"
            />

            <div className="absolute inset-0 bg-black/30" aria-hidden="true" />

            <div className="relative z-10 max-w-2xl w-full bg-white/90 shadow-lg rounded-lg p-8">
                <h1 className="text-3xl font-bold text-center mb-6">Get a Quote</h1>
                <p className="text-center text-gray-700 mb-8">
                    Fill in your shipment details and our team will respond promptly with a tailored quote.
                </p>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="mt-1 w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Shipment Details</label>
                        <textarea
                            name="details"
                            value={form.details}
                            onChange={handleChange}
                            rows="5"
                            required
                            className="mt-1 w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSending}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-md transition"
                    >
                        {isSending ? 'Sending...' : 'Submit Request'}
                    </button>

                    {status && (
                        <p className="text-center text-sm mt-4 text-gray-700">{status}</p>
                    )}
                </form>
            </div>
        </section>
    );
}