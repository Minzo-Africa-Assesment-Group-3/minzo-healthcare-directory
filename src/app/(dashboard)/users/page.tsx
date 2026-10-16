'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService, AppUser } from '@/services/users.service';
import { DataTable } from '@/components/data-table';
import { buildUserColumns } from './columns';
import { CreateUserDialog } from './create-user-dialog';
import { EditRolesDialog } from './edit-roles-dialog';
import { RequireRole } from '@/components/require-role';
import { useAuth } from '@/hooks/use-auth';
import { UserRole } from '@/lib/types';
import { notify } from '@/lib/toast';
import { ResetPasswordDialog } from './reset-password-dialog';

export default function UsersPage() {
    return (
        <RequireRole roles={[UserRole.ADMIN]}>
            <UsersContent />
        </RequireRole>
    );
}

function UsersContent() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [editingUser, setEditingUser] = useState<AppUser | null>(null);
    const [resettingUser, setResettingUser] = useState<AppUser | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: usersService.getAll,
    });

    const { mutate: toggleStatus } = useMutation({
        mutationFn: (target: AppUser) =>
            target.isActive ? usersService.deactivate(target._id) : usersService.reactivate(target._id),
        onSuccess: (_, target) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            notify.success(target.isActive ? 'User deactivated' : 'User reactivated');
        },
    });

    const columns = buildUserColumns(toggleStatus, setEditingUser, setResettingUser, user?.id);

    return (
        <div>
            <div className="mb-6 md:flex space-y-4 md:space-y-0 items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                    <p className="text-sm text-gray-500">Staff accounts and access control</p>
                </div>
                <CreateUserDialog />
            </div>

            <DataTable columns={columns} data={data ?? []} isLoading={isLoading} />

            <EditRolesDialog user={editingUser} onClose={() => setEditingUser(null)} />

            <ResetPasswordDialog user={resettingUser} onClose={() => setResettingUser(null)} />
        </div>
    );
}