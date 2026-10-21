'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FileText, Upload, X } from 'lucide-react';
import { MAX_DOC_MB, type BusinessFormValues } from './business-schema';
import { Field, inputClass, slab } from './wizard-ui';

export default function StepRepresentative() {
    const {
        register,
        setValue,
        watch,
        formState: { errors },
    } = useFormContext<BusinessFormValues>();
    const file = watch('document');
    const [dragging, setDragging] = useState(false);
    const docError = errors.document?.message as string | undefined;

    const pick = (f?: File | null) =>
        setValue('document', f ?? undefined, { shouldValidate: true, shouldDirty: true });

    return (
        <div className="space-y-5">
            <Field label="Full name" htmlFor="fullName" error={errors.fullName?.message}>
                <input
                    id="fullName"
                    placeholder="e.g Miatte Kollie"
                    autoComplete="name"
                    aria-invalid={!!errors.fullName}
                    className={inputClass(!!errors.fullName)}
                    {...register('fullName')}
                />
            </Field>

            <Field label="Email address" htmlFor="email" error={errors.email?.message}>
                <input
                    id="email"
                    type="email"
                    placeholder="e.g matte@gmail.com"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    className={inputClass(!!errors.email)}
                    {...register('email')}
                />
            </Field>

            <Field label="Phone number" htmlFor="phone" error={errors.phone?.message}>
                <input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    placeholder="000 000 000 000"
                    autoComplete="tel"
                    aria-invalid={!!errors.phone}
                    className={inputClass(!!errors.phone)}
                    {...register('phone')}
                />
            </Field>

            <div>
                <p className="mb-2 text-base font-medium text-gray-950">Upload Registration Document</p>

                {file ? (
                    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
                        <FileText className="h-6 w-6 shrink-0 text-[#0C486D]" aria-hidden />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button type="button" onClick={() => pick(null)} aria-label="Remove document" className="rounded-full p-1.5 text-gray-600 hover:bg-gray-100">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <label
                        htmlFor="document"
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragging(true);
                        }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setDragging(false);
                            pick(e.dataTransfer.files?.[0]);
                        }}
                        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-10 text-center transition-colors focus-within:border-[#0C486D] ${
                            dragging ? 'border-[#0C486D] bg-[#0C486D]/5' : docError ? 'border-red-500' : 'border-gray-300 hover:border-[#0C486D]'
                        }`}
                    >
                        <Upload className="h-6 w-6 text-gray-900" aria-hidden />
                        <span className={`text-base font-medium text-gray-950 ${slab}`}>Upload Document</span>
                        <span className="text-xs text-gray-400">PDF or photo. Max {MAX_DOC_MB} mb</span>
                        <input
                            id="document"
                            type="file"
                            accept=".pdf,image/*"
                            className="sr-only"
                            onChange={(e) => {
                                pick(e.target.files?.[0]);
                                e.target.value = '';
                            }}
                        />
                    </label>
                )}

                {docError && (
                    <p role="alert" className="mt-1 text-xs text-red-600">
                        {docError}
                    </p>
                )}
            </div>
        </div>
    );
}
