'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, SearchX } from 'lucide-react';
import { serif } from '@/lib/fonts';
import { notify } from '@/lib/toast';
// import Navbar from '@/components/landing/navbar';
import { useBusiness } from './use-business';
import { useFollow } from './use-follow';
import { getOpenStatus } from './hours';
import type { BusinessDetail } from './types';
import BusinessHeader from './business-header';
import ProfileTabs, { type Tab } from './profile-tabs';
import AboutCard from './about-card';
import ServicesCard from './services-card';
import ReviewsCard, { CustomerReviews } from './reviews-card';
import ContactCard from './contact-card';
import HoursCard from './hours-card';
import Modal from './modal';
import ReviewForm from './review-form';
import MessageForm from './message-form';
import ProfileSkeleton from './profile-skeleton';
import { useBusinessReview } from '../../components/use-business-review';
import { businessService, DEFAULT_PAGE_SIZE } from '@/services/business.service';
import { AddReviews } from '@/types/business-types';

const TABS: Tab[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'services', label: 'Services' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'contact', label: 'Contact & hours', mobileOnly: true },
];

const outline =
    'inline-flex h-10 items-center rounded-full border border-[#0C486D] px-5 text-sm font-medium text-[#0C486D] transition-colors hover:bg-[#0C486D]/5';

function Shell({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    return (
        <div className={`${serif.className} min-h-dvh bg-white text-gray-900`}>
            {/* <Navbar /> */}
            <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mb-4 inline-flex items-center gap-1.5 rounded text-sm text-gray-600 hover:text-[#0C486D]"
                >
                    <ArrowLeft className="h-4 w-4" aria-hidden />
                    Back to results
                </button>
                {children}
            </main>
        </div>
    );
}

function Message({ icon: Icon, text, action }: { icon: typeof AlertCircle; text: string; action: React.ReactNode }) {
    return (
        <div role="alert" className="mx-auto mt-10 flex max-w-sm flex-col items-center gap-3 rounded-2xl bg-[#F5F7F8] px-6 py-12 text-center">
            <Icon className="h-7 w-7 text-gray-500" aria-hidden />
            <p className="text-sm text-gray-700">{text}</p>
            {action}
        </div>
    );
}

export default function BusinessProfile({ slug }: { slug: string }) {
    const router = useRouter();
    const [page] = useState(1);

    const { data, loading, error, notFound, refetch } = useBusiness(slug);
    const { data: reviews, refetch: reviewsRefetch } = useBusinessReview({
        pageNumber: page,
        pageSize: DEFAULT_PAGE_SIZE
    }, data?.id);

    if (loading) {
        return (
            <Shell>
                <ProfileSkeleton />
            </Shell>
        );
    }
    if (notFound) {
        return (
            <Shell>
                <Message
                    icon={SearchX}
                    text="We couldn’t find this business. It may have been removed or the link is incorrect."
                    action={<button type="button" onClick={() => router.back()} className={outline}>Go back</button>}
                />
            </Shell>
        );
    }
    if (error || !data) {
        return (
            <Shell>
                <Message
                    icon={AlertCircle}
                    text={`We couldn’t load this business. ${error ?? ''}`}
                    action={<button type="button" onClick={refetch} className={outline}>Try again</button>}
                />
            </Shell>
        );
    }

    return (
        <Shell>
            <ProfileContent key={data.id} business={data} refetch={refetch} reviews={reviews} reviewsRefetch={reviewsRefetch} />
        </Shell>
    );
}

function ProfileContent({ business, refetch, reviews, reviewsRefetch }: { business: BusinessDetail, refetch: () => void, reviews: CustomerReviews[], reviewsRefetch: () => void }) {
    const { toggle } = useFollow(business.id);
    const following = business?.isFollowedByCurrentUser;
    const [locationId, setLocationId] = useState(
        (business.locations.find((l) => l.isPrimary) ?? business.locations[0])?.id,
    );
    const [modal, setModal] = useState<null | 'review' | 'message'>(null);

    const location = business.locations.find((l) => l.id === locationId) ?? business.locations[0];

    useEffect(() => {
        document.title = `${business.displayName} | Minzo`;
    }, [business.displayName]);

    const status = useMemo(
        () => (location ? getOpenStatus(location.openingPeriods, location.timezone) : { state: 'unknown' as const, label: '' }),
        [location],
    );

    const rating = useMemo(() => {
        const base = business.rating;

        return {
            average: base.reviewCount > 0 ? base.averageRating : null,
            total: base.reviewCount,
        };
    }, [business.rating]);

    if (!location) {
        return <Message icon={AlertCircle} text="This business has no locations yet." action={null} />;
    }

    const onToggleFollow = () => {
        const next = toggle();
        notify.success(next ? `You’re following ${business.displayName}` : `You unfollowed ${business.displayName}`);
    };

    const submitReview = async (
        businessId: string,
        payload: AddReviews
    ) => {
        try {
            await businessService.addReviews(businessId, payload);

            notify.success('Review added successfully');
            setModal(null);
            reviewsRefetch();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <BusinessHeader
                business={business}
                location={location}
                rating={rating}
                status={status}
                refetch={refetch}
                following={following!}
                onToggleFollow={onToggleFollow}
                onMessage={() => setModal('message')}
            />

            {business.locations.length > 1 && (
                <div role="group" aria-label="Locations" className="mt-5 flex flex-wrap gap-2 px-1 sm:px-5">
                    {business.locations.map((l) => (
                        <button
                            key={l.id}
                            type="button"
                            aria-pressed={l.id === location.id}
                            onClick={() => setLocationId(l.id)}
                            className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${l.id === location.id
                                ? 'border-[#0C486D] bg-[#0C486D] font-medium text-white'
                                : 'border-gray-200 text-gray-700 hover:border-[#0C486D]/40'
                                }`}
                        >
                            {l.name}
                        </button>
                    ))}
                </div>
            )}

            <ProfileTabs tabs={TABS} />

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start">
                <div className="space-y-6">
                    <AboutCard business={business} location={location} />
                    <ServicesCard services={location.services} />
                    <ReviewsCard average={rating.average} total={rating.total} onAdd={() => setModal('review')} reviews={reviews} />
                </div>

                <aside id="contact" className="scroll-mt-32 space-y-6 lg:sticky lg:top-32">
                    <ContactCard business={business} location={location} />
                    <HoursCard location={location} status={status} />
                </aside>
            </div>

            <Modal open={modal === 'review'} title="Add review" onClose={() => setModal(null)} >
                <ReviewForm
                    onSubmit={async ({ rating, text, isAnonymous }) => {
                        await submitReview(business.id, {
                            stars: rating,
                            text,
                            isAnonymous,
                        });
                    }}
                />
            </Modal>
            <Modal open={modal === 'message'} title={`Message ${business.displayName}`} onClose={() => setModal(null)}>
                <MessageForm
                    onSubmit={() => {
                        setModal(null);
                        notify.success('Message sent');
                    }}
                />
            </Modal>
        </>
    );
}