import { Clock } from 'lucide-react';
import type { BusinessDetailLocation } from './types';
import { DAY_ORDER, dayLabel, todayIn, type OpenStatus } from './hours';

export default function HoursCard({ location: loc, status }: { location: BusinessDetailLocation; status: OpenStatus }) {
    const today = todayIn(loc.timezone);

    return (
        <section className="rounded-2xl border border-gray-200 bg-[#F6F8FA] p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-base font-semibold text-gray-950">
                    <Clock className="h-4 w-4 text-[#0C486D]" aria-hidden />
                    Opening hours
                </h2>
            </div>

            {loc.openingPeriods.length === 0 ? (
                <p className="text-sm text-gray-500">Opening hours haven’t been provided.</p>
            ) : (
                <>
                    <p className={`mb-3 text-xs font-medium ${status.state === 'open' ? 'text-[#1B7A47]' : 'text-gray-600'}`}>
                        {status.label}
                    </p>
                    <ul className="divide-y divide-gray-200/70 text-sm">
                        {DAY_ORDER.map((day) => {
                            const periods = loc.openingPeriods.filter((p) => p.dayOfWeek === day);
                            const isToday = day === today;
                            return (
                                <li
                                    key={day}
                                    className={`flex items-center justify-between gap-3 py-2 ${isToday ? 'font-semibold text-gray-950' : 'text-gray-700'}`}
                                >
                                    <span>
                                        {dayLabel(day)}
                                        {isToday && <span className="ml-2 rounded-full bg-[#0C486D] px-2 py-0.5 text-[10px] font-medium text-white">Today</span>}
                                    </span>
                                    <span className="text-right">
                                        {periods.length
                                            ? periods
                                                .map((p) => (p.opensAt === p.closesAt ? 'Open 24 hours' : `${p.opensAt} – ${p.closesAt}`))
                                                .join(', ')
                                            : 'Closed'}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </>
            )}
        </section>
    );
}