import Link from 'next/link'

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 bg-black px-6 py-4 text-white shadow-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between">

                <Link
                    href="/"
                    className="text-xl font-bold transition hover:text-gray-300"
                >
                    ADR Carriers Ltd
                </Link>

                <div className="flex items-center gap-6 text-sm font-medium">

                    <Link href="/services" className="transition hover:text-gray-300">
                        Services
                    </Link>

                    <Link href="/services/explosives" className="transition hover:text-gray-300">
                        Explosives
                    </Link>

                    <Link href="/services/radioactive" className="transition hover:text-gray-300">
                        Radioactive
                    </Link>

                    <Link href="/services/customs" className="transition hover:text-gray-300">
                        Customs
                    </Link>

                    <Link href="/adr-resources" className="transition hover:text-gray-300">
                        Resources
                    </Link>

                    <Link href="/subcontractor-register" className="transition hover:text-gray-300">
                        Subcontractors
                    </Link>

                    <Link href="/employment" className="transition hover:text-gray-300">
                        Careers
                    </Link>

                    <Link href="/policy" className="transition hover:text-gray-300">
                        Policies
                    </Link>

                    <Link href="/contact" className="transition hover:text-gray-300">
                        Contact
                    </Link>

                    {/* magic link admin login */}
                    <Link
                        href="/admin/login"
                        className="text-xs text-gray-400 transition hover:text-white"
                    >
                        Admin
                    </Link>

                </div>

            </div>
        </nav>
    )
}