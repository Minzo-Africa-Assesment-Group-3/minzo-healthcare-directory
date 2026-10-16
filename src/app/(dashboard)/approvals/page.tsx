'use client';

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { UserRole } from '@/lib/types';
import { PendingTab } from './pending-tab';
import { MyRequestsTab } from './my-requests-tab';
import { RequireRole } from '@/components/require-role';

export default function ApprovalsPage() {
    return (
        <RequireRole roles={[UserRole.ADMIN, UserRole.CHECKER]}>
            <ApprovalsContent />
        </RequireRole>
    );
}

function ApprovalsContent() {
    const { hasRole } = useAuth();
    const canApprove = hasRole(UserRole.CHECKER) || hasRole(UserRole.ADMIN);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Approvals</h1>
                <p className="text-sm text-gray-500">Maker-checker authorization queue</p>
            </div>

            <Tabs defaultValue={canApprove ? 'pending' : 'mine'}>
                <TabsList>
                    {canApprove && <TabsTrigger value="pending">Pending Approvals</TabsTrigger>}
                    <TabsTrigger value="mine">My Requests</TabsTrigger>
                </TabsList>

                {canApprove && (
                    <TabsContent value="pending" className="mt-4">
                        <PendingTab />
                    </TabsContent>
                )}

                <TabsContent value="mine" className="mt-4">
                    <MyRequestsTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}