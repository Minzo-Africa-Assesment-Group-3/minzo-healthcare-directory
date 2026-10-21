'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthShell from '../auth-shell';

type AccountType = 'care-seeker' | 'business-owner';

const options: { value: AccountType; label: string; icon: string }[] = [
    { value: 'care-seeker', label: 'I’m looking for care', icon: '/care.svg' },
    { value: 'business-owner', label: 'I own a business', icon: '/biz.svg' },
];

export default function AccountTypeForm() {
    const router = useRouter();
    const [accountType, setAccountType] = useState<AccountType>('care-seeker');

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (accountType === 'care-seeker') {
            router.push(`/register/user?type=${accountType}`); 
        } else if (accountType === 'business-owner') {
            router.push(`/register/business?type=${accountType}`);
        }
    };

    return (
        <AuthShell
            title="Join Minzo"
            subtitle="One account for searching, reviewing and following"
        >
            <form onSubmit={onSubmit}>
                <fieldset>
                    <legend className="sr-only">Choose your account type</legend>
                    <div className="grid grid-cols-2 gap-3">
                        {options.map((opt) => (
                            <label
                                key={opt.value}
                                className="relative flex h-36 cursor-pointer flex-col items-center justify-end gap-3 rounded-2xl bg-gray-100 px-2 pb-5 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)] transition-colors hover:bg-gray-50 has-checked:bg-white has-checked:ring-1 has-checked:ring-[#0C486D]/30"
                            >
                                <input
                                    type="radio"
                                    name="accountType"
                                    value={opt.value}
                                    checked={accountType === opt.value}
                                    onChange={() => setAccountType(opt.value)}
                                    className="peer sr-only"
                                />

                                {/* radio indicator */}
                                <span
                                    aria-hidden
                                    className="absolute left-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border border-[#0C486D] bg-white after:h-3 after:w-3 after:scale-0 after:rounded-full after:bg-[#0C486D] after:transition-transform after:content-[''] peer-checked:after:scale-100 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#0C486D]"
                                />

                                <Image
                                    src={opt.icon}
                                    alt=""
                                    width={64}
                                    height={64}
                                    className="h-16 w-16 object-contain"
                                />
                                <span className="text-center text-sm font-medium text-gray-900">
                                    {opt.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </fieldset>

                <button
                    type="submit"
                    className="mt-8 h-14 w-full rounded-full bg-[#0C486D] text-base font-medium text-white shadow-[0_12px_24px_-8px_rgba(12,72,109,0.35)] transition-colors hover:bg-[#0a3b5a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C486D]"
                // onClick={() => router.push(`/register/user?type=${accountType}`)}
                >
                    Create account
                </button>

                <p className="mt-5 text-center font-(family-name:--font-roboto-slab) text-sm font-medium text-gray-900">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-[#0C486D] hover:underline">
                        Log in
                    </Link>
                </p>
            </form>
        </AuthShell>
    );
}