import '../styles/globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CookieConsent from '../components/CookieConsent'

export const metadata = {
    title: 'ADR Hazardous Goods Couriers United Kingdom & Europe',
    description:
        'ADR Carriers provides secure, compliant transport for hazardous goods across UK & Europe. EX-certified fleet, express delivery, customs support.',
    icons: {
        icon: '/icon.png',
        shortcut: '/icon.png',
        apple: '/icon.png',
    },
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Navbar />
                <main className="bg-white text-gray-900">
                    {children}
                </main>
                <Footer />
                <CookieConsent />
            </body>
        </html>
    )
}