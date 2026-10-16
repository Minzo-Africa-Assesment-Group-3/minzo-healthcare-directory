import { LucideIcon } from 'lucide-react';

export function KpiCard({
    label,
    value,
    icon: Icon,
    accent = 'text-gray-900',
}: {
    label: string;
    value: string;
    icon: LucideIcon;
    accent?: string;
}) {
    return (
        <div className="rounded-lg border bg-white p-5">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{label}</p>
                <Icon size={18} className="text-gray-300" />
            </div>
            <p className={`mt-2 text-2xl font-bold ${accent}`}>{value}</p>
        </div>
    );
}