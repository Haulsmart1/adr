'use client';

import { useRef, useState } from 'react';
import { ENQUIRY_LIMITS, validateEnquiry } from '@/lib/enquiryValidation';

export default function QuoteForm() {
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        shipmentDetails: '',
    });
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const submitting = useRef(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting.current) return;
        const values = validateEnquiry(form);
        if (!values) {
            setStatus('Please provide your name, a valid email and shipment details within the stated field limits.');
            return;
        }
        submitting.current = true;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000);
        setLoading(true);
        setStatus('');

        try {
            const response = await fetch('https://formsubmit.co/ajax/stuart@adrcarriers.net', {
                method: 'POST',
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    ...values,
                    _subject: 'New Quote Request - ADR Carriers',
                    _template: 'table',
                    _captcha: 'false',
                }),
            });

            const data = await response.json();

            if (!response.ok || data.success === false || data.success === 'false') {
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
            setStatus('❌ Something went wrong. Please try again.');
        } finally {
            clearTimeout(timeout);
            submitting.current = false;
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="quote-fullName" className="block text-sm font-medium text-gray-800 mb-1">
                    Full Name
                </label>
                <input
                    type="text"
                    id="quote-fullName"
                    autoComplete="name"
                    name="fullName"
                    maxLength={ENQUIRY_LIMITS.fullName}
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label htmlFor="quote-email" className="block text-sm font-medium text-gray-800 mb-1">
                    Email Address
                </label>
                <input
                    type="email"
                    id="quote-email"
                    autoComplete="email"
                    name="email"
                    maxLength={ENQUIRY_LIMITS.email}
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label htmlFor="quote-phone" className="block text-sm font-medium text-gray-800 mb-1">
                    Phone Number (optional)
                </label>
                <input
                    type="tel"
                    id="quote-phone"
                    autoComplete="tel"
                    name="phone"
                    maxLength={ENQUIRY_LIMITS.phone}
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label htmlFor="quote-shipmentDetails" className="block text-sm font-medium text-gray-800 mb-1">
                    Shipment Details
                </label>
                <textarea
                    id="quote-shipmentDetails"
                    name="shipmentDetails"
                    maxLength={ENQUIRY_LIMITS.shipmentDetails}
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

            {status && <p role="status" aria-live="polite" className="text-center text-sm mt-4">{status}</p>}
        </form>
    );
}