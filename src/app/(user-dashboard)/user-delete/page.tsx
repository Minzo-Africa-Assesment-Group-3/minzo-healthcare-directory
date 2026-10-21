'use client';

import { useState } from 'react';
import { Button, SectionCard } from '../components/ui';

export default function DeleteAccount() {
    const [confirming, setConfirming] = useState(false);

    return (
        <SectionCard title="Delete account" className="pb-8">
            <p className="mt-3 max-w-xl text-sm text-gray-700">
                Deleting your account permanently removes your profile, the businesses you follow and
                the reviews you’ve written. This can’t be undone.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
                {confirming ? (
                    <>
                        <span className="text-sm font-medium text-gray-900">
                            Are you sure you want to delete your account?
                        </span>
                        <Button variant="secondary" onClick={() => setConfirming(false)}>
                            Keep account
                        </Button>
                        <Button variant="danger">Yes, delete</Button>
                    </>
                ) : (
                    <Button variant="danger" onClick={() => setConfirming(true)}>
                        Delete my account
                    </Button>
                )}
            </div>
        </SectionCard>
    );
}