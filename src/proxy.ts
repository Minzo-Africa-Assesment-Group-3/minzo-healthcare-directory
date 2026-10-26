import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const ADMIN_ACCESS_TOKEN_COOKIE = "admin_access_token"
const ADMIN_REFRESH_TOKEN_COOKIE = "admin_refresh_token"
const ADMIN_LOGIN_PATH = "/portal/admin/login"
const ADMIN_WORKSPACE_PATH = "/portal/admin/dashboard"

function hasAdminSession(request: NextRequest): boolean {
  return Boolean(
    request.cookies.get(ADMIN_ACCESS_TOKEN_COOKIE)?.value
    || request.cookies.get(ADMIN_REFRESH_TOKEN_COOKIE)?.value
  )
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAdministratorSessionRoute = pathname === ADMIN_LOGIN_PATH || pathname === "/portal/admin/verify-otp"
  const isAdministratorWorkspaceRoute = pathname.startsWith("/portal/admin/") && !isAdministratorSessionRoute
  const administratorIsAuthenticated = hasAdminSession(request)

  if (isAdministratorSessionRoute && administratorIsAuthenticated) {
    return NextResponse.redirect(new URL(ADMIN_WORKSPACE_PATH, request.url))
  }

  if (isAdministratorWorkspaceRoute && !administratorIsAuthenticated) {
    const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url)
    loginUrl.searchParams.set("from", `${pathname}${request.nextUrl.search}`)

    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/portal/admin/:path*"]
}
