'use client';

import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { businessService } from '@/services/business.service'; // adjust path if needed
import type { BusinessDetail } from './types';

interface State {
    data: BusinessDetail | null;
    loading: boolean;
    error: string | null;
    notFound: boolean;
}

export function useBusiness(slug: string) {
    const [state, setState] = useState<State>({ data: null, loading: true, error: null, notFound: false });
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        // setState({ data: null, loading: true, error: null, notFound: false });
        queueMicrotask(() => {
            setState({ data: null, loading: true, error: null, notFound: false });
        });

        businessService
            .getBySlug(slug, { signal: controller.signal })
            .then((data) => setState({ data, loading: false, error: null, notFound: false }))
            .catch((err) => {
                if (axios.isCancel(err)) return;
                if (axios.isAxiosError(err) && err.response?.status === 404) {
                    setState({ data: null, loading: false, error: null, notFound: true });
                    return;
                }
                const message = axios.isAxiosError(err)
                    ? (err.response?.data as { message?: string } | undefined)?.message ?? err.message
                    : 'Something went wrong';
                setState({ data: null, loading: false, error: message, notFound: false });
            });

        return () => controller.abort();
    }, [slug, attempt]);

    const refetch = useCallback(() => setAttempt((a) => a + 1), []);
    return { ...state, refetch };
}