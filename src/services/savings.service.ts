import { api } from '@/lib/axios-client';
import { MoneyValue, PaginatedResult } from '@/lib/types';

export interface SavingsTransactionItem {
    _id: string;
    type: 'DEPOSIT' | 'WITHDRAWAL' | 'REVERSAL';
    amount: MoneyValue;
    balanceAfter: MoneyValue;
    narration: string;
    createdAt: string;
    reversed: boolean;
}

export interface SavingsAccountListItem {
    _id: string;
    accountNumber: string;
    balance: MoneyValue;
    status: 'ACTIVE' | 'DORMANT' | 'CLOSED';
    memberId: {
        _id: string;
        membershipNumber: string;
        fullName: string;
    };
}

export interface CreateTransactionDto {
    savingsAccountId: string;
    amount: number;
    narration: string;
}

export const savingsService = {
    getAllAccounts: (params: { status?: string; page?: number; limit?: number; search?: string } = {}) =>
        api.get<PaginatedResult<SavingsAccountListItem>>('/savings/accounts', { params })
            .then((r) => r.data),

    getStatement: (accountId: string, params: { page?: number; limit?: number } = {}) =>
        api
            .get<PaginatedResult<SavingsTransactionItem>>(`/savings/accounts/${accountId}/statement`, { params })
            .then((r) => r.data),

    openAccount: (memberId: string) =>
        api.post('/savings/accounts', { memberId }).then((r) => r.data),

    requestDeposit: (dto: CreateTransactionDto) =>
        api.post('/savings/deposits', dto).then((r) => r.data),

    requestWithdrawal: (dto: CreateTransactionDto) =>
        api.post('/savings/withdrawals', dto).then((r) => r.data),
};