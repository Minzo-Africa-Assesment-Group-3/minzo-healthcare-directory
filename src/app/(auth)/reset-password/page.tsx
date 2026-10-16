'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { notify } from '@/lib/toast';
import AuthShell from '../auth-shell';

const resetSchema = z
    .object({
        password: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string().min(1, 'Repeat your new password'),
    })
    .refine((v) => v.password === v.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords must match',
    });

type ResetValues = z.infer<typeof resetSchema>;

function PasswordField({
    id,
    label,
    placeholder,
    error,
    registration,
}: {
    id: string;
    label: string;
    placeholder: string;
    error?: string;
    registration: UseFormRegisterReturn;
}) {
    const [show, setShow] = useState(false);

    return (
        <div>
            <label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-950">
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    type={show ? 'text' : 'password'}
                    placeholder={placeholder}
                    autoComplete="new-password"
                    aria-invalid={!!error}
                    className={`h-12 w-full rounded-xl border bg-white px-4 pr-12 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0C486D]/20 ${error ? 'border-red-500' : 'border-gray-200 focus:border-[#0C486D]'
                        }`}
                    {...registration}
                />
                <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    aria-label={show ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-gray-500 hover:text-gray-800"
                >
                    {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
            </div>
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}

export default function ResetPasswordForm() {
    const router = useRouter();
    const token = useSearchParams().get('token');
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetValues>({ resolver: zodResolver(resetSchema) });

    const onSubmit = async ({ password }: ResetValues) => {
        // setServerError(null);

        // // Adjust endpoint/payload to your backend
        // const res = await fetch('/api/auth/reset-password', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ token, password }),
        // });

        // if (!res.ok) {
        //     const data = await res.json().catch(() => ({}));
        //     const message = data.message ?? 'Could not reset your password. Try again.';
        //     setServerError(message);
        //     notify.error(message);
        //     return;
        // }

        router.push('/reset-password/success');
    };

    return (
        <AuthShell
            title="Reset password"
            subtitle="Please enter a new password. Password must be different from previous password"
        >
            {/* {token ? (
                <div role="alert" className="text-center text-sm text-red-600">
                    This reset link is invalid or has expired.{' '}
                    <Link href="/forgot-password" className="font-semibold text-[#0C486D] hover:underline">
                        Request a new link
                    </Link>
                </div>
            ) : (
            )} */}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                <PasswordField
                    id="password"
                    label="New password"
                    placeholder="Minimum of 8 characters"
                    error={errors.password?.message}
                    registration={register('password')}
                />

                <PasswordField
                    id="confirmPassword"
                    label="Repeat password"
                    placeholder="Both passwords must match"
                    error={errors.confirmPassword?.message}
                    registration={register('confirmPassword')}
                />

                {serverError && (
                    <p role="alert" className="text-sm text-red-600">
                        {serverError}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-3 h-14 w-full rounded-full bg-[#0C486D] text-base font-medium text-white shadow-[0_12px_24px_-8px_rgba(12,72,109,0.35)] transition-colors hover:bg-[#0a3b5a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C486D] disabled:opacity-50"
                >
                    {isSubmitting ? 'Resetting…' : 'Reset password'}
                </button>
            </form>
        </AuthShell>
    );
}