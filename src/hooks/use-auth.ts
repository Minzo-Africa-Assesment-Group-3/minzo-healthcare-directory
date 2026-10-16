'use client';

import { useAuthStore } from '@/store/auth-store';
import { UserRole } from '@/lib/types';

export function useAuth() {
    const user = useAuthStore((state) => state.user);
    const hydrated = useAuthStore((state) => state.hydrated);

    return {
        user,
        hydrated,
        hasRole: (role: UserRole) => user?.roles.includes(role) ?? false,
        isAdmin: user?.roles.includes(UserRole.ADMIN) ?? false,
    };
}