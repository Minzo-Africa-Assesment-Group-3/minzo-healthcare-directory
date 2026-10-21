'use client';

import { useFormContext, type UseFormRegisterReturn } from 'react-hook-form';
import { Clock } from 'lucide-react';
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
        formState: { errors },
    } = useFormContext<BusinessFormValues>();
    const hours = watch('openingHours');

    return (
        <div className="rounded-2xl bg-[#F4F4F4] p-3 sm:p-4">
            <ul className="space-y-3">
                {DAYS.map((d, i) => {
                    const closed = !!hours[i]?.closed;
                    const err = errors.openingHours?.[i];
                    const message = err?.closesAt?.message ?? err?.opensAt?.message;
                    return (
                        <li key={d.value}>
                            <div className="flex items-center gap-2">
                                <span className={`w-10 shrink-0 text-sm font-semibold text-gray-950 ${slab}`}>{d.short}</span>
                                <TimeInput reg={register(`openingHours.${i}.opensAt`)} label={`${d.short} opening time`} disabled={closed} />
                                <span className="text-gray-700" aria-hidden>-</span>
                                <TimeInput reg={register(`openingHours.${i}.closesAt`)} label={`${d.short} closing time`} disabled={closed} />
                                <label className="flex shrink-0 cursor-pointer items-center gap-1.5 text-xs text-gray-800">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-400 accent-[#0C486D]"
                                        {...register(`openingHours.${i}.closed`)}
                                    />
                                    Closed
                                </label>
                            </div>
                            {message && <p className="mt-1 pl-12 text-xs text-red-600">{message}</p>}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
