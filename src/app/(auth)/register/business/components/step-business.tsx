'use client';

import { useFormContext } from 'react-hook-form';
import { FACILITY_TYPES, type BusinessFormValues } from './business-schema';
import { Field, SelectInput, inputClass, textareaClass } from './wizard-ui';

export default function StepBusiness() {
    const {
        register,
        formState: { errors },
    } = useFormContext<BusinessFormValues>();

    return (
        <div className="space-y-5">
            <Field label="Business name" htmlFor="businessName" error={errors.businessName?.message}>
                <input
                    id="businessName"
                    placeholder="Enter your business name"
                    autoComplete="organization"
                    aria-invalid={!!errors.businessName}
                    className={inputClass(!!errors.businessName)}
                    {...register('businessName')}
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
                    aria-invalid={!!errors.description}
                    className={textareaClass(!!errors.description)}
                    {...register('description')}
                />
            </Field>
        </div>
    );
}
