'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { formatMoney, formatDate } from '@/lib/format';

export function CashBankTab() {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [applied, setApplied] = useState<{ from?: string; to?: string }>({});

    const { data, isLoading } = useQuery({
        queryKey: ['cash-bank', applied],
        queryFn: () => reportsService.getCashBankReport(applied.from, applied.to),
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

            {isLoading ? (
                <p className="text-sm text-gray-500">Loading…</p>
            ) : !data ? (
                <p className="text-sm text-gray-500">No data.</p>
            ) : (
                <div className="rounded-md border bg-white">
                    <div className="border-b p-4">
                        <p className="text-sm text-gray-500">Account</p>
                        <p className="font-semibold">
                            {data.account.code} — {data.account.name}
                        </p>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Narration</TableHead>
                                <TableHead>Source</TableHead>
                                <TableHead className="text-right">Debit</TableHead>
                                <TableHead className="text-right">Credit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.entries.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-20 text-center text-gray-500">
                                        No entries in this period.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.entries.map((entry) =>
                                    entry.lines
                                        .filter((line) => {
                                            const accId = typeof line.accountId === 'object' ? line.accountId._id : line.accountId;
                                            return accId === data.account._id;
                                        })
                                        .map((line, i) => (
                                            <TableRow key={`${entry._id}-${i}`}>
                                                <TableCell>{formatDate(entry.date)}</TableCell>
                                                <TableCell className="text-sm">{entry.narration}</TableCell>
                                                <TableCell className="text-xs text-gray-500">{entry.sourceModule}</TableCell>
                                                <TableCell className="text-right">
                                                    {parseFloat(line.debit.$numberDecimal) > 0 ? formatMoney(line.debit) : '—'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {parseFloat(line.credit.$numberDecimal) > 0 ? formatMoney(line.credit) : '—'}
                                                </TableCell>
                                            </TableRow>
                                        )),
                                )
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}