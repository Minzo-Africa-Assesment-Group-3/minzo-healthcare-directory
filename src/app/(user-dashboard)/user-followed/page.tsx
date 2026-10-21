'use client';

import { useState } from 'react';
import { SectionCard } from '../components/ui';

type Business = { id: string; name: string; category: string; location: string };

const MOCK: Business[] = [
    { id: '1', name: 'Hope Valley Clinic', category: 'Clinic', location: 'Location goes in here' },
    { id: '2', name: 'Hope Valley Clinic', category: 'Clinic', location: 'Location goes in here' },
    { id: '3', name: 'Hope Valley Clinic', category: 'Clinic', location: 'Location goes in here' },
];

const abbr = (name: string) =>
    name
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join('');

function BusinessCard({ business, onUnfollow }: { business: Business; onUnfollow: () => void }) {
    return (
        <li className="rounded-xl border border-gray-100 bg-[#FAFAFA] p-6">
            <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#EEF0F2] font-(family-name:--font-roboto-slab) text-lg font-semibold text-gray-900">
                    {abbr(business.name)}
                </div>
                <div className="min-w-0">
                    <p className="truncate font-(family-name:--font-roboto-slab) text-sm font-semibold text-gray-900">
                        {business.name}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                        <span>{business.category}</span>
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300" aria-hidden="true" />
                        <span className="truncate">{business.location}</span>
                    </p>
                </div>
            </div>
            <button
                type="button"
                onClick={onUnfollow}
                className="mt-4 h-12 cursor-pointer rounded-full border border-gray-100 bg-white px-8 text-base font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
                Unfollow
            </button>
        </li>
    );
}

export default function FollowedBusinesses() {
    const [items, setItems] = useState(MOCK);

    return (
        <SectionCard title="Followed Businesses" className="pb-8">
            {items.length === 0 ? (
                <p className="mt-6 rounded-xl bg-[#FAFAFA] p-8 text-center text-sm text-gray-500">
                    You aren’t following any businesses yet. Follow a business to see it here.
                </p>
            ) : (
                <ul className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {items.map((b) => (
                        <BusinessCard
                            key={b.id}
                            business={b}
                            onUnfollow={() => setItems((prev) => prev.filter((x) => x.id !== b.id))}
                        />
                    ))}
                </ul>
            )}
        </SectionCard>
    );
}