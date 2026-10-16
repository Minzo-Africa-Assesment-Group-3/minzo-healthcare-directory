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
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { usersService } from '@/services/users.service';
import { UserRole } from '@/lib/types';
import { notify } from '@/lib/toast';

const createUserSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    roles: z.array(z.nativeEnum(UserRole)).min(1, 'Select at least one role'),
});

type CreateUserValues = z.infer<typeof createUserSchema>;

const ALL_ROLES = [UserRole.ADMIN, UserRole.MAKER, UserRole.CHECKER, UserRole.VIEWER];

export function CreateUserDialog() {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateUserValues>({
        resolver: zodResolver(createUserSchema),
        defaultValues: { roles: [] },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: usersService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            notify.success('User created successfully');
            setOpen(false);
            reset();
        },
    });

    const onSubmit = (values: CreateUserValues) => {
        mutate({ ...values, email: values.email || undefined });
    };

    return (
        <>
            <Button className="bg-green-700 hover:bg-green-800" onClick={() => setOpen(true)}>
                <Plus size={16} className="mr-1" /> New User
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create Staff User</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" {...register('fullName')} />
                            {errors.fullName && (
                                <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="email">Email (optional)</Label>
                            <Input id="email" type="email" {...register('email')} />
                            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
                        </div>
                        <p className="text-xs text-gray-500">
                            If provided, the new user will receive their login details by email.
                        </p>

                        <div className="space-y-1">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" {...register('username')} />
                            {errors.username && (
                                <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" {...register('password')} />
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label>Roles</Label>
                            <Controller
                                control={control}
                                name="roles"
                                render={({ field }) => (
                                    <div className="mt-1 space-y-2">
                                        {ALL_ROLES.map((role) => (
                                            <div key={role} className="flex items-center gap-2">
                                                <Checkbox
                                                    id={role}
                                                    checked={field.value.includes(role)}
                                                    onCheckedChange={(checked) => {
                                                        field.onChange(
                                                            checked
                                                                ? [...field.value, role]
                                                                : field.value.filter((r) => r !== role),
                                                        );
                                                    }}
                                                />
                                                <Label htmlFor={role} className="text-sm font-normal">
                                                    {role}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            />
                            {errors.roles && <p className="mt-1 text-xs text-red-600">{errors.roles.message}</p>}
                        </div>

                        <p className="text-xs text-gray-500">
                            Note: the system allows a maximum of 10 active users at a time.
                        </p>

                        <DialogFooter>
                            <Button type="submit" disabled={isPending} className="bg-green-700 hover:bg-green-800">
                                {isPending ? 'Creating…' : 'Create User'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}