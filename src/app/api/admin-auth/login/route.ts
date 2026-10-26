import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const apiUrl = process.env.API_URL

  if (!apiUrl) {
    return NextResponse.json({ message: "The API URL is not configured." }, { status: 500 })
  }

  const body = await request.json()

  try {
    const backendResponse = await fetch(`${apiUrl}/api/v1/admin/auth/login`, {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
    const data: unknown = await backendResponse.json().catch(() => null)

    return NextResponse.json(data, { status: backendResponse.status })
  } catch {
    return NextResponse.json({ message: "Admin login failed." }, { status: 502 })
  }
}
