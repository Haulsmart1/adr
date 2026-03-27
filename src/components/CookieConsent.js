// components/CookieConsent.js
'use client'
import { useState, useEffect } from 'react'

export default function CookieConsent() {
    const [show, setShow] = useState(false)

    useEffect(() => {
        const accepted = localStorage.getItem('cookieConsent')
        if (!accepted) setShow(true)
    }, [])

    const acceptCookies = () => {
        localStorage.setItem('cookieConsent', 'true')
        setShow(false)
    }

    if (!show) return null

    return (
        <div className="fixed bottom-0 w-full bg-gray-800 text-white p-4 text-sm flex justify-between items-center">
            <span>This website uses cookies to ensure the best experience.</span>
            <button onClick={acceptCookies} className="bg-white text-black px-3 py-1 ml-4">I Agree</button>
        </div>
    )
}
