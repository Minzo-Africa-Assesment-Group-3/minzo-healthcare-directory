'use client';

import { useEffect } from 'react';
import { useMemberAuthStore } from '@/store/member-auth-store';
import { AppUser } from '@/services/users.service';

export function MemberAuthHydrator({ member }: { member: AppUser | null }) {
    const setMember = useMemberAuthStore((state) => state.setMember);
    useEffect(() => setMember(member), [member, setMember]);
    return null;
}