'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Find care', href: '/listings' },
    { label: 'About', href: '/#about' },
    // { label: 'Explore services', href: '/#services' },
    { label: 'Contact', href: '/#contact' },
];

function Brand() {
    return (
        <Link href="/" className="flex items-center gap-2.5" aria-label="Minzo home">
            <Image src="/minzologo.png" alt="" width={32} height={28} priority className="h-7 w-auto" />
            <span className="text-lg font-bold text-[#0C486D]">Minzo</span>
        </Link>
    );
}

export default function Navbar() {
    const [open, setOpen] = useState(false);

    // Lock page scroll while the mobile menu is open; close on Esc or when resizing to desktop
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
        const onResize = () => window.innerWidth >= 768 && setOpen(false);
        window.addEventListener('keydown', onKey);
        window.addEventListener('resize', onResize);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', onKey);
            window.removeEventListener('resize', onResize);
        };
    }, [open]);

    return (
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
            <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Brand />

                {/* Desktop links */}
                <nav aria-label="Main" className="hidden items-center gap-10 md:flex">
                    {navLinks.map((l) => (
                        <Link
                            key={l.label}
                            href={l.href}
                            className="text-sm text-gray-600 transition-colors hover:text-[#0C486D]"
                        >
                            {l.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop actions */}
                <div className="hidden items-center gap-3 md:flex">
                    <Link
                        href="/login"
                        className="rounded-full bg-[#E8EDF1] px-6 py-2.5 text-sm font-medium text-[#0C486D] transition-colors hover:bg-[#dbe3e9]"
                    >
                        Sign in
                    </Link>
                    <Link
                        href="/account-type"
                        className="rounded-full bg-[#0C486D] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0a3b5a]"
                    >
                        Get started
                    </Link>
                </div>

                {/* Mobile trigger */}
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    aria-label="Open menu"
                    aria-expanded={open}
                    className="p-1 text-gray-800 md:hidden"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Mobile overlay */}
            {open && (
                <div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-50 flex flex-col bg-white md:hidden">
                    <div className="flex h-16 items-center justify-between border-b border-gray-800 px-4">
                        <Brand />
                        <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="p-1 text-gray-900">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <nav aria-label="Mobile" className="mt-14 flex flex-col items-center gap-10">
                        {navLinks.map((l) => (
                            <Link
                                key={l.label}
                                href={l.href}
                                onClick={() => setOpen(false)}
                                className="text-base text-gray-500 hover:text-[#0C486D]"
                            >
                                {l.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="mx-auto mt-12 flex w-full max-w-68 flex-col gap-3 px-4">
                        <Link
                            href="/login"
                            onClick={() => setOpen(false)}
                            className="rounded-full bg-[#E8EDF1] py-4 text-center text-base text-[#0C486D]"
                        >
                            Sign in
                        </Link>
                        <Link
                            href="/account-type"
                            onClick={() => setOpen(false)}
                            className="rounded-full bg-[#0C486D] py-4 text-center text-base text-white"
                        >
                            Get started
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
