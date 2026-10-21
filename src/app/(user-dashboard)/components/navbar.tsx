import Link from 'next/link';
import Image from 'next/image';

function Brand() {
    return (
        <Link href="/" className="flex items-center gap-2.5" aria-label="Minzo home">
            <Image src="/minzologo.png" alt="" width={32} height={28} priority className="h-7 w-auto" />
            <span className="text-lg font-bold text-[#0C486D]">Minzo</span>
        </Link>
    );
}

export default function Navbar() {
    return (
        <header className="h-20 w-full bg-white">
            <div className="mx-auto flex h-full max-w-336 items-center justify-between px-6">
                <Brand />

                <div className="flex items-center gap-4 sm:gap-8">
                    <Link
                        href="/business/new"
                        className="flex items-center gap-3 font-(family-name:--font-roboto-slab) text-base text-gray-700 hover:text-[#0C486D]"
                    >
                        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
                            <path d="M3 22V9h7V2h11v20h-7v-5h-3v5zm3-3h2v-2H6zm0-4h2v-2H6zm5-4h2V9h-2zm0-4h2V5h-2zm4 0h2V5h-2zm0 4h2V9h-2zm0 4h2v-2h-2zm0 4h2v-2h-2z" />
                        </svg>
                        <span className="hidden sm:inline">List your business</span>
                    </Link>

                    {/* <div className="flex h-12.5 items-center gap-3 rounded-full border border-gray-200 bg-white px-3 sm:w-33.5 sm:justify-between sm:pl-5">
                        <button
                            type="button"
                            aria-label="Search"
                            className="cursor-pointer text-gray-600 hover:text-[#0C486D]"
                        >
                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" aria-hidden="true">
                                <circle cx="11" cy="11" r="7" />
                                <path d="M20 20l-3.5-3.5" />
                            </svg>
                        </button>
                    </div> */}
                    
                    <button
                        type="button"
                        aria-label="Account menu"
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#E3EBF1] text-[#0C486D]"
                    >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                            <circle cx="12" cy="8" r="4.5" />
                            <path d="M3.5 21c0-4.6 3.8-7 8.5-7s8.5 2.4 8.5 7z" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
}