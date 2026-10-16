'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMemberAuthStore } from '@/store/member-auth-store';
import { notify } from '@/lib/toast';

const schema = z.object({
    membershipNumber: z.string().min(1, 'Membership number is required'),
    password: z.string().min(1, 'Password is required'),
});
type Values = z.infer<typeof schema>;

export default function PortalLoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const setMember = useMemberAuthStore((s) => s.setMember);
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<Values>({ resolver: zodResolver(schema) });

    const onSubmit = async (values: Values) => {
        setServerError(null);
        const res = await fetch('/api/portal-auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        });
        const data = await res.json();

        if (!res.ok) {
            setServerError(data.message ?? 'Invalid membership number or password');
            return;
        }

        setMember(data.member);
        router.push('/portal/dashboard');
        router.refresh();
    };

    useEffect(() => {
        if (searchParams.get('expired') === '1') {
            notify.error('Your session expired. Please log in again.');
        }
    }, [searchParams]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-sm rounded-lg border bg-white p-8 shadow-sm">
                <h1 className="mb-1 text-xl font-bold text-gray-900">Member Portal</h1>
                <p className="mb-6 text-sm text-gray-500">Coopmate360 Cooperative</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Membership Number</label>
                        <input
                            {...register('membershipNumber')}
                            placeholder="MSC-0001"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
                        />
                        {errors.membershipNumber && (
                            <p className="mt-1 text-xs text-red-600">{errors.membershipNumber.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            {...register('password')}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
                    </div>
                    {serverError && <p className="text-sm text-red-600">{serverError}</p>}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-md bg-green-700 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>
            </div>
        </div>
    );
}