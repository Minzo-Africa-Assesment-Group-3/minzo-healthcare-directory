import { api } from '@/lib/axios-client';
import { MoneyValue, PaginatedResult } from '@/lib/types';

export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'CHEQUE' | 'OTHER';

export interface ExpenseHead {
    _id: string;
    name: string;
    accountCode: string;
    isActive: boolean;
}

export interface Expense {
    _id: string;
    date: string;
    description: string;
    amount: MoneyValue;
    payee: string;
    paymentMethod: PaymentMethod;
    expenseHeadId: string;
    referenceDocument: string | null;
}

export interface CreateExpenseHeadDto {
    name: string;
    accountCode: string;
}

export interface RecordExpenseDto {
    description: string;
    amount: number;
    payee: string;
    paymentMethod: PaymentMethod;
    expenseHeadId: string;
    referenceDocument?: string;
}

export interface ExpenseReportByHeadItem {
    expenseHeadId: string;
    expenseHeadName: string;
    totalAmount: number;
    count: number;
}

export const expensesService = {
    getAllHeads: () => api.get<ExpenseHead[]>('/expenses/heads').then((r) => r.data),

    createHead: (dto: CreateExpenseHeadDto) =>
        api.post<ExpenseHead>('/expenses/heads', dto).then((r) => r.data),

    // getAll: (filters?: { expenseHeadId?: string; payee?: string; from?: string; to?: string }) =>
    //     api.get<Expense[]>('/expenses', { params: filters }).then((r) => r.data),
    getAll: (params: {
        expenseHeadId?: string;
        payee?: string;
        from?: string;
        to?: string;
        page?: number;
        limit?: number;
        search?: string;
    } = {}) => api.get<PaginatedResult<Expense>>('/expenses', { params }).then((r) => r.data),

    recordExpense: (dto: RecordExpenseDto) => api.post('/expenses', dto).then((r) => r.data),

    getReportByHead: (from?: string, to?: string) =>
        api
            .get<ExpenseReportByHeadItem[]>('/expenses/reports/by-head', { params: { from, to } })
            .then((r) => r.data),
};