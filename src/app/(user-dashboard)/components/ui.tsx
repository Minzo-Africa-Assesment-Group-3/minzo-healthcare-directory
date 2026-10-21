import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

const slab = 'font-(family-name:--font-roboto-slab)';

export function SectionCard({
    title,
    children,
    className = '',
}: {
    title: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <section className={`rounded-2xl bg-white p-6 ${className}`}>
            <h2 className={`${slab} text-lg font-semibold text-gray-900`}>{title}</h2>
            {children}
        </section>
    );
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; id: string };

export function Field({ label, id, className = '', ...props }: FieldProps) {
    return (
        <div className="flex min-w-0 flex-1 flex-col gap-2">
            <label htmlFor={id} className="text-sm font-medium text-gray-900">
                {label}
            </label>
            <input
                id={id}
                {...props}
                className={`h-13.5 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 placeholder:font-normal placeholder:text-gray-400 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#0C486D] disabled:bg-[#F4F4F4] disabled:text-gray-700 ${className}`}
            />
        </div>
    );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
};

const variants = {
    primary:
        'bg-[#0C486D] text-white shadow-[0_12px_24px_-8px_rgba(12,72,109,0.35)] hover:bg-[#0a3b5a]',
    secondary: 'bg-[#E9EDF1] text-[#0C486D] hover:bg-[#dde3e9]',
    outline: 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50',
    danger: 'bg-[#D92D4A] text-white hover:bg-[#bf2540]',
};

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
    return (
        <button
            type="button"
            {...props}
            className={`h-14 cursor-pointer rounded-full px-8 text-base font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C486D] disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
        />
    );
}