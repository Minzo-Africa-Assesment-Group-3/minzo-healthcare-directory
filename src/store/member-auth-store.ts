import { create } from 'zustand';
import { MemberAuthUser } from '@/lib/types';

interface MemberAuthState {
    member: MemberAuthUser | null;
    hydrated: boolean;
    setMember: (member: MemberAuthUser | null) => void;
}

export const useMemberAuthStore = create<MemberAuthState>((set) => ({
    member: null,
    hydrated: false,
    setMember: (member) => set({ member, hydrated: true }),
}));