'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { UserRole } from '@/lib/types';
import { notify } from '@/lib/toast';
import { Skeleton } from '@/components/ui/skeleton';

interface RequireRoleProps {
    roles: UserRole[];
    children: React.ReactNode;
}

export function RequireRole({ roles, children }: RequireRoleProps) {
    const router = useRouter();
    const { hydrated, hasRole } = useAuth();

    const isAuthorized = roles.some((role) => hasRole(role));

    useEffect(() => {
        if (!hydrated) return; // wait until we actually know who the user is

        if (!isAuthorized) {
            notify.error("You don't have permission to view that page");
            router.replace('/dashboard');
        }
    }, [hydrated, isAuthorized, router]);

    if (!hydrated) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (!isAuthorized) {
        return null; // redirect is already in flight via the effect above
    }

    return <>{children}</>;
}