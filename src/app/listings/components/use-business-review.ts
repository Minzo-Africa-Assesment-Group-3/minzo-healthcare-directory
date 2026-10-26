'use client';

import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { businessService } from '@/services/business.service';
import type { Pagination, ReviewQuery } from '@/types/business-types';
import { CustomerReviews } from '../[slug]/components/reviews-card';

interface State {
    data: CustomerReviews[];
    pagination: Pagination | null;
    loading: boolean;
    error: string | null;
}

/**
 * Fetches one page of businesses whenever the query changes.
 * - Stale requests are aborted, so quick filter changes can't overwrite newer results.
 * - The previous page stays in `data` while the next one loads (no layout flash).
 */
export function useBusinessReview(query: ReviewQuery, businessId: string | undefined) {
    const [state, setState] = useState<State>({ data: [], pagination: null, loading: true, error: null });
    const [attempt, setAttempt] = useState(0);

    const { pageNumber, pageSize } = query;

    useEffect(() => {
        const controller = new AbortController();
        const loadingTimer = window.setTimeout(() => {
            if (!controller.signal.aborted) {
                setState((s) => ({ ...s, loading: true, error: null }));
            }
        }, 0);

        businessService
            .getBusinessReview({ pageNumber, pageSize }, businessId)
            .then((res) => setState({ data: res.data, pagination: res.pagination, loading: false, error: null }))
            .catch((err) => {
                if (axios.isCancel(err)) return;
                const message = axios.isAxiosError(err)
                    ? (err.response?.data as { message?: string } | undefined)?.message ?? err.message
                    : 'Something went wrong';
                setState((s) => ({ ...s, loading: false, error: message }));
            });

        return () => controller.abort();
    }, [pageNumber, pageSize, attempt, businessId]);

    const refetch = useCallback(() => setAttempt((a) => a + 1), []);

    return { ...state, refetch };
}