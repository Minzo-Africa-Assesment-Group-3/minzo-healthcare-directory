'use client';

import { Menu, X } from 'lucide-react';
import { useNav } from '@/hooks/use-nav';
import { useNavStore } from '@/store/use-nav-store';
import Image from 'next/image';

export function TopbarMobile() {
    const { isOpen } = useNav();
    const setIsOpen = useNavStore((state) => state.setIsOpen)

    return (
        <>
            {/* Mobile top bar */}
            <div className="flex items-center justify-between border-b bg-white px-4 py-3 md:hidden sticky top-0">
                <Image
                    src="https://res.cloudinary.com/dpyezce56/image/upload/v1789075039/fu0aqkfhoj2regdnthak.png"
                    alt="Logo"
                    width={900}
                    height={640}
                    style={{
                        display: 'block',
                        width: '120px',
                        height: 'auto',
                    }}
                />
                <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
                    {isOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>
        </>
    );
}