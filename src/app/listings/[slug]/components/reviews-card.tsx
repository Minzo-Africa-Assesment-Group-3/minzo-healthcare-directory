'use client';

import { formatDate } from '@/lib/format';
import { CircleUserRound, MessageSquarePlus, Star } from 'lucide-react';

// Session-only review (no reviews endpoint yet)
export interface LocalReview {
    id: string;
    name: string;
    time: string;
    rating: number;
    text: string;
}

export interface CustomerReviews {
    id: string;
    businessId: string;
    stars: number;
    text: string;
    isAnonymous: boolean,
    mine: boolean,
    author: {
        displayName: string;
    },
    submittedAt: string;
    updatedAt: string;
}

interface Props {
    average: number | null;
    total: number;
    // reviews: LocalReview[];
    onAdd: () => void;
    reviews: CustomerReviews[]
}

function Stars({ value, size = 16 }: { value: number; size?: number }) {
    return (
        <span className="inline-flex gap-0.5" role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((i) => {
                const fill = Math.max(0, Math.min(1, value - (i - 1)));
                return (
                    <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
                        <Star className="absolute inset-0 text-gray-200" fill="currentColor" stroke="none" width={size} height={size} />
                        <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                            <Star className="text-amber-400" fill="currentColor" stroke="none" width={size} height={size} />
                        </span>
                    </span>
                );
            })}
        </span>
    );
}

export default function ReviewsCard({ average, total, reviews, onAdd }: Props) {
    return (
        <section id="reviews" className="scroll-mt-32 rounded-xl border border-gray-200 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-gray-950 sm:text-lg">Reviews</h2>
                <button
                    type="button"
                    onClick={onAdd}
                    className="inline-flex h-9 items-center gap-2 rounded-full bg-[#0C486D] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0a3b5a]"
                >
                    <MessageSquarePlus className="h-4 w-4" aria-hidden />
                    Add review
                </button>
            </div>

            {average === null ? (
                <div className="mt-4 rounded-xl bg-[#F6F8FA] px-4 py-8 text-center">
                    <Stars value={0} size={22} />
                    <p className="mt-3 text-sm font-medium text-gray-900">No reviews yet</p>
                    <p className="mt-1 text-sm text-gray-500">Be the first to share your experience.</p>
                </div>
            ) : (
                <div className="mt-4 flex items-center gap-5 rounded-xl bg-[#F6F8FA] px-5 py-4">
                    <p className="text-4xl font-medium text-gray-950">{average.toFixed(1)}</p>
                    <div className="flex flex-col gap-1.5">
                        <Stars value={average} size={20} />
                        <p className="text-sm text-gray-600">{total.toLocaleString()} {total === 1 ? 'review' : 'reviews'}</p>
                    </div>
                </div>
            )}

            {reviews.length > 0 && (
                <ul className="mt-4 space-y-3">
                    {reviews.map((r) => (
                        <li key={r.id}>
                            <article className="flex gap-3 rounded-xl border border-gray-200 p-4">
                                <CircleUserRound className="h-9 w-9 shrink-0 text-gray-500" strokeWidth={1.4} aria-hidden />
                                <div className="min-w-0 space-y-1.5">
                                    <div>
                                        {r.isAnonymous ? (
                                            <p className="text-sm font-semibold text-gray-950">Anonymous</p>
                                        ) : (
                                            <p className="text-sm font-semibold text-gray-950">{r.author.displayName}</p>
                                        )}
                                        <p className="text-xs text-gray-500">{formatDate(r.submittedAt)}</p>
                                    </div>
                                    <Stars value={r.stars} size={14} />
                                    <p className="text-sm leading-relaxed text-gray-800">{r.text}</p>
                                </div>
                            </article>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}