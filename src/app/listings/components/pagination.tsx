'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Pagination as PaginationData } from '@/types/business-types';

// 1 … 4 5 6 … 13
function pageList(current: number, total: number): (number | '…')[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = [...new Set([1, total, current - 1, current, current + 1])]
        .filter((p) => p >= 1 && p <= total)
        .sort((a, b) => a - b);
    const out: (number | '…')[] = [];
    pages.forEach((p, i) => {
        if (i > 0 && p - pages[i - 1] > 1) out.push('…');
        out.push(p);
    });
    return out;
}

const btn =
    'inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C486D] disabled:cursor-not-allowed disabled:opacity-40';

export default function Pagination({
    pagination: p,
    onPageChange,
    disabled,
}: {
    pagination: PaginationData;
    onPageChange: (page: number) => void;
    disabled?: boolean;
}) {
    const start = (p.pageNumber - 1) * p.pageSize + 1;
    const end = Math.min(p.pageNumber * p.pageSize, p.totalItems);

    return (
        <div className="mt-8 flex flex-col items-center gap-3">
            <p className="text-xs text-gray-500">
                Showing {start}–{end} of {p.totalItems}
            </p>

            {p.totalPages > 1 && (
                <nav aria-label="Pagination" className="flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={() => onPageChange(p.pageNumber - 1)}
                        disabled={disabled || !p.hasPreviousPage}
                        aria-label="Previous page"
                        className={`${btn} gap-1 border-gray-200 bg-white pr-3 text-gray-800 hover:bg-gray-50 cursor-pointer`}
                    >
                        <ChevronLeft className="h-4 w-4" aria-hidden />
                        <span className="hidden sm:inline">Previous</span>
                    </button>

                    {/* Small screens: compact counter. sm+: page numbers */}
                    <span className="px-3 text-sm text-gray-700 sm:hidden">
                        {p.pageNumber} / {p.totalPages}
                    </span>
                    <ul className="hidden items-center gap-1.5 sm:flex">
                        {pageList(p.pageNumber, p.totalPages).map((item, i) =>
                            item === '…' ? (
                                <li key={`gap-${i}`} className="px-1 text-gray-400" aria-hidden>…</li>
                            ) : (
                                <li key={item}>
                                    <button
                                        type="button"
                                        onClick={() => onPageChange(item)}
                                        disabled={disabled}
                                        aria-label={`Page ${item}`}
                                        aria-current={item === p.pageNumber ? 'page' : undefined}
                                        className={`${btn} ${item === p.pageNumber
                                                ? 'border-[#0C486D] bg-[#0C486D] font-medium text-white cursor-pointer'
                                                : 'border-gray-200 bg-white text-gray-800 hover:bg-gray-50 cursor-pointer'
                                            }`}
                                    >
                                        {item}
                                    </button>
                                </li>
                            ),
                        )}
                    </ul>

                    <button
                        type="button"
                        onClick={() => onPageChange(p.pageNumber + 1)}
                        disabled={disabled || !p.hasNextPage}
                        aria-label="Next page"
                        className={`${btn} gap-1 border-gray-200 bg-white pl-3 text-gray-800 hover:bg-gray-50 cursor-pointer`}
                    >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="h-4 w-4" aria-hidden />
                    </button>
                </nav>
            )}
        </div>
    );
}