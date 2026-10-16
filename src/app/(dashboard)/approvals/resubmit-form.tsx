'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PayloadView } from '@/components/payload-view';
import { approvalsService } from '@/services/approvals.service';
import { RESUBMIT_EDITABLE_FIELDS } from '@/lib/resubmit-fields';
import { notify } from '@/lib/toast';

interface ResubmitFormProps {
    requestId: string;
    action: string;
    payload: Record<string, unknown>;
    onDone: () => void;
}

export function ResubmitForm({ requestId, action, payload, onDone }: ResubmitFormProps) {
    const queryClient = useQueryClient();
    const editableFields = RESUBMIT_EDITABLE_FIELDS[action] ?? [];
    const editableKeys = new Set(editableFields.map((f) => f.key));

    const [values, setValues] = useState<Record<string, string | number>>(() => {
        const initial: Record<string, string | number> = {};
        editableFields.forEach((f) => {
            initial[f.key] = (payload[f.key] as string | number) ?? '';
        });
        return initial;
    });

    const readOnlyPayload = Object.fromEntries(
        Object.entries(payload).filter(([key]) => !editableKeys.has(key)),
    );

    const { mutate, isPending } = useMutation({
        mutationFn: () => {
            const merged = { ...payload };
            editableFields.forEach((f) => {
                merged[f.key] = f.type === 'number' ? Number(values[f.key]) : values[f.key];
            });
            return approvalsService.resubmit(requestId, merged);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['approvals'] });
            notify.success('Request resubmitted for approval');
            onDone();
        },
        onError: (err: Error) => notify.error(err.message),
    });

    if (editableFields.length === 0) {
        // Fallback for any action we haven't explicitly mapped yet
        return (
            <div className="space-y-3">
                <p className="text-xs text-amber-700">
                    This action type doesn&apos;t have a guided edit form yet — contact an admin to update
                    it, or reject and resubmit fresh.
                </p>
                <PayloadView payload={payload} />
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {Object.keys(readOnlyPayload).length > 0 && (
                <div>
                    <p className="mb-1 text-xs font-medium text-gray-500">Fixed details (not editable)</p>
                    <PayloadView payload={readOnlyPayload} />
                </div>
            )}

            <div className="space-y-3">
                {editableFields.map((field) => (
                    <div key={field.key}>
                        <Label htmlFor={field.key}>{field.label}</Label>
                        <Input
                            id={field.key}
                            type={field.type}
                            step={field.type === 'number' ? '0.01' : undefined}
                            value={values[field.key]}
                            onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                        />
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={onDone}>
                    Cancel
                </Button>
                <Button
                    size="sm"
                    className="bg-green-700 hover:bg-green-800"
                    disabled={isPending}
                    onClick={() => mutate()}
                >
                    {isPending ? 'Resubmitting…' : 'Resubmit'}
                </Button>
            </div>
        </div>
    );
}