import { useQuery } from "@tanstack/react-query"

import { adminApi } from "./admin-api-client"

interface AdminBusinessDashboardCounts {
  approved: number
  pendingApproval: number
  rejected: number
  total: number
  unclaimed: number
}

interface AdminClaimDashboardCounts {
  approved: number
  pending: number
  rejected: number
}

interface AdminReviewDashboardCounts {
  flagged: number
  published: number
  rejected: number
  unreviewed: number
}

interface AdminUserDashboardCounts {
  active: number
  pendingEmailVerification: number
  total: number
}

export interface IAdminDashboardResponse {
  businesses: AdminBusinessDashboardCounts
  claims: AdminClaimDashboardCounts
  reviews: AdminReviewDashboardCounts
  users: AdminUserDashboardCounts
}

export const adminDashboardQueryKey = ["admin-dashboard-overview"] as const

async function getAdminDashboardData(): Promise<IAdminDashboardResponse> {
  const response = await adminApi.get<IAdminDashboardResponse>("/dashboard/overview")

  return response.data
}

export function useGetAdminDashboardDataQuery() {
  return useQuery({
    queryKey: adminDashboardQueryKey,
    queryFn: getAdminDashboardData,
    staleTime: 5 * 60 * 1000
  })
}
