import { NextRequest, NextResponse } from 'next/server';
import { getToken } from '@/lib/session';

const API_URL = process.env.API_URL;

async function forward(request: NextRequest, pathSegments: string[]) {
    const token = await getToken();
    const path = pathSegments.join('/');
    const search = request.nextUrl.search; // preserves ?query=params

    const isBodyMethod = ['POST', 'PATCH', 'PUT', 'DELETE'].includes(request.method);
    const body = isBodyMethod ? await request.text() : undefined;

    const backendResponse = await fetch(`${API_URL}/${path}${search}`, {
        method: request.method,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body || undefined,
    });

    const contentType = backendResponse.headers.get('content-type') ?? '';

    // File exports (Excel/PDF) return binary — stream those through as-is
    if (!contentType.includes('application/json')) {
        const buffer = await backendResponse.arrayBuffer();
        return new NextResponse(buffer, {
            status: backendResponse.status,
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': backendResponse.headers.get('content-disposition') ?? '',
            },
        });
    }

    const data = await backendResponse.json().catch(() => null);
    return NextResponse.json(data, { status: backendResponse.status });
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return forward(request, path);
}
export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return forward(request, path);
}
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return forward(request, path);
}
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return forward(request, path);
}