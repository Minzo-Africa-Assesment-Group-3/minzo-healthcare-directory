import Link from 'next/link';
import { ArrowRight, Building2, User } from 'lucide-react';

const audiences = [
    {
        title: 'For Individuals',
        text: 'Find care that fits you needs.',
        cta: 'Explore directory',
        href: '/directory',
        icon: User,
    },
    {
        title: 'For Healthcare Business',
        text: 'Keep your organisation’s information up to date.',
        cta: 'Manage your profile',
        href: '/signup',
        icon: Building2,
    },
];

export default function AudienceSection() {
    return (
        <section className="bg-white py-14 md:py-20">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-950 sm:text-3xl">Made for everyone</h2>
                    <p className="mt-3 text-sm text-gray-700 sm:text-base">Different needs. One trusted platform.</p>
                </div>

                <div className="mx-auto mt-8 grid max-w-4xl gap-5 md:mt-12 md:grid-cols-2 md:gap-6">
                    {audiences.map(({ title, text, cta, href, icon: Icon }) => (
                        <article
                            key={title}
                            className="mx-auto flex w-full max-w-sm flex-col items-center rounded-2xl bg-[#F5F7F8] p-6 text-center md:max-w-none md:p-8"
                        >
                            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E1EDE2] text-gray-900">
                                <Icon className="h-6 w-6" aria-hidden />
                            </span>
                            <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
                            <p className="mt-4 max-w-[15rem] flex-1 text-sm leading-relaxed text-gray-700">{text}</p>
                            <Link
                                href={href}
                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0C486D] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#0a3b5a]"
                            >
                                {cta}
                                <ArrowRight className="h-4 w-4" aria-hidden />
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
