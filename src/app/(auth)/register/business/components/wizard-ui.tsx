import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export const slab = 'font-[family-name:var(--font-roboto-slab)]';

const base =
    'w-full rounded-xl border bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0C486D]/20 disabled:bg-gray-50 disabled:text-gray-400';
const state = (err?: boolean) => (err ? 'border-red-500' : 'border-gray-200 focus:border-[#0C486D]');

export const inputClass = (err?: boolean) => `h-12 ${base} ${state(err)}`;
export const textareaClass = (err?: boolean) => `min-h-28 resize-none py-3 ${base} ${state(err)}`;

export const primaryBtn =
    'inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#0C486D] px-8 text-base font-semibold text-white shadow-[0_12px_24px_-8px_rgba(12,72,109,0.35)] transition-colors hover:bg-[#0a3b5a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C486D] disabled:opacity-50';
export const secondaryBtn =
    'inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#E8EDF1] px-8 text-base font-semibold text-[#0C486D] transition-colors hover:bg-[#dbe3e9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C486D]';
export const outlineBtn =
    'inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#0C486D] px-6 text-sm font-semibold text-[#0C486D] transition-colors hover:bg-[#0C486D]/5 disabled:opacity-50';

export function Field({
    label,
    htmlFor,
    error,
    className,
    children,
}: {
    label: string;
    htmlFor?: string;
    error?: string;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div className={className}>
            <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-gray-950">
                {label}
            </label>
            {children}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
    options: { value: string; label: string }[];
    placeholder?: string;
    invalid?: boolean;
};

export const SelectInput = forwardRef<HTMLSelectElement, SelectProps>(function SelectInput(
    { options, placeholder = 'Select', invalid, className = '', ...props },
    ref,
) {
    return (
        <div className="relative">
            <select
                ref={ref}
                aria-invalid={invalid}
                className={`${inputClass(invalid)} appearance-none pr-10 ${className}`}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-900" aria-hidden />
        </div>
    );
});

export function StepHeader({ title, step, total = 7 }: { title: string; step: number; total?: number }) {
    return (
        <div className={`mb-8 flex items-center justify-between ${slab}`}>
            <h2 className="text-base font-semibold text-gray-950">{title}</h2>
            <p className="text-xs font-semibold text-gray-950">
                Step <span className="text-[#0C486D]">{step}</span> of {total}
            </p>
        </div>
    );
}
