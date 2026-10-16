import { api } from '@/lib/axios-client';
import { UserRole } from '@/lib/types';

export interface AppUser {
    _id: string;
    username: string;
    fullName: string;
    email: string | null;
    roles: UserRole[];
    isActive: boolean;
    lastLoginAt: string | null;
    createdAt: string;
}

export interface CreateUserDto {
    username: string;
    password: string;
    fullName: string;
    email?: string;
    roles: UserRole[];
}

export const usersService = {
    getAll: () => api.get<AppUser[]>('/users').then((r) => r.data),

    create: (dto: CreateUserDto) => api.post<AppUser>('/users', dto).then((r) => r.data),

    deactivate: (id: string) => api.patch<AppUser>(`/users/${id}/deactivate`).then((r) => r.data),

    reactivate: (id: string) => api.patch<AppUser>(`/users/${id}/reactivate`).then((r) => r.data),

    updateProfile: (fullName: string, email?: string) =>
        api.patch<AppUser>('/users/me', { fullName, email }).then((r) => r.data),

    changePassword: (currentPassword: string, newPassword: string) =>
        api.patch('/users/me/change-password', { currentPassword, newPassword }).then((r) => r.data),

    updateRoles: (id: string, roles: UserRole[]) =>
        api.patch<AppUser>(`/users/${id}/roles`, { roles }).then((r) => r.data),

    adminResetPassword: (id: string, password: string) =>
        api.patch(`/users/${id}/reset-password`, { password }).then((r) => r.data),
};