'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CookieConsent() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const consent = (() => { try { return window.localStorage.getItem('cookie_consent') } catch { return null } })()
        if (!consent) setVisible(true)
    }, [])

    const acceptCookies = () => {
        try { window.localStorage.setItem('cookie_consent', 'accepted') } catch { /* Storage may be unavailable. */ }
        setVisible(false)
    }

    if (!visible) return null

    return (
        <div role="region" aria-label="Privacy information" className="border-t border-gray-700 bg-gray-950 p-4 text-white">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <p className="text-sm">
                    Read how we handle personal information and cookies.{' '}
                    <Link href="/privacy-policy" className="underline hover:text-gray-300">
                        Privacy and cookie information
                    </Link>
                </p>

                <button
                    onClick={acceptCookies}
                    className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-200"
                >
                    Dismiss notice
                </button>
            </div>
        </div>
    )
}