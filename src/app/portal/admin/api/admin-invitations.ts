import { useMutation, useQueryClient } from "@tanstack/react-query"

import { adminApi } from "./admin-api-client"
import type { AdminPaginatedResponse, AdminPaginationQuery } from "./pagination"

export interface InviteAdministratorInput {
  displayName: string
  email: string
  roleName: string
}

export interface InviteAdministratorResult {
  id: string
  expiresAt: string
  message: string
}

export type AdminInvitationStatus = "PENDING" | "ACCEPTED" | "REVOKED"

export interface AdminInvitation {
  id: string
  displayName: string
  email: string
  status: AdminInvitationStatus
  expiresAt: string
  acceptedAt: string | null
  revokedAt: string | null
  createdAt: string
  role: {
    id: string
    name: string
  }
  invitedBy: {
    id: string
    displayName: string
    email: string
  }
}

export interface AdminInvitationsQuery extends AdminPaginationQuery {
  search?: string
  status?: AdminInvitationStatus
}

export const adminInvitationQueryKeys = {
  all: ["admin-invitations"] as const,
  list: (query: AdminInvitationsQuery) => ["admin-invitations", "list", query] as const
}

async function inviteAdministrator(input: InviteAdministratorInput): Promise<InviteAdministratorResult> {
  const response = await adminApi.post<InviteAdministratorResult>("/invitations", input)
  return response.data
}

export async function getAdminInvitations(query: AdminInvitationsQuery): Promise<AdminPaginatedResponse<AdminInvitation>> {
  const response = await adminApi.get<AdminPaginatedResponse<AdminInvitation>>("/invitations", { params: query })
  return response.data
}

async function revokeAdministratorInvitation(invitationId: string): Promise<{ id: string; revokedAt: string; status: "REVOKED" }> {
  const response = await adminApi.patch<{ id: string; revokedAt: string; status: "REVOKED" }>(`/invitations/${invitationId}/revoke`, {})
  return response.data
}

export function useInviteAdministratorMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: inviteAdministrator,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminInvitationQueryKeys.all })
    }
  })
}

export function useRevokeAdministratorInvitationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: revokeAdministratorInvitation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminInvitationQueryKeys.all })
    }
  })
}
