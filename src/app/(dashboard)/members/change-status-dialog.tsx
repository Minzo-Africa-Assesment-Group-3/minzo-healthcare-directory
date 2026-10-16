'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { membersService } from '@/services/members.service';
import { notify } from '@/lib/toast';

const STATUS_OPTIONS = ['ACTIVE', 'INACTIVE', 'SUSPENDED'] as const;

const STATUS_WARNING: Record<string, string> = {
    SUSPENDED: 'A suspended member will lose access to the member portal immediately.',
    INACTIVE: 'An inactive member will lose access to the member portal immediately.',
    ACTIVE: 'This restores full member portal access.',
};

export function ChangeStatusDialog({
    memberId,
    currentStatus,
}: {
    memberId: string;
    currentStatus: string;
}) {
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState(currentStatus);
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: () => membersService.setStatus(memberId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['member-statement', memberId] });
            queryClient.invalidateQueries({ queryKey: ['members'] });
            notify.success('Member status updated');
            setOpen(false);
        },
    });

    return (
        <>
            <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
                <UserCog size={14} className="mr-1" /> Change Status
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Change Member Status</DialogTitle>
                    </DialogHeader>

                    <div className='space-y-2'>
                        <Label>Status</Label>
                        <Select value={status} onValueChange={(v) => setStatus(v ?? currentStatus)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUS_OPTIONS.map((s) => (
                                    <SelectItem key={s} value={s}>
                                        {s}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {status !== currentStatus && (
                            <p className="mt-2 text-xs text-amber-700">{STATUS_WARNING[status]}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            disabled={isPending || status === currentStatus}
                            className="bg-green-700 hover:bg-green-800"
                            onClick={() => mutate()}
                        >
                            {isPending ? 'Saving…' : 'Save Status'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}