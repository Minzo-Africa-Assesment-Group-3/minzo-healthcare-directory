'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { accountingService, AccountType } from '@/services/accounting.service';
import { notify } from '@/lib/toast';

const accountSchema = z.object({
    code: z.string().min(1, 'Account code is required'),
    name: z.string().min(1, 'Account name is required'),
    type: z.enum(['ASSET', 'LIABILITY', 'EQUITY', 'INCOME', 'EXPENSE']),
    description: z.string().optional(),
});
type AccountValues = z.infer<typeof accountSchema>;

const TYPE_OPTIONS: { value: AccountType; label: string }[] = [
    { value: 'ASSET', label: 'Asset' },
    { value: 'LIABILITY', label: 'Liability' },
    { value: 'EQUITY', label: 'Equity' },
    { value: 'INCOME', label: 'Income' },
    { value: 'EXPENSE', label: 'Expense' },
];

export function CreateAccountDialog() {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AccountValues>({ resolver: zodResolver(accountSchema) });

    const { mutate, isPending } = useMutation({
        mutationFn: accountingService.createAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            notify.success('Account created');
            setOpen(false);
            reset();
        },
    });

    return (
        <>
            <Button className="bg-green-700 hover:bg-green-800" onClick={() => setOpen(true)}>
                <Plus size={16} className="mr-1" /> New Account
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Account</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit((v) => mutate(v))} className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="code">Account Code</Label>
                            <Input id="code" {...register('code')} placeholder="e.g. 5500" />
                            {errors.code && <p className="mt-1 text-xs text-red-600">{errors.code.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="name">Account Name</Label>
                            <Input id="name" {...register('name')} placeholder="e.g. Cash and Bank" />
                            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label>Type</Label>
                            <Controller
                                control={control}
                                name="type"
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={(v) => field.onChange(v ?? undefined)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select account type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TYPE_OPTIONS.map((t) => (
                                                <SelectItem key={t.value} value={t.value}>
                                                    {t.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.type && <p className="mt-1 text-xs text-red-600">{errors.type.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="description">Description (optional)</Label>
                            <Input id="description" {...register('description')} />
                        </div>

                        <DialogFooter>
                            <Button type="submit" disabled={isPending} className="bg-green-700 hover:bg-green-800">
                                {isPending ? 'Saving…' : 'Add Account'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}