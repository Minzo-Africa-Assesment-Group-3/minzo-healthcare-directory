'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

type AuthShellProps = {
    title: string;
    subtitle?: React.ReactNode;
    imageSrc?: string;
    showBack?: boolean;
    onBack?: () => void; // defaults to router.back()
    hero?: React.ReactNode; // optional graphic between logo and title
    children: React.ReactNode;
};

/**
 * Shared layout for Minzo auth screens.
 * Mobile: single centred column (matches Figma mobile frames).
 * lg+: image on the left half, form on the right half.
 */
export default function AuthShell({
    title,
    subtitle,
    imageSrc = '/login.webp',
    showBack = true,
    onBack,
    hero,
    children,
}: AuthShellProps) {
    const router = useRouter();

    return (
        <div className="flex min-h-screen bg-white font-[family-name:var(--font-inter)]">
            {/* Left: image (desktop only) */}
            <div className="relative hidden w-1/2 lg:block">
                <Image
                    src={imageSrc}
                    alt=""
                    fill
                    priority
                    sizes="50vw"
                    className="object-cover"
                />
            </div>

            {/* Right: content */}
            <main className="flex w-full items-center justify-center px-4 py-10 sm:px-8 lg:w-1/2">
                <div className="w-full max-w-md">
                    <div className="flex flex-col items-center text-center">
                        <Image
                            src="/minzo-logo.png"
                            alt="Minzo"
                            width={56}
                            height={48}
                            priority
                            className="h-12 w-auto"
                        />

                        {hero && <div className="mt-10">{hero}</div>}

                        {showBack && (
                            <button
                                type="button"
                                onClick={() => (onBack ? onBack() : router.back())}
                                className="mt-8 inline-flex items-center gap-2 rounded text-sm font-medium text-gray-900 hover:text-[#0C486D] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0C486D]"
                            >
                                <ArrowLeft className="h-4 w-4" aria-hidden />
                                Go back
                            </button>
                        )}

                        <h1 className={`${showBack ? 'mt-3' : 'mt-8'} font-[family-name:var(--font-roboto-slab)] text-3xl font-bold leading-tight text-gray-950 sm:text-4xl`}>
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-500">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <div className="mt-10">{children}</div>
                </div>
            </main>
        </div>
    );
}
