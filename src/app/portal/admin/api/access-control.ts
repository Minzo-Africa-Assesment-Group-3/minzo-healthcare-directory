import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { adminApi } from "./admin-api-client"

export interface AdminPermission {
    id: string
    name: string
    description: string | null
}

export interface AdminRole {
    id: string
    name: string
    description: string | null
    isSystem: boolean
    permissions: AdminPermission[]
}

export interface AdminRole {
    id: string
    name: string
    description: string | null
    isSystem: boolean
    permissions: AdminPermission[]
}

export interface AdminAdministrator { 
    id: string
    displayName: string
    email: string
    status: "ACTIVE" | "SUSPENDED" | "DEACTIVATED"
    roles: Array<{
      id: string
      name: string
    }>
}


export interface CreateAdminRoleInput {
    name: string
    description?: string
  }

  export interface SyncRolePermissionsInput {
    roleId: string
    permissionIds: string[]
  }

  export interface SyncAdministratorRolesInput {
    adminUserId: string
    roleIds: string[]
  }

  export const accessControlQueryKeys = {
    all: ["admin-access-control"] as const,
    administrators: ["admin-access-control", "administrators"] as const,
    permissions: ["admin-access-control", "permissions"] as const,
    roles: ["admin-access-control", "roles"] as const
  }

  async function getPermissions(): Promise<AdminPermission[]> {
    const response = await adminApi.get<{ data: AdminPermission[] }>("/permissions")

    return response.data.data
  }

  async function getRoles(): Promise<AdminRole[]> {
    const response = await adminApi.get<{ data: AdminRole[] }>("/roles")

    return response.data.data
  }

  async function getAdministrators(): Promise<AdminAdministrator[]> {
    const response = await adminApi.get<{ data: AdminAdministrator[] }>("/users")

    return response.data.data
  }

  async function createAdminRole(input: CreateAdminRoleInput): Promise<AdminRole> {
    const response = await adminApi.post<AdminRole>("/roles", input)

    return response.data
  }

  async function syncRolePermissions({
    roleId,
    permissionIds
  }: SyncRolePermissionsInput): Promise<AdminRole> {
    const response = await adminApi.put<AdminRole>(
      `/roles/${roleId}/permissions`,
      { permissionIds }
    )

    return response.data
  }

  async function syncAdministratorRoles({
    adminUserId,
    roleIds
  }: SyncAdministratorRolesInput): Promise<AdminAdministrator> {
    const response = await adminApi.put<AdminAdministrator>(
      `/users/${adminUserId}/roles`,
      { roleIds }
    )

    return response.data
  }

  export function useAdminPermissionsQuery() {
    return useQuery({
      queryKey: accessControlQueryKeys.permissions,
      queryFn: getPermissions,
      staleTime: 5 * 60 * 1000
    })
  }

  export function useAdminRolesQuery() {
    return useQuery({
      queryKey: accessControlQueryKeys.roles,
      queryFn: getRoles,
      staleTime: 60 * 1000
    })
  }

  export function useAdministratorsQuery() {
    return useQuery({
      queryKey: accessControlQueryKeys.administrators,
      queryFn: getAdministrators,
      staleTime: 60 * 1000
    })
  }

  export function useCreateAdminRoleMutation() {
    const queryClient = useQueryClient()

    return useMutation({
      mutationFn: createAdminRole,
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: accessControlQueryKeys.roles
        })
      }
    })
  }

  export function useSyncRolePermissionsMutation() {
    const queryClient = useQueryClient()

    return useMutation({
      mutationFn: syncRolePermissions,
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: accessControlQueryKeys.roles
        })
      }
    })
  }

  export function useSyncAdministratorRolesMutation() {
    const queryClient = useQueryClient()

    return useMutation({
      mutationFn: syncAdministratorRoles,
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: accessControlQueryKeys.administrators
        })
      }
    })
  }


