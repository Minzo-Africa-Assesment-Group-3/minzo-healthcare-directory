import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { adminApi } from "./admin-api-client"
import type { AdminPaginatedResponse, AdminPaginationQuery } from "./pagination"

export type AdminBusinessClaimStatus = "PENDING" | "APPROVED" | "REJECTED"

export interface AdminBusinessClaim {
  id: string
  business: { id: string; displayName: string; slug: string }
  claimant: { id: string; displayName: string; email: string; phone: string | null }
  requestedRole: "OWNER" | "MANAGER"
  status: AdminBusinessClaimStatus
  claimantNote: string | null
  evidenceDocument: { originalFileName: string; mimeType: string; sizeBytes: number }
  reviewNote: string | null
  reviewedAt: string | null
  reviewedByAdminId: string | null
  createdAt: string
}

export interface AdminBusinessClaimsQuery extends AdminPaginationQuery {
  status?: AdminBusinessClaimStatus
}

export type ModerateBusinessClaimInput =
  | { claimId: string; decision: "APPROVED"; reviewNote?: string }
  | { claimId: string; decision: "REJECTED"; reviewNote: string }

interface ClaimEvidenceDownloadAuthorization {
  expiresAt: string
  url: string
}

export const adminBusinessClaimQueryKeys = {
  all: ["admin-business-claims"] as const,
  detail: (claimId: string) => ["admin-business-claims", "detail", claimId] as const,
  list: (query: AdminBusinessClaimsQuery) => ["admin-business-claims", "list", query] as const
}

export async function getAdminBusinessClaims(query: AdminBusinessClaimsQuery): Promise<AdminPaginatedResponse<AdminBusinessClaim>> {
  const response = await adminApi.get<AdminPaginatedResponse<AdminBusinessClaim>>("/business-claims", { params: query })

  return response.data
}

async function getAdminBusinessClaim(claimId: string): Promise<AdminBusinessClaim> {
  const response = await adminApi.get<AdminBusinessClaim>(`/business-claims/${claimId}`)

  return response.data
}

export async function getClaimEvidenceDownloadUrl(claimId: string): Promise<ClaimEvidenceDownloadAuthorization> {
  const response = await adminApi.get<ClaimEvidenceDownloadAuthorization>(`/business-claims/${claimId}/evidence-download-url`)

  return response.data
}

async function moderateBusinessClaim({ claimId, ...body }: ModerateBusinessClaimInput): Promise<AdminBusinessClaim> {
  const response = await adminApi.patch<AdminBusinessClaim>(`/business-claims/${claimId}`, body)

  return response.data
}

export function useAdminBusinessClaimQuery(claimId?: string) {
  return useQuery({
    queryKey: adminBusinessClaimQueryKeys.detail(claimId ?? "missing"),
    queryFn: () => getAdminBusinessClaim(claimId ?? ""),
    enabled: Boolean(claimId)
  })
}

export function useModerateBusinessClaimMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: moderateBusinessClaim,
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: adminBusinessClaimQueryKeys.all })
      await queryClient.invalidateQueries({ queryKey: adminBusinessClaimQueryKeys.detail(variables.claimId) })
      await queryClient.invalidateQueries({ queryKey: ["admin-dashboard-overview"] })
    }
  })
}
