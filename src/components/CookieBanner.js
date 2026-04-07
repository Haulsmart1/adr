'use client'

import { useEffect, useState } from 'react'

export default function CookieBanner() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent')
        if (!consent) setVisible(true)
    }, [])

    const acceptCookies = () => {
        localStorage.setItem('cookie_consent', 'accepted')
        setVisible(false)
    }

    if (!visible) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-4 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

                <p className="text-sm">
                    We use cookies to improve your experience. By using our website you agree to our use of cookies.
                </p>

                <button
                    onClick={acceptCookies}
                    className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                >
                    Accept Cookies
                </button>

            </div>
        </div>
    )
}