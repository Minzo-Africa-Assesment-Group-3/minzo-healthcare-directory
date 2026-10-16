'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { membersService } from '@/services/members.service';
import { notify } from '@/lib/toast';

const schema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
});
type Values = z.infer<typeof schema>;

export function SetPasswordDialog({
    memberId,
    membershipNumber,
}: {
    memberId: string;
    membershipNumber: string;
}) {
    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Values>({ resolver: zodResolver(schema) });

    const { mutate, isPending } = useMutation({
        mutationFn: (values: Values) => membersService.setPortalPassword(memberId, values.password),
        onSuccess: () => {
            notify.success('Portal password set successfully');
            setOpen(false);
            reset();
        },
    });

    return (
        <>
            <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
                <KeyRound size={14} className="mr-1" /> Set Portal Password
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Set Member Portal Password</DialogTitle>
                    </DialogHeader>

                    <p className="text-sm text-gray-500">
                        This creates or resets login access to the member self-service portal for{' '}
                        <span className="font-medium">{membershipNumber}</span>. Share the password with the
                        member directly — it will not be shown again.
                    </p>

                    <form onSubmit={handleSubmit((v) => mutate(v))} className="space-y-4">
                        <div className='space-y-2'>
                            <Label htmlFor="password">New Password</Label>
                            <Input id="password" type="password" {...register('password')} />
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button type="submit" disabled={isPending} className="bg-green-700 hover:bg-green-800">
                                {isPending ? 'Setting…' : 'Set Password'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}