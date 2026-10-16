'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { approvalsService } from '@/services/approvals.service';
import { PayloadView } from '@/components/payload-view';
import { DecisionDialog } from './decision-dialog';
import { formatDate } from '@/lib/format';
import { notify } from '@/lib/toast';

const moduleColor: Record<string, string> = {
    SAVINGS: 'bg-blue-100 text-blue-800',
    LOANS: 'bg-purple-100 text-purple-800',
    EXPENSES: 'bg-orange-100 text-orange-800',
    MEMBERS: 'bg-teal-100 text-teal-800',
    ACCOUNTING: 'bg-gray-100 text-gray-800',
};

export function PendingTab() {
    const queryClient = useQueryClient();
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [decision, setDecision] = useState<{ id: string | null; action: 'reject' | 'return' | null }>({
        id: null,
        action: null,
    });

    const { data, isLoading } = useQuery({
        queryKey: ['approvals', 'pending'],
        queryFn: () => approvalsService.getPending(),
    });

    const { mutate: approve, isPending: isApproving, variables: approvingId } = useMutation({
        mutationFn: (id: string) => approvalsService.approve(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['approvals'] })
            notify.success('Request approved');
        },
    });

    if (isLoading) return <p className="text-sm text-gray-500">Loading…</p>;
    if (!data || data.length === 0) {
        return (
            <div className="rounded-lg border border-dashed bg-white py-12 text-center">
                <p className="text-sm text-gray-500">No pending approvals — you&apos;re all caught up.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {data.map((req) => {
                const maker = typeof req.makerId === 'object' ? req.makerId : null;
                const isExpanded = expandedId === req._id;

                return (
                    <div key={req._id} className="rounded-lg border bg-white p-4">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => setExpandedId(isExpanded ? null : req._id)}
                                className="flex flex-1 items-center gap-3 justify-between text-left"
                            >
                                <div className="flex items-center gap-2">
                                <Badge className={moduleColor[req.module]} variant="secondary">
                                    {req.module}
                                </Badge>
                                <div>
                                    <p className="text-sm font-medium">{req.action.replace(/_/g, ' ')}</p>
                                    <p className="text-xs text-gray-500">
                                        Submitted by {maker?.fullName ?? 'Unknown'} · {formatDate(req.createdAt)}
                                    </p>
                                </div>
                                </div>
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                        </div>

                        {isExpanded && (
                            <div className="mt-3 space-y-3">
                                <PayloadView payload={req.payload} />

                                <div className="flex justify-end gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setDecision({ id: req._id, action: 'return' })}
                                    >
                                        <RotateCcw size={14} className="mr-1" /> Return
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-red-200 text-red-700 hover:bg-red-50"
                                        onClick={() => setDecision({ id: req._id, action: 'reject' })}
                                    >
                                        <X size={14} className="mr-1" /> Reject
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="bg-green-700 hover:bg-green-800"
                                        disabled={isApproving && approvingId === req._id}
                                        onClick={() => approve(req._id)}
                                    >
                                        <Check size={14} className="mr-1" />
                                        {isApproving && approvingId === req._id ? 'Approving…' : 'Approve'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}

            <DecisionDialog
                requestId={decision.id}
                action={decision.action}
                onClose={() => setDecision({ id: null, action: null })}
            />
        </div>
    );
}