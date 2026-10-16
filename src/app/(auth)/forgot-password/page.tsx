'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { notify } from '@/lib/toast';
import AuthShell from '../auth-shell';

const forgotSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
});

type ForgotValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordForm() {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotValues>({ resolver: zodResolver(forgotSchema) });

    const onSubmit = async ({ email }: ForgotValues) => {
        // setServerError(null);

        // // Adjust endpoint to your backend
        // const res = await fetch('/api/auth/forgot-password', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email }),
        // });

        // if (!res.ok) {
        //     const data = await res.json().catch(() => ({}));
        //     const message = data.message ?? 'Something went wrong. Try again.';
        //     setServerError(message);
        //     notify.error(message);
        //     return;
        // }

        router.push(`/verify-email?email=${encodeURIComponent(email)}&purpose=reset`);
    };

    return (
        <AuthShell
            title="Forgot password?"
            subtitle="Please enter the email address associated with your Minzo directory account"
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
                        className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0C486D]/20 ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-[#0C486D]'
                            }`}
                        {...register('email')}
                    />
                    {errors.email && (
                        <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                    )}
                </div>

                {serverError && (
                    <p role="alert" className="text-sm text-red-600">
                        {serverError}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-14 w-full rounded-full bg-[#0C486D] text-base font-medium text-white shadow-[0_12px_24px_-8px_rgba(12,72,109,0.35)] transition-colors hover:bg-[#0a3b5a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C486D] disabled:opacity-50"
                >
                    {isSubmitting ? 'Sending…' : 'Reset password'}
                </button>
            </form>
        </AuthShell>
    );
}