'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { MemberAuthUser } from '@/lib/types';
import { cn } from '@/lib/utils';

const LINKS = [
    { label: 'Overview', href: '/portal/dashboard' },
    { label: 'Savings', href: '/portal/dashboard/savings' },
    { label: 'Loans', href: '/portal/dashboard/loans' },
];

export function PortalNav({ member }: { member: MemberAuthUser }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/portal-auth/logout', { method: 'POST' });
        router.push('/portal/login');
        router.refresh();
    };

    return (
        <header className="border-b bg-white">
            <div className="mx-auto md:flex max-w-4xl items-center justify-between px-6 py-4">
                <div>
                    <p className="font-bold text-green-800">Coopmate360 Cooperative</p>
                    <p className="text-xs text-gray-500">{member.fullName} · {member.membershipNumber}</p>
                </div>
                <nav className="flex items-center gap-4 mt-4 md:mt-0">
                    {LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'text-sm font-medium',
                                pathname === link.href ? 'text-green-700' : 'text-gray-500 hover:text-gray-800',
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <button onClick={handleLogout} className="text-gray-400 hover:text-red-600">
                        <LogOut size={18} />
                    </button>
                </nav>
            </div>
        </header>
    );
}