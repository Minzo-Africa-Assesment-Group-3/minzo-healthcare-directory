import { useMutation, useQueryClient } from "@tanstack/react-query"

import { adminApi } from "./admin-api-client"

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
