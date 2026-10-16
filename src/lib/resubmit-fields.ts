export interface EditableField {
    key: string;
    label: string;
    type: 'text' | 'number';
}

export const RESUBMIT_EDITABLE_FIELDS: Record<string, EditableField[]> = {
    DEPOSIT: [
        { key: 'amount', label: 'Amount (₦)', type: 'number' },
        { key: 'narration', label: 'Narration', type: 'text' },
    ],
    WITHDRAWAL: [
        { key: 'amount', label: 'Amount (₦)', type: 'number' },
        { key: 'narration', label: 'Narration', type: 'text' },
    ],
    REVERSE_TRANSACTION: [{ key: 'reason', label: 'Reason', type: 'text' }],
    DISBURSE: [
        { key: 'principal', label: 'Principal (₦)', type: 'number' },
        { key: 'annualInterestRate', label: 'Interest Rate (% p.a.)', type: 'number' },
        { key: 'tenureMonths', label: 'Tenure (months)', type: 'number' },
    ],
    REPAYMENT: [
        { key: 'amount', label: 'Amount (₦)', type: 'number' },
        { key: 'narration', label: 'Narration', type: 'text' },
    ],
    RESTRUCTURE: [
        { key: 'newAnnualInterestRate', label: 'New Interest Rate (% p.a.)', type: 'number' },
        { key: 'newTenureMonths', label: 'New Tenure (months)', type: 'number' },
        { key: 'reason', label: 'Reason', type: 'text' },
    ],
    WAIVE_INTEREST: [
        { key: 'waiveAmount', label: 'Waive Amount (₦)', type: 'number' },
        { key: 'reason', label: 'Reason', type: 'text' },
    ],
    RECORD_EXPENSE: [
        { key: 'description', label: 'Description', type: 'text' },
        { key: 'amount', label: 'Amount (₦)', type: 'number' },
        { key: 'payee', label: 'Payee', type: 'text' },
        { key: 'referenceDocument', label: 'Reference', type: 'text' },
    ],
};