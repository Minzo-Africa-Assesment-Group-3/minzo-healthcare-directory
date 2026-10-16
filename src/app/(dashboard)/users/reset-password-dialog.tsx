'use client';

// import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
// import { KeyRound } from 'lucide-react';
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
import { usersService, AppUser } from '@/services/users.service';
import { notify } from '@/lib/toast';

const schema = z.object({ password: z.string().min(8, 'Password must be at least 8 characters') });
type Values = z.infer<typeof schema>;

export function ResetPasswordDialog({ user, onClose }: { user: AppUser | null; onClose: () => void }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Values>({ resolver: zodResolver(schema) });

    const { mutate, isPending } = useMutation({
        mutationFn: (values: Values) => usersService.adminResetPassword(user!._id, values.password),
        onSuccess: () => {
            notify.success('Password reset successfully');
            reset();
            onClose();
        },
    });

    return (
        <Dialog open={!!user} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Reset Password — {user?.fullName}</DialogTitle>
                </DialogHeader>

                <p className="text-sm text-gray-500">
                    This immediately signs {user?.fullName} out of any active session. Share the new
                    password with them directly — it will not be shown again.
                </p>

                <form onSubmit={handleSubmit((v) => mutate(v))} className="space-y-4">
                    <div className='space-y-1'>
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" {...register('password')} />
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isPending} className="bg-green-700 hover:bg-green-800">
                            {isPending ? 'Resetting…' : 'Reset Password'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}