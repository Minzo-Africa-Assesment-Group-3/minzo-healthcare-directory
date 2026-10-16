import { api } from '@/lib/axios-client';
import { MoneyValue, PaginatedResult } from '@/lib/types';
import { Member } from './members.service';
import { downloadBlob } from '@/lib/download-file';

export interface SavingsAccountSummary {
    _id: string;
    accountNumber: string;
    balance: MoneyValue;
    status: string;
}

export interface SavingsTransactionItem {
    _id: string;
    type: 'DEPOSIT' | 'WITHDRAWAL' | 'REVERSAL';
    amount: MoneyValue;
    balanceAfter: MoneyValue;
    narration: string;
    createdAt: string;
    reversed: boolean;
}

export interface LoanSummary {
    _id: string;
    loanNumber: string;
    principal: MoneyValue;
    annualInterestRate: number;
    tenureMonths: number;
    status: 'ACTIVE' | 'OVERDUE' | 'CLOSED' | 'LIQUIDATED';
    outstandingPrincipal: MoneyValue;
    outstandingInterest: MoneyValue;
    totalOutstanding: MoneyValue;
    totalRepaid: MoneyValue;
    disbursementDate: string;
    maturityDate: string;
}

export interface LoanRepaymentItem {
    _id: string;
    type: 'SCHEDULED' | 'EARLY_LIQUIDATION';
    totalAmount: MoneyValue;
    principalPortion: MoneyValue;
    interestPortion: MoneyValue;
    paymentDate: string;
    narration: string;
}

export interface MemberStatement {
    member: Member;
    savings: {
        account: SavingsAccountSummary;
        transactions: SavingsTransactionItem[];
    } | null;
    loans: Array<{
        loan: LoanSummary;
        repayments: LoanRepaymentItem[];
        totalLoanPlusInterest: MoneyValue;
        totalLoanBalance: MoneyValue;
    }>;
}
export interface ReportLine {
    accountCode: string | null;
    accountName: string;
    amount: string;
}

export interface ProfitAndLoss {
    period: { from: string; to: string };
    income: ReportLine[];
    totalIncome: string;
    expenses: ReportLine[];
    totalExpenses: string;
    surplusOrDeficit: string;
    result: 'SURPLUS' | 'DEFICIT';
}

export interface BalanceSheetSection {
    lines: ReportLine[];
    total: string;
}

export interface BalanceSheet {
    asOfDate: string;
    assets: BalanceSheetSection;
    liabilities: BalanceSheetSection;
    equity: BalanceSheetSection;
    totalLiabilitiesAndEquity: string;
    balanced: boolean;
}

export interface SavingsRegisterItem {
    _id: string;
    accountNumber: string;
    balance: MoneyValue;
    status: string;
    memberId: { _id: string; membershipNumber: string; fullName: string }
}

export interface JournalLineItem {
    accountId: { _id: string; code: string; name: string } | string;
    debit: MoneyValue;
    credit: MoneyValue;
}

export interface JournalEntryItem {
    _id: string;
    date: string;
    narration: string;
    sourceModule: string;
    sourceReferenceId: string | null;
    lines: JournalLineItem[];
    reversed: boolean;
}

export interface CashBankReport {
    account: { _id: string; code: string; name: string };
    entries: JournalEntryItem[];
}

async function downloadReport(path: string, params: Record<string, string | undefined>, filenameFallback: string) {
    const response = await api.get(path, { params, responseType: 'blob' });
    const disposition = response.headers['content-disposition'] as string | undefined;
    const match = disposition?.match(/filename="(.+)"/);
    downloadBlob(response.data, match?.[1] ?? filenameFallback);
}

export const reportsService = {
    getMemberStatement: (memberId: string) =>
        api.get<MemberStatement>(`/reports/member-statement/${memberId}`).then((r) => r.data),

    getProfitAndLoss: (from?: string, to?: string) =>
        api.get<ProfitAndLoss>('/reports/profit-and-loss', { params: { from, to } }).then((r) => r.data),

    getBalanceSheet: (asOf?: string) =>
        api.get<BalanceSheet>('/reports/balance-sheet', { params: { asOf } }).then((r) => r.data),

    getSavingsRegister: (params: { status?: string; page?: number; limit?: number; search?: string } = {}) =>
        api.get<PaginatedResult<SavingsRegisterItem>>('/reports/savings-register', { params }).then((r) => r.data),

    getCashBankReport: (from?: string, to?: string) =>
        api.get<CashBankReport>('/reports/cash-bank', { params: { from, to } }).then((r) => r.data),

    getTransactionListing: (from?: string, to?: string) =>
        api.get<JournalEntryItem[]>('/reports/transactions', { params: { from, to } }).then((r) => r.data),

    exportProfitAndLoss: (from: string | undefined, to: string | undefined, format: 'excel' | 'pdf') =>
        downloadReport('/reports/profit-and-loss/export', { from, to, format }, `profit-and-loss.${format === 'pdf' ? 'pdf' : 'xlsx'}`),

    exportBalanceSheet: (asOf: string | undefined, format: 'excel' | 'pdf') =>
        downloadReport('/reports/balance-sheet/export', { asOf, format }, `balance-sheet.${format === 'pdf' ? 'pdf' : 'xlsx'}`),

    exportMemberStatement: async (memberId: string) => {
        const response = await api.get(`/reports/member-statement/${memberId}/export`, {
            responseType: 'blob',
        });
        const disposition = response.headers['content-disposition'] as string | undefined;
        const match = disposition?.match(/filename="(.+)"/);
        downloadBlob(response.data, match?.[1] ?? 'statement.pdf');
    },
};