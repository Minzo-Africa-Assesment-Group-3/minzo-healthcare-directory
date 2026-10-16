'use client';

import { useQuery } from '@tanstack/react-query';
import { memberPortalService } from '@/services/member-portal.service';
import { formatMoney } from '@/lib/format';
import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PortalOverviewPage() {
    const [isExporting, setIsExporting] = useState(false);
    const { data: savings } = useQuery({
        queryKey: ['portal-savings'],
        queryFn: memberPortalService.getSavingsAccount,
        retry: false,
    });
    const { data: loans } = useQuery({
        queryKey: ['portal-loans'],
        queryFn: memberPortalService.getLoans,
    });

    const activeLoans = loans?.filter((l) => l.status === 'ACTIVE' || l.status === 'OVERDUE') ?? [];

    const handleExport = async () => {
        setIsExporting(true);
        try {
            await memberPortalService.exportStatement();
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={isExporting}
                    onClick={handleExport}
                >
                    <Download size={14} className="mr-1" /> {isExporting ? 'Preparing…' : 'Download Statement'}
                </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border bg-white p-5">
                    <p className="text-sm text-gray-500">Savings Balance</p>
                    <p className="mt-1 text-2xl font-bold text-green-700">
                        {savings ? formatMoney(savings.balance) : '—'}
                    </p>
                </div>
                <div className="rounded-lg border bg-white p-5">
                    <p className="text-sm text-gray-500">Active Loans</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">{activeLoans.length}</p>
                </div>
            </div>
        </div>
    );
}