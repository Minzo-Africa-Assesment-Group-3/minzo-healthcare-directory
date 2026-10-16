'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { approvalsService } from '@/services/approvals.service';
import { notify } from '@/lib/toast';

interface DecisionDialogProps {
    requestId: string | null;
    action: 'reject' | 'return' | null;
    onClose: () => void;
}

export function DecisionDialog({ requestId, action, onClose }: DecisionDialogProps) {
    const [comment, setComment] = useState('');
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: () =>
            action === 'reject'
                ? approvalsService.reject(requestId!, comment || undefined)
                : approvalsService.returnToMaker(requestId!, comment || undefined),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['approvals'] });
            notify.success(action === 'reject' ? 'Request rejected' : 'Returned to Maker');
            setComment('');
            onClose();
        },
    });

    const open = !!requestId && !!action;

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>
                        {action === 'reject' ? 'Reject Request' : 'Return to Maker'}
                    </DialogTitle>
                </DialogHeader>

                <div>
                    <Label htmlFor="comment">
                        {action === 'reject' ? 'Reason for rejection' : 'What needs correcting'}
                    </Label>
                    <Textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Optional, but recommended"
                        rows={3}
                    />
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => mutate()}
                        disabled={isPending}
                        className={action === 'reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'}
                    >
                        {isPending ? 'Submitting…' : action === 'reject' ? 'Reject' : 'Return'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}