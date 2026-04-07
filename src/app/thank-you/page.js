export const metadata = {
    title: 'Thank You | ADR Carriers Ltd',
    description: 'Your form has been submitted successfully.',
}

export default function ThankYouPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">

            <div className="max-w-xl rounded-2xl bg-white p-8 text-center shadow-md">

                <h1 className="text-3xl font-bold text-gray-900">
                    Thank You
                </h1>

                <p className="mt-4 text-gray-600">
                    Your form has been submitted successfully.
                    A member of our team will review your information and contact you shortly.
                </p>

                <a
                    href="/"
                    className="mt-6 inline-block rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
                >
                    Return Home
                </a>

            </div>

        </main>
    )
}