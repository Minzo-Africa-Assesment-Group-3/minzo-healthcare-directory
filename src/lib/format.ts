import { MoneyValue } from './types';

export function formatMoney(value: MoneyValue | string | number | null | undefined): string {
    if (value === null || value === undefined) return '—';
    const raw = typeof value === 'object' ? value.$numberDecimal : value;
    const num = typeof raw === 'string' ? parseFloat(raw) : raw;
    if (Number.isNaN(num)) return '—';
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(num);
}

export function formatDate(value: string | null | undefined): string {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}