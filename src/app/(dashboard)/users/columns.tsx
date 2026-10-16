'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AppUser } from '@/services/users.service';
import { formatDate } from '@/lib/format';

export function buildUserColumns(
    onToggleStatus: (user: AppUser) => void,
    onEditRoles: (user: AppUser) => void,
    onResetPassword: (user: AppUser) => void,
    currentUserId: string | undefined,
): ColumnDef<AppUser>[] {
    return [
        { accessorKey: 'fullName', header: 'Full Name' },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => row.original.email ?? '—',
        },
        { accessorKey: 'username', header: 'Username' },
        {
            id: 'roles',
            header: 'Roles',
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1">
                    {row.original.roles.map((role) => (
                        <Badge key={role} variant="secondary" className="bg-gray-100 text-gray-700">
                            {role}
                        </Badge>
                    ))}
                </div>
            ),
        },
        {
            accessorKey: 'isActive',
            header: 'Status',
            cell: ({ row }) => (
                <Badge
                    variant="secondary"
                    className={
                        row.original.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-500'
                    }
                >
                    {row.original.isActive ? 'Active' : 'Deactivated'}
                </Badge>
            ),
        },
        {
            accessorKey: 'lastLoginAt',
            header: 'Last Login',
            cell: ({ row }) => (row.original.lastLoginAt ? formatDate(row.original.lastLoginAt) : 'Never'),
        },
        // {
        //     id: 'actions',
        //     header: '',
        //     cell: ({ row }) => {
        //         const isSelf = row.original._id === currentUserId;
        //         return (
        //             <div className="flex justify-end gap-2">
        //                 <Button size="sm" variant="outline" onClick={() => onEditRoles(row.original)}>
        //                     Edit Roles
        //                 </Button>
        //                 <Button
        //                     size="sm"
        //                     variant="outline"
        //                     disabled={isSelf}
        //                     title={isSelf ? "You can't deactivate your own account" : undefined}
        //                     className={
        //                         row.original.isActive
        //                             ? 'border-red-200 text-red-700 hover:bg-red-50'
        //                             : 'border-green-200 text-green-700 hover:bg-green-50'
        //                     }
        //                     onClick={() => onToggleStatus(row.original)}
        //                 >
        //                     {row.original.isActive ? 'Deactivate' : 'Reactivate'}
        //                 </Button>
        //             </div>
        //         );
        //     },
        // },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => {
                const isSelf = row.original._id === currentUserId;
                return (
                    <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => onEditRoles(row.original)}>
                            Edit Roles
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onResetPassword(row.original)}>
                            Reset Password
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={isSelf}
                            title={isSelf ? "You can't deactivate your own account" : undefined}
                            className={
                                row.original.isActive
                                    ? 'border-red-200 text-red-700 hover:bg-red-50'
                                    : 'border-green-200 text-green-700 hover:bg-green-50'
                            }
                            onClick={() => onToggleStatus(row.original)}
                        >
                            {row.original.isActive ? 'Deactivate' : 'Reactivate'}
                        </Button>
                    </div>
                );
            },
        },
    ];
}