'use client';

import { useFormContext, type UseFormRegisterReturn } from 'react-hook-form';
import { Clock, Copy } from 'lucide-react';
import { DAYS, type BusinessFormValues } from './business-schema';
import { slab } from './wizard-ui';

function TimeInput({ reg, label, disabled }: { reg: UseFormRegisterReturn; label: string; disabled: boolean }) {
    return (
        <div className="relative min-w-0 flex-1">
            <input
                type="time"
                aria-label={label}
                disabled={disabled}
                className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-2.5 pr-7 text-xs text-gray-900 focus:border-[#0C486D] focus:outline-none focus:ring-2 focus:ring-[#0C486D]/20 disabled:opacity-50 sm:text-sm [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
                {...reg}
            />
            <Clock className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" aria-hidden />
        </div>
    );
}

export default function StepHours() {
    const {
        register,
        watch,
        setValue,
        getValues,
        formState: { errors },
    } = useFormContext<BusinessFormValues>();
    const hours = watch('openingHours');

    // Monday → every other day
    const copyMonday = () => {
        const monday = getValues('openingHours.0');
        const opts = { shouldDirty: true, shouldValidate: true };
        for (let i = 1; i < DAYS.length; i++) {
            setValue(`openingHours.${i}.opensAt`, monday.opensAt, opts);
            setValue(`openingHours.${i}.closesAt`, monday.closesAt, opts);
            setValue(`openingHours.${i}.closed`, monday.closed, opts);
            setValue(`openingHours.${i}.is24Hours`, monday.is24Hours, opts);
        }
    };

    return (
        <div>
            <div className="mb-2 flex justify-end">
                <button
                    type="button"
                    onClick={copyMonday}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-[#0C486D] hover:bg-[#0C486D]/5"
                >
                    <Copy className="h-3.5 w-3.5" aria-hidden />
                    Copy Monday to all days
                </button>
            </div>

            <div className="rounded-2xl bg-[#F4F4F4] p-3 sm:p-4">
                <ul className="space-y-3">
                    {DAYS.map((d, i) => {
                        const off = !!hours[i]?.closed || !!hours[i]?.is24Hours;
                        const err = errors.openingHours?.[i];
                        const message = err?.closesAt?.message ?? err?.opensAt?.message;
                        return (
                            <li key={d.value}>
                                <div className="flex items-center gap-2">
                                    <span className={`w-9 shrink-0 text-sm font-semibold text-gray-950 ${slab}`}>{d.short}</span>
                                    <TimeInput reg={register(`openingHours.${i}.opensAt`)} label={`${d.short} opening time`} disabled={off} />
                                    <span className="text-gray-700" aria-hidden>-</span>
                                    <TimeInput reg={register(`openingHours.${i}.closesAt`)} label={`${d.short} closing time`} disabled={off} />
                                    <div className="flex shrink-0 flex-col gap-1 text-[11px] text-gray-800">
                                        <label className="flex cursor-pointer items-center gap-1.5">
                                            <input
                                                type="checkbox"
                                                className="h-3.5 w-3.5 rounded border-gray-400 accent-[#0C486D]"
                                                {...register(`openingHours.${i}.closed`, {
                                                    onChange: (e) => e.target.checked && setValue(`openingHours.${i}.is24Hours`, false),
                                                })}
                                            />
                                            Closed
                                        </label>
                                        <label className="flex cursor-pointer items-center gap-1.5">
                                            <input
                                                type="checkbox"
                                                className="h-3.5 w-3.5 rounded border-gray-400 accent-[#0C486D]"
                                                {...register(`openingHours.${i}.is24Hours`, {
                                                    onChange: (e) => e.target.checked && setValue(`openingHours.${i}.closed`, false),
                                                })}
                                            />
                                            24 hours
                                        </label>
                                    </div>
                                </div>
                                {message && (
                                    <p role="alert" className="mt-1 pl-11 text-xs text-red-600">
                                        {message}
                                    </p>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}