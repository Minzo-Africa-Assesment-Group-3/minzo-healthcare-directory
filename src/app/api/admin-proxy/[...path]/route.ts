import { NextRequest, NextResponse } from "next/server"

import { ADMIN_ACCESS_TOKEN_COOKIE } from "../../admin-auth/admin-session"

const bodyMethods = new Set(["POST", "PUT", "PATCH", "DELETE"])

async function forward(request: NextRequest, pathSegments: string[]): Promise<NextResponse> {
  const apiUrl = process.env.API_URL

  if (!apiUrl) {
    return NextResponse.json({ message: "The API URL is not configured." }, { status: 500 })
  }

  const accessToken = request.cookies.get(ADMIN_ACCESS_TOKEN_COOKIE)?.value

  if (!accessToken) {
    return NextResponse.json({ message: "Administrator authentication is required." }, { status: 401 })
  }

  const path = pathSegments.join("/")
  const contentType = request.headers.get("content-type")
  const body = bodyMethods.has(request.method) ? await request.text() : undefined

  try {
    const backendResponse = await fetch(
      `${apiUrl}/api/v1/admin/${path}${request.nextUrl.search}`,
      {
        method: request.method,
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ...(contentType ? { "Content-Type": contentType } : {})
        },
        body: body || undefined
      }
    )

    const responseContentType = backendResponse.headers.get("content-type") ?? ""

    if (!responseContentType.includes("application/json")) {
      return new NextResponse(await backendResponse.arrayBuffer(), {
        status: backendResponse.status,
        headers: responseContentType ? { "Content-Type": responseContentType } : undefined
      })
    }

    return NextResponse.json(await backendResponse.json().catch(() => null), {
      status: backendResponse.status
    })
  } catch {
    return NextResponse.json({ message: "The administration service is unavailable." }, { status: 502 })
  }
}

interface RouteContext {
  params: Promise<{ path: string[] }>
}

async function handle(request: NextRequest, context: RouteContext): Promise<NextResponse> {
  const { path } = await context.params

  return forward(request, path)
}

export const GET = handle
export const POST = handle
export const PUT = handle
export const PATCH = handle
export const DELETE = handle
