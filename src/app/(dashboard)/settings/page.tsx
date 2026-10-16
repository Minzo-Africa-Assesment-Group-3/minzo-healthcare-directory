'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { useAuthStore } from '@/store/auth-store';
import { usersService } from '@/services/users.service';
import { notify } from '@/lib/toast';

const profileSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
});
type ProfileValues = z.infer<typeof profileSchema>;

const passwordSchema = z
    .object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: z.string().min(8, 'New password must be at least 8 characters'),
        confirmPassword: z.string().min(1, 'Please confirm your new password'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });
type PasswordValues = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
    const { user } = useAuth();
    const setUser = useAuthStore((s) => s.setUser);

    const {
        register: registerProfile,
        handleSubmit: handleProfileSubmit,
        formState: { errors: profileErrors },
    } = useForm<ProfileValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: { fullName: user?.fullName ?? '', email: user?.email ?? '' },
    });

    const { mutate: saveProfile, isPending: isSavingProfile } = useMutation({
        mutationFn: (values: ProfileValues) => usersService.updateProfile(values.fullName, values.email || undefined),
        onSuccess: (updated) => {
            if (user) setUser({ ...user, fullName: updated.fullName });
            notify.success('Profile updated');
        },
    });

    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        reset: resetPassword,
        formState: { errors: passwordErrors },
    } = useForm<PasswordValues>({ resolver: zodResolver(passwordSchema) });

    const { mutate: changePassword, isPending: isChangingPassword } = useMutation({
        mutationFn: (values: PasswordValues) =>
            usersService.changePassword(values.currentPassword, values.newPassword),
        onSuccess: () => {
            notify.success('Password changed successfully');
            resetPassword();
        },
    });

    return (
        <div className="w-full space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
                <p className="text-sm text-gray-500">Manage your profile and password</p>
            </div>

            <div className="lg:flex gap-4 justify-between space-y-4 lg:space-y-0">
                <div className="rounded-lg border bg-white p-6 w-full">
                    <h2 className="mb-4 font-semibold text-gray-700">Profile</h2>
                    <form onSubmit={handleProfileSubmit((v) => saveProfile(v))} className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" value={user?.username ?? ''} disabled className="bg-gray-50" />
                            <p className="mt-1 text-xs text-gray-400">Username cannot be changed.</p>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" {...registerProfile('fullName')} />
                            {profileErrors.fullName && (
                                <p className="mt-1 text-xs text-red-600">{profileErrors.fullName.message}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" {...registerProfile('email')} />
                            {profileErrors.email && (
                                <p className="mt-1 text-xs text-red-600">{profileErrors.email.message}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <Label>Roles</Label>
                            <p className="text-sm text-gray-600">{user?.roles.join(', ')}</p>
                            <p className="mt-1 text-xs text-gray-400">Only an Admin can change your roles.</p>
                        </div>
                        <Button type="submit" disabled={isSavingProfile} className="bg-green-700 hover:bg-green-800">
                            {isSavingProfile ? 'Saving…' : 'Save Profile'}
                        </Button>
                    </form>
                </div>

                <div className="rounded-lg border bg-white p-6 w-full">
                    <h2 className="mb-4 font-semibold text-gray-700">Change Password</h2>
                    <form onSubmit={handlePasswordSubmit((v) => changePassword(v))} className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input id="currentPassword" type="password" {...registerPassword('currentPassword')} />
                            {passwordErrors.currentPassword && (
                                <p className="mt-1 text-xs text-red-600">{passwordErrors.currentPassword.message}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input id="newPassword" type="password" {...registerPassword('newPassword')} />
                            {passwordErrors.newPassword && (
                                <p className="mt-1 text-xs text-red-600">{passwordErrors.newPassword.message}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input id="confirmPassword" type="password" {...registerPassword('confirmPassword')} />
                            {passwordErrors.confirmPassword && (
                                <p className="mt-1 text-xs text-red-600">{passwordErrors.confirmPassword.message}</p>
                            )}
                        </div>
                        <Button
                            type="submit"
                            disabled={isChangingPassword}
                            className="bg-green-700 hover:bg-green-800"
                        >
                            {isChangingPassword ? 'Updating…' : 'Change Password'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}