import { NextRequest, NextResponse } from 'next/server';
import { apiClient, ApiError } from '@/lib/api-client';
import { MEMBER_SESSION_COOKIE } from '@/lib/member-session';
import { MemberAuthUser } from '@/lib/types';

interface MemberLoginResponse {
    accessToken: string;
    member: MemberAuthUser;
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    try {
        const data = await apiClient.post<MemberLoginResponse>('/member-auth/login', body);

        const response = NextResponse.json({ member: data.member });

        response.cookies.set(MEMBER_SESSION_COOKIE, data.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24,
        });

        return response;
    } catch (err) {
        if (err instanceof ApiError) {
            return NextResponse.json({ message: err.message }, { status: err.statusCode });
        }
        return NextResponse.json({ message: 'Login failed' }, { status: 500 });
    }
}