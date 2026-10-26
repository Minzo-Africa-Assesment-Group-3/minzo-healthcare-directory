'use client';

import { CATEGORIES, type CategoryId } from './categories';

interface Props {
    value: CategoryId;
    onChange: (c: CategoryId) => void;
}

export default function CategoryTabs({ value, onChange }: Props) {
    return (
        <div className="border-b border-gray-200 bg-white">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                <div
                    role="group"
                    aria-label="Categories"
                    className="flex gap-2 overflow-x-auto py-3 [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden"
                >
                    {CATEGORIES.map(({ id, label, icon: Icon }) => {
                        const active = id === value;
                        return (
                            <button
                                key={id}
                                type="button"
                                aria-pressed={active}
                                onClick={() => onChange(id)}
                                className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C486D] ${
                                    active
                                        ? 'border-[#0C486D] bg-[#0C486D] font-medium text-white'
                                        : 'border-gray-200 bg-white text-gray-700 hover:border-[#0C486D]/40 hover:text-[#0C486D]'
                                }`}
                            >
                                <Icon className="h-4 w-4" aria-hidden />
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}