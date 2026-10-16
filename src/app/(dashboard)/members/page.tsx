'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { membersService, Member } from '@/services/members.service';
import { DataTable } from '@/components/data-table';
import { PaginationControls } from '@/components/pagination-controls';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { memberColumns } from './columns';
import { CreateMemberDialog } from './create-member-dialog';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const STATUS_OPTIONS = ['ALL', 'ACTIVE', 'INACTIVE', 'SUSPENDED'] as const;

export default function MembersPage() {
    const router = useRouter();
    const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>('ALL');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebouncedValue(search);

    const { data, isLoading } = useQuery({
        queryKey: ['members', status, page, debouncedSearch],
        queryFn: () =>
            membersService.getAll({
                status: status === 'ALL' ? undefined : status,
                page,
                search: debouncedSearch || undefined,
            }),
    });

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Members</h1>
                    <p className="text-sm text-gray-500">Cooperative membership register</p>
                </div>
                <CreateMemberDialog />
            </div>

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

                <Select
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
                </Select>
            </div>

            <DataTable
                columns={memberColumns}
                data={data?.data ?? []}
                isLoading={isLoading}
                onRowClick={(member: Member) => router.push(`/members/${member._id}`)}
            />

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
    );
}