"use client"

import axios, { type AxiosRequestConfig } from "axios"


interface RetriableRequestConfig extends AxiosRequestConfig {
  _adminRetried?: boolean
}

export const adminApi = axios.create({
  baseURL: "/api/admin-proxy",
  headers: { "Content-Type": "application/json" },
  withCredentials: true
})

let refreshPromise: Promise<boolean> | undefined

async function refreshAdminSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch("/api/admin-auth/refresh", {
      method: "POST",
      credentials: "include"
    })
      .then((response) => response.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = undefined
      })
  }

  return refreshPromise
}

async function endAdminSession(): Promise<void> {
  await fetch("/api/admin-auth/logout", {
    method: "POST",
    credentials: "include"
  }).catch(() => undefined)

  // Axios interceptors are outside React, so use a browser redirect for an expired session.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  globalThis.location.assign("/portal/admin/login?expired=1")
}

adminApi.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401 || !error.config) {
      return Promise.reject(error)
    }

    const request = error.config as RetriableRequestConfig

    if (request._adminRetried) {
      await endAdminSession()
      return Promise.reject(error)
    }

    request._adminRetried = true

    if (await refreshAdminSession()) {
      return adminApi(request)
    }

    await endAdminSession()
    return Promise.reject(error)
  }
)
