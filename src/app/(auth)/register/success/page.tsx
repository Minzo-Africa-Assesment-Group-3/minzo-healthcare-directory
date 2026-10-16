'use client';

import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import AuthShell from '../../auth-shell';

// Decorative confetti, positioned around the badge (static, no motion)
const confetti = [
    { c: 'bg-orange-400', s: 'h-3 w-1.5', p: 'left-[8%] top-[28%] rotate-[35deg]' },
    { c: 'bg-yellow-400', s: 'h-1.5 w-1.5', p: 'left-[2%] top-[42%]' },
    { c: 'bg-orange-400', s: 'h-2 w-1.5', p: 'left-[30%] top-[88%] rotate-[60deg]' },
    { c: 'bg-orange-400', s: 'h-3 w-1.5', p: 'left-[72%] top-[0%] -rotate-[20deg]' },
    { c: 'bg-blue-400', s: 'h-2 w-1', p: 'left-[78%] top-[12%] rotate-[15deg]' },
    { c: 'bg-yellow-400', s: 'h-2 w-1', p: 'left-[96%] top-[40%] rotate-[50deg]' },
    { c: 'bg-yellow-400', s: 'h-1.5 w-3', p: 'left-[90%] top-[58%]' },
    { c: 'bg-yellow-400', s: 'h-2 w-3', p: 'left-[86%] top-[92%] rotate-[40deg]' },
];

export default function ResetSuccess() {
    const router = useRouter();

    return (
        <AuthShell
            showBack={false}
            title="Account created successfully"
            subtitle="You have successfully reset your password"
            hero={
                <div className="relative h-36 w-52" aria-hidden>
                    {confetti.map((piece, i) => (
                        <span
                            key={i}
                            className={`absolute rounded-[1px] ${piece.c} ${piece.s} ${piece.p}`}
                        />
                    ))}
                    <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-emerald-100">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#1B8A52]">
                            <Check className="h-12 w-12 text-white" strokeWidth={3.5} />
                        </div>
                    </div>
                </div>
            }
        >
            <button
                type="button"
                onClick={() => router.push('/login')}
                className="h-14 w-full rounded-full bg-[#0C486D] text-base font-medium text-white shadow-[0_12px_24px_-8px_rgba(12,72,109,0.35)] transition-colors hover:bg-[#0a3b5a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C486D]"
            >
                Log in
            </button>
        </AuthShell>
    );
}