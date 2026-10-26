import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

import { adminApi } from "./admin-api-client"
import { paginateAdminItems, type AdminClientTableQuery, type AdminPaginatedResponse } from "./pagination"

const directoryApi = axios.create({ baseURL: "/api/proxy/api/v1" })

export interface AdminCounty {
  id: string
  name: string
  slug: string
  isActive: boolean
}

export interface AdminCity {
  id: string
  countyId: string
  name: string
  slug: string
  isActive: boolean
}

interface DirectoryResponse<TItem> {
  data: TItem[]
}

export interface CreateCountyInput {
  name: string
}

export interface UpdateCountyInput {
  countyId: string
  name?: string
  isActive?: boolean
}

export interface CreateCityInput {
  countyId: string
  name: string
}

export interface UpdateCityInput {
  cityId: string
  countyId?: string
  name?: string
  isActive?: boolean
}

async function createCounty(input: CreateCountyInput): Promise<AdminCounty> {
  const response = await adminApi.post<AdminCounty>("/counties", input)
  return response.data
}

async function updateCounty({ countyId, ...body }: UpdateCountyInput): Promise<AdminCounty> {
  const response = await adminApi.patch<AdminCounty>(`/counties/${countyId}`, body)
  return response.data
}

async function createCity(input: CreateCityInput): Promise<AdminCity> {
  const response = await adminApi.post<AdminCity>("/cities", input)
  return response.data
}

async function updateCity({ cityId, ...body }: UpdateCityInput): Promise<AdminCity> {
  const response = await adminApi.patch<AdminCity>(`/cities/${cityId}`, body)
  return response.data
}

export async function getAdminCounties(query: AdminClientTableQuery): Promise<AdminPaginatedResponse<AdminCounty>> {
  const response = await directoryApi.get<DirectoryResponse<Omit<AdminCounty, "isActive">>>("/counties", {
    params: { limit: 20, search: query.search }
  })

  return paginateAdminItems(response.data.data.map((county) => ({ ...county, isActive: true })), query)
}

export async function getAdminCities(query: AdminClientTableQuery): Promise<AdminPaginatedResponse<AdminCity>> {
  const response = await directoryApi.get<DirectoryResponse<Omit<AdminCity, "isActive">>>("/cities", {
    params: { limit: 100, search: query.search }
  })

  return paginateAdminItems(response.data.data.map((city) => ({ ...city, isActive: true })), query)
}

export function useCreateCountyMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCounty,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["counties"] })
    }
  })
}

export function useUpdateCountyMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateCounty,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["counties"] })
      await queryClient.invalidateQueries({ queryKey: ["cities"] })
    }
  })
}

export function useCreateCityMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCity,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cities"] })
    }
  })
}

export function useUpdateCityMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateCity,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cities"] })
    }
  })
}
