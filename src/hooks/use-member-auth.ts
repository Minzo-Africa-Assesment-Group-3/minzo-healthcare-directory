'use client';

import { useMemberAuthStore } from '@/store/member-auth-store';

export function useMemberAuth() {
    const member = useMemberAuthStore((state) => state.member);
    const hydrated = useMemberAuthStore((state) => state.hydrated);
    return { member, hydrated };
}