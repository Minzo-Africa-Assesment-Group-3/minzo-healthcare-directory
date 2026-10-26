'use client';

import { MapPin } from 'lucide-react';

export type GeoStatus = 'idle' | 'loading' | 'granted' | 'denied' | 'unsupported';

const MESSAGES: Record<GeoStatus, string> = {
    idle: 'Turn on location to see the businesses closest to you.',
    loading: 'Finding your location…',
    granted: 'Using your location to find businesses near you.',
    denied: 'Location is blocked. Allow it in your browser settings to see what’s closest.',
    unsupported: 'Your browser doesn’t support location.',
};

interface Props {
    status: GeoStatus;
    onRequest: () => void;
}

export default function LocationBanner({ status, onRequest }: Props) {
    return (
        <div
            aria-live="polite"
            className="flex flex-col gap-2 rounded-xl bg-[#EEF4EE] px-3.5 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
        >
            <p className="text-xs text-gray-700 sm:text-sm">{MESSAGES[status]}</p>
            {status !== 'granted' && status !== 'unsupported' && (
                <button
                    type="button"
                    onClick={onRequest}
                    disabled={status === 'loading'}
                    className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 self-start rounded-full border border-[#0C486D] px-3.5 text-xs font-medium text-[#0C486D] transition-colors hover:bg-[#0C486D]/5 disabled:opacity-50 sm:self-auto"
                >
                    <MapPin className="h-3.5 w-3.5" aria-hidden />
                    {status === 'denied' ? 'Try again' : 'Use my location'}
                </button>
            )}
        </div>
    );
}