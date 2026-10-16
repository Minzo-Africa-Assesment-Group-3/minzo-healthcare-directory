'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DateRangeFilter } from '@/components/date-range-filter';
import { ReportLineTable } from '@/components/report-line-table';
import { reportsService } from '@/services/reports.service';
import { notify } from '@/lib/toast';

export function ProfitAndLossTab() {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [applied, setApplied] = useState<{ from?: string; to?: string }>({});
    const [exporting, setExporting] = useState<'excel' | 'pdf' | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ['profit-and-loss', applied],
        queryFn: () => reportsService.getProfitAndLoss(applied.from, applied.to),
    });

    const handleExport = async (format: 'excel' | 'pdf') => {
        setExporting(format);
        try {
            await reportsService.exportProfitAndLoss(applied.from, applied.to, format);
            notify.success('Download started');
        } catch {
            notify.error('Export failed');
        } finally {
            setExporting(null);
        }
    };

    return (
        <div>
            <DateRangeFilter
                from={from}
                to={to}
                onFromChange={setFrom}
                onToChange={setTo}
                onApply={() => setApplied({ from: from || undefined, to: to || undefined })}
            />

            <div className="mb-4 flex justify-end gap-2">
                <Button variant="outline" size="sm" disabled={!!exporting} onClick={() => handleExport('excel')}>
                    <Download size={14} className="mr-1" /> {exporting === 'excel' ? 'Exporting…' : 'Excel'}
                </Button>
                <Button variant="outline" size="sm" disabled={!!exporting} onClick={() => handleExport('pdf')}>
                    <Download size={14} className="mr-1" /> {exporting === 'pdf' ? 'Exporting…' : 'PDF'}
                </Button>
            </div>

            {isLoading ? (
                <p className="text-sm text-gray-500">Loading…</p>
            ) : !data ? (
                <p className="text-sm text-gray-500">No data.</p>
            ) : (
                <div className="space-y-6 rounded-lg border bg-white p-6">
                    <div>
                        <h3 className="mb-2 font-semibold text-gray-700">Income</h3>
                        <ReportLineTable lines={data.income} total={data.totalIncome} totalLabel="Total Income" />
                    </div>
                    <div>
                        <h3 className="mb-2 font-semibold text-gray-700">Expenses</h3>
                        <ReportLineTable lines={data.expenses} total={data.totalExpenses} totalLabel="Total Expenses" />
                    </div>
                    <div
                        className={`rounded-md p-4 text-center font-bold ${data.result === 'SURPLUS' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                            }`}
                    >
                        {data.result}:{' '}
                        {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(
                            parseFloat(data.surplusOrDeficit),
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}