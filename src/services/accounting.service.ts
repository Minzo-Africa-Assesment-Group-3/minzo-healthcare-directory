import { api } from '@/lib/axios-client';

export type AccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'INCOME' | 'EXPENSE';

export interface Account {
    _id: string;
    code: string;
    name: string;
    type: AccountType;
    isActive: boolean;
    description: string | null;
}

export interface CreateAccountDto {
    code: string;
    name: string;
    type: AccountType;
    description?: string;
}

export const accountingService = {
    getAllAccounts: () => api.get<Account[]>('/accounting/accounts').then((r) => r.data),

    createAccount: (dto: CreateAccountDto) =>
        api.post<Account>('/accounting/accounts', dto).then((r) => r.data),

    getBalance: (accountId: string) =>
        api
            .get<{ accountId: string; balance: string }>(`/accounting/accounts/${accountId}/balance`)
            .then((r) => r.data),

    updateAccount: (id: string, dto: { name?: string; description?: string }) =>
        api.patch<Account>(`/accounting/accounts/${id}`, dto).then((r) => r.data),
};