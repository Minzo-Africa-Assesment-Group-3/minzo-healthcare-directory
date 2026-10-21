'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { notify } from '@/lib/toast';
import AuthShell from '../auth-shell';

const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const inputClass =
    'h-12 w-full rounded-xl border bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0C486D]/20';

export default function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

    const onSubmit = async (values: LoginFormValues) => {
        setServerError(null);

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(values),
        });

        const data = await res.json();

        if (!res.ok) {
            const message = data.detail ?? data.message ?? 'Invalid email or password';
            setServerError(message);
            notify.error(message);
            return;
        }

        const challengeId = data.challengeId as string | undefined;
        if (!challengeId) {
            setServerError('The login service did not return a verification challenge.');
            return;
        }

        const returnTo = searchParams.get('from');
        const otpParameters = new URLSearchParams({
            challengeId,
            email: data.maskedEmail ?? values.email,
        });
        if (returnTo) otpParameters.set('from', returnTo);

        notify.success('A verification code has been sent to your email.');
        router.push(`/otp?${otpParameters.toString()}`);
        router.refresh();
    };

    useEffect(() => {
        if (searchParams.get('expired') === '1') {
            notify.error('Your session expired. Please log in again.');
        }
    }, [searchParams]);

    return (
        <AuthShell
            title="Log into your account"
            subtitle="Please enter your email and password to have access to your account"
        >
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                <div>
                    <label htmlFor="email" className="mb-2 block text-base font-medium text-gray-950">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="e.g matte@gmail.com"
                        autoComplete="email"
                        aria-invalid={!!errors.email}
                        className={`${inputClass} ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-[#0C486D]'}`}
                        {...register('email')}
                    />
                    {errors.email && (
                        <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="mb-2 block text-base font-medium text-gray-950">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Minimum of 8 characters"
                            autoComplete="current-password"
                            aria-invalid={!!errors.password}
                            className={`${inputClass} pr-12 ${errors.password ? 'border-red-500' : 'border-gray-200 focus:border-[#0C486D]'}`}
                            {...register('password')}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-gray-500 hover:text-gray-800"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                    )}
                </div>

                {serverError && (
                    <p role="alert" className="text-sm text-red-600">
                        {serverError}
                    </p>
                )}

                <div className="text-center">
                    <Link
                        href="/forgot-password"
                        className="font-(family-name:--font-roboto-slab) text-sm font-semibold text-[#0C486D] hover:underline"
                    >
                        Forgot password?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-14 w-full rounded-full bg-[#0C486D] text-base font-medium text-white shadow-[0_12px_24px_-8px_rgba(12,72,109,0.35)] transition-colors hover:bg-[#0a3b5a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C486D] disabled:opacity-50"
                >
                    {isSubmitting ? 'Logging in…' : 'Log in'}
                </button>

                <p className="text-center font-(family-name:--font-roboto-slab) text-sm font-medium text-gray-900">
                    Don&apos;t have an account?{' '}
                    <Link href="/account-type" className="font-semibold text-[#0C486D] hover:underline">
                        Create an account.
                    </Link>
                </p>
            </form>
        </AuthShell>
    );
}
