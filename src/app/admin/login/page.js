'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function MagicLinkLoginForm() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)
        setMessage('')
        setError('')

        try {
            const supabase = createClient()

            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            })

            if (error) throw error

            setMessage('Magic link sent. Check your email.')
        } catch (err) {
            setError(err.message || 'Failed to send magic link.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">

                <h1 className="text-2xl font-bold text-gray-900">
                    Admin Login
                </h1>

                <p className="mt-2 text-sm text-gray-600">
                    Enter your admin email to receive a secure login link.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Email address
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="your@email.com"
                            required
                            className="w-full rounded-lg border border-gray-300 p-3 focus:border-black focus:outline-none"
                        />
                    </div>

                    {message && (
                        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60"
                    >
                        {loading ? 'Sending link...' : 'Send magic link'}
                    </button>

                </form>

                <p className="mt-6 text-xs text-gray-400">
                    Secure admin access via Supabase authentication
                </p>

            </div>
        </main>
    )
}