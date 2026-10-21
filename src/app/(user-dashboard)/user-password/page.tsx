// Save for later
'use client';

import { useState } from 'react';
import { Button, Field, SectionCard } from '../components/ui';

export default function PasswordSection() {
    const [current, setCurrent] = useState('');
    const [next, setNext] = useState('');

    const canSubmit = current.length > 0 && next.length >= 8;

    return (
        <SectionCard title="Password" className="pb-8">
            <div className="mt-6 flex flex-col gap-2 md:flex-row">
                <Field
                    id="current-password"
                    label="Current password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter current password"
                    value={current}
                    onChange={(e) => setCurrent(e.target.value)}
                />
                <Field
                    id="new-password"
                    label="New password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Enter new password"
                    value={next}
                    onChange={(e) => setNext(e.target.value)}
                />
            </div>
            <p className="mt-2 text-xs text-gray-500">Use at least 8 characters.</p>

            <div className="mt-8 flex justify-end">
                <Button
                    disabled={!canSubmit}
                    onClick={() => {
                        setCurrent('');
                        setNext('');
                    }}
                >
                    Update password
                </Button>
            </div>
        </SectionCard>
    );
}