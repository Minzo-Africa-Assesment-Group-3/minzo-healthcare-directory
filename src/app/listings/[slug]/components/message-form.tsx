'use client';

import { useState, type FormEvent } from 'react';

const field =
    'mt-1.5 w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm font-normal focus:border-[#0C486D] focus:outline-none focus:ring-2 focus:ring-[#0C486D]/20';

export default function MessageForm({
    onSubmit,
}: {
    onSubmit: (v: { name: string; email: string; message: string }) => void;
}) {
    const [v, setV] = useState({ name: '', email: '', message: '' });
    const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setV((p) => ({ ...p, [k]: e.target.value }));

    const submit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(v);
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <label className="block text-sm font-medium text-gray-900">
                Your name
                <input required autoComplete="name" value={v.name} onChange={set('name')} className={field} />
            </label>
            <label className="block text-sm font-medium text-gray-900">
                Email
                <input required type="email" autoComplete="email" value={v.email} onChange={set('email')} className={field} />
            </label>
            <label className="block text-sm font-medium text-gray-900">
                Message
                <textarea required rows={5} value={v.message} onChange={set('message')} className={`${field} resize-none`} />
            </label>
            <button type="submit" className="h-11 w-full rounded-full bg-[#0C486D] text-sm font-semibold text-white hover:bg-[#0a3b5a]">
                Send message
            </button>
        </form>
    );
}