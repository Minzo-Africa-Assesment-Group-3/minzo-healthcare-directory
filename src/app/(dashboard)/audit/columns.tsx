'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AuditLogEntry } from '@/services/audit.service';

const methodColor: Record<string, string> = {
    GET: 'bg-blue-100 text-blue-800',
    POST: 'bg-green-100 text-green-800',
    PATCH: 'bg-amber-100 text-amber-800',
    DELETE: 'bg-red-100 text-red-800',
};

export function buildAuditColumns(
    expandedId: string | null,
    onToggle: (id: string) => void,
): ColumnDef<AuditLogEntry>[] {
    return [
        {
            id: 'expand',
            header: '',
            cell: ({ row }) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggle(row.original._id);
                    }}
                    className="text-gray-400 hover:text-gray-700"
                >
                    {expandedId === row.original._id ? (
                        <ChevronDown size={16} />
                    ) : (
                        <ChevronRight size={16} />
                    )}
                </button>
            ),
        },
        {
            accessorKey: 'createdAt',
            header: 'Time',
            cell: ({ row }) => new Date(row.original.createdAt).toLocaleString('en-NG'),
        },
        {
            accessorKey: 'username',
            header: 'User',
            cell: ({ row }) => row.original.username ?? '—',
        },
        {
            accessorKey: 'method',
            header: 'Method',
            cell: ({ row }) => (
                <Badge className={methodColor[row.original.method] ?? ''} variant="secondary">
                    {row.original.method}
                </Badge>
            ),
        },
        {
            accessorKey: 'route',
            header: 'Route',
            cell: ({ row }) => <span className="font-mono text-xs">{row.original.route}</span>,
        },
        {
            accessorKey: 'statusCode',
            header: 'Status',
            cell: ({ row }) => (
                <span
                    className={row.original.success ? 'text-green-700' : 'font-medium text-red-600'}
                >
                    {row.original.statusCode}
                </span>
            ),
        },
    ];
}