'use client';

import { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { XCircle } from 'lucide-react';
import { LIMITS, SUGGESTED_SERVICES, type BusinessFormValues } from './business-schema';

export default function StepServices() {
    const { watch, setValue } = useFormContext<BusinessFormValues>();
    const selected = watch('services');
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [note, setNote] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const q = query.trim().toLowerCase();
    const options = SUGGESTED_SERVICES.filter((s) => !selected.includes(s) && s.toLowerCase().includes(q));
    const canAddCustom =
        q !== '' &&
        !SUGGESTED_SERVICES.some((s) => s.toLowerCase() === q) &&
        !selected.some((s) => s.toLowerCase() === q);

    const update = (next: string[]) => setValue('services', next, { shouldDirty: true });
    const add = (name: string) => {
        const v = name.replace(/[\u0000-\u001F\u007F]/g, '').replace(/\s+/g, ' ').trim();
        if (!v) return;
        if (selected.some((s) => s.toLowerCase() === v.toLowerCase())) return setNote(`“${v}” is already added`);
        if (v.length < 2) return setNote('A service name needs at least 2 characters');
        if (selected.length >= LIMITS.maxServices) return setNote(`You can add up to ${LIMITS.maxServices} services`);
        update([...selected, v]);
        setQuery('');
        setNote('');
        inputRef.current?.focus();
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // don't submit the wizard
            const match = SUGGESTED_SERVICES.find((s) => s.toLowerCase() === q);
            add(match ?? query);
        } else if (e.key === 'Backspace' && query === '' && selected.length) {
            update(selected.slice(0, -1));
        } else if (e.key === 'Escape') {
            setOpen(false);
        }
    };

    return (
        <div
            className="relative"
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
            }}
        >
            <label htmlFor="services" className="mb-2 block text-base font-medium text-gray-950">
                Services (optional)
            </label>

            <div
                onClick={() => inputRef.current?.focus()}
                className="flex min-h-14 flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 focus-within:border-[#0C486D] focus-within:ring-2 focus-within:ring-[#0C486D]/20"
            >
                {selected.map((name) => (
                    <span key={name} className="inline-flex max-w-full items-center gap-2 rounded-full border border-gray-200 bg-[#F6F7F8] py-2 pl-4 pr-3 text-xs text-gray-900">
                        <span className="truncate">{name}</span>
                        <button type="button" onClick={() => update(selected.filter((s) => s !== name))} aria-label={`Remove ${name}`} className="shrink-0 text-gray-900 hover:text-red-600">
                            <XCircle className="h-4 w-4" />
                        </button>
                    </span>
                ))}
                <input
                    ref={inputRef}
                    id="services"
                    value={query}
                    maxLength={LIMITS.service}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setNote('');
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    onKeyDown={onKeyDown}
                    placeholder={selected.length ? 'Add another…' : 'Search or add a service'}
                    autoComplete="off"
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    className="min-w-[8rem] flex-1 bg-transparent py-1 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />
            </div>
            <p role="status" className={`mt-1 text-xs ${note ? 'text-red-600' : 'text-gray-500'}`}>
                {note || 'Press Enter to add a service that isn’t listed.'}
            </p>

            {open && (options.length > 0 || canAddCustom) && (
                <ul role="listbox" className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-gray-100 bg-white py-2 shadow-lg">
                    {options.map((s) => (
                        <li key={s} role="option" aria-selected={false}>
                            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => add(s)} className="w-full px-5 py-2.5 text-left text-sm text-gray-900 hover:bg-gray-50">
                                {s}
                            </button>
                        </li>
                    ))}
                    {canAddCustom && (
                        <li role="option" aria-selected={false}>
                            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => add(query)} className="w-full px-5 py-2.5 text-left text-sm font-medium text-[#0C486D] hover:bg-gray-50">
                                Add “{query.trim()}”
                            </button>
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
}