'use client';

import {
    TruckIcon,
    ShieldCheckIcon,
    GlobeEuropeAfricaIcon,
} from '@heroicons/react/24/outline';

export default function HomeHero() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-gradient-to-br from-gray-100 to-white overflow-hidden">
            {/* 🧠 If you want SEO content above the hero visually */}
            <div className="max-w-3xl text-gray-800 mb-10 text-left z-10">
                <h2 className="text-xl font-semibold">ADR & Hazardous Goods Courier Services Across the UK and Europe</h2>
                <p className="mt-2 text-sm">
                    ADR Carriers Ltd is a specialist hazardous goods courier providing compliant road transport...
                    {/* truncate or expand as needed */}
                </p>
            </div>

            {/* 🚚 Background image */}
            <div className="absolute inset-0 bg-[url('/truck-bg.jpg')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-white/20 backdrop-brightness-95" />

            {/* Hero Text */}
            <div className="relative z-10 max-w-3xl text-center animate-fade-in-up bg-white/40 backdrop-blur-md p-8 rounded-xl shadow-xl">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
                    ADR Hazardous Goods Couriers
                </h1>

                <p className="text-lg md:text-xl text-gray-700 mb-4">
                    At <strong>ADR Carriers Ltd</strong>, we specialize in the safe and compliant transport of hazardous goods...
                </p>

                {/* Icons */}
                <div className="flex justify-center gap-6 mb-10 text-blue-600">
                    <div className="flex flex-col items-center">
                        <TruckIcon className="w-8 h-8 mb-1" />
                        <span className="text-sm text-gray-700">EX Fleet</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <ShieldCheckIcon className="w-8 h-8 mb-1" />
                        <span className="text-sm text-gray-700">ADR Compliant</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <GlobeEuropeAfricaIcon className="w-8 h-8 mb-1" />
                        <span className="text-sm text-gray-700">UK & Europe</span>
                    </div>
                </div>

                <a
                    href="/get-a-quote"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md shadow-md transition transform hover:scale-105"
                >
                    Get a Quote →
                </a>
            </div>
        </section>
    );
}
