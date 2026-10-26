import { NextRequest, NextResponse } from "next/server"

import { readRefreshTokenFromBackend, setAdminSession } from "../admin-session"

interface VerifyAdminOtpResponse {
  accessToken?: string
  admin?: {
    displayName: string
    email: string
    id: string
    roles: string[]
  }
  detail?: string
  expiresIn?: number
  message?: string
  refreshTokenExpiresAt?: string
}

export async function POST(request: NextRequest) {
  const apiUrl = process.env.API_URL

  if (!apiUrl) {
    return NextResponse.json({ message: "The API URL is not configured." }, { status: 500 })
  }

  const body = await request.json()

  try {
    const backendResponse = await fetch(`${apiUrl}/api/v1/admin/auth/login/verify-otp`, {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
    const data = (await backendResponse.json().catch(() => null)) as VerifyAdminOtpResponse | null

    if (!backendResponse.ok || !data) {
      return NextResponse.json(data, { status: backendResponse.status })
    }

    const refreshToken = readRefreshTokenFromBackend(backendResponse)

    if (!data.accessToken || !data.expiresIn || !data.refreshTokenExpiresAt || !refreshToken || !data.admin) {
      return NextResponse.json(
        { message: "The administration service returned an incomplete session." },
        { status: 502 }
      )
    }

    const response = NextResponse.json({ admin: data.admin })
    setAdminSession(response, data as Required<Pick<VerifyAdminOtpResponse, "accessToken" | "expiresIn" | "refreshTokenExpiresAt">>, refreshToken)

    return response
  } catch {
    return NextResponse.json({ message: "Could not verify the administrator login code." }, { status: 502 })
  }
}
