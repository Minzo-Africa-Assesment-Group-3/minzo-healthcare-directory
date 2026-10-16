import { api } from '@/lib/axios-client';
import { PaginatedResult } from '@/lib/types';

export interface AuditLogEntry {
    _id: string;
    userId: string | null;
    username: string | null;
    method: string;
    route: string;
    requestBody: Record<string, unknown> | null;
    routeParams: Record<string, unknown> | null;
    statusCode: number;
    success: boolean;
    errorMessage: string | null;
    durationMs: number;
    ipAddress: string | null;
    createdAt: string;
}

export interface AuditLogFilters {
    userId?: string;
    route?: string;
    from?: string;
    to?: string;
}

export const auditService = {
    // getAll: (filters?: AuditLogFilters) =>
    //     api.get<AuditLogEntry[]>('/audit-logs', { params: filters }).then((r) => r.data),
    getAll: (filters: AuditLogFilters & { page?: number; limit?: number } = {}) =>
        api.get<PaginatedResult<AuditLogEntry>>('/audit-logs', { params: filters }).then((r) => r.data),
};