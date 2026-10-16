import { api } from '@/lib/axios-client';
import { MoneyValue, PaginatedResult } from '@/lib/types';
import { downloadBlob } from '@/lib/download-file';

export type LoanStatus = 'ACTIVE' | 'OVERDUE' | 'CLOSED' | 'LIQUIDATED';

export interface LoanScheduleEntry {
    period: number;
    dueDate: string;
    principalDue: MoneyValue;
    interestDue: MoneyValue;
    totalDue: MoneyValue;
    outstandingPrincipalAfter: MoneyValue;
    paid: boolean;
    paidDate: string | null;
}

export interface Loan {
    _id: string;
    memberId: { _id: string; membershipNumber: string; fullName: string } | string;
    loanNumber: string;
    principal: MoneyValue;
    annualInterestRate: number;
    tenureMonths: number;
    disbursementDate: string;
    maturityDate: string;
    status: LoanStatus;
    outstandingPrincipal: MoneyValue;
    outstandingInterest: MoneyValue;
    totalOutstanding: MoneyValue;
    totalRepaid: MoneyValue;
    schedule: LoanScheduleEntry[];
}

export interface CreateLoanDto {
    memberId: string;
    principal: number;
    annualInterestRate: number;
    tenureMonths: number;
}

export interface RecordRepaymentDto {
    loanId: string;
    amount: number;
    narration: string;
}

export interface RestructureLoanDto {
    loanId: string;
    newAnnualInterestRate?: number;
    newTenureMonths?: number;
    reason: string;
}

export interface WaiveInterestDto {
    loanId: string;
    schedulePeriod: number;
    waiveAmount: number;
    reason: string;
}

export interface LoanAgingItem {
    loanId: string;
    loanNumber: string;
    memberId: string;
    outstandingPrincipal: string;
    daysOverdue: number;
    agingBucket: string;
}

export const loansService = {
    // getRegister: (status?: LoanStatus) =>
    //     api.get<Loan[]>('/loans', { params: status ? { status } : {} }).then((r) => r.data),
    getRegister: (params: { status?: LoanStatus; page?: number; limit?: number; search?: string } = {}) =>
        api.get<PaginatedResult<Loan>>('/loans', { params }).then((r) => r.data),

    getById: (id: string) => api.get<Loan>(`/loans/${id}`).then((r) => r.data),

    getByMember: (memberId: string) =>
        api.get<Loan[]>(`/loans/member/${memberId}`).then((r) => r.data),

    requestDisbursement: (dto: CreateLoanDto) =>
        api.post('/loans/disbursements', dto).then((r) => r.data),

    requestRepayment: (dto: RecordRepaymentDto) =>
        api.post('/loans/repayments', dto).then((r) => r.data),

    requestLiquidation: (loanId: string) =>
        api.post('/loans/liquidations', { loanId }).then((r) => r.data),

    requestRestructure: (dto: RestructureLoanDto) =>
        api.post('/loans/restructure', dto).then((r) => r.data),

    requestInterestWaiver: (dto: WaiveInterestDto) =>
        api.post('/loans/waive-interest', dto).then((r) => r.data),

    getAgingReport: () => api.get<LoanAgingItem[]>('/loans/reports/aging').then((r) => r.data),

    exportStatement: async (loanId: string, loanNumber: string) => {
        const response = await api.get(`/loans/${loanId}/statement/export`, { responseType: 'blob' });
        downloadBlob(response.data, `loan-statement-${loanNumber}.pdf`);
    },
};