'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CookieConsent() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const consent = window.localStorage.getItem('cookie_consent')
        if (!consent) setVisible(true)
    }, [])

    const acceptCookies = () => {
        window.localStorage.setItem('cookie_consent', 'accepted')
        setVisible(false)
    }

    if (!visible) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-black p-4 text-white shadow-lg">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <p className="text-sm">
                    We use cookies to improve your experience. By continuing to use this site, you agree to our use of cookies.{' '}
                    <Link href="/cookie-policy" className="underline hover:text-gray-300">
                        Learn more
                    </Link>
                </p>

                <button
                    onClick={acceptCookies}
                    className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-200"
                >
                    Accept Cookies
                </button>
            </div>
        </div>
    )
}