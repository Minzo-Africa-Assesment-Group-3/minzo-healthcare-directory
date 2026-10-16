const LABELS: Record<string, string> = {
    amount: 'Amount',
    principal: 'Principal',
    annualInterestRate: 'Interest Rate',
    tenureMonths: 'Tenure (months)',
    narration: 'Narration',
    reason: 'Reason',
    memberId: 'Member ID',
    loanId: 'Loan ID',
    savingsAccountId: 'Savings Account ID',
    savingsTransactionId: 'Transaction ID',
    expenseHeadId: 'Expense Head ID',
    payee: 'Payee',
    paymentMethod: 'Payment Method',
    referenceDocument: 'Reference',
    schedulePeriod: 'Schedule Period',
    waiveAmount: 'Waive Amount',
    totalAmount: 'Total Amount',
    accruedInterest: 'Accrued Interest',
};

const MONEY_FIELDS = new Set([
    'amount', 'principal', 'totalAmount', 'accruedInterest', 'waiveAmount',
]);

function formatValue(key: string, value: unknown): string {
    if (value === null || value === undefined || value === '') return '—';
    if (MONEY_FIELDS.has(key) && (typeof value === 'number' || typeof value === 'string')) {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        if (!Number.isNaN(num)) {
            return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(num);
        }
    }
    return String(value);
}

export function PayloadView({ payload }: { payload: Record<string, unknown> }) {
    const entries = Object.entries(payload).filter(([, v]) => v !== undefined);

    return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-md bg-gray-50 p-3 text-sm">
            {entries.map(([key, value]) => (
                <div key={key}>
                    <p className="text-xs text-gray-500">{LABELS[key] ?? key}</p>
                    <p className="truncate font-medium" title={formatValue(key, value)}>
                        {formatValue(key, value)}
                    </p>
                </div>
            ))}
        </div>
    );
}