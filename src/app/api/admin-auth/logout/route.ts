import { NextRequest, NextResponse } from "next/server"

import { clearAdminSession, getAdminRefreshCookieHeader } from "../admin-session"

export async function POST(request: NextRequest) {
  const apiUrl = process.env.API_URL
  const response = new NextResponse(null, { status: 204 })
  const cookieHeaders = getAdminRefreshCookieHeader(request)

  if (apiUrl && cookieHeaders) {
    await fetch(`${apiUrl}/api/v1/admin/auth/logout`, {
      method: "POST",
      cache: "no-store",
      headers: cookieHeaders
    }).catch(() => undefined)
  }

  clearAdminSession(response)
  return response
}
