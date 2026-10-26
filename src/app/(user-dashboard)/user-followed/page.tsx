'use client';

import { useEffect, useState, useCallback } from 'react';
import { SectionCard } from '../components/ui';
import { usersService } from '@/services/users.service';
import { notify } from '@/lib/toast';

type Business = {
    id: string;
    name: string;
    category: string;
    location: string;
};

interface FollowedBizResponse {
    business: {
        id: string;
        displayName: string;
        slug: string;
        verificationStatus: string;
        isClaimed: boolean;
        location?: {
            id: string;
            name: string;
            facilityType: string;
            addressLine: string;
            county: string;
            cityOrTown: string;
            latitude: string | null;
            longitude: string | null;
            isPrimary: boolean;
        };
    };
    followedAt: string;
}

const abbr = (name: string) =>
    name
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join('');

function BusinessCard({ 
    business, 
    loading, 
    onUnfollow 
}: { 
    business: Business; 
    loading: boolean; 
    onUnfollow: () => void 
}) {
    return (
        <li className="rounded-xl border border-gray-100 bg-[#FAFAFA] p-6 flex flex-col justify-between">
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
                disabled={loading}
                className={`mt-6 h-12 cursor-pointer rounded-full border border-gray-100 bg-white px-8 text-base font-medium text-gray-600 transition-colors hover:bg-gray-50 ${!loading && "hover:text-red-600"} hover:border-red-100 disabled:opacity-50`}
            >
                {loading ? 'Please wait...' : 'Unfollow'}
            </button>
        </li>
    );
}

function BusinessCardSkeleton() {
    return (
        <li className="rounded-xl border border-gray-100 bg-[#FAFAFA] p-6 animate-pulse flex flex-col justify-between">
            <div className="flex items-center gap-4">
                <div className="h-16 w-16 shrink-0 rounded-xl bg-gray-200" />
                <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-gray-200" />
                    <div className="h-3 w-1/2 rounded bg-gray-200" />
                </div>
            </div>
            <div className="mt-6 h-12 w-full rounded-full bg-gray-200" />
        </li>
    );
}

export default function FollowedBusinesses() {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // Track the ID of the specific card currently loading
    const [unfollowingId, setUnfollowingId] = useState<string | null>(null);

    // Hoisted fetch function wrapped in useCallback so it can be called anywhere
    const fetchFollowedBusinesses = useCallback(async () => {
        try {
            const res: FollowedBizResponse[] = await usersService.getBusinessIFollow();

            const formatted: Business[] = res.map((item) => {
                const biz = item.business;
                const loc = biz.location;
                const locationString = loc
                    ? [loc.cityOrTown, loc.county].filter(Boolean).join(', ')
                    : 'Location unavailable';

                return {
                    id: biz.id,
                    name: biz.displayName,
                    category: loc?.facilityType || 'Business',
                    location: locationString,
                };
            });

            setBusinesses(formatted);
        } catch (error) {
            console.error(error);
            notify.error('Failed to load followed businesses');
            setBusinesses([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void fetchFollowedBusinesses();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [fetchFollowedBusinesses]);

    const handleUnfollow = async (id: string) => {
        setUnfollowingId(id);
        try {
            await usersService.unFollowBusiness(id);
            notify.success('Successfully unfollowed business');
            // Re-fetch the updated list from the backend
            await fetchFollowedBusinesses();
        } catch (error) {
            console.error(error);
            notify.error('Failed to unfollow business');
        } finally {
            setUnfollowingId(null);
        }
    };

    return (
        <SectionCard title="Followed Businesses" className="pb-8">
            {isLoading ? (
                <ul className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3].map((n) => (
                        <BusinessCardSkeleton key={n} />
                    ))}
                </ul>
            ) : businesses.length === 0 ? (
                <p className="mt-6 rounded-xl bg-[#FAFAFA] p-8 text-center text-sm text-gray-500">
                    You aren’t following any businesses yet. Follow a business to see it here.
                </p>
            ) : (
                <ul className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {businesses.map((b) => (
                        <BusinessCard
                            key={b.id}
                            business={b}
                            loading={unfollowingId === b.id}
                            onUnfollow={() => handleUnfollow(b.id)}
                        />
                    ))}
                </ul>
            )}
        </SectionCard>
    );
}