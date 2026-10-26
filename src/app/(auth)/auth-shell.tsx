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
    hero?: React.ReactNode;
    children: React.ReactNode;
};

export default function AuthShell({
    title,
    subtitle,
    imageSrc = '/auth/nurse2.png',
    showBack = true,
    onBack,
    hero,
    children,
}: AuthShellProps) {
    const router = useRouter();

    return (
        <div className="flex min-h-dvh bg-white font-(family-name:--font-inter) lg:h-dvh lg:overflow-hidden">
            {/* Left: image (desktop only), fixed in place */}
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

            <main
                id="auth-main"
                className="flex w-full px-4 py-10 sm:px-8 lg:w-1/2 lg:overflow-y-auto"
            >
                <div className="m-auto w-full max-w-md">
                    <div className="flex flex-col items-center text-center">
                        <Image
                            src="/Minzo-Logo-1.jpg"
                            alt="Minzo"
                            width={56}
                            height={60}
                            priority
                            className="h-16 w-auto"
                        />

                        {hero && <div className="mt-10">{hero}</div>}

                        {showBack && (
                            <button
                                type="button"
                                onClick={() => (onBack ? onBack() : router.back())}
                                className="mt-8 inline-flex items-center gap-2 rounded text-sm font-medium text-gray-900 hover:text-[#0C486D] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0C486D] cursor-pointer"
                            >
                                <ArrowLeft className="h-4 w-4" aria-hidden />
                                Go back
                            </button>
                        )}

                        <h1 className={`${showBack ? 'mt-3' : 'mt-8'} font-(family-name:--font-roboto-slab) text-3xl font-bold leading-tight text-gray-950 sm:text-4xl`}>
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