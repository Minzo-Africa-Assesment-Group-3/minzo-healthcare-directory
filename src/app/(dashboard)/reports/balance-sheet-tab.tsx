'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ReportLineTable } from '@/components/report-line-table';
import { reportsService } from '@/services/reports.service';
import { notify } from '@/lib/toast';

export function BalanceSheetTab() {
    const [asOf, setAsOf] = useState('');
    const [applied, setApplied] = useState<string | undefined>(undefined);
    const [exporting, setExporting] = useState<'excel' | 'pdf' | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ['balance-sheet', applied],
        queryFn: () => reportsService.getBalanceSheet(applied),
    });
    // console.log(data)

    const handleExport = async (format: 'excel' | 'pdf') => {
        setExporting(format);
        try {
            await reportsService.exportBalanceSheet(applied, format);
            notify.success('Download started');
        } catch {
            notify.error('Export failed');
        } finally {
            setExporting(null);
        }
    };

    return (
        <div>
            <div className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border bg-white p-4">
                <div>
                    <Label htmlFor="asOf" className="text-xs">As of</Label>
                    <Input id="asOf" type="date" value={asOf} onChange={(e) => setAsOf(e.target.value)} />
                </div>
                <Button onClick={() => setApplied(asOf || undefined)} className="bg-green-700 hover:bg-green-800">
                    Apply
                </Button>
            </div>

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
                        <h3 className="mb-2 font-semibold text-gray-700">Assets</h3>
                        <ReportLineTable lines={data.assets.lines} total={data.assets.total} totalLabel="Total Assets" />
                    </div>
                    <div>
                        <h3 className="mb-2 font-semibold text-gray-700">Liabilities</h3>
                        <ReportLineTable
                            lines={data.liabilities.lines}
                            total={data.liabilities.total}
                            totalLabel="Total Liabilities"
                        />
                    </div>
                    <div>
                        <h3 className="mb-2 font-semibold text-gray-700">Equity</h3>
                        <ReportLineTable lines={data.equity.lines} total={data.equity.total} totalLabel="Total Equity" />
                    </div>

                    <div
                        className={`flex items-center justify-center gap-2 rounded-md p-4 font-medium ${data.balanced ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                            }`}
                    >
                        {data.balanced ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                        {data.balanced
                            ? 'Balance Sheet is balanced'
                            : 'Warning: Balance Sheet does not balance — investigate immediately'}
                    </div>
                </div>
            )}
        </div>
    );
}