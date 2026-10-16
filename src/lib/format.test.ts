import { formatMoney, formatDate } from './format';

describe('formatMoney', () => {
    it('formats a MoneyValue object as Naira currency', () => {
        expect(formatMoney({ $numberDecimal: '150000.00' })).toBe('₦150,000.00');
    });

    it('formats a plain number', () => {
        expect(formatMoney(5000)).toBe('₦5,000.00');
    });

    it('returns an em dash for null or undefined', () => {
        expect(formatMoney(null)).toBe('—');
        expect(formatMoney(undefined)).toBe('—');
    });

    it('returns an em dash for a non-numeric string', () => {
        expect(formatMoney('not-a-number')).toBe('—');
    });
});

describe('formatDate', () => {
    it('formats an ISO date string', () => {
        expect(formatDate('2026-09-01T00:00:00.000Z')).toMatch(/Sep/);
    });

    it('returns an em dash for a falsy value', () => {
        expect(formatDate(null)).toBe('—');
        expect(formatDate(undefined)).toBe('—');
    });
});