'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Check, Eye, EyeOff } from 'lucide-react';
import { PASSWORD_RULES, passwordScore, type BusinessFormValues } from './business-schema';
import { Field, inputClass } from './wizard-ui';

const STRENGTH = [
    { label: 'Too weak', bar: 'bg-red-500', text: 'text-red-600' },
    { label: 'Weak', bar: 'bg-red-500', text: 'text-red-600' },
    { label: 'Fair', bar: 'bg-amber-500', text: 'text-amber-600' },
    { label: 'Good', bar: 'bg-lime-500', text: 'text-lime-700' },
    { label: 'Strong', bar: 'bg-[#1B8A52]', text: 'text-[#1B7A47]' },
];

export default function StepPassword({ serverError }: { serverError: string | null }) {
    const {
        register,
        watch,
        formState: { errors },
    } = useFormContext<BusinessFormValues>();
    const [show, setShow] = useState(false);

    const password = watch('password') ?? '';
    const score = passwordScore(password);
    const strength = STRENGTH[score];

    return (
        <div className="space-y-5">
            <Field label="Enter Password" htmlFor="password" error={errors.password?.message}>
                <div className="relative">
                    <input
                        id="password"
                        type={show ? 'text' : 'password'}
                        placeholder="Minimum of 8 characters"
                        autoComplete="new-password"
                        maxLength={128}
                        autoFocus
                        aria-invalid={!!errors.password}
                        aria-describedby="password-rules"
                        className={`${inputClass(!!errors.password)} pr-12`}
                        {...register('password')}
                    />
                    <button
                        type="button"
                        onClick={() => setShow((s) => !s)}
                        aria-label={show ? 'Hide password' : 'Show password'}
                        aria-pressed={show}
                        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-gray-500 hover:text-gray-800"
                    >
                        {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
            </Field>

            {password && (
                <div aria-live="polite" className="-mt-2">
                    <div className="flex gap-1" aria-hidden>
                        {[1, 2, 3, 4].map((n) => (
                            <span key={n} className={`h-1.5 flex-1 rounded-full ${n <= score ? strength.bar : 'bg-gray-200'}`} />
                        ))}
                    </div>
                    <p className={`mt-1.5 text-xs font-medium ${strength.text}`}>Password strength: {strength.label}</p>
                </div>
            )}

            <ul id="password-rules" className="space-y-1.5 text-xs">
                {PASSWORD_RULES.map((r) => {
                    const ok = r.test(password);
                    return (
                        <li key={r.id} className={`flex items-center gap-2 ${ok ? 'text-[#1B7A47]' : 'text-gray-500'}`}>
                            <Check className={`h-3.5 w-3.5 ${ok ? '' : 'opacity-30'}`} aria-hidden />
                            {r.label}
                            <span className="sr-only">{ok ? '(done)' : '(required)'}</span>
                        </li>
                    );
                })}
            </ul>

            <div>
                <label className="flex cursor-pointer items-start gap-2.5 text-sm text-gray-800">
                    <input
                        type="checkbox"
                        aria-invalid={!!errors.acceptedTerms}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-400 accent-[#0C486D]"
                        {...register('acceptedTerms')}
                    />
                    <span>
                        I agree to the{' '}
                        <a href="/terms" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0C486D] underline">
                            Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0C486D] underline">
                            Privacy Policy
                        </a>
                        .
                    </span>
                </label>
                {errors.acceptedTerms && (
                    <p role="alert" className="mt-1 text-xs text-red-600">
                        {errors.acceptedTerms.message}
                    </p>
                )}
            </div>

            {serverError && (
                <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    {serverError}
                </p>
            )}
        </div>
    );
}