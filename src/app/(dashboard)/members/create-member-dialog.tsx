'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { membersService } from '@/services/members.service';
import { Plus } from 'lucide-react';
import { notify } from '@/lib/toast';

const createMemberSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    phoneNumber: z.string().min(1, 'Phone number is required'),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    address: z.string().optional(),
    nextOfKinName: z.string().optional(),
    nextOfKinPhone: z.string().optional(),
});

type CreateMemberValues = z.infer<typeof createMemberSchema>;

export function CreateMemberDialog() {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateMemberValues>({ resolver: zodResolver(createMemberSchema) });

    const { mutate, isPending, error } = useMutation({
        mutationFn: membersService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['members'] });
            notify.success('Member registered successfully');
            setOpen(false);
            reset();
        },
    });

    const onSubmit = (values: CreateMemberValues) => {
        mutate({ ...values, email: values.email || undefined });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    <Button className="bg-green-700 hover:bg-green-800">
                        <Plus size={16} className="mr-1" /> New Member
                    </Button>
                }
            />
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Register New Member</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="fullName">Full Name<span className="text-red-500">*</span></Label>
                        <Input id="fullName" {...register('fullName')} placeholder="John Doe" />
                        {errors.fullName && (
                            <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="phoneNumber">Phone Number<span className="text-red-500">*</span></Label>
                        <Input id="phoneNumber" {...register('phoneNumber')} placeholder="+234..." />
                        {errors.phoneNumber && (
                            <p className="mt-1 text-xs text-red-600">{errors.phoneNumber.message}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="email">Email (optional)</Label>
                        <Input id="email" type="email" {...register('email')} placeholder="john.doe@example.com" />
                        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="address">Address (optional)</Label>
                        <Input id="address" {...register('address')} placeholder="123 Main Street" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label htmlFor="nextOfKinName">Next of Kin<span className="text-red-500">*</span></Label>
                            <Input id="nextOfKinName" {...register('nextOfKinName')} placeholder="John Doe" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="nextOfKinPhone">NOK Phone<span className="text-red-500">*</span></Label>
                            <Input id="nextOfKinPhone" {...register('nextOfKinPhone')} placeholder="+234..." />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-600">{error.message}</p>}

                    <DialogFooter>
                        <Button type="submit" disabled={isPending} className="bg-green-700 hover:bg-green-800">
                            {isPending ? 'Saving…' : 'Register Member'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}