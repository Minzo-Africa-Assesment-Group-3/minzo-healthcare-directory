import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { adminApi } from "./admin-api-client"
import type { AdminPaginatedResponse, AdminPaginationQuery } from "./pagination"

export type CustomerReviewModerationStatus = "UNREVIEWED" | "APPROVED" | "FLAGGED" | "REJECTED"

export interface AdminCustomerReview {
  id: string
  business: { id: string; displayName: string; slug: string }
  author: { id: string; displayName: string; email: string }
  stars: number
  text: string
  isAnonymous: boolean
  publicationStatus: "PUBLISHED" | "HIDDEN"
  moderationStatus: CustomerReviewModerationStatus
  submittedAt: string
  updatedAt: string
  lastModeration: AdminReviewModerationAction | null
}

export interface AdminReviewModerationAction {
  id: string
  actorType: "ADMIN" | "AUTOMATION"
  decision: "APPROVED" | "FLAGGED" | "REJECTED"
  adminUserId: string | null
  actorReference: string | null
  reason: string | null
  createdAt: string
  moderatedBy: "MINZO_ADMIN" | "AI"
}

export interface AdminCustomerReviewsQuery extends AdminPaginationQuery {
  moderationStatus?: CustomerReviewModerationStatus
  search?: string
}

export type ModerateCustomerReviewInput =
  | { reviewId: string; decision: "APPROVED"; reason?: string }
  | { reviewId: string; decision: "REJECTED"; reason: string }

export interface ModerateCustomerReviewResult {
  reviewId: string
  publicationStatus: "PUBLISHED" | "HIDDEN"
  moderationStatus: CustomerReviewModerationStatus
  moderation: AdminReviewModerationAction
}

export const adminCustomerReviewQueryKeys = {
  all: ["admin-customer-reviews"] as const,
  list: (query: AdminCustomerReviewsQuery) => ["admin-customer-reviews", "list", query] as const
}

async function getCustomerReviews(query: AdminCustomerReviewsQuery): Promise<AdminPaginatedResponse<AdminCustomerReview>> {
  const response = await adminApi.get<AdminPaginatedResponse<AdminCustomerReview>>("/customer-reviews", { params: query })
  return response.data
}

async function moderateCustomerReview({ reviewId, ...body }: ModerateCustomerReviewInput): Promise<ModerateCustomerReviewResult> {
  const response = await adminApi.patch<ModerateCustomerReviewResult>(`/customer-reviews/${reviewId}/moderation`, body)
  return response.data
}

export function useAdminCustomerReviewsQuery(query: AdminCustomerReviewsQuery) {
  return useQuery({
    queryKey: adminCustomerReviewQueryKeys.list(query),
    queryFn: () => getCustomerReviews(query)
  })
}

export function useModerateCustomerReviewMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: moderateCustomerReview,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminCustomerReviewQueryKeys.all })
      await queryClient.invalidateQueries({ queryKey: ["admin-dashboard-overview"] })
    }
  })
}
