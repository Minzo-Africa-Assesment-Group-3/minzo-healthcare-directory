'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface Props {
    open: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
}

export default function Modal({ open, title, onClose, children }: Props) {
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const d = ref.current;
        if (!d) return;
        if (open && !d.open) d.showModal();
        if (!open && d.open) d.close();
    }, [open]);

    return (
        <dialog
            ref={ref}
            onClose={onClose}
            onClick={(e) => e.target === ref.current && onClose()}
            aria-label={title}
            className="m-auto w-[min(30rem,calc(100%-2rem))] rounded-2xl p-0 text-gray-900 backdrop:bg-slate-900/50"
        >
            {open && (
                <div className="p-5 sm:p-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h3 className="text-lg font-semibold">{title}</h3>
                        <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-1.5 text-gray-600 hover:bg-gray-100">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    {children}
                </div>
            )}
        </dialog>
    );
}