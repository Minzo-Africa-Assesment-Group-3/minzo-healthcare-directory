'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { PlusCircle, Trash2 } from 'lucide-react';
import { STAFF_ROLES, type BusinessFormValues } from './business-schema';
import { SelectInput, inputClass, outlineBtn } from './wizard-ui';

export default function StepStaff() {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext<BusinessFormValues>();
    const { fields, append, remove } = useFieldArray({ control, name: 'staffMembers' });

    return (
        <div>
            <p className="mb-2 text-base font-medium text-gray-950">Staff members</p>

            <ul className="space-y-4">
                {fields.map((field, i) => {
                    const err = errors.staffMembers?.[i];
                    return (
                        <li key={field.id}>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <input
                                        aria-label={`Staff member ${i + 1} full name`}
                                        placeholder="Full name"
                                        aria-invalid={!!err?.fullName}
                                        className={inputClass(!!err?.fullName)}
                                        {...register(`staffMembers.${i}.fullName`)}
                                    />
                                    {err?.fullName && <p className="mt-1 text-xs text-red-600">{err.fullName.message}</p>}
                                </div>
                                <div>
                                    <SelectInput
                                        aria-label={`Staff member ${i + 1} role`}
                                        options={STAFF_ROLES}
                                        invalid={!!err?.role}
                                        {...register(`staffMembers.${i}.role`)}
                                    />
                                    {err?.role && <p className="mt-1 text-xs text-red-600">{err.role.message}</p>}
                                </div>
                            </div>
                            <div className="mt-2 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => remove(i)}
                                    className="inline-flex items-center gap-2 rounded-full bg-red-50 px-5 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                                >
                                    <Trash2 className="h-4 w-4" aria-hidden />
                                    Delete
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>

            <div className="mt-5 flex justify-center">
                <button type="button" onClick={() => append({ fullName: '', role: '' })} className={`${outlineBtn} px-6`}>
                    <PlusCircle className="h-5 w-5" aria-hidden />
                    Add staff member
                </button>
            </div>
        </div>
    );
}
