'use client';

import { useCallback, useSyncExternalStore } from 'react';

const EVENT = 'minzo:follow-changed';

/**
 * Follow state, persisted in localStorage and kept in sync across tabs.
 * TODO: replace the localStorage write with your follow / unfollow API call.
 */
export function useFollow(businessId: string) {
    const key = `minzo:follow:${businessId}`;

    const subscribe = useCallback(
        (onChange: () => void) => {
            const onStorage = (e: StorageEvent) => e.key === key && onChange();
            window.addEventListener('storage', onStorage);
            window.addEventListener(EVENT, onChange);
            return () => {
                window.removeEventListener('storage', onStorage);
                window.removeEventListener(EVENT, onChange);
            };
        },
        [key],
    );

    const getSnapshot = useCallback(() => {
        try {
            return localStorage.getItem(key) === '1';
        } catch {
            return false;
        }
    }, [key]);

    const following = useSyncExternalStore(subscribe, getSnapshot, () => false);

    const toggle = useCallback(() => {
        const next = !following;
        try {
            localStorage.setItem(key, next ? '1' : '0');
        } catch {
            /* storage unavailable */
        }
        window.dispatchEvent(new Event(EVENT));
        return next;
    }, [following, key]);

    return { following, toggle };
}