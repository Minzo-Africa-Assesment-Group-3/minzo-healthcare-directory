export type SectionId = 'personal' | 'password' | 'followed' | 'reviews' | 'delete';

export const PROFILE_SECTIONS: { id: SectionId; label: string; link: string; danger?: boolean }[] = [
    { id: 'personal', label: 'Personal Details', link: '/user-details', },
    { id: 'password', label: 'Password', link: '/user-password', },
    { id: 'followed', label: 'Followed businesses', link: '/user-followed', },
    { id: 'reviews', label: 'My reviews', link: '/user-reviews', },
    { id: 'delete', label: 'Delete account', link: '/user-delete', danger: true },
];