'use client';

import { useEffect, useState } from 'react';

export interface Tab {
    id: string;
    label: string;
    mobileOnly?: boolean; // on lg+ this content is the always-visible sidebar
}

export default function ProfileTabs({ tabs }: { tabs: Tab[] }) {
    const [active, setActive] = useState(tabs[0].id);

    useEffect(() => {
        const desktop = window.matchMedia('(min-width: 1024px)');
        const els = tabs.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
        const io = new IntersectionObserver(
            (entries) =>
                entries.forEach((e) => {
                    if (!e.isIntersecting) return;
                    const tab = tabs.find((t) => t.id === e.target.id);
                    if (tab?.mobileOnly && desktop.matches) return;
                    setActive(e.target.id);
                }),
            { rootMargin: '-25% 0px -65% 0px' },
        );
        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, [tabs]);

    const go = (id: string) => {
        setActive(id);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <nav
            aria-label="Profile sections"
            className="sticky top-16 z-30 mt-6 flex gap-1 overflow-x-auto border-b border-gray-200 bg-white/95 backdrop-blur [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden"
        >
            {tabs.map((t) => (
                <button
                    key={t.id}
                    type="button"
                    onClick={() => go(t.id)}
                    aria-current={active === t.id ? 'true' : undefined}
                    className={`-mb-px shrink-0 border-b-2 px-3.5 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0C486D] ${t.mobileOnly ? 'lg:hidden' : ''
                        } ${active === t.id
                            ? 'border-[#0C486D] text-[#0C486D]'
                            : 'border-transparent text-gray-500 hover:text-gray-900'
                        }`}
                >
                    {t.label}
                </button>
            ))}
        </nav>
    );
}