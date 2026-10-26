'use client';

import { BadgeCheck, Heart, MapPin, MessageSquare, Star } from 'lucide-react';
import type { BusinessDetail, BusinessDetailLocation } from './types';
import type { OpenStatus } from './hours';
import { facilityMeta } from './facility-meta';
import { usersService } from '@/services/users.service';

interface Props {
    business: BusinessDetail;
    location: BusinessDetailLocation;
    rating: { average: number | null; total: number };
    status: OpenStatus;
    following: boolean;
    onToggleFollow: () => void;
    onMessage: () => void;
    refetch: () => void;
}

export default function BusinessHeader({ business: b, location: loc, rating, status, following, onMessage, refetch }: Props) {
    const { label, icon: Icon } = facilityMeta(loc.facilityType);
    const verified = b.verificationStatus === 'VERIFIED';

    const toggleFollowing = async (id: string) => {
        if (following === true) {
            try {
                await usersService.unFollowBusiness(id)
                refetch()
            } catch (error) {
                console.log(error)
            }
        } else {
            try {
                await usersService.followBusiness(id)
                refetch()
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <header>
            <div className="h-36 overflow-hidden rounded-2xl bg-linear-to-br from-[#9DB7C9] to-[#CFDBE4] sm:h-48 lg:h-56">
                {b.gallery.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={b.gallery.coverImage}
                        alt={`${b.displayName} building`}
                        className="h-full w-full object-cover"
                        onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
                    />
                ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={'/listings/dummy_hosp.webp'}
                        alt={`${b.displayName} building`}
                        className="h-full w-full object-cover"
                        onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
                    />

                )}
            </div>

            <div className="px-1 sm:flex sm:items-start sm:gap-5 sm:px-5">
                <span
                    aria-hidden
                    className="-mt-10 flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#E1EDE2] text-[#2F6B3F] shadow-sm sm:-mt-12 sm:h-28 sm:w-28"
                >
                    <Icon className="h-9 w-9 sm:h-12 sm:w-12" />
                </span>

                <div className="mt-3 min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                        <h1 className="text-xl font-bold leading-tight text-gray-950 sm:text-2xl">{b.displayName}</h1>
                        {verified && (
                            <>
                                <BadgeCheck className="mt-1 h-5 w-5 shrink-0 text-[#1B8A52]" aria-hidden />
                                <span className="sr-only">Verified</span>
                            </>
                        )}
                    </div>
                    <p className="mt-0.5 text-sm font-semibold text-[#0C486D] sm:text-base">{label}</p>

                    <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-gray-700">
                        <span className="inline-flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-gray-500" aria-hidden />
                            {loc.cityOrTown}, {loc.county} County
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
                            {rating.average !== null ? (
                                <>
                                    <strong className="font-semibold text-gray-950">{rating.average.toFixed(1)}</strong>
                                    <span className="text-gray-500">({rating.total.toLocaleString()} {rating.total === 1 ? 'review' : 'reviews'})</span>
                                </>
                            ) : (
                                <span className="text-gray-500">No reviews yet</span>
                            )}
                        </span>
                        {status.state !== 'unknown' && (
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.state === 'open' ? 'bg-[#E5F2EA] text-[#1B7A47]' : 'bg-gray-100 text-gray-600'
                                    }`}
                            >
                                <span className={`h-1.5 w-1.5 rounded-full ${status.state === 'open' ? 'bg-[#1B8A52]' : 'bg-gray-400'}`} aria-hidden />
                                {status.label}
                            </span>
                        )}
                    </div>
                </div>

                <div className="mt-4 flex gap-2 sm:mt-3 sm:shrink-0">
                    <button
                        type="button"
                        onClick={() => toggleFollowing(b.id)}
                        aria-pressed={following}
                        className={`inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full border px-5 text-sm font-semibold transition-colors sm:flex-none ${following
                            ? 'border-[#0C486D] bg-[#0C486D]/5 text-[#0C486D]'
                            : 'border-gray-300 text-gray-800 hover:border-[#0C486D] hover:text-[#0C486D]'
                            }`}
                    >
                        <Heart className={`h-4 w-4 ${following ? 'fill-[#d6336c] text-[#d6336c]' : ''}`} aria-hidden />
                        {following ? 'Following' : 'Follow'}
                    </button>
                    <button
                        type="button"
                        onClick={onMessage}
                        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-[#0C486D] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0a3b5a] sm:flex-none"
                    >
                        <MessageSquare className="h-4 w-4" aria-hidden />
                        Message
                    </button>
                </div>
            </div>
        </header>
    );
}