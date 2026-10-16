'use client';

import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { reportsService, SavingsRegisterItem } from '@/services/reports.service';
import { formatMoney } from '@/lib/format';
import { useState } from 'react';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { PaginationControls } from '@/components/pagination-controls';
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const columns: ColumnDef<SavingsRegisterItem>[] = [
    {
        id: 'member',
        header: 'Member',
        cell: ({ row }) => (
            <div>
                <p className="font-medium">{row.original.memberId.fullName}</p>
                <p className="text-xs text-gray-500">{row.original.memberId.membershipNumber}</p>
            </div>
        ),
    },
    { accessorKey: 'accountNumber', header: 'Account No.' },
    {
        accessorKey: 'balance',
        header: 'Balance',
        cell: ({ row }) => formatMoney(row.original.balance),
    },
    { accessorKey: 'status', header: 'Status' },
];


// const STATUS_OPTIONS = ['ALL', 'ACTIVE', 'INACTIVE', 'SUSPENDED'] as const;
export function SavingsRegisterTab() {
    // const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>('ALL');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebouncedValue(search);
    const { data: data, isLoading } = useQuery({
        queryKey: ['savings-register', page, debouncedSearch],
        queryFn: () =>
            reportsService.getSavingsRegister({
                // status: status === 'ALL' ? undefined : status,
                page,
                search: debouncedSearch || undefined,
            }),
    });

    return (
        <>
            <div className="mb-4 flex items-center gap-3">
                <div className="relative w-64">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Search by name, number, phone…"
                        className="pl-9"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1); // reset to first page on a new search
                        }}
                    />
                </div>

                {/* <Select
                    value={status}
                    onValueChange={(v) => {
                        setStatus(v as typeof status);
                        setPage(1);
                    }}
                >
                    <SelectTrigger className="w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s}>
                                {s === 'ALL' ? 'All statuses' : s}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select> */}
            </div>
            <DataTable columns={columns} data={data?.data ?? []} isLoading={isLoading} />

            {data && (
                <PaginationControls
                    page={data.page}
                    totalPages={data.totalPages}
                    total={data.total}
                    limit={data.limit}
                    onPageChange={setPage}
                />
            )}
        </>
    )
}