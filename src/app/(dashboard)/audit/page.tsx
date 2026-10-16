'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { auditService } from '@/services/audit.service';
import { buildAuditColumns } from './columns';
import { LogDetail } from './log-detail';
import { RequireRole } from '@/components/require-role';
import { UserRole } from '@/lib/types';
import { PaginationControls } from '@/components/pagination-controls';

export default function AuditLogsPage() {
    return (
        <RequireRole roles={[UserRole.ADMIN]}>
            <AuditLogsContent />
        </RequireRole>
    );
}

function AuditLogsContent() {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [route, setRoute] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [appliedFilters, setAppliedFilters] = useState({});
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery({
        queryKey: ['audit-logs', appliedFilters, page],
        queryFn: () =>
            auditService.getAll({
                ...appliedFilters,
                page,
                // search: debouncedSearch || undefined,
            }),
    });

    const columns = buildAuditColumns(expandedId, (id) =>
        setExpandedId((prev) => (prev === id ? null : id)),
    );

    const table = useReactTable({
        data: data?.data ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const applyFilters = () => {
        setAppliedFilters({
            route: route || undefined,
            from: from || undefined,
            to: to || undefined,
        });
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
                <p className="text-sm text-gray-500">System-wide activity trail</p>
            </div>

            <div className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border bg-white p-4">
                <div>
                    <Label htmlFor="route" className="text-xs">Route contains</Label>
                    <Input
                        id="route"
                        value={route}
                        onChange={(e) => setRoute(e.target.value)}
                        placeholder="e.g. /loans"
                        className="w-48"
                    />
                </div>
                <div>
                    <Label htmlFor="from" className="text-xs">From</Label>
                    <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="to" className="text-xs">To</Label>
                    <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
                </div>
                <Button onClick={applyFilters} className="bg-green-700 hover:bg-green-800">
                    Apply
                </Button>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                                    Loading…
                                </TableCell>
                            </TableRow>
                        ) : !data || data?.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                                    No log entries found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <>
                                    <TableRow
                                        key={row.id}
                                        onClick={() =>
                                            setExpandedId((prev) => (prev === row.original._id ? null : row.original._id))
                                        }
                                        className="cursor-pointer hover:bg-gray-50"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                    {expandedId === row.original._id && (
                                        <TableRow key={`${row.id}-detail`}>
                                            <TableCell colSpan={columns.length} className="p-0">
                                                <LogDetail log={row.original} />
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </>
                            ))
                        )}
                    </TableBody>
                </Table>

                {data && (
                    <PaginationControls
                        page={data.page}
                        totalPages={data.totalPages}
                        total={data.total}
                        limit={data.limit}
                        onPageChange={setPage}
                    />
                )}
            </div>
        </div>
    );
}