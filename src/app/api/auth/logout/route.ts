import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, REFRESH_COOKIE } from '@/lib/session';

export async function POST() {
    const apiUrl = process.env.API_URL;
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

    if (apiUrl && (token || refreshToken)) {
        await fetch(`${apiUrl}/api/v1/auth/logout`, {
            method: 'POST',
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...(refreshToken ? { Cookie: `${REFRESH_COOKIE}=${refreshToken}` } : {}),
            },
        }).catch(() => { });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete(SESSION_COOKIE);
    response.cookies.delete(REFRESH_COOKIE);
    return response;
}
