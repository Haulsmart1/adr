// components/Footer.js
export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white p-6 mt-12 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} ADR Carriers Ltd. All rights reserved.</p>
            <p>
                <a href="/privacy-policy" className="underline">Privacy Policy</a>
            </p>
        </footer>
    )
}
