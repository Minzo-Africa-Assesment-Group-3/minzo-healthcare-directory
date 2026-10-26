'use client';

import { useFormContext } from 'react-hook-form';
import { FACILITY_TYPES, LIMITS, type BusinessFormValues } from './business-schema';
import { Field, SelectInput, inputClass, textareaClass } from './wizard-ui';

export default function StepBusiness() {
    const {
        register,
        watch,
        formState: { errors },
    } = useFormContext<BusinessFormValues>();
    const descLength = watch('description')?.length ?? 0;

    return (
        <div className="space-y-5">
            <Field label="Business name" htmlFor="businessName" error={errors.businessName?.message}>
                <input
                    id="businessName"
                    placeholder="Enter your business name"
                    autoComplete="organization"
                    maxLength={120}
                    aria-invalid={!!errors.businessName}
                    className={inputClass(!!errors.businessName)}
                    {...register('businessName')}
                />
            </Field>

            <Field
                label="Legal name (Optional)"
                htmlFor="legalName"
                hint="As it appears on your registration. Leave blank if it’s the same."
                error={errors.legalName?.message}
            >
                <input
                    id="legalName"
                    placeholder="e.g Minzo Medical Center Incorporated"
                    maxLength={150}
                    aria-invalid={!!errors.legalName}
                    className={inputClass(!!errors.legalName)}
                    {...register('legalName')}
                />
            </Field>

            <Field label="Registration number" htmlFor="registrationNumber" error={errors.registrationNumber?.message}>
                <input
                    id="registrationNumber"
                    placeholder="e.g REG-12345"
                    autoComplete="off"
                    maxLength={50}
                    aria-invalid={!!errors.registrationNumber}
                    className={inputClass(!!errors.registrationNumber)}
                    {...register('registrationNumber')}
                />
            </Field>

            <Field label="Facility type" htmlFor="facilityType" error={errors.facilityType?.message}>
                <SelectInput
                    id="facilityType"
                    options={FACILITY_TYPES}
                    invalid={!!errors.facilityType}
                    {...register('facilityType')}
                />
            </Field>

            <Field label="Description" htmlFor="description" error={errors.description?.message}>
                <textarea
                    id="description"
                    rows={3}
                    placeholder="Enter description"
                    maxLength={LIMITS.description}
                    aria-invalid={!!errors.description}
                    className={textareaClass(!!errors.description)}
                    {...register('description')}
                />
                <p className="mt-1 text-right text-xs text-gray-400" aria-hidden>
                    {descLength}/{LIMITS.description}
                </p>
            </Field>
        </div>
    );
}