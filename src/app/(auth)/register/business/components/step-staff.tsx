'use client';

import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { ChevronDown, PlusCircle, Trash2 } from 'lucide-react';
import { PROFESSIONS, emptyStaffRow, type BusinessFormValues } from './business-schema';
import { Field, SelectInput, inputClass, outlineBtn } from './wizard-ui';

const MAX_STAFF = 50;

export default function StepStaff() {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext<BusinessFormValues>();
    const { fields, append, remove } = useFieldArray({ control, name: 'staffMembers' });
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    return (
        <div>
            <p className="mb-2 text-base font-medium text-gray-950">Staff members</p>

            <ul className="space-y-5">
                {fields.map((field, i) => {
                    const err = errors.staffMembers?.[i];
                    const detailsError = !!(err?.professionalTitle || err?.phone || err?.email || err?.yearsExperience);
                    const showDetails = expanded[field.id] || detailsError; // never hide a field that has an error
                    return (
                        <li key={field.id} className="rounded-2xl border border-gray-200 p-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <input
                                        aria-label={`Staff member ${i + 1} full name`}
                                        placeholder="Full name"
                                        autoComplete="off"
                                        maxLength={100}
                                        aria-invalid={!!err?.displayName}
                                        className={inputClass(!!err?.displayName)}
                                        {...register(`staffMembers.${i}.displayName`)}
                                    />
                                    {err?.displayName && <p role="alert" className="mt-1 text-xs text-red-600">{err.displayName.message}</p>}
                                </div>
                                <div>
                                    <SelectInput
                                        aria-label={`Staff member ${i + 1} profession`}
                                        options={PROFESSIONS}
                                        placeholder="Profession"
                                        invalid={!!err?.profession}
                                        {...register(`staffMembers.${i}.profession`)}
                                    />
                                    {err?.profession && <p role="alert" className="mt-1 text-xs text-red-600">{err.profession.message}</p>}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setExpanded((e) => ({ ...e, [field.id]: !e[field.id] }))}
                                aria-expanded={showDetails}
                                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0C486D]"
                            >
                                <ChevronDown className={`h-4 w-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} aria-hidden />
                                {showDetails ? 'Fewer details' : 'More details (optional)'}
                            </button>

                            {showDetails && (
                                <div className="mt-3 space-y-4">
                                    <Field label="Professional title" htmlFor={`staff-title-${i}`} error={err?.professionalTitle?.message}>
                                        <input
                                            id={`staff-title-${i}`}
                                            placeholder="e.g Consultant Paediatrician"
                                            maxLength={100}
                                            className={inputClass(!!err?.professionalTitle)}
                                            {...register(`staffMembers.${i}.professionalTitle`)}
                                        />
                                    </Field>

                                    <div className="grid grid-cols-2 gap-3">
                                        <Field label="Phone" htmlFor={`staff-phone-${i}`} error={err?.phone?.message}>
                                            <input
                                                id={`staff-phone-${i}`}
                                                type="tel"
                                                inputMode="tel"
                                                placeholder="+231 …"
                                                maxLength={25}
                                                className={inputClass(!!err?.phone)}
                                                {...register(`staffMembers.${i}.phone`)}
                                            />
                                        </Field>
                                        <Field label="Years of experience" htmlFor={`staff-years-${i}`} error={err?.yearsExperience?.message}>
                                            <input
                                                id={`staff-years-${i}`}
                                                inputMode="numeric"
                                                placeholder="e.g 5"
                                                maxLength={3}
                                                className={inputClass(!!err?.yearsExperience)}
                                                {...register(`staffMembers.${i}.yearsExperience`)}
                                            />
                                        </Field>
                                    </div>

                                    <Field label="Email" htmlFor={`staff-email-${i}`} error={err?.email?.message}>
                                        <input
                                            id={`staff-email-${i}`}
                                            type="email"
                                            placeholder="e.g dr.kollie@example.com"
                                            autoCapitalize="none"
                                            spellCheck={false}
                                            maxLength={254}
                                            className={inputClass(!!err?.email)}
                                            {...register(`staffMembers.${i}.email`)}
                                        />
                                    </Field>

                                    <label className="flex cursor-pointer items-start gap-2.5 text-sm text-gray-800">
                                        <input
                                            type="checkbox"
                                            className="mt-0.5 h-4 w-4 rounded border-gray-400 accent-[#0C486D]"
                                            {...register(`staffMembers.${i}.isPublic`)}
                                        />
                                        <span>
                                            Show on the public profile
                                            <span className="block text-xs text-gray-500">
                                                Only share details this person has agreed to make public.
                                            </span>
                                        </span>
                                    </label>
                                </div>
                            )}

                            <div className="mt-3 flex justify-end">
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
                <button
                    type="button"
                    onClick={() => append({ ...emptyStaffRow })}
                    disabled={fields.length >= MAX_STAFF}
                    className={`${outlineBtn} px-6`}
                >
                    <PlusCircle className="h-5 w-5" aria-hidden />
                    Add staff member
                </button>
            </div>
        </div>
    );
}