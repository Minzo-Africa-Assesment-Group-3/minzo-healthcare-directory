import Image from 'next/image';
import Link from 'next/link';
// import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { FaFacebook } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { FaXTwitter } from "react-icons/fa6";
import { TbBrandLinkedinFilled } from "react-icons/tb";

const columns = [
    {
        title: 'Explore',
        links: [
            { label: 'Hospitals', href: '/directory?category=hospitals' },
            { label: 'Doctors', href: '/directory?category=doctors' },
            { label: 'Pharmacies', href: '/directory?category=pharmacies' },
            { label: 'Labs', href: '/directory?category=labs' },
        ],
    },
    {
        title: 'For Organisations',
        links: [
            { label: 'Business sign in', href: '/login' },
            { label: 'Manage your profile', href: '/signup' },
        ],
    },
    {
        title: 'Help',
        links: [
            { label: 'Contact', href: '/#contact' },
            { label: 'FAQs', href: '/faqs' },
            { label: 'Report incident', href: '/report' },
            { label: 'Information', href: '/information' },
        ],
    },
];

// Replace the hrefs with Minzo's real profiles
const socials = [
    { label: 'Facebook', href: 'https://www.facebook.com/share/1DYBQPY7gS/', icon: FaFacebook },
    { label: 'Instagram', href: 'https://www.instagram.com/minzoafrica', icon: RiInstagramFill },
    // { label: 'X', href: '#', icon: FaXTwitter },
    // { label: 'LinkedIn', href: '#', icon: TbBrandLinkedinFilled },
];

export default function Footer() {
    return (
        <footer id="contact" className="scroll-mt-16 bg-white">
            <div className="mx-auto w-full max-w-6xl px-4 pt-12 sm:px-6 lg:px-8">
                <div className="grid gap-10 md:grid-cols-[1.2fr_2fr] md:gap-16">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center gap-2.5" aria-label="Minzo home">
                            <Image src="/minzologo.png" alt="" width={40} height={34} className="h-8 w-auto" />
                            <span className="text-xl font-bold text-[#0C486D]">Minzo</span>
                        </Link>
                        <p className="mt-3 text-sm text-gray-600">Better healthcare closer to you.</p>
                        <ul className="mt-5 flex items-center gap-4">
                            {socials.map(({ label, href, icon: Icon }) => (
                                <li key={label}>
                                    <a
                                        href={href}
                                        aria-label={label}
                                        target='_blank'
                                        className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0C486D] text-white transition-colors hover:bg-[#0a3b5a]"
                                    >
                                        <Icon className="h-3.5 w-3.5" aria-hidden />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Link columns: 2-up on mobile (Help wraps below), 3-up on desktop */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
                        {columns.map((col) => (
                            <nav key={col.title} aria-label={col.title}>
                                <h3 className="text-sm font-semibold text-[#0C486D]">{col.title}</h3>
                                <ul className="mt-4 space-y-3">
                                    {col.links.map((l) => (
                                        <li key={l.label}>
                                            <Link href={l.href} className="text-sm text-gray-600 transition-colors hover:text-[#0C486D]">
                                                {l.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        ))}
                    </div>
                </div>

                {/* Watermark */}
                <p
                    aria-hidden
                    className="mt-12 select-none text-center text-5xl font-bold tracking-[0.35em] text-[#D5E0E8] sm:text-7xl md:text-8xl"
                >
                    Minzo
                </p>
            </div>

            <div className="border-t border-gray-200 py-5 text-center text-xs text-gray-600">
                © {new Date().getFullYear()} Minzo. All rights reserved.
            </div>
        </footer>
    );
}
