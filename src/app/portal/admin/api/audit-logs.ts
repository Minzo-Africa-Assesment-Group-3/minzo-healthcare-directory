import { useQuery } from "@tanstack/react-query"

import { adminApi } from "./admin-api-client"
import type { AdminPaginatedResponse, AdminPaginationQuery } from "./pagination"

export interface AdminAuditLog {
  id: string
  actor: {
    type: "ADMIN" | "AUTOMATION"
    admin: { id: string; displayName: string; email: string } | null
    reference: string | null
  }
  action: string
  entity: { type: string; id: string }
  metadata: unknown | null
  createdAt: string
}

export interface AdminAuditLogsQuery extends AdminPaginationQuery {
  action?: string
  actorType?: "ADMIN" | "AUTOMATION"
  entityId?: string
  entityType?: string
}

export const adminAuditLogQueryKeys = {
  all: ["admin-audit-logs"] as const,
  list: (query: AdminAuditLogsQuery) => ["admin-audit-logs", "list", query] as const
}

export async function getAuditLogs(query: AdminAuditLogsQuery): Promise<AdminPaginatedResponse<AdminAuditLog>> {
  const response = await adminApi.get<AdminPaginatedResponse<AdminAuditLog>>("/audit-logs", { params: query })
  return response.data
}

export function useAdminAuditLogsQuery(query: AdminAuditLogsQuery) {
  return useQuery({
    queryKey: adminAuditLogQueryKeys.list(query),
    queryFn: () => getAuditLogs(query)
  })
}
