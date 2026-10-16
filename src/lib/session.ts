import { cookies } from 'next/headers';
import { apiClient } from './api-client';
import { AuthUser } from './types';

export const SESSION_COOKIE = 'access_token';
export const REFRESH_COOKIE = 'refresh_token';

export async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(SESSION_COOKIE)?.value;
}

// Fetches the current user fresh from the backend using the stored token —
// this also naturally re-validates the token (expired/idle-timed-out tokens
// will throw here), so we never trust a stale cookie blindly.
export async function getCurrentUser(): Promise<AuthUser | null> {
    const token = await getToken();
    if (!token) return null;

    try {
        return await apiClient.get<AuthUser>('/users/me', token);
    } catch {
        return null;
    }
}