'use client';

import { useState } from 'react';
import { Button, Field, SectionCard } from '../components/ui';

const INITIAL = { fullName: 'John Doe', email: 'johndoe@gmail.com', phone: '08082234567' };

const initials = (name: string) =>
    name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join('') || '?';

export default function PersonalDetails() {
    const [saved, setSaved] = useState(INITIAL);
    const [form, setForm] = useState(INITIAL);

    const dirty = form.fullName !== saved.fullName || form.phone !== saved.phone;

    return (
        <SectionCard title="Personal Details" className="pb-8">
            <div className="mt-6 flex items-center gap-4 px-1">
                <div
                    aria-hidden="true"
                    className="flex h-25 w-25 shrink-0 items-center justify-center rounded-full bg-[#0C486D] font-(family-name:--font-roboto-slab) text-4xl font-medium text-white"
                >
                    {initials(saved.fullName)}
                </div>
                <div>
                    <p className="font-(family-name:--font-roboto-slab) text-lg font-semibold text-gray-900">
                        {saved.fullName}
                    </p>
                    <p className="text-sm text-gray-700">{saved.email}</p>
                </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 px-1 md:flex-row">
                <Field
                    id="full-name"
                    label="Full name"
                    placeholder="Enter your full name"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
                <Field id="email" label="Email address" value={form.email} disabled readOnly />
                <Field
                    id="phone"
                    label="Phone number(optional)"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
            </div>

            <div className="mt-10 flex justify-end gap-2 px-1">
                <Button variant="secondary" onClick={() => setForm(saved)} disabled={!dirty}>
                    Cancel
                </Button>
                <Button onClick={() => setSaved(form)} disabled={!dirty}>
                    Save changes
                </Button>
            </div>
        </SectionCard>
    );
}