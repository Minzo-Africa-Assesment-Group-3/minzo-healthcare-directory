'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
// import { notify } from '@/lib/toast';
import AuthShell from '../auth-shell';
import Loading from '@/components/Loading';

const RESEND_SECONDS = 30;

const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export default function VerifyEmail() {
    return (
        <Suspense fallback={<Loading message="Loading email verification" />}>
            <VerifyEmailContent />
        </Suspense>
    );
}

function VerifyEmailContent() {
    const router = useRouter();
    const email = useSearchParams().get('email');

    const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
    const [isResending, setIsResending] = useState(false);

    // Countdown: ticks once per second until it reaches 0
    useEffect(() => {
        if (secondsLeft <= 0) return;
        const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
        return () => clearTimeout(id);
    }, [secondsLeft]);

    const handleResend = useCallback(async () => {
        // if (!email || secondsLeft > 0 || isResending) return;
        // setIsResending(true);

        // // Adjust endpoint to your backend
        // const res = await fetch('/api/auth/resend-verification', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email }),
        // });

        // setIsResending(false);

        // if (!res.ok) {
        //     const data = await res.json().catch(() => ({}));
        //     notify.error(data.message ?? 'Could not resend the link. Try again.');
        //     return;
        // }

        // notify.success('Verification link sent');
        // setSecondsLeft(RESEND_SECONDS);
    }, [email, secondsLeft, isResending]);

    return (
        <AuthShell
            showBack={false}
            title="Check your inbox"
            hero={
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[#E6F0E6] sm:h-36 sm:w-36">
                    <Image
                        src="/mail.svg"
                        alt=""
                        width={80}
                        height={80}
                        className="h-20 w-20 object-contain"
                    />
                </div>
            }
            subtitle={
                <>
                    We sent a verification link to{' '}
                    {email ? (
                        <strong className="font-semibold text-gray-700">{email}</strong>
                    ) : (
                        'your email'
                    )}
                    . Please click on it to verify your email.
                </>
            }
        >
            <button
                type="button"
                onClick={() => router.push('/reset-password')}
                className="h-14 w-full rounded-full bg-[#0C486D] text-base font-medium text-white shadow-[0_12px_24px_-8px_rgba(12,72,109,0.35)] transition-colors hover:bg-[#0a3b5a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C486D]"
            >
                Continue
            </button>

            <p className="mt-5 text-center font-(family-name:--font-roboto-slab) text-sm font-medium text-gray-900">
                Did not receive code?{' '}
                {secondsLeft > 0 ? (
                    <span className="font-semibold text-[#0C486D]">Resend in {secondsLeft}sec</span>
                ) : (
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={isResending}
                        className="font-semibold text-[#0C486D] hover:underline disabled:opacity-50"
                    >
                        {isResending ? 'Sending…' : 'Resend'}
                    </button>
                )}
            </p>

            <p
                className="mt-6 text-center text-sm font-semibold tabular-nums text-gray-500"
                aria-live="off"
            >
                {formatTime(secondsLeft)}
            </p>
        </AuthShell>
    );
}
