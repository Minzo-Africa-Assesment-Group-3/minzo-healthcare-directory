import Link from 'next/link';
import { Brain, Building2, ChevronRight, FlaskConical, Pill, Smile, Stethoscope } from 'lucide-react';

const services = [
    { label: 'Hospitals', slug: 'hospitals', icon: Building2 },
    { label: 'Doctors', slug: 'doctors', icon: Stethoscope },
    { label: 'Labs', slug: 'labs', icon: FlaskConical },
    { label: 'Pharmacies', slug: 'pharmacies', icon: Pill },
    { label: 'Dental care', slug: 'dental-care', icon: Smile },
    { label: 'Mental health', slug: 'mental-health', icon: Brain },
];

export default function ServicesSection() {
    return (
        <section id="services" className="scroll-mt-16 bg-white py-14 md:py-20">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-950 sm:text-3xl">What are you looking for?</h2>
                    <p className="mt-3 text-sm text-gray-700 sm:text-base">
                        Quick access to the healthcare services you need.
                    </p>
                </div>

                <ul className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-3 md:mt-12 md:grid-cols-3 md:gap-4">
                    {services.map(({ label, slug, icon: Icon }) => (
                        <li key={slug}>
                            <Link
                                href={`/directory?category=${slug}`}
                                className="group flex items-center gap-3 rounded-xl bg-[#EEF4EE] px-3 py-3.5 text-sm font-medium text-gray-900 transition-colors hover:bg-[#e2ede3] sm:px-4 md:py-5"
                            >
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D7E6D8] text-[#2F6B3F]">
                                    <Icon className="h-5 w-5" aria-hidden />
                                </span>
                                <span className="flex-1">{label}</span>
                                <ChevronRight className="h-4 w-4 text-gray-500 transition-transform group-hover:translate-x-0.5" aria-hidden />
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
