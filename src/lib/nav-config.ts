import {
    LayoutDashboard,
    Users,
    PiggyBank,
    HandCoins,
    Receipt,
    ClipboardCheck,
    FileBarChart,
    ShieldCheck,
    Settings,
    type LucideIcon,
    UserCog,
    BookOpen
} from 'lucide-react';

import { UserRole } from './types';

export interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
    roles?: UserRole[]; // omit = visible to everyone logged in
}

export const NAV_ITEMS: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Members', href: '/members', icon: Users },
    { label: 'Savings', href: '/savings', icon: PiggyBank },
    { label: 'Loans', href: '/loans', icon: HandCoins },
    { label: 'Expenses', href: '/expenses', icon: Receipt },
    {
        label: 'Approvals',
        href: '/approvals',
        icon: ClipboardCheck,
        roles: [UserRole.CHECKER, UserRole.ADMIN],
    },
    {
        label: 'Reports',
        href: '/reports',
        icon: FileBarChart,
        roles: [UserRole.ADMIN, UserRole.CHECKER],
    },
    {
        label: 'Audit Logs',
        href: '/audit',
        icon: ShieldCheck,
        roles: [UserRole.ADMIN],
    },
    {
        label: 'Users',
        href: '/users',
        icon: Settings,
        roles: [UserRole.ADMIN],
    },
    {
        label: 'Chart of Accounts',
        href: '/accounts',
        icon: BookOpen,
        roles: [UserRole.ADMIN],
    },
    { label: 'Account Settings', href: '/settings', icon: UserCog },
];