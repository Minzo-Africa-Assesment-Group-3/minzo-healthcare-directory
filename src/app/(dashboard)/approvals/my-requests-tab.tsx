'use client';

// ignore unused vars
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PayloadView } from '@/components/payload-view';
import { approvalsService, ApprovalStatus } from '@/services/approvals.service';
import { formatDate } from '@/lib/format';
import { ResubmitForm } from './resubmit-form';

const statusColor: Record<ApprovalStatus, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    RETURNED: 'bg-amber-100 text-amber-800',
};

export function MyRequestsTab() {
    const queryClient = useQueryClient();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editedJson, setEditedJson] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['approvals', 'mine'],
        queryFn: approvalsService.getMine,
    });

    const { mutate: resubmit, isPending, error } = useMutation({
        mutationFn: (id: string) => approvalsService.resubmit(id, JSON.parse(editedJson)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['approvals'] });
            setEditingId(null);
        },
    });

    if (isLoading) return <p className="text-sm text-gray-500">Loading…</p>;
    if (!data || data.length === 0) {
        return (
            <div className="rounded-lg border border-dashed bg-white py-12 text-center">
                <p className="text-sm text-gray-500">You haven&apos;t submitted any requests yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {data.map((req) => (
                <div key={req._id} className="rounded-lg border bg-white p-4">
                    <div className="mb-2 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">
                                {req.module} · {req.action.replace(/_/g, ' ')}
                            </p>
                            <p className="text-xs text-gray-500">Submitted {formatDate(req.createdAt)}</p>
                        </div>
                        <Badge className={statusColor[req.status]} variant="secondary">
                            {req.status}
                        </Badge>
                    </div>

                    <PayloadView payload={req.payload} />

                    {req.comment && (
                        <p className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">Checker note:</span> {req.comment}
                        </p>
                    )}

                    {req.status === 'RETURNED' && (
                        <div className="mt-3">
                            {editingId === req._id ? (
                                <ResubmitForm
                                    requestId={req._id}
                                    action={req.action}
                                    payload={req.payload}
                                    onDone={() => setEditingId(null)}
                                />
                            ) : (
                                <Button size="sm" variant="outline" onClick={() => setEditingId(req._id)}>
                                    Edit & Resubmit
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}