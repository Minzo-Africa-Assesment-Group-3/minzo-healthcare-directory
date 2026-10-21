import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, REFRESH_COOKIE } from '@/lib/session';

function getRefreshToken(response: Response): string | undefined {
    const headers = response.headers as Headers & { getSetCookie?: () => string[] };
    const setCookie = headers.getSetCookie?.().find((value) => value.startsWith('refresh_token='));
    const firstPart = setCookie?.split(';', 1)[0];
    return firstPart?.slice('refresh_token='.length);
}

export async function POST() {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
        return NextResponse.json({ message: 'The API URL is not configured.' }, { status: 500 });
    }

    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

    if (!refreshToken) {
        return NextResponse.json({ message: 'No session to refresh' }, { status: 401 });
    }

    try {
        const backendResponse = await fetch(`${apiUrl}/api/v1/auth/refresh`, {
            method: 'POST',
            cache: 'no-store',
            headers: { Cookie: `${REFRESH_COOKIE}=${refreshToken}` },
        });
        const data: unknown = await backendResponse.json().catch(() => null);

        if (!backendResponse.ok || !data || typeof data !== 'object') {
            return NextResponse.json({ message: 'Session expired' }, { status: backendResponse.status });
        }

        const { accessToken, expiresIn, refreshTokenExpiresAt } = data as {
            accessToken: string;
            expiresIn: number;
            refreshTokenExpiresAt: string;
        };
        const nextRefreshToken = getRefreshToken(backendResponse);
        if (!accessToken || !nextRefreshToken) {
            return NextResponse.json({ message: 'The authentication service returned an incomplete session.' }, { status: 502 });
        }

        const response = NextResponse.json({ success: true });
        const secure = process.env.NODE_ENV === 'production';

        response.cookies.set(SESSION_COOKIE, accessToken, {
            httpOnly: true,
            secure,
            sameSite: 'lax',
            path: '/',
            maxAge: expiresIn,
        });

        response.cookies.set(REFRESH_COOKIE, nextRefreshToken, {
            httpOnly: true,
            secure,
            sameSite: 'lax',
            path: '/',
            maxAge: Math.max(0, Math.floor((Date.parse(refreshTokenExpiresAt) - Date.now()) / 1000)),
        });

        return response;
    } catch {
        return NextResponse.json({ message: 'Session expired' }, { status: 502 });
    }
}
