import { ApiErrorResponse } from './types';

const API_URL = process.env.API_URL;

export class ApiError extends Error {
    statusCode: number;
    errorType: string;

    constructor(body: ApiErrorResponse) {
        super(Array.isArray(body.message) ? body.message.join(', ') : body.message);
        this.statusCode = body.statusCode;
        this.errorType = body.error;
    }
}

interface RequestOptions extends RequestInit {
    token?: string;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { token, headers, ...rest } = options;

    const response = await fetch(`${API_URL}${path}`, {
        ...rest,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
    });

    if (!response.ok) {
        const body = await response.json().catch(() => null);
        if (body) throw new ApiError(body);
        throw new Error(`Request failed with status ${response.status}`);
    }

    // Some endpoints (e.g. file exports) return non-JSON; callers handle those separately
    return response.json();
}

export const apiClient = {
    get: <T>(path: string, token?: string) => request<T>(path, { method: 'GET', token }),

    post: <T>(path: string, body?: unknown, token?: string) =>
        request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined, token }),

    patch: <T>(path: string, body?: unknown, token?: string) =>
        request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined, token }),
};