'use client';

import Link from 'next/link';
import { PROFILE_SECTIONS } from './user-sections';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { logout } from '@/lib/logout';
import { useMemberAuthStore } from '@/store/member-auth-store';

export default function UserProfileSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const setMember = useMemberAuthStore((state) => state.setMember);

    const handleLogout = async () => {
        await logout();
        setMember(null);
        router.replace('/');
        router.refresh();
    };

    return (
        <nav
            aria-label="Profile sections"
            className="flex gap-1 overflow-x-auto rounded-2xl bg-white p-1.5 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.08)] lg:flex-col lg:gap-2 lg:overflow-visible lg:pb-4"
        >
            {PROFILE_SECTIONS.map(({ id, label, link, danger }) => {
                const isActive =
                    pathname === link || pathname.startsWith(`${link}`);

                return (
                    <Link
                        key={id}
                        href={link}
                        aria-current={isActive ? 'page' : undefined}
                        className={`shrink-0 cursor-pointer rounded-lg px-4 py-2.5 text-left font-(family-name:--font-roboto-slab) text-sm whitespace-nowrap transition-colors lg:py-2.5 ${isActive
                            ? 'bg-[#0C486D] font-semibold text-[#F5F7FA]'
                            : danger
                                ? 'font-medium text-[#D92D4A] hover:bg-red-50'
                                : 'font-medium text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        {label}
                    </Link>
                );
            })}

            <div className="flex items-center px-4 py-2 gap-2 text-red-500 text-sm hover:bg-red-50 cursor-pointer rounded-lg" onClick={handleLogout}>
                <LogOut size={16} />
                <p>Log out</p>
            </div>
        </nav>
    );
}