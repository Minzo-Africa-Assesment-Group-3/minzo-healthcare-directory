'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { notify } from '@/lib/toast';
import AuthShell from '../auth-shell';

const OTP_LENGTH = 4; // Figma shows 4 boxes but the copy says "6-digit": confirm and change here
const RESEND_SECONDS = 30;

export default function OtpVerificationForm() {
    const router = useRouter();
    const email = useSearchParams().get('email');

    const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const [error, setError] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const inputs = useRef<(HTMLInputElement | null)[]>([]);

    const code = digits.join('');
    const isComplete = code.length === OTP_LENGTH;

    useEffect(() => {
        inputs.current[0]?.focus();
    }, []);

    useEffect(() => {
        if (cooldown <= 0) return;
        const id = setTimeout(() => setCooldown((s) => s - 1), 1000);
        return () => clearTimeout(id);
    }, [cooldown]);

    // Write a run of digits starting at `start` (handles typing, autofill and paste)
    const fillFrom = (start: number, raw: string) => {
        const chars = raw.replace(/\D/g, '').slice(0, OTP_LENGTH - start).split('');
        if (chars.length === 0) return;
        setError(null);
        setDigits((prev) => {
            const next = [...prev];
            chars.forEach((c, i) => (next[start + i] = c));
            return next;
        });
        inputs.current[Math.min(start + chars.length, OTP_LENGTH - 1)]?.focus();
    };

    const handleChange = (i: number, value: string) => {
        if (value === '') {
            setError(null);
            setDigits((prev) => prev.map((d, idx) => (idx === i ? '' : d)));
            return;
        }
        fillFrom(i, value);
    };

    const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !digits[i] && i > 0) {
            e.preventDefault();
            setDigits((prev) => prev.map((d, idx) => (idx === i - 1 ? '' : d)));
            inputs.current[i - 1]?.focus();
        } else if (e.key === 'ArrowLeft' && i > 0) {
            inputs.current[i - 1]?.focus();
        } else if (e.key === 'ArrowRight' && i < OTP_LENGTH - 1) {
            inputs.current[i + 1]?.focus();
        }
    };

    const handlePaste = (i: number, e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        fillFrom(i, e.clipboardData.getData('text'));
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isComplete || isVerifying) return;
        setIsVerifying(true);
        setError(null);

        // Adjust endpoint/payload to your backend
        const res = await fetch('/api/auth/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code }),
        });
        const data = await res.json().catch(() => ({}));
        setIsVerifying(false);

        if (!res.ok) {
            setError(data.message ?? 'Incorrect code. Please enter the correct code');
            return;
        }

        notify.success('Verified successfully');
        router.push(data.redirectTo ?? '/login');
    };

    const handleResend = async () => {
        if (cooldown > 0 || isResending) return;
        setIsResending(true);

        const res = await fetch('/api/auth/resend-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        setIsResending(false);

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            notify.error(data.message ?? 'Could not resend the code. Try again.');
            return;
        }

        notify.success('A new code has been sent');
        setDigits(Array(OTP_LENGTH).fill(''));
        setError(null);
        setCooldown(RESEND_SECONDS);
        inputs.current[0]?.focus();
    };

    return (
        <AuthShell
            title="Enter verification code"
            subtitle={`We sent a ${OTP_LENGTH}-digit code to your email address`}
        >
            <form onSubmit={handleVerify} noValidate>
                <div
                    role="group"
                    aria-label="Verification code"
                    className="flex justify-center gap-2 sm:gap-3"
                >
                    {digits.map((d, i) => (
                        <input
                            key={i}
                            ref={(el) => {
                                inputs.current[i] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            autoComplete={i === 0 ? 'one-time-code' : 'off'}
                            maxLength={OTP_LENGTH} // allows autofill/paste into one box; fillFrom trims it
                            value={d}
                            aria-label={`Digit ${i + 1} of ${OTP_LENGTH}`}
                            aria-invalid={!!error}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            onPaste={(e) => handlePaste(i, e)}
                            onFocus={(e) => e.target.select()}
                            className={`h-12 w-11 rounded-lg border bg-white text-center text-base text-gray-900 transition-colors focus:outline-none focus:ring-2 sm:w-12 ${error
                                ? 'border-red-500 focus:ring-red-500/20'
                                : 'border-gray-200 focus:border-[#0C486D] focus:ring-[#0C486D]/20'
                                }`}
                        />
                    ))}
                </div>

                <p
                    role={error ? 'alert' : undefined}
                    className={`mt-6 text-center text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}
                >
                    {error ?? 'This code expires in 10min'}
                </p>

                <button
                    type="submit"
                    disabled={!isComplete || isVerifying}
                    className="mt-8 h-14 w-full rounded-full bg-[#0C486D] text-base font-medium text-white shadow-[0_12px_24px_-8px_rgba(12,72,109,0.35)] transition-colors hover:bg-[#0a3b5a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C486D] disabled:cursor-not-allowed disabled:bg-[#CFD6DC] disabled:text-[#6F8FA3] disabled:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.12)]"
                >
                    {isVerifying ? 'Verifying…' : 'Verify'}
                </button>

                <p className="mt-5 text-center font-(family-name:--font-roboto-slab) text-sm font-medium text-gray-900">
                    Didn’t receive the code?{' '}
                    {cooldown > 0 ? (
                        <span className="font-semibold text-[#0C486D]">Resend in {cooldown}s</span>
                    ) : (
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={isResending}
                            className="font-semibold text-[#0C486D] hover:underline disabled:opacity-50"
                        >
                            {isResending ? 'Sending…' : 'Resend Code'}
                        </button>
                    )}
                </p>
            </form>
        </AuthShell>
    );
}