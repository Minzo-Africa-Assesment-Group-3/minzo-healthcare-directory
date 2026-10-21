'use client';

import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

import { Users, PiggyBank, HandCoins, Wallet, ClipboardCheck, AlertTriangle } from 'lucide-react';
import { KpiCard } from '@/components/kpi-card';
import { membersService } from '@/services/members.service';
import { loansService } from '@/services/loans.service';
import { approvalsService } from '@/services/approvals.service';
import { reportsService } from '@/services/reports.service';
import { dashboardService } from '@/services/dashboard.service';
import { useAuth } from '@/hooks/use-auth';
import { UserRole } from '@/lib/types';

const currency = (n: number) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n);

export default function DashboardHomePage() {
    const { user, hasRole } = useAuth();
    const canSeeReports = hasRole(UserRole.ADMIN) || hasRole(UserRole.CHECKER);

    const { data: members } = useQuery({
        queryKey: ['members', 'ACTIVE'],
        queryFn: () => membersService.getAll({ status: 'ACTIVE', limit: 1 }),
    });

    const { data: loans } = useQuery({
        queryKey: ['loans', 'ALL', 'dashboard'],
        queryFn: () => loansService.getRegister(),
    });

    const { data: summary } = useQuery({
        queryKey: ['dashboard-summary'],
        queryFn: dashboardService.getFinancialSummary,
    });

    const { data: pendingApprovals } = useQuery({
        queryKey: ['approvals', 'pending'],
        queryFn: () => approvalsService.getPending(),
        enabled: canSeeReports,
    });

    const { data: myRequests } = useQuery({
        queryKey: ['approvals', 'mine'],
        queryFn: approvalsService.getMine,
        enabled: !canSeeReports,
    });

    const { data: aging } = useQuery({
        queryKey: ['loans', 'aging'],
        queryFn: loansService.getAgingReport,
        enabled: canSeeReports,
    });

    const { data: profitAndLoss } = useQuery({
        queryKey: ['profit-and-loss', 'dashboard'],
        queryFn: () => reportsService.getProfitAndLoss(),
        enabled: canSeeReports,
    });

    const { data: balanceSheet } = useQuery({
        queryKey: ['balance-sheet', 'dashboard'],
        queryFn: () => reportsService.getBalanceSheet(),
        enabled: canSeeReports,
    });

    const activeLoansCount = loans?.data?.filter((l) => l.status === 'ACTIVE' || l.status === 'OVERDUE').length ?? 0;
    const pendingCount = canSeeReports
        ? pendingApprovals?.length ?? 0
        : myRequests?.filter((r) => r.status === 'PENDING').length ?? 0;

    const bsChartData = balanceSheet
        ? [
            { name: 'Assets', value: parseFloat(balanceSheet.assets.total), fill: '#16a34a' },
            { name: 'Liabilities', value: parseFloat(balanceSheet.liabilities.total), fill: '#dc2626' },
            { name: 'Equity', value: parseFloat(balanceSheet.equity.total), fill: '#2563eb' },
        ]
        : [];

    const plChartData = profitAndLoss
        ? [
            { name: 'Income', value: parseFloat(profitAndLoss.totalIncome), fill: '#16a34a' },
            { name: 'Expenses', value: parseFloat(profitAndLoss.totalExpenses), fill: '#dc2626' },
        ]
        : [];

    return (
        <div className="space-y-6">
            {/* <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {user?.fullName}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <KpiCard label="Active Members" value={String(members?.total ?? '—')} icon={Users} />
                <KpiCard
                    label="Total Savings"
                    value={summary ? currency(summary.savingsTotal) : '—'}
                    icon={PiggyBank}
                    accent="text-green-700"
                />
                <KpiCard
                    label="Loan Portfolio (Outstanding)"
                    value={summary ? currency(summary.loansOutstanding) : '—'}
                    icon={HandCoins}
                    accent="text-blue-700"
                />
                <KpiCard
                    label="Cash & Bank"
                    value={summary ? currency(summary.cash) : '—'}
                    icon={Wallet}
                />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <KpiCard label="Active Loans" value={String(activeLoansCount)} icon={HandCoins} />
                <KpiCard
                    label={canSeeReports ? 'Pending Approvals' : 'My Pending Requests'}
                    value={String(pendingCount)}
                    icon={ClipboardCheck}
                    accent={pendingCount > 0 ? 'text-amber-600' : 'text-gray-900'}
                />
                {canSeeReports && (
                    <KpiCard
                        label="Overdue Loans"
                        value={String(aging?.length ?? 0)}
                        icon={AlertTriangle}
                        accent={aging && aging.length > 0 ? 'text-red-600' : 'text-gray-900'}
                    />
                )}
            </div>

            {canSeeReports && (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="rounded-lg border bg-white p-5">
                        <h3 className="mb-4 font-semibold text-gray-700">Balance Sheet Composition</h3>
                        {balanceSheet ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={bsChartData}>
                                    <XAxis dataKey="name" fontSize={12} />
                                    <YAxis
                                        fontSize={12}
                                        tickFormatter={(v) => new Intl.NumberFormat('en-NG', { notation: 'compact' }).format(v)}
                                    />
                                    <Tooltip formatter={(value) => currency(Number(value ?? 0))} />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {bsChartData.map((entry, i) => (
                                            <Cell key={i} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-sm text-gray-500">Loading…</p>
                        )}
                        {balanceSheet && !balanceSheet.balanced && (
                            <p className="mt-2 text-xs font-medium text-red-600">
                                Warning: Balance Sheet does not currently balance.
                            </p>
                        )}
                    </div>

                    <div className="rounded-lg border bg-white p-5">
                        <h3 className="mb-4 font-semibold text-gray-700">
                            Income vs Expenses (This Year)
                        </h3>
                        {profitAndLoss ? (
                            <>
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={plChartData}>
                                        <XAxis dataKey="name" fontSize={12} />
                                        <YAxis
                                            fontSize={12}
                                            tickFormatter={(v) => new Intl.NumberFormat('en-NG', { notation: 'compact' }).format(v)}
                                        />
                                        <Tooltip formatter={(value) => currency(Number(value ?? 0))} />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                            {plChartData.map((entry, i) => (
                                                <Cell key={i} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                                <p
                                    className={`mt-2 text-sm font-medium ${profitAndLoss.result === 'SURPLUS' ? 'text-green-700' : 'text-red-600'
                                        }`}
                                >
                                    {profitAndLoss.result}: {currency(parseFloat(profitAndLoss.surplusOrDeficit))}
                                </p>
                            </>
                        ) : (
                            <p className="text-sm text-gray-500">Loading…</p>
                        )}
                    </div>
                </div>
            )} */}


        </div>
    );
}