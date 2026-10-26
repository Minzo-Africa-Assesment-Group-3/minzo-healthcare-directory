import Link from 'next/link';
import { BadgeCheck, MapPin, Star } from 'lucide-react';
import type { Business } from '@/types/business-types';
import { facilityMeta } from './categories';

const MAX_CHIPS = 3;

export default function BusinessCard({ business: b }: { business: Business }) {
    const { label, icon: Icon } = facilityMeta(b.location.facilityType);
    const verified = b.verificationStatus === 'VERIFIED';
    const shown = b.services.slice(0, MAX_CHIPS);
    const hidden = b.services.slice(MAX_CHIPS);
    const { averageRating, reviewCount } = b.rating;

    return (
        <Link
            href={`/listings/${b.slug}`} // adjust to your detail route
            className="group flex h-full flex-col rounded-xl border border-gray-200 bg-white p-3.5 transition-all hover:-translate-y-0.5 hover:border-[#0C486D]/30 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C486D]"
        >
            <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E1EDE2] text-[#2F6B3F]">
                    <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <h3 title={b.displayName} className="line-clamp-2 text-sm font-semibold leading-snug text-gray-950 group-hover:text-[#0C486D]">
                            {b.displayName}
                        </h3>
                        {verified && (
                            <>
                                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#1B8A52]" aria-hidden />
                                <span className="sr-only">Verified</span>
                            </>
                        )}
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">{label}</p>
                </div>
            </div>

            <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-600">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden />
                <span className="truncate">
                    {b.location.cityOrTown}, {b.location.county} County
                </span>
            </p>

            {b.services.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Services">
                    {shown.map((s) => (
                        <li key={s.id} className="max-w-38 truncate rounded-full bg-[#F1F5F2] px-2.5 py-1 text-[11px] text-gray-700">
                            {s.name}
                        </li>
                    ))}
                    
                    {hidden.length > 0 && (
                        <li title={hidden.map((s) => s.name).join(', ')} className="rounded-full bg-[#F1F5F2] px-2.5 py-1 text-[11px] font-medium text-[#0C486D]">
                            +{hidden.length}
                        </li>
                    )}
                </ul>
            )}

            <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
                {averageRating !== null ? (
                    <span className="inline-flex items-center gap-1 font-medium text-gray-900">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
                        {averageRating.toFixed(1)}
                        <span className="font-normal text-gray-500">({reviewCount})</span>
                    </span>
                ) : (
                    <span className="text-gray-400">No reviews yet</span>
                )}
                {b.distanceKm !== null && <span className="text-gray-500">{b.distanceKm.toFixed(1)} km away</span>}
            </div>
        </Link>
    );
}