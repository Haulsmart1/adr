// src/components/Navbar.js
import Link from 'next/link'

export default function Navbar() {
    return (
        <nav className="bg-black text-white px-6 py-4 shadow-md sticky top-0 z-50">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                <Link href="/" className="text-xl font-bold hover:text-gray-300 transition">
                    ADR Carriers Ltd
                </Link>
                <div className="space-x-6 text-sm font-medium">
                    <Link href="/services" className="hover:text-gray-300 transition">Services</Link>
                    <Link href="/services/explosives" className="hover:text-gray-300 transition">Explosives</Link>
                    <Link href="/services/radioactive" className="hover:text-gray-300 transition">Radioactive</Link>
                    <Link href="/services/customs" className="hover:text-gray-300 transition">Customs</Link>
                    <Link href="/contact" className="hover:text-gray-300 transition">Contact</Link>
                </div>
            </div>
        </nav>
    )
}
