'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthShell from '../../auth-shell';
import { usersService } from '@/services/users.service';
import Loading from '@/components/Loading';

const REDIRECT_DELAY_MS = 3000;

type Status = 'verifying' | 'success' | 'error';

const getErrorMessage = (err: unknown): string => {
    const e = err as { response?: { data?: { message?: string } }; message?: string };
    return (
        e?.response?.data?.message ||
        e?.message ||
        'This verification link is invalid or has expired.'
    );
};

export default function VerifyEmail() {
    const router = useRouter();
    const token = useSearchParams().get('token');

    const [status, setStatus] = useState<Status>(token ? 'verifying' : 'error');
    const [errorMessage, setErrorMessage] = useState(
        token ? '' : 'Verification token not found. Please use the link from your email.'
    );

    const verifiedToken = useRef<string | null>(null);

    useEffect(() => {
        if (!token || verifiedToken.current === token) return;
        verifiedToken.current = token;

        // let cancelled = false;

        (async () => {
            try {
                await usersService.verifyEmail({ token });
                // if (!cancelled) 
                setStatus('success');
            } catch (err) {
                // if (cancelled) return;
                setErrorMessage(getErrorMessage(err));
                setStatus('error');
            }
        })();

        // return () => {
        //     cancelled = true;
        // };
    }, [token]);

    console.log(status)

    // Auto-redirect after success
    useEffect(() => {
        if (status !== 'success') return;
        const id = setTimeout(() => router.replace('/login'), REDIRECT_DELAY_MS);
        return () => clearTimeout(id);
    }, [status, router]);

    if (status === 'verifying') {
        return <Loading message="Verifying" />;
    }

    if (status === 'success') {
        return (
            <AuthShell
                showBack={false}
                title="Account verified"
                hero={
                    <div className="relative flex h-32 w-32 items-center justify-center sm:h-36 sm:w-36">
                        <span className="verify-ring absolute inset-0 rounded-full bg-[#E6F0E6]" />
                        <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#2E7D4F] shadow-[0_12px_24px_-8px_rgba(46,125,79,0.5)]">
                            <svg
                                viewBox="0 0 24 24"
                                className="h-10 w-10"
                                fill="none"
                                stroke="white"
                                strokeWidth={3}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path className="verify-check" d="M5 12.5l4.5 4.5L19 7.5" />
                            </svg>
                        </span>
                    </div>
                }
                subtitle="Your email is confirmed. Redirecting you to login…"
            >
                <div
                    className="mx-auto h-1 w-full max-w-xs overflow-hidden rounded-full bg-[#E6F0E6]"
                    role="progressbar"
                    aria-label="Redirecting to login"
                >
                    <div
                        className="verify-bar h-full rounded-full bg-[#0C486D]"
                        style={{ animationDuration: `${REDIRECT_DELAY_MS}ms` }}
                    />
                </div>

                <button
                    type="button"
                    onClick={() => router.replace('/login')}
                    className="mt-6 w-full text-center text-sm font-semibold text-[#0C486D] hover:underline cursor-pointer"
                >
                    Go to login now
                </button>

                <style>{`
                    .verify-ring { animation: verify-pop 500ms cubic-bezier(0.2, 0.8, 0.2, 1) both; }
                    .verify-check {
                        stroke-dasharray: 24;
                        stroke-dashoffset: 24;
                        animation: verify-draw 450ms 250ms ease-out forwards;
                    }
                    .verify-bar {
                        width: 0;
                        animation-name: verify-fill;
                        animation-timing-function: linear;
                        animation-fill-mode: forwards;
                    }
                    @keyframes verify-pop { from { transform: scale(0.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                    @keyframes verify-draw { to { stroke-dashoffset: 0; } }
                    @keyframes verify-fill { to { width: 100%; } }
                    @media (prefers-reduced-motion: reduce) {
                        .verify-ring, .verify-check { animation: none; stroke-dashoffset: 0; }
                    }
                `}</style>
            </AuthShell>
        );
    }

    // status === 'error'
    return (
        <AuthShell
            showBack={false}
            title="Verification failed"
            hero={
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-red-50 sm:h-36 sm:w-36">
                    <span className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500 shadow-[0_12px_24px_-8px_rgba(239,68,68,0.5)]">
                        <svg
                            viewBox="0 0 24 24"
                            className="h-10 w-10"
                            fill="none"
                            stroke="white"
                            strokeWidth={3}
                            strokeLinecap="round"
                            aria-hidden="true"
                        >
                            <path d="M7 7l10 10M17 7L7 17" />
                        </svg>
                    </span>
                </div>
            }
            subtitle={errorMessage}
        >
            <button
                type="button"
                onClick={() => router.push('/login')}
                className="h-14 w-full rounded-full bg-[#0C486D] text-base font-medium text-white shadow-[0_12px_24px_-8px_rgba(12,72,109,0.35)] transition-colors hover:bg-[#0a3b5a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C486D] cursor-pointer"
            >
                Go to login
            </button>
        </AuthShell>
    );
}