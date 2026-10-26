import { useMutation } from "@tanstack/react-query"

import { adminApi } from "./admin-api-client"

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

async function inviteAdministrator(input: InviteAdministratorInput): Promise<InviteAdministratorResult> {
  const response = await adminApi.post<InviteAdministratorResult>("/invitations", input)
  return response.data
}

export function useInviteAdministratorMutation() {
  return useMutation({ mutationFn: inviteAdministrator })
}
