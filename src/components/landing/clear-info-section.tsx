import Image from 'next/image';
import { Check } from 'lucide-react';

export default function ClearInfoSection() {
    return (
        <section className="bg-[#EEF4EE] py-14 md:py-20">
            <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-4 text-center sm:px-6 md:flex-row md:gap-16 md:text-left lg:px-8">
                <div className="relative shrink-0">
                    <Image
                        src="/lady-phone.png"
                        alt="A woman smiling while using her phone"
                        width={224}
                        height={256}
                        className="h-56 w-48 rounded-2xl object-cover md:h-80 md:w-64"
                    />
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#1B8A52] text-white ring-2 ring-[#EEF4EE]">
                        <Check className="h-3.5 w-3.5" strokeWidth={3.5} aria-hidden />
                    </span>
                </div>

                <div className="max-w-md md:max-w-lg">
                    <h2 className="text-2xl font-bold leading-snug text-gray-950 sm:text-3xl">
                        Clear Information. Better Decisions.
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-gray-800 sm:text-base">
                        Minzo helps you find healthcare professionals and institutions with the details, services and
                        contact information you need to make informed choices
                    </p>
                </div>
            </div>
        </section>
    );
}
