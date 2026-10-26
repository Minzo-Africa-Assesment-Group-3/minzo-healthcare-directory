'use client';

import { AlertCircle, SearchX } from 'lucide-react';
import type { Business, Pagination as PaginationData } from '@/types/business-types';
import BusinessCard from './business-card';
import Pagination from './pagination';

interface Props {
    title: string;
    items: Business[];
    pagination: PaginationData | null;
    loading: boolean;
    error: string | null;
    onPageChange: (page: number) => void;
    onRetry: () => void;
    onClear: () => void;
}

const outline =
    'inline-flex h-9 items-center rounded-full border border-[#0C486D] px-4 text-sm font-medium text-[#0C486D] transition-colors hover:bg-[#0C486D]/5';

const grid = 'grid gap-3 sm:grid-cols-2 lg:grid-cols-3';

function SkeletonCard() {
    return (
        <div className="h-46 animate-pulse rounded-xl border border-gray-100 bg-white p-3.5">
            <div className="flex gap-3">
                <div className="h-10 w-10 rounded-lg bg-gray-100" />
                <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 w-3/4 rounded bg-gray-100" />
                    <div className="h-2.5 w-1/3 rounded bg-gray-100" />
                </div>
            </div>
            <div className="mt-4 h-2.5 w-1/2 rounded bg-gray-100" />
            <div className="mt-4 flex gap-2">
                <div className="h-5 w-16 rounded-full bg-gray-100" />
                <div className="h-5 w-20 rounded-full bg-gray-100" />
                <div className="h-5 w-14 rounded-full bg-gray-100" />
            </div>
        </div>
    );
}

export default function BusinessList({ title, items, pagination, loading, error, onPageChange, onRetry, onClear }: Props) {
    const firstLoad = loading && items.length === 0 && !error;

    return (
        <section id="results" aria-labelledby="results-title" className="scroll-mt-20 pb-14 pt-6">
            <div className="mb-4 flex items-baseline justify-between gap-3">
                <h2 id="results-title" className="text-lg font-semibold text-gray-950 sm:text-xl">
                    {title}
                </h2>
                {pagination && !error && (
                    <p className="text-xs text-gray-500" aria-live="polite">
                        {pagination.totalItems.toLocaleString()} {pagination.totalItems === 1 ? 'result' : 'results'}
                    </p>
                )}
            </div>

            {firstLoad ? (
                <div className={grid} aria-busy="true" aria-label="Loading businesses">
                    {Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : error ? (
                <div role="alert" className="flex flex-col items-center gap-3 rounded-xl bg-red-50 px-4 py-10 text-center">
                    <AlertCircle className="h-6 w-6 text-red-600" aria-hidden />
                    <p className="text-sm text-red-700">We couldn’t load businesses. {error}</p>
                    <button type="button" onClick={onRetry} className={outline}>Try again</button>
                </div>
            ) : items.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-xl bg-[#F5F7F8] px-4 py-12 text-center">
                    <SearchX className="h-6 w-6 text-gray-500" aria-hidden />
                    <p className="text-sm text-gray-700">No businesses match your search. Try another location or category.</p>
                    <button type="button" onClick={onClear} className={outline}>Clear search</button>
                </div>
            ) : (
                <>
                    <div className={`${grid} transition-opacity ${loading ? 'pointer-events-none opacity-50' : ''}`} aria-busy={loading}>
                        {items.map((b) => <BusinessCard key={b.id} business={b} />)}
                    </div>
                    {pagination && <Pagination pagination={pagination} onPageChange={onPageChange} disabled={loading} />}
                </>
            )}
        </section>
    );
}