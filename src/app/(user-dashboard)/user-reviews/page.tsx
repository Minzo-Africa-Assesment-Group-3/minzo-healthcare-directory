'use client';

import { useState } from 'react';

type Review = {
    id: string;
    business: string;
    rating: number;
    date: string;
    body: string;
    visibility: 'name' | 'anonymous' | 'initials';
    counts: boolean;
};

const MOCK: Review[] = [
    {
        id: '1',
        business: 'Hope Valley Clinic',
        rating: 5,
        date: '12 Dec 2025',
        body: 'The nurses were patient and explained everything clearly. Short wait on Monday morning',
        visibility: 'name',
        counts: true,
    },
    {
        id: '2',
        business: 'Sunnydale Hospital',
        rating: 5,
        date: '12 Dec 2025',
        body: 'The staff was very attentive and the facilities were clean. Only a slight delay during peak hours.',
        visibility: 'anonymous',
        counts: true,
    },
    {
        id: '3',
        business: 'Greenwood Medical Center',
        rating: 5,
        date: '12 Dec 2024',
        body: 'Visited for a routine check-up, and the experience was smooth. Minimal waiting time on weekends.',
        visibility: 'initials',
        counts: false,
    },
];

const VISIBILITY_LABEL = {
    name: 'Posted with your name',
    anonymous: 'Anonymous feedback',
    initials: 'Posted with your initials',
} as const;

function Stars({ value }: { value: number }) {
    return (
        <div className="flex gap-1" role="img" aria-label={`${value} out of 5 stars`}>
            {Array.from({ length: 5 }, (_, i) => (
                <svg
                    key={i}
                    viewBox="0 0 24 24"
                    className={`h-5 w-5 ${i < value ? 'text-[#F26B0A]' : 'text-gray-200'}`}
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z" />
                </svg>
            ))}
        </div>
    );
}

function ReviewCard({ review, onDelete }: { review: Review; onDelete: () => void }) {
    return (
        <li className="rounded-xl border border-gray-100 bg-[#FAFAFA] px-6 py-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="font-(family-name:--font-roboto-slab) text-sm font-semibold text-gray-900">
                        {review.business}
                    </h3>
                    <div className="mt-1">
                        <Stars value={review.rating} />
                    </div>
                </div>
                <time className="shrink-0 text-sm font-medium text-gray-500">{review.date}</time>
            </div>

            <p className="mt-3 text-sm text-gray-900">{review.body}</p>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-3">
                    <span className="rounded-full bg-[#F1F1F1] px-5 py-3 text-sm font-medium text-gray-500">
                        {VISIBILITY_LABEL[review.visibility]}
                    </span>
                    <span
                        className={`rounded-full px-5 py-3 text-sm font-medium ${
                            review.counts
                                ? 'bg-[#EAF8F0] text-[#2E7D4F]'
                                : 'bg-[#FDF0E6] text-gray-600'
                        }`}
                    >
                        {review.counts ? 'Counts towards rating' : 'Older than 2 years no longer counts'}
                    </span>
                </div>
                <div className="flex items-center gap-6 pr-1 text-sm font-medium">
                    <button type="button" className="cursor-pointer text-gray-500 hover:text-gray-900">
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={onDelete}
                        className="cursor-pointer font-semibold text-[#D92D4A] hover:underline"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </li>
    );
}

export default function MyReviews() {
    const [reviews, setReviews] = useState(MOCK);

    return (
        <section className="rounded-2xl bg-white pb-6">
            <h2 className="border-b border-gray-100 px-6 py-5 font-(family-name:--font-roboto-slab) text-lg font-semibold text-gray-900">
                My Reviews
            </h2>

            {reviews.length === 0 ? (
                <p className="m-6 rounded-xl bg-[#FAFAFA] p-8 text-center text-sm text-gray-500">
                    You haven’t written any reviews yet.
                </p>
            ) : (
                <ul className="mt-6 flex flex-col gap-4 px-6">
                    {reviews.map((r) => (
                        <ReviewCard
                            key={r.id}
                            review={r}
                            onDelete={() => setReviews((prev) => prev.filter((x) => x.id !== r.id))}
                        />
                    ))}
                </ul>
            )}
        </section>
    );
}