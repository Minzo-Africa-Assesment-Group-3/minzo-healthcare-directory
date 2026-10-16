import axios from 'axios';
import { MoneyValue } from '@/lib/types';
import { downloadBlob } from '@/lib/download-file';

const portalApi = axios.create({ baseURL: '/api/portal-proxy' });

let isPortalRedirecting = false;

portalApi.interceptors.response.use(
    (r) => r,
    async (error) => {
        const status = error.response?.status;

        if (status === 401 && !isPortalRedirecting && !window.location.pathname.startsWith('/portal/login')) {
            isPortalRedirecting = true;
            await fetch('/api/portal-auth/logout', { method: 'POST' }).catch(() => { });
            window.location.href = '/portal/login?expired=1';
            return new Promise(() => { });
        }

        const message = error.response?.data?.message ?? 'Something went wrong';
        return Promise.reject(new Error(Array.isArray(message) ? message.join(', ') : message));
    },
);

export interface PortalMember {
    _id: string;
    membershipNumber: string;
    fullName: string;
    status: string;
    dateOfRegistration: string;
}

export interface PortalSavingsAccount {
    _id: string;
    accountNumber: string;
    balance: MoneyValue;
    status: string;
}

export interface PortalSavingsTransaction {
    _id: string;
    type: string;
    amount: MoneyValue;
    balanceAfter: MoneyValue;
    narration: string;
    createdAt: string;
}

export interface PortalLoan {
    _id: string;
    loanNumber: string;
    principal: MoneyValue;
    annualInterestRate: number;
    outstandingPrincipal: MoneyValue;
    status: string;
    disbursementDate: string;
    maturityDate: string;
}

export interface PortalLoanScheduleEntry {
    period: number;
    dueDate: string;
    principalDue: MoneyValue;
    interestDue: MoneyValue;
    totalDue: MoneyValue;
    outstandingPrincipalAfter: MoneyValue;
    paid: boolean;
    paidDate: string | null;
}

export interface PortalLoanDetail extends PortalLoan {
    schedule: PortalLoanScheduleEntry[];
}

export interface PortalLoanRepayment {
    _id: string;
    type: 'SCHEDULED' | 'EARLY_LIQUIDATION';
    totalAmount: MoneyValue;
    principalPortion: MoneyValue;
    interestPortion: MoneyValue;
    paymentDate: string;
    narration: string;
}

export interface PortalLoanDetailResponse {
    loan: PortalLoanDetail;
    repayments: PortalLoanRepayment[];
}

export const memberPortalService = {
    getProfile: () => portalApi.get<PortalMember>('/member-portal/me').then((r) => r.data),

    getSavingsAccount: () =>
        portalApi.get<PortalSavingsAccount>('/member-portal/savings').then((r) => r.data),

    getSavingsStatement: () =>
        portalApi.get<PortalSavingsTransaction[]>('/member-portal/savings/statement').then((r) => r.data),

    getLoans: () => portalApi.get<PortalLoan[]>('/member-portal/loans').then((r) => r.data),

    getLoanDetail: (id: string) =>
        portalApi.get<PortalLoanDetailResponse>(`/member-portal/loans/${id}`).then((r) => r.data),

    exportStatement: async () => {
        const response = await portalApi.get('/member-portal/statement/export', {
            responseType: 'blob',
        });
        const disposition = response.headers['content-disposition'] as string | undefined;
        const match = disposition?.match(/filename="(.+)"/);
        downloadBlob(response.data, match?.[1] ?? 'my-statement.pdf');
    },
};