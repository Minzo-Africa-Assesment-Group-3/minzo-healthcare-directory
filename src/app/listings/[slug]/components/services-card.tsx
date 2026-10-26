import { CircleCheck } from 'lucide-react';
import type { BusinessDetailLocation } from './types';

export default function ServicesCard({ services }: { services: BusinessDetailLocation['services'] }) {
    return (
        <section id="services" className="scroll-mt-32 rounded-xl border border-gray-200 p-5 sm:p-6">
            <h2 className="text-base font-semibold text-gray-950 sm:text-lg">
                Services{services.length > 0 && <span className="ml-1.5 text-sm font-normal text-gray-500">({services.length})</span>}
            </h2>

            {services.length === 0 ? (
                <p className="mt-3 text-sm text-gray-500">No services have been listed yet.</p>
            ) : (
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {services.map((s) => (
                        <li key={s.id} className="flex items-center gap-2.5 rounded-lg bg-[#F1F5F2] px-3.5 py-2.5 text-sm text-gray-900">
                            <CircleCheck className="h-4 w-4 shrink-0 text-[#1B8A52]" aria-hidden />
                            {s.name}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}