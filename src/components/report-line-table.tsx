import { ReportLine } from '@/services/reports.service';

export function ReportLineTable({
    lines,
    total,
    totalLabel,
}: {
    lines: ReportLine[];
    total: string;
    totalLabel: string;
}) {
    return (
        <table className="w-full text-sm">
            <tbody>
                {lines.map((line) => (
                    <tr key={line.accountName} className="border-b">
                        <td className="py-2 text-gray-500">{line.accountCode ?? ''}</td>
                        <td className="py-2">{line.accountName}</td>
                        <td className="py-2 text-right">
                            {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(
                                parseFloat(line.amount),
                            )}
                        </td>
                    </tr>
                ))}
                <tr className="font-bold">
                    <td className="py-2"></td>
                    <td className="py-2">{totalLabel}</td>
                    <td className="py-2 text-right">
                        {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(
                            parseFloat(total),
                        )}
                    </td>
                </tr>
            </tbody>
        </table>
    );
}