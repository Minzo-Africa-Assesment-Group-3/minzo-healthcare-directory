'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil } from 'lucide-react';
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
import { accountingService, Account } from '@/services/accounting.service';
import { notify } from '@/lib/toast';

const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
});
type Values = z.infer<typeof schema>;

export function EditAccountDialog({ account }: { account: Account }) {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Values>({
        resolver: zodResolver(schema),
        defaultValues: { name: account.name, description: account.description ?? '' },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (values: Values) => accountingService.updateAccount(account._id, values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            notify.success('Account updated');
            setOpen(false);
        },
    });

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="text-gray-400 hover:text-gray-700"
                aria-label={`Edit ${account.name}`}
            >
                <Pencil size={14} />
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Edit Account</DialogTitle>
                    </DialogHeader>

                    <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-500">
                        Code <span className="font-mono">{account.code}</span> · {account.type}
                        <br />
                        <span className="text-xs">Code and type cannot be changed.</span>
                    </div>

                    <form onSubmit={handleSubmit((v) => mutate(v))} className="space-y-4">
                        <div className='space-y-1'>
                            <Label htmlFor="name">Account Name</Label>
                            <Input id="name" {...register('name')} />
                            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
                        </div>
                        <div className='space-y-1'>
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" {...register('description')} />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isPending} className="bg-green-700 hover:bg-green-800">
                                {isPending ? 'Saving…' : 'Save'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}