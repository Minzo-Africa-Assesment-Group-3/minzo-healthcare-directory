'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/nav-config';
import { useAuth } from '@/hooks/use-auth';
import { useAuthStore } from '@/store/auth-store';
import { logout } from '@/lib/logout';
import { cn } from '@/lib/utils';
import { useNav } from '@/hooks/use-nav';
import { useNavStore } from '@/store/use-nav-store';

export function SidebarMobile() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, hasRole } = useAuth();
    const setUser = useAuthStore((state) => state.setUser);

    const { isOpen } = useNav();
    const setIsOpen = useNavStore((state) => state.setIsOpen)

    const visibleItems = NAV_ITEMS.filter(
        (item) => !item.roles || item.roles.some((role) => hasRole(role)),
    );

    const handleLogout = async () => {
        await logout();
        setUser(null);
        router.push('/login');
        router.refresh();
    };

    return (
        <>
            <div 
            className={cn('fixed top-10 left-0 w-full bg-black/40 backdrop-blur-xs h-screen z-40', isOpen ? '' : 'hidden')}
                onClick={() => setIsOpen(false)}
            >
            </div>
            <aside
                className={cn(
                    'w-64 shrink-0 border-r bg-white',
                    'md:flex md:flex-col md:h-screen fixed top-10 bottom-0 z-50',
                    isOpen ? 'block' : 'hidden md:flex',
                )}
            >
                <div className="hidden border-b px-6 py-5 md:block">
                    <h1 className="text-lg font-bold text-green-800">Coopmate360</h1>
                    <p className="text-xs text-gray-500">Cooperative ERP</p>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                    {visibleItems.map((item) => {
                        const isActive =
                            pathname === item.href || pathname.startsWith(`${item.href}/`);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-green-100 text-green-800'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                                )}
                            >
                                <Icon size={18} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t px-4 py-4">
                    <div className="mb-3 px-1">
                        <p className="truncate text-sm font-medium text-gray-900">{user?.fullName}</p>
                        <p className="truncate text-xs text-gray-500">
                            {user?.roles.join(', ').toLowerCase()}
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-700"
                    >
                        <LogOut size={16} />
                        Sign out
                    </button>
                </div>
            </aside>
        </>
    );
}