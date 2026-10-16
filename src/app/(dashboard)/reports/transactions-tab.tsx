'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { DateRangeFilter } from '@/components/date-range-filter';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { reportsService } from '@/services/reports.service';
import { formatDate } from '@/lib/format';

export function TransactionsTab() {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [applied, setApplied] = useState<{ from?: string; to?: string }>({});

    const { data, isLoading } = useQuery({
        queryKey: ['transactions', applied],
        queryFn: () => reportsService.getTransactionListing(applied.from, applied.to),
    });

    return (
        <div>
            <DateRangeFilter
                from={from}
                to={to}
                onFromChange={setFrom}
                onToChange={setTo}
                onApply={() => setApplied({ from: from || undefined, to: to || undefined })}
            />

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Narration</TableHead>
                            <TableHead>Module</TableHead>
                            <TableHead>Accounts Affected</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                                    Loading…
                                </TableCell>
                            </TableRow>
                        ) : !data || data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                                    No transactions found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((entry) => (
                                <TableRow key={entry._id}>
                                    <TableCell>{formatDate(entry.date)}</TableCell>
                                    <TableCell className="text-sm">{entry.narration}</TableCell>
                                    <TableCell className="text-xs text-gray-500">{entry.sourceModule}</TableCell>
                                    <TableCell className="text-xs">
                                        {entry.lines
                                            .map((l) => (typeof l.accountId === 'object' ? l.accountId.name : l.accountId))
                                            .join(', ')}
                                    </TableCell>
                                    <TableCell>
                                        {entry.reversed ? (
                                            <Badge variant="secondary" className="bg-gray-100 text-gray-500">
                                                Reversed
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                Posted
                                            </Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}