'use client';

import { useFormContext } from 'react-hook-form';
import type { BusinessFormValues } from './business-schema';
import { Field, inputClass } from './wizard-ui';

export default function StepRepresentative() {
    const {
        register,
        formState: { errors },
    } = useFormContext<BusinessFormValues>();

    return (
        <div className="space-y-5">
            <p className="text-sm leading-relaxed text-gray-600">
                These details create your owner account. You’ll use your email to sign in.
            </p>

            <Field label="Full name" htmlFor="fullName" error={errors.fullName?.message}>
                <input
                    id="fullName"
                    placeholder="e.g Miatte Kollie"
                    autoComplete="name"
                    maxLength={100}
                    aria-invalid={!!errors.fullName}
                    className={inputClass(!!errors.fullName)}
                    {...register('fullName')}
                />
            </Field>

            <Field
                label="Email address"
                htmlFor="email"
                hint="We’ll send a verification link to this address."
                error={errors.email?.message}
            >
                <input
                    id="email"
                    type="email"
                    placeholder="e.g matte@gmail.com"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    maxLength={254}
                    aria-invalid={!!errors.email}
                    className={inputClass(!!errors.email)}
                    {...register('email')}
                />
            </Field>

            <Field
                label="Phone number"
                htmlFor="phone"
                hint="Include the country code, e.g. +231 770 000 000"
                error={errors.phone?.message}
            >
                <input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    placeholder="+231 000 000 000"
                    autoComplete="tel"
                    maxLength={25}
                    aria-invalid={!!errors.phone}
                    className={inputClass(!!errors.phone)}
                    {...register('phone')}
                />
            </Field>
        </div>
    );
}