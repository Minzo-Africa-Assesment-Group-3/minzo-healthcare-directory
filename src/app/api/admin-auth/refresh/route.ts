import { NextRequest, NextResponse } from "next/server"

import {
  clearAdminSession,
  getAdminRefreshCookieHeader,
  readRefreshTokenFromBackend,
  setAdminSession
} from "../admin-session"

interface RefreshAdminSessionResponse {
  accessToken?: string
  expiresIn?: number
  refreshTokenExpiresAt?: string
}

export async function POST(request: NextRequest) {
  const apiUrl = process.env.API_URL

  if (!apiUrl) {
    return NextResponse.json({ message: "The API URL is not configured." }, { status: 500 })
  }

  const cookieHeaders = getAdminRefreshCookieHeader(request)

  if (!cookieHeaders) {
    const response = NextResponse.json({ message: "Administrator session expired." }, { status: 401 })
    clearAdminSession(response)
    return response
  }

  try {
    const backendResponse = await fetch(`${apiUrl}/api/v1/admin/auth/refresh`, {
      method: "POST",
      cache: "no-store",
      headers: cookieHeaders
    })
    const data = (await backendResponse.json().catch(() => null)) as RefreshAdminSessionResponse | null

    if (!backendResponse.ok || !data) {
      const response = NextResponse.json(data, { status: backendResponse.status })
      clearAdminSession(response)
      return response
    }

    const refreshToken = readRefreshTokenFromBackend(backendResponse)

    if (!data.accessToken || !data.expiresIn || !data.refreshTokenExpiresAt || !refreshToken) {
      const response = NextResponse.json(
        { message: "The administration service returned an incomplete session." },
        { status: 502 }
      )
      clearAdminSession(response)
      return response
    }

    const response = NextResponse.json({})
    setAdminSession(response, data as Required<RefreshAdminSessionResponse>, refreshToken)

    return response
  } catch {
    const response = NextResponse.json({ message: "Could not refresh the administrator session." }, { status: 502 })
    clearAdminSession(response)
    return response
  }
}
