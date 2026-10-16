import { create } from 'zustand';
import { AuthUser } from '@/lib/types';

interface AuthState {
    user: AuthUser | null;
    hydrated: boolean;
    setUser: (user: AuthUser | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    hydrated: false,
    setUser: (user) => set({ user, hydrated: true }),
}));