'use client';

import {
    TruckIcon,
    ShieldCheckIcon,
    GlobeEuropeAfricaIcon,
} from '@heroicons/react/24/outline';

export default function HomeHero() {
    return (
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-100 to-white px-4 py-20">
            <div className="absolute inset-0 bg-[url('/truck-bg.jpg')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-white/20 backdrop-brightness-95" />

            <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center">
                <div className="mb-10 max-w-3xl text-left text-gray-800">
                    <h2 className="text-xl font-semibold">
                        ADR & Hazardous Goods Courier Services Across the UK and Europe
                    </h2>
                    <p className="mt-2 text-sm">
                        ADR Carriers Ltd is a specialist hazardous goods courier providing compliant road transport.
                    </p>
                </div>

                <div className="max-w-3xl rounded-xl bg-white/40 p-8 text-center shadow-xl backdrop-blur-md">
                    <h1 className="mb-6 text-4xl font-extrabold leading-tight text-gray-800 md:text-5xl">
                        ADR Hazardous Goods Couriers
                    </h1>

                    <p className="mb-4 text-lg text-gray-700 md:text-xl">
                        At <strong>ADR Carriers Ltd</strong>, we specialize in the safe and compliant transport of hazardous goods.
                    </p>

                    <div className="mb-10 flex justify-center gap-6 text-blue-600">
                        <div className="flex flex-col items-center">
                            <TruckIcon className="mb-1 h-8 w-8" />
                            <span className="text-sm text-gray-700">EX Fleet</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <ShieldCheckIcon className="mb-1 h-8 w-8" />
                            <span className="text-sm text-gray-700">ADR Compliant</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <GlobeEuropeAfricaIcon className="mb-1 h-8 w-8" />
                            <span className="text-sm text-gray-700">UK & Europe</span>
                        </div>
                    </div>

                    <a
                        href="/get-a-quote"
                        className="inline-block rounded-md bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition hover:scale-105 hover:bg-blue-700"
                    >
                        Get a Quote →
                    </a>
                </div>
            </div>
        </section>
    );
}