import { create } from 'zustand';
import { AppUser } from '@/services/users.service';

interface MemberAuthState {
    member: AppUser | null;
    hydrated: boolean;
    setMember: (member: AppUser | null) => void;
}

export const useMemberAuthStore = create<MemberAuthState>((set) => ({
    member: null,
    hydrated: false,
    setMember: (member) => set({ member, hydrated: true }),
}));