'use client';

import { useState } from 'react';

export default function QuoteForm() {
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        shipmentDetails: '',
    });
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');

        try {
            const response = await fetch('https://formsubmit.co/ajax/stuart@adrcarriers.net', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    fullName: form.fullName,
                    email: form.email,
                    phone: form.phone,
                    shipmentDetails: form.shipmentDetails,
                    _subject: 'New Quote Request - ADR Carriers',
                    _template: 'table',
                    _captcha: 'false',
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed');
            }

            setStatus('✅ Quote request sent successfully!');
            setForm({
                fullName: '',
                email: '',
                phone: '',
                shipmentDetails: '',
            });
        } catch (error) {
            console.error(error);
            setStatus('❌ Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                    Full Name
                </label>
                <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                    Email Address
                </label>
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                    Phone Number
                </label>
                <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                    Shipment Details
                </label>
                <textarea
                    name="shipmentDetails"
                    rows={5}
                    value={form.shipmentDetails}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="text-center">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition disabled:opacity-50"
                >
                    {loading ? 'Sending...' : 'Submit Request'}
                </button>
            </div>

            {status && <p className="text-center text-sm mt-4">{status}</p>}
        </form>
    );
}