'use client';

import { useFormContext } from 'react-hook-form';
import type { BusinessFormValues } from './business-schema';
import { Field, inputClass } from './wizard-ui';

export default function StepContact() {
    const {
        register,
        formState: { errors },
    } = useFormContext<BusinessFormValues>();

    return (
        <div className="space-y-5">
            <Field label="Contact Email (Optional)" htmlFor="contactEmail" error={errors.contactEmail?.message}>
                <input
                    id="contactEmail"
                    type="email"
                    placeholder="e.g info@minzodirect.com"
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    maxLength={254}
                    aria-invalid={!!errors.contactEmail}
                    className={inputClass(!!errors.contactEmail)}
                    {...register('contactEmail')}
                />
            </Field>

            <Field
                label="Contact Phone (Optional)"
                htmlFor="contactPhone"
                hint="Include the country code, e.g. +231 770 000 000"
                error={errors.contactPhone?.message}
            >
                <input
                    id="contactPhone"
                    type="tel"
                    inputMode="tel"
                    placeholder="Enter phone number"
                    maxLength={25}
                    aria-invalid={!!errors.contactPhone}
                    className={inputClass(!!errors.contactPhone)}
                    {...register('contactPhone')}
                />
            </Field>

            <Field label="Website url (Optional)" htmlFor="websiteUrl" error={errors.websiteUrl?.message}>
                <input
                    id="websiteUrl"
                    inputMode="url"
                    placeholder="e.g www.minzodirect.com"
                    autoCapitalize="none"
                    spellCheck={false}
                    maxLength={200}
                    aria-invalid={!!errors.websiteUrl}
                    className={inputClass(!!errors.websiteUrl)}
                    {...register('websiteUrl')}
                />
            </Field>
        </div>
    );
}