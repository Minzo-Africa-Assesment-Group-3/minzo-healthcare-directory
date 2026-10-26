import { cookies } from 'next/headers';
import { apiClient } from './api-client';
import { AppUser } from '@/services/users.service';

export const MEMBER_SESSION_COOKIE = 'access_token';

export async function getMemberToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(MEMBER_SESSION_COOKIE)?.value;
}

export async function getCurrentMember(): Promise<AppUser | null> {
    const token = await getMemberToken();
    if (!token) return null;

    try {
        return await apiClient.get<AppUser>('/api/v1/me', token);
    } catch {
        return null;
    }
}