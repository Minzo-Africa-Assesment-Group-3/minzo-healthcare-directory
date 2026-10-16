'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ChevronDown, ChevronUp, PiggyBank } from 'lucide-react';
import { reportsService } from '@/services/reports.service';
import { savingsService } from '@/services/savings.service';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatMoney, formatDate } from '@/lib/format';
import { SetPasswordDialog } from './set-password-dialog';
import { useAuth } from '@/hooks/use-auth';
import { UserRole } from '@/lib/types';
import { ChangeStatusDialog } from '../change-status-dialog';

import { Download } from 'lucide-react';
import { useState } from 'react';
import { notify } from '@/lib/toast';
import { PaginationControls } from '@/components/pagination-controls';

const memberStatusColor: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-800 hover:bg-green-100',
    INACTIVE: 'bg-gray-100 text-gray-700 hover:bg-gray-100',
    SUSPENDED: 'bg-red-100 text-red-800 hover:bg-red-100',
};

const loanStatusColor: Record<string, string> = {
    ACTIVE: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
    OVERDUE: 'bg-red-100 text-red-800 hover:bg-red-100',
    CLOSED: 'bg-gray-100 text-gray-700 hover:bg-gray-100',
    LIQUIDATED: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
};

export default function MemberDetailPage() {
    const { hasRole } = useAuth();
    const isAdmin = hasRole(UserRole.ADMIN);
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isExporting, setIsExporting] = useState(false);
    const [savingsPage, setSavingsPage] = useState(1);
    const [expandedLoanId, setExpandedLoanId] = useState<string | null>(null);

    const { data, isLoading, error } = useQuery({
        queryKey: ['member-statement', id],
        queryFn: () => reportsService.getMemberStatement(id),
    });

    const { data: savingsStatement, isLoading: isSavingsLoading } = useQuery({
        queryKey: ['savings-statement', data?.savings?.account._id, savingsPage],
        queryFn: () => savingsService.getStatement(data!.savings!.account._id, { page: savingsPage, limit: 15 }),
        enabled: !!data?.savings?.account,
    });

    const { mutate: openAccount, isPending: isOpeningAccount } = useMutation({
        mutationFn: () => savingsService.openAccount(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['member-statement', id] });
        },
    });

    const handleExport = async () => {
        setIsExporting(true);
        try {
            await reportsService.exportMemberStatement(member._id);
            notify.success('Download started');
        } catch {
            notify.error('Export failed');
        } finally {
            setIsExporting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div>
                <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                    <ArrowLeft size={16} className="mr-1" /> Back
                </Button>
                <p className="text-red-600">Could not load this member. They may not exist.</p>
            </div>
        );
    }

    const { member, savings, loans } = data;

    return (
        <div>
            <Button variant="ghost" onClick={() => router.back()} className="mb-4 -ml-2">
                <ArrowLeft size={16} className="mr-1" /> Back to Members
            </Button>

            <div className="mb-6 md:flex items-start justify-between space-y-4 md:space-y-0">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900">{member.fullName}</h1>
                        <Badge className={memberStatusColor[member.status]} variant="secondary">
                            {member.status}
                        </Badge>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                        {member.membershipNumber} · Registered {formatDate(member.dateOfRegistration)}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" size="sm" disabled={isExporting} onClick={handleExport}>
                        <Download size={14} className="mr-1" /> {isExporting ? 'Exporting…' : 'Download Statement'}
                    </Button>
                    {isAdmin && (
                        <>
                            <ChangeStatusDialog memberId={member._id} currentStatus={member.status} />
                            <SetPasswordDialog memberId={member._id} membershipNumber={member.membershipNumber} />
                        </>
                    )}
                </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 rounded-lg border bg-white p-4 sm:grid-cols-3">
                <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium">{member.phoneNumber}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium">{member.email ?? '—'}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm font-medium">{member.address ?? '—'}</p>
                </div>
            </div>

            <Tabs defaultValue="savings">
                <TabsList>
                    <TabsTrigger value="savings">Savings</TabsTrigger>
                    <TabsTrigger value="loans">Loans ({loans.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="savings" className="mt-4">
                    {!savings ? (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-white py-12 text-center">
                            <PiggyBank className="mb-3 text-gray-300" size={40} />
                            <p className="mb-3 text-sm text-gray-500">
                                This member doesn&apos;t have a savings account yet.
                            </p>
                            <Button
                                onClick={() => openAccount()}
                                disabled={isOpeningAccount}
                                className="bg-green-700 hover:bg-green-800"
                            >
                                {isOpeningAccount ? 'Opening…' : 'Open Savings Account'}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border bg-white p-4">
                                <div>
                                    <p className="text-xs text-gray-500">Account Number</p>
                                    <p className="font-medium">{savings.account.accountNumber}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">Current Balance</p>
                                    <p className="text-lg font-bold text-green-700">
                                        {formatMoney(savings.account.balance)}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-md border bg-white">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Narration</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                            <TableHead className="text-right">Balance After</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isSavingsLoading ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-20 text-center text-gray-500">Loading…</TableCell>
                                            </TableRow>
                                        ) : !savingsStatement || savingsStatement.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-20 text-center text-gray-500">No transactions yet.</TableCell>
                                            </TableRow>
                                        ) : (
                                            savingsStatement.data.map((tx) => (
                                                <TableRow key={tx._id}>
                                                    <TableCell>{formatDate(tx.createdAt)}</TableCell>
                                                    <TableCell>
                                                        {tx.reversed ? (
                                                            <Badge variant="secondary" className="bg-gray-100 text-gray-500">{tx.type} (reversed)</Badge>
                                                        ) : (
                                                            tx.type
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-sm text-gray-600">{tx.narration}</TableCell>
                                                    <TableCell className="text-right">{formatMoney(tx.amount)}</TableCell>
                                                    <TableCell className="text-right">{formatMoney(tx.balanceAfter)}</TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>

                                {savingsStatement && (
                                    <PaginationControls
                                        page={savingsStatement.page}
                                        totalPages={savingsStatement.totalPages}
                                        total={savingsStatement.total}
                                        limit={savingsStatement.limit}
                                        onPageChange={setSavingsPage}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="loans" className="mt-4 space-y-4">
                    {loans.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-white py-12 text-center">
                            <p className="text-sm text-gray-500">This member has no loans.</p>
                        </div>
                    ) : (
                        loans.map(({ loan, repayments, totalLoanPlusInterest }) => {
                            const isExpanded = expandedLoanId === loan._id;

                            return (
                                <div key={loan._id} className="rounded-lg border bg-white">
                                    <button
                                        onClick={() => setExpandedLoanId(isExpanded ? null : loan._id)}
                                        className="flex w-full items-center justify-between p-4 text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <p className="font-semibold">{loan.loanNumber}</p>
                                            <Badge className={loanStatusColor[loan.status]} variant="secondary">
                                                {loan.status}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-gray-500">
                                                Outstanding: <span className="font-medium text-gray-900">{formatMoney(loan.totalOutstanding)}</span>
                                            </span>
                                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </div>
                                    </button>

                                    {isExpanded && (
                                        <div className="border-t p-4">
                                            {/* <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                                                <div>
                                                    <p className="text-xs text-gray-500">Principal</p>
                                                    <p className="font-medium">{formatMoney(loan.principal)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Rate</p>
                                                    <p className="font-medium">{loan.annualInterestRate}% p.a.</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Outstanding</p>
                                                    <p className="font-medium">{formatMoney(loan.outstandingPrincipal)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Total Repaid</p>
                                                    <p className="font-medium">{formatMoney(loan.totalRepaid)}</p>
                                                </div>
                                            </div> */}

                                            <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                                                <div>
                                                    <p className="text-xs text-gray-500">Principal</p>
                                                    <p className="font-medium">{formatMoney(loan.principal)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Rate</p>
                                                    <p className="font-medium">{loan.annualInterestRate}% p.a.</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Total Outstanding Payment</p>
                                                    <p className="font-medium">{formatMoney(loan.totalOutstanding)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Total Payment</p>
                                                    <p className="font-medium">{formatMoney(totalLoanPlusInterest)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Total Repaid</p>
                                                    <p className="font-medium">{formatMoney(loan.totalRepaid)}</p>
                                                </div>
                                            </div>

                                            <Separator className="mb-3" />

                                            <p className="mb-2 text-xs font-medium text-gray-500">Repayment History</p>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Date</TableHead>
                                                        <TableHead>Type</TableHead>
                                                        <TableHead className="text-right">Principal</TableHead>
                                                        <TableHead className="text-right">Interest</TableHead>
                                                        <TableHead className="text-right">Total</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {repayments.length === 0 ? (
                                                        <TableRow>
                                                            <TableCell colSpan={5} className="h-16 text-center text-gray-500">No repayments yet.</TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        repayments.map((r) => (
                                                            <TableRow key={r._id}>
                                                                <TableCell>{formatDate(r.paymentDate)}</TableCell>
                                                                <TableCell>{r.type === 'EARLY_LIQUIDATION' ? 'Liquidation' : 'Scheduled'}</TableCell>
                                                                <TableCell className="text-right">{formatMoney(r.principalPortion)}</TableCell>
                                                                <TableCell className="text-right">{formatMoney(r.interestPortion)}</TableCell>
                                                                <TableCell className="text-right font-medium">{formatMoney(r.totalAmount)}</TableCell>
                                                            </TableRow>
                                                        ))
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}