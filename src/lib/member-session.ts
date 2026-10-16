import { cookies } from 'next/headers';
import { apiClient } from './api-client';
import { MemberAuthUser } from './types';

export const MEMBER_SESSION_COOKIE = 'member_access_token';

export async function getMemberToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(MEMBER_SESSION_COOKIE)?.value;
}

export async function getCurrentMember(): Promise<MemberAuthUser | null> {
    const token = await getMemberToken();
    if (!token) return null;

    try {
        return await apiClient.get<MemberAuthUser>('/member-portal/me', token);
    } catch {
        return null;
    }
}