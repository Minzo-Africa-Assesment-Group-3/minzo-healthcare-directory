'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import type { BusinessFormValues } from './business-schema';
import { Field, inputClass } from './wizard-ui';

export default function StepPassword({ serverError }: { serverError: string | null }) {
    const {
        register,
        formState: { errors },
    } = useFormContext<BusinessFormValues>();
    const [show, setShow] = useState(false);

    return (
        <div className="space-y-4">
            <Field label="Enter Password" htmlFor="password" error={errors.password?.message}>
                <div className="relative">
                    <input
                        id="password"
                        type={show ? 'text' : 'password'}
                        placeholder="Minimum of 8 characters"
                        autoComplete="new-password"
                        aria-invalid={!!errors.password}
                        className={`${inputClass(!!errors.password)} pr-12`}
                        {...register('password')}
                    />
                    <button
                        type="button"
                        onClick={() => setShow((s) => !s)}
                        aria-label={show ? 'Hide password' : 'Show password'}
                        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-gray-500 hover:text-gray-800"
                    >
                        {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
            </Field>

            {serverError && (
                <p role="alert" className="text-sm text-red-600">
                    {serverError}
                </p>
            )}
        </div>
    );
}
