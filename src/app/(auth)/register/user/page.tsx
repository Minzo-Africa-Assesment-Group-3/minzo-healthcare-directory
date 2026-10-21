'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { notify } from '@/lib/toast';
import AuthShell from '../../auth-shell';
import { usersService } from '@/services/users.service';

const signupSchema = z.object({
    displayName: z.string().trim().min(2, 'Enter your full name'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    phone: z
        .string()
        .min(1, 'Phone number is required')
        .regex(/^\+?[\d\s-]{7,15}$/, 'Enter a valid phone number'),
    password: z.string().min(12, 'Password must be at least 12 characters'),
});

type SignupValues = z.infer<typeof signupSchema>;

const inputClass =
    'h-12 w-full rounded-xl border bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0C486D]/20';
const labelClass = 'mb-2 block text-sm font-medium text-gray-950';

export default function CareSignupForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

    const borderFor = (hasError: boolean) =>
        hasError ? 'border-red-500' : 'border-gray-200 focus:border-[#0C486D]';

    const onSubmit = async (values: SignupValues) => {
        setServerError(null);

        const res = await usersService.create(values)

        const message = res.detail ?? res.message ?? 'Could not create your account. Try again.';

        notify.success(message);
        router.push(`/register/resend-email?email=${encodeURIComponent(values.email)}&type=email`);
    };

    return (
        <AuthShell
            title="I’m looking for care"
            subtitle="One account for searching, reviewing and following"
        >
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                <div>
                    <label htmlFor="displayName" className={labelClass}>Full name</label>
                    <input
                        id="displayName"
                        type="text"
                        placeholder="e.g Miatte Kollie"
                        autoComplete="name"
                        aria-invalid={!!errors.displayName}
                        className={`${inputClass} ${borderFor(!!errors.displayName)}`}
                        {...register('displayName')}
                    />
                    {errors.displayName && (
                        <p className="mt-1 text-xs text-red-600">{errors.displayName.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className={labelClass}>Email address</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="e.g matte@gmail.com"
                        autoComplete="email"
                        aria-invalid={!!errors.email}
                        className={`${inputClass} ${borderFor(!!errors.email)}`}
                        {...register('email')}
                    />
                    {errors.email && (
                        <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="phone" className={labelClass}>Phone number</label>
                    <input
                        id="phone"
                        type="tel"
                        inputMode="tel"
                        placeholder="000 000 000 000"
                        autoComplete="tel"
                        aria-invalid={!!errors.phone}
                        className={`${inputClass} ${borderFor(!!errors.phone)}`}
                        {...register('phone')}
                    />
                    {errors.phone && (
                        <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className={labelClass}>Password</label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Minimum of 8 characters"
                            autoComplete="new-password"
                            aria-invalid={!!errors.password}
                            className={`${inputClass} pr-12 ${borderFor(!!errors.password)}`}
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

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-14 w-full rounded-full bg-[#0C486D] text-base font-medium text-white shadow-[0_12px_24px_-8px_rgba(12,72,109,0.35)] transition-colors hover:bg-[#0a3b5a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C486D] disabled:opacity-50"
                >
                    {isSubmitting ? 'Creating account…' : 'Create account'}
                </button>
            </form>
        </AuthShell>
    );
}
