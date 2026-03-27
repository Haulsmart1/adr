'use client';

import { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

export default function ContactForm() {

    const [form, setForm] = useState({
        name: '',
        email: '',
        message: '',
    });

    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    // initialise EmailJS once
    useEffect(() => {

        if (!PUBLIC_KEY) {
            console.error('Missing EmailJS public key');
            return;
        }

        emailjs.init({
            publicKey: PUBLIC_KEY
        });

    }, []);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);
        setStatus('');

        try {

            if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {

                throw new Error('EmailJS environment variables missing');

            }

            const response = await emailjs.send(

                SERVICE_ID,
                TEMPLATE_ID,
                {
                    name: form.name,
                    email: form.email,
                    message: form.message
                }

            );

            console.log('EmailJS success', response);

            setStatus('✅ Message sent successfully');

            setForm({
                name: '',
                email: '',
                message: ''
            });

        } catch (error) {

            console.error('EmailJS error', error);

            setStatus(
                `❌ Failed to send message: ${error?.text ||
                error?.message ||
                'Unknown error'
                }`
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >

            <div>

                <label className="block text-sm font-medium mb-1">

                    Name

                </label>

                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md"
                />

            </div>


            <div>

                <label className="block text-sm font-medium mb-1">

                    Email

                </label>

                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md"
                />

            </div>


            <div>

                <label className="block text-sm font-medium mb-1">

                    Message

                </label>

                <textarea
                    name="message"
                    rows="5"
                    value={form.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md"
                />

            </div>


            <button

                type="submit"

                disabled={loading}

                className="bg-blue-600 text-white px-6 py-2 rounded-md disabled:opacity-50"

            >

                {loading ? 'Sending...' : 'Send Message'}

            </button>


            {status && (

                <p className="text-sm mt-4">

                    {status}

                </p>

            )}

        </form>

    );

}