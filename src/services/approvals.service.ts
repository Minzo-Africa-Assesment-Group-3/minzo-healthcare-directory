import { api } from '@/lib/axios-client';

export type ApprovalModule = 'SAVINGS' | 'LOANS' | 'EXPENSES' | 'MEMBERS' | 'ACCOUNTING';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'RETURNED';

export interface ApprovalHistoryEntry {
    action: string;
    byUserId: string;
    at: string;
    comment: string | null;
}

export interface ApprovalRequestItem {
    _id: string;
    module: ApprovalModule;
    action: string;
    payload: Record<string, unknown>;
    entityId: string | null;
    status: ApprovalStatus;
    makerId: { _id: string; username: string; fullName: string } | string;
    checkerId: string | null;
    comment: string | null;
    decidedAt: string | null;
    history: ApprovalHistoryEntry[];
    createdAt: string;
}

export const approvalsService = {
    getPending: (module?: ApprovalModule) =>
        api
            .get<ApprovalRequestItem[]>('/approvals/pending', { params: module ? { module } : {} })
            .then((r) => r.data),

    getMine: () => api.get<ApprovalRequestItem[]>('/approvals/mine').then((r) => r.data),

    getAllFiltered: (status?: ApprovalStatus, module?: ApprovalModule) =>
        api
            .get<ApprovalRequestItem[]>('/approvals', { params: { status, module } })
            .then((r) => r.data),

    approve: (id: string) => api.patch(`/approvals/${id}/approve`).then((r) => r.data),

    reject: (id: string, comment?: string) =>
        api.patch(`/approvals/${id}/reject`, { comment }).then((r) => r.data),

    returnToMaker: (id: string, comment?: string) =>
        api.patch(`/approvals/${id}/return`, { comment }).then((r) => r.data),

    resubmit: (id: string, payload: Record<string, unknown>) =>
        api.patch(`/approvals/${id}/resubmit`, { payload }).then((r) => r.data),
};