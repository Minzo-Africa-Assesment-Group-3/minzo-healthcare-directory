import { NextRequest, NextResponse } from 'next/server';
import { REFRESH_COOKIE, SESSION_COOKIE } from '@/lib/session';

function getRefreshToken(response: Response): string | undefined {
    const headers = response.headers as Headers & { getSetCookie?: () => string[] };
    const setCookie = headers.getSetCookie?.().find((value) => value.startsWith('refresh_token='));
    const firstPart = setCookie?.split(';', 1)[0];
    return firstPart?.slice('refresh_token='.length);
}

export async function POST(request: NextRequest) {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
        return NextResponse.json({ message: 'The API URL is not configured.' }, { status: 500 });
    }

    const body = await request.json();

    try {
        const backendResponse = await fetch(`${apiUrl}/api/v1/auth/login/verify-otp`, {
            method: 'POST',
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data: unknown = await backendResponse.json().catch(() => null);

        if (!backendResponse.ok || !data || typeof data !== 'object') {
            return NextResponse.json(data, { status: backendResponse.status });
        }

        const { accessToken, expiresIn, refreshTokenExpiresAt, ...responseBody } = data as {
            accessToken: string;
            expiresIn: number;
            refreshTokenExpiresAt: string;
        } & Record<string, unknown>;
        const refreshToken = getRefreshToken(backendResponse);

        if (!accessToken || !refreshToken) {
            return NextResponse.json({ message: 'The authentication service returned an incomplete session.' }, { status: 502 });
        }

        const refreshMaxAge = Math.max(0, Math.floor((Date.parse(refreshTokenExpiresAt) - Date.now()) / 1000));
        const response = NextResponse.json(responseBody);
        const secure = process.env.NODE_ENV === 'production';

        response.cookies.set(SESSION_COOKIE, accessToken, {
            httpOnly: true,
            secure,
            sameSite: 'lax',
            path: '/',
            maxAge: expiresIn,
        });
        response.cookies.set(REFRESH_COOKIE, refreshToken, {
            httpOnly: true,
            secure,
            sameSite: 'lax',
            path: '/',
            maxAge: refreshMaxAge,
        });

        return response;
    } catch {
        return NextResponse.json({ message: 'Could not verify the login code.' }, { status: 502 });
    }
}
