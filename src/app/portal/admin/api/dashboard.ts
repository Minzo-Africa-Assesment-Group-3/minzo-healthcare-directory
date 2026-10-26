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

export type AdminDashboardActivityType =
  | "ADMIN_ACTION"
  | "BUSINESS_CLAIM_SUBMITTED"
  | "BUSINESS_REGISTRATION_SUBMITTED"
  | "CUSTOMER_REVIEW_SUBMITTED"

export interface AdminDashboardActivity {
  action: string | null
  entity: {
    id: string
    name: string | null
    type: string
  }
  id: string
  occurredAt: string
  type: AdminDashboardActivityType
}

interface AdminDashboardChanges {
  businessesRegisteredThisWeek: number
  claimsSubmittedThisWeek: number
  reviewsSubmittedThisWeek: number
  usersRegisteredThisWeek: number
}

export interface IAdminDashboardResponse {
  businesses: AdminBusinessDashboardCounts
  changes: AdminDashboardChanges
  claims: AdminClaimDashboardCounts
  recentActivities: AdminDashboardActivity[]
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
