'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { AuthUser } from '@/lib/types';

export function AuthHydrator({ user }: { user: AuthUser }) {
    const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
        setUser(user);
    }, [user, setUser]);

    return null;
}