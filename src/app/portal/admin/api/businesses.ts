import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { AdminPaginatedResponse, AdminPaginationQuery } from "./pagination"
import { adminApi } from "./admin-api-client"

export type AdminBusinessStatus = "PENDING_APPROVAL" | "APPROVED" | "REJECTED"
export type AdminVerificationStatus = "UNVERIFIED" | "VERIFIED"

export interface AdminBusinessMember {
  role: "OWNER" | "MANAGER"
  user: {
    id: string
    displayName: string
    email: string
    phone: string | null
    status: "PENDING_VERIFICATION" | "ACTIVE" | "SUSPENDED" | "DEACTIVATED"
  }
}

export interface AdminBusinessRegistration {
  id: string
  displayName: string
  legalName: string | null
  slug: string
  registrationNumber: string | null
  status: AdminBusinessStatus
  verificationStatus: AdminVerificationStatus
  submittedAt: string | null
  reviewedAt: string | null
  hasRegistrationDocument: boolean
  primaryLocation: {
    id: string
    name: string
    county: string | null
    cityOrTown: string | null
  } | null
  members: AdminBusinessMember[]
}

export interface AdminBusinessRegistrationDetail extends Omit<AdminBusinessRegistration, "hasRegistrationDocument" | "primaryLocation"> {
  source: "SELF_REGISTERED"
  approvedAt: string | null
  rejectedAt: string | null
  reviewedByAdminId: string | null
  reviewNote: string | null
  registrationDocument: {
    id: string
    originalFileName: string
    mimeType: string
    sizeBytes: number
    uploadedAt: string
    downloadUrl: string
    downloadExpiresAt: string
  } | null
  locations: Array<{
    id: string
    name: string
    slug: string
    status: "DRAFT" | "ACTIVE" | "INACTIVE"
    isPrimary: boolean
    facilityType: string | null
    contactEmail: string | null
    contactPhone: string | null
    websiteUrl: string | null
    description: string | null
    addressLine: string | null
    county: string | null
    cityOrTown: string | null
    latitude: number | null
    longitude: number | null
    timezone: string
    openingPeriods: Array<{
      id: string
      dayOfWeek: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY"
      opensAt: string
      closesAt: string
      closesNextDay: boolean
    }>
    services: Array<{ id: string; name: string; slug: string }>
    staffMembers: Array<{
      id: string
      displayName: string
      profession: string
      professionalTitle: string | null
      phone: string | null
      email: string | null
      yearsExperience: number | null
      isPublic: boolean
      verificationStatus: AdminVerificationStatus
    }>
  }>
}

export interface AdminBusinessRegistrationsQuery extends AdminPaginationQuery {
  search?: string
  status?: AdminBusinessStatus
}

export type ModerateBusinessInput =
  | { businessId: string; decision: "APPROVED"; reviewNote?: string }
  | { businessId: string; decision: "REJECTED"; reviewNote: string }

export interface ModerateBusinessResult {
  businessId: string
  status: "APPROVED" | "REJECTED"
  verificationStatus: AdminVerificationStatus
  reviewedByAdminId: string
  reviewedAt: string
  reviewNote: string | null
  activatedLocationCount: number
}

export const adminBusinessQueryKeys = {
  all: ["admin-businesses"] as const,
  detail: (businessId: string) => ["admin-businesses", "detail", businessId] as const,
  list: (query: AdminBusinessRegistrationsQuery) => ["admin-businesses", "list", query] as const
}

async function getBusinessRegistrations(query: AdminBusinessRegistrationsQuery): Promise<AdminPaginatedResponse<AdminBusinessRegistration>> {
  const response = await adminApi.get<AdminPaginatedResponse<AdminBusinessRegistration>>("/businesses", { params: query })
  return response.data
}

async function getBusinessRegistration(businessId: string): Promise<AdminBusinessRegistrationDetail> {
  const response = await adminApi.get<AdminBusinessRegistrationDetail>(`/businesses/${businessId}`)
  return response.data
}

async function moderateBusiness({ businessId, ...body }: ModerateBusinessInput): Promise<ModerateBusinessResult> {
  const response = await adminApi.patch<ModerateBusinessResult>(`/businesses/${businessId}/moderation`, body)
  return response.data
}

export function useAdminBusinessRegistrationsQuery(query: AdminBusinessRegistrationsQuery) {
  return useQuery({
    queryKey: adminBusinessQueryKeys.list(query),
    queryFn: () => getBusinessRegistrations(query)
  })
}

export function useAdminBusinessRegistrationQuery(businessId?: string) {
  return useQuery({
    queryKey: adminBusinessQueryKeys.detail(businessId ?? "missing"),
    queryFn: () => getBusinessRegistration(businessId ?? ""),
    enabled: Boolean(businessId)
  })
}

export function useModerateBusinessMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: moderateBusiness,
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: adminBusinessQueryKeys.all })
      await queryClient.invalidateQueries({ queryKey: adminBusinessQueryKeys.detail(variables.businessId) })
      await queryClient.invalidateQueries({ queryKey: ["admin-dashboard-overview"] })
    }
  })
}
