"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import s from "./business.module.css";

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
            className={s.modal}
            onClose={onClose}
            onClick={(e) => e.target === ref.current && onClose()}
            aria-label={title}
        >
            {open && (
                <div className={s.modalBody}>
                    <div className={s.modalHead}>
                        <h3>{title}</h3>
                        <button className={s.iconBtn} onClick={onClose} aria-label="Close"><X size={20} /></button>
                    </div>
                    {children}
                </div>
            )}
        </dialog>
    );
}