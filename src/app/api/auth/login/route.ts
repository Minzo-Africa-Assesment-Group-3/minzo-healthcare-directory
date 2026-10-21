import { NextRequest, NextResponse } from 'next/server';
import { apiClient, ApiError } from '@/lib/api-client';
import { LoginResponse } from '@/lib/types';
import { SESSION_COOKIE, REFRESH_COOKIE } from '@/lib/session';

export async function POST(request: NextRequest) {
    console.log('LOGIN ROUTE HIT');
    const body = await request.json();

    try {
        const data = await apiClient.post<LoginResponse & { refreshToken: string }>(
            '/api/v1/auth/login',
            body,
        );

        const response = NextResponse.json({ user: data.user });

        response.cookies.set(SESSION_COOKIE, data.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 15, // 15 minutes, matches JWT_EXPIRES_IN
        });

        response.cookies.set(REFRESH_COOKIE, data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days, matches REFRESH_TOKEN_EXPIRES_IN
        });

        return response;
    } catch (err) {
        if (err instanceof ApiError) {
            return NextResponse.json({ message: err.message }, { status: err.statusCode });
        }
        return NextResponse.json({ message: 'Login failed' }, { status: 500 });
    }
}