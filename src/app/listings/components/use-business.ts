'use client';

import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { businessService } from '@/services/business.service';
import type { Business, BusinessQuery, Pagination } from '@/types/business-types';

interface State {
    data: Business[];
    pagination: Pagination | null;
    loading: boolean;
    error: string | null;
}

/**
 * Fetches one page of businesses whenever the query changes.
 * - Stale requests are aborted, so quick filter changes can't overwrite newer results.
 * - The previous page stays in `data` while the next one loads (no layout flash).
 */
export function useBusinesses(query: BusinessQuery) {
    const [state, setState] = useState<State>({ data: [], pagination: null, loading: true, error: null });
    const [attempt, setAttempt] = useState(0);

    const { pageNumber, pageSize, facilityType, search, location, latitude, longitude } = query;

    useEffect(() => {
        const controller = new AbortController();
        const loadingTimer = window.setTimeout(() => {
            if (!controller.signal.aborted) {
                setState((s) => ({ ...s, loading: true, error: null }));
            }
        }, 0);

        businessService
            .getAll({ pageNumber, pageSize, facilityType, search, location, latitude, longitude }, { signal: controller.signal })
            .then((res) => setState({ data: res.data, pagination: res.pagination, loading: false, error: null }))
            .catch((err) => {
                if (axios.isCancel(err)) return;
                const message = axios.isAxiosError(err)
                    ? (err.response?.data as { message?: string } | undefined)?.message ?? err.message
                    : 'Something went wrong';
                setState((s) => ({ ...s, loading: false, error: message }));
            });

        return () => controller.abort();
    }, [pageNumber, pageSize, facilityType, search, location, latitude, longitude, attempt]);

    const refetch = useCallback(() => setAttempt((a) => a + 1), []);

    return { ...state, refetch };
}