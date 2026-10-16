import { create } from 'zustand';
interface NavState {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export const useNavStore = create<NavState>((set) => ({
    isOpen: false,
    setIsOpen: (isOpen) => set({ isOpen }),
}));