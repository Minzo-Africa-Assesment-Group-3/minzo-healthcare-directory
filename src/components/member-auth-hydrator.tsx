'use client';

import { useEffect } from 'react';
import { useMemberAuthStore } from '@/store/member-auth-store';
import { MemberAuthUser } from '@/lib/types';

export function MemberAuthHydrator({ member }: { member: MemberAuthUser }) {
    const setMember = useMemberAuthStore((state) => state.setMember);
    useEffect(() => setMember(member), [member, setMember]);
    return null;
}