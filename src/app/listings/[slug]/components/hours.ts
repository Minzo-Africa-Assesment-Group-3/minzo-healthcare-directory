import type { DayOfWeek, OpeningPeriod } from './types';

export const DAY_ORDER: DayOfWeek[] = [
    'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY',
];

const JS_DAY: Record<DayOfWeek, number> = {
    SUNDAY: 0, MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3, THURSDAY: 4, FRIDAY: 5, SATURDAY: 6,
};
const JS_DAY_NAME = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const dayLabel = (d: DayOfWeek) => d.charAt(0) + d.slice(1).toLowerCase();

/** "08:30 PM" → minutes since midnight */
const toMinutes = (t: string): number | null => {
    const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(t.trim());
    if (!m) return null;
    return (Number(m[1]) % 12) * 60 + Number(m[2]) + (m[3].toUpperCase() === 'PM' ? 720 : 0);
};

/** Current weekday + minutes in the business's own timezone */
function zonedNow(timeZone: string, now: Date) {
    const opts: Intl.DateTimeFormatOptions = { weekday: 'long', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' };
    let parts: Intl.DateTimeFormatPart[];
    try {
        parts = new Intl.DateTimeFormat('en-US', { ...opts, timeZone }).formatToParts(now);
    } catch {
        parts = new Intl.DateTimeFormat('en-US', opts).formatToParts(now); // invalid tz: fall back to the viewer's
    }
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
    return {
        day: JS_DAY_NAME.indexOf(get('weekday')),
        minutes: Number(get('hour')) * 60 + Number(get('minute')),
    };
}

export const todayIn = (timeZone: string, now = new Date()): DayOfWeek =>
    DAY_ORDER.find((d) => JS_DAY[d] === zonedNow(timeZone, now).day) ?? 'MONDAY';

export type OpenStatus = { state: 'open' | 'closed' | 'unknown'; label: string };

export function getOpenStatus(periods: OpeningPeriod[], timeZone: string, now = new Date()): OpenStatus {
    const spans = periods.flatMap((p) => {
        const start = toMinutes(p.opensAt);
        const close = toMinutes(p.closesAt);
        if (start === null || close === null) return [];
        const crossesMidnight = p.closesNextDay || close <= start; // 12:00 AM → 12:00 AM = open 24h
        return [{ day: JS_DAY[p.dayOfWeek], start, end: crossesMidnight ? close + 1440 : close, p }];
    });
    if (!spans.length) return { state: 'unknown', label: 'Hours not provided' };

    const { day, minutes } = zonedNow(timeZone, now);

    for (const sp of spans) {
        // today's span, or yesterday's span that runs past midnight
        const t = sp.day === day ? minutes : (sp.day + 1) % 7 === day ? minutes + 1440 : null;
        if (t !== null && t >= sp.start && t < sp.end) {
            const allDay = sp.end - sp.start >= 1440;
            return { state: 'open', label: allDay ? 'Open 24 hours' : `Open now · Closes ${sp.p.closesAt}` };
        }
    }

    for (let offset = 0; offset <= 7; offset++) {
        const target = (day + offset) % 7;
        const next = spans
            .filter((sp) => sp.day === target && (offset > 0 || sp.start > minutes))
            .sort((a, b) => a.start - b.start)[0];
        if (next) {
            const when = offset === 0 ? '' : offset === 1 ? 'tomorrow ' : `${JS_DAY_NAME[target].slice(0, 3)} `;
            return { state: 'closed', label: `Closed · Opens ${when}${next.p.opensAt}` };
        }
    }
    return { state: 'closed', label: 'Closed' };
}