import Image from 'next/image';
import { Search, ShieldCheck } from 'lucide-react';

export default function HeroSection() {
    return (
        <section id="home" className="relative isolate flex min-h-104 items-center overflow-hidden sm:min-h-128 lg:min-h-144">
            <Image
                src="/stetoscope.jpg"
                alt=""
                fill
                priority
                sizes="100vw"
                className="-z-20 object-cover"
            />
            {/* Contrast layer: deep navy wash so white text always clears WCAG AA, whatever the photo */}
            <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-linear-to-b from-[#0C486D]/90 via-[#0C486D]/80 to-[#0C486D]/90 md:bg-linear-to-r md:from-[#0C486D]/95 md:via-[#0C486D]/80 md:to-[#0C486D]/60"
            />

            <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
                    <span className="rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm sm:text-sm">
                        Healthcare, closer to you
                    </span>

                    <h1 className="mt-5 text-3xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                        Find the right care,
                        <br />
                        closer to home
                    </h1>

                    <p className="mt-5 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
                        Discover trusted healthcare professionals, hospitals, pharmacies and diagnostic services around you.
                    </p>

                    <form action="/directory" role="search" className="mt-8 w-full max-w-xl">
                        <label htmlFor="hero-search" className="sr-only">
                            Search doctors, hospitals, pharmacies
                        </label>
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-800" aria-hidden />
                            <input
                                id="hero-search"
                                name="q"
                                type="search"
                                placeholder="Search doctors, hospitals, pharmacies..."
                                className="h-12 w-full rounded-xl bg-white pl-12 pr-4 text-sm text-gray-900 shadow-lg placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-white/40 sm:h-14"
                            />
                        </div>
                    </form>

                    <p className="mt-5 flex items-center gap-2 text-sm text-white/90">
                        <ShieldCheck className="h-5 w-5 shrink-0" aria-hidden />
                        Explore healthcare services across your community.
                    </p>
                </div>
            </div>
        </section>
    );
}
