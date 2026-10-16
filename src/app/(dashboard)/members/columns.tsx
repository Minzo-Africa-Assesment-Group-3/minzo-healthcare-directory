'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Member } from '@/services/members.service';

const statusColor: Record<Member['status'], string> = {
    ACTIVE: 'bg-green-100 text-green-800 hover:bg-green-100',
    INACTIVE: 'bg-gray-100 text-gray-700 hover:bg-gray-100',
    SUSPENDED: 'bg-red-100 text-red-800 hover:bg-red-100',
};

export const memberColumns: ColumnDef<Member>[] = [
    {
        accessorKey: 'membershipNumber',
        header: 'Membership No.',
    },
    {
        accessorKey: 'fullName',
        header: 'Full Name',
    },
    {
        accessorKey: 'phoneNumber',
        header: 'Phone',
    },
    {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => row.original.email ?? '—',
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
            <Badge className={statusColor[row.original.status]} variant="secondary">
                {row.original.status}
            </Badge>
        ),
    },
    {
        accessorKey: 'dateOfRegistration',
        header: 'Registered',
        cell: ({ row }) =>
            new Date(row.original.dateOfRegistration).toLocaleDateString('en-NG', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }),
    },
];