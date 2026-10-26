import axios from 'axios';
import { api } from '@/lib/axios-client';
import type { RegisterBusinessPayload, RegisterBusinessResponse } from '@/types/business-reg-types';

export const authService = {
    registerBusiness: (payload: RegisterBusinessPayload, options?: { signal?: AbortSignal }) =>
        api
            .post<RegisterBusinessResponse>('/auth/register/business', payload, { signal: options?.signal })
            .then((r) => r.data),

    getCounties: () => api.get('/counties').then((r) => r.data.data),

    getCities: (countyId: string) => api.get(`/cities?countyId=${countyId}`).then((r) => r.data.data)

};

/* ---------- Error handling ---------- */

export interface ApiFailure {
    status?: number;
    message: string; // safe to show to the user
    fieldErrors: Record<string, string>; // keyed by the API's field path, e.g. "user.email"
}

const rec = (v: unknown): Record<string, unknown> | undefined =>
    v && typeof v === 'object' ? (v as Record<string, unknown>) : undefined;

const firstString = (v: unknown): string | undefined =>
    typeof v === 'string' ? v : Array.isArray(v) && typeof v[0] === 'string' ? v[0] : undefined;

/**
 * Turns any thrown error into something safe to display.
 * 4xx: the server's message (it's about the user's input).
 * 5xx / network: a generic message, so internals are never shown.
 */
export function parseApiError(err: unknown): ApiFailure {
    if (!axios.isAxiosError(err)) {
        return { message: 'Something went wrong. Please try again.', fieldErrors: {} };
    }
    if (!err.response) {
        return { message: 'Network error. Check your connection and try again.', fieldErrors: {} };
    }

    const status = err.response.status;
    const data = rec(err.response.data);
    const fieldErrors: Record<string, string> = {};

    // Support both [{ field, message }] and { "user.email": "…" } styles
    const errors = data?.errors;
    if (Array.isArray(errors)) {
        errors.forEach((e) => {
            const item = rec(e);
            const field = item?.field ?? item?.path;
            const msg = firstString(item?.message);
            if (typeof field === 'string' && msg) fieldErrors[field] = msg;
        });
    } else if (rec(errors)) {
        Object.entries(rec(errors)!).forEach(([k, v]) => {
            const msg = firstString(v);
            if (msg) fieldErrors[k] = msg;
        });
    }

    let message = firstString(data?.message) ?? '';
    if (status === 429) message = 'Too many attempts. Please wait a moment and try again.';
    else if (status >= 500) message = 'Something went wrong on our side. Please try again shortly.';
    else if (!message) message = 'We couldn’t create your account. Check your details and try again.';

    return { status, message, fieldErrors };
}