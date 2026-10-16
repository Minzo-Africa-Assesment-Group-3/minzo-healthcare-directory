import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient, ApiError } from '@/lib/api-client';
import { SESSION_COOKIE, REFRESH_COOKIE } from '@/lib/session';
import { AuthUser } from '@/lib/types';

export async function POST() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

    if (!refreshToken) {
        return NextResponse.json({ message: 'No session to refresh' }, { status: 401 });
    }

    try {
        const data = await apiClient.post<{ accessToken: string; refreshToken: string; user: AuthUser }>(
            '/auth/refresh',
            { refreshToken },
        );

        const response = NextResponse.json({ user: data.user });

        response.cookies.set(SESSION_COOKIE, data.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 15,
        });

        response.cookies.set(REFRESH_COOKIE, data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch (err) {
        const status = err instanceof ApiError ? err.statusCode : 401;
        return NextResponse.json({ message: 'Session expired' }, { status });
    }
}