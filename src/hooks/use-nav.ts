'use client';

import { useNavStore } from '@/store/use-nav-store';

export function useNav() {
    const isOpen = useNavStore((state) => state.isOpen);

    return {
        isOpen,
    };
}