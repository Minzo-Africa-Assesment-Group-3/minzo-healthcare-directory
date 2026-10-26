import { NextRequest, NextResponse } from "next/server"

export const ADMIN_ACCESS_TOKEN_COOKIE = "admin_access_token"
export const ADMIN_REFRESH_TOKEN_COOKIE = "admin_refresh_token"

interface BackendSessionResponse {
  accessToken: string
  expiresIn: number
  refreshTokenExpiresAt: string
}

function getSetCookieHeaders(response: Response): string[] {
  const headers = response.headers as Headers & { getSetCookie?: () => string[] }

  return headers.getSetCookie?.() ?? []
}

export function readRefreshTokenFromBackend(response: Response): string | undefined {
  const cookieHeader = getSetCookieHeaders(response).find((value) =>
    value.startsWith(`${ADMIN_REFRESH_TOKEN_COOKIE}=`)
  )
  const firstPart = cookieHeader?.split(";", 1)[0]

  return firstPart?.slice(`${ADMIN_REFRESH_TOKEN_COOKIE}=`.length)
}

export function getAdminRefreshCookieHeader(request: NextRequest): HeadersInit | undefined {
  const refreshToken = request.cookies.get(ADMIN_REFRESH_TOKEN_COOKIE)?.value

  return refreshToken ? { Cookie: `${ADMIN_REFRESH_TOKEN_COOKIE}=${refreshToken}` } : undefined
}

export function setAdminSession(
  response: NextResponse,
  session: BackendSessionResponse,
  refreshToken: string
): void {
  const refreshMaxAge = Math.max(0, Math.floor((Date.parse(session.refreshTokenExpiresAt) - Date.now()) / 1_000))
  const secure = process.env.NODE_ENV === "production"

  response.cookies.set(ADMIN_ACCESS_TOKEN_COOKIE, session.accessToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: session.expiresIn
  })
  response.cookies.set(ADMIN_REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: refreshMaxAge
  })
}

export function clearAdminSession(response: NextResponse): void {
  response.cookies.delete(ADMIN_ACCESS_TOKEN_COOKIE)
  response.cookies.delete(ADMIN_REFRESH_TOKEN_COOKIE)
}
