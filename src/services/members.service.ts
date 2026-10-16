import { api } from '@/lib/axios-client';
import { PaginatedResult } from '@/lib/types';

export interface Member {
    _id: string;
    membershipNumber: string;
    fullName: string;
    phoneNumber: string;
    email: string | null;
    address: string | null;
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    dateOfRegistration: string;
    nextOfKinName: string | null;
    nextOfKinPhone: string | null;
}

export interface CreateMemberDto {
    fullName: string;
    phoneNumber: string;
    email?: string;
    address?: string;
    nextOfKinName?: string;
    nextOfKinPhone?: string;
}

export const membersService = {
    // getAll: (status?: string) =>
    //     api.get<Member[]>('/members', { params: status ? { status } : {} }).then((r) => r.data),
    getAll: (params: { status?: string; page?: number; limit?: number; search?: string } = {}) =>
        api.get<PaginatedResult<Member>>('/members', { params }).then((r) => r.data),

    getById: (id: string) => api.get<Member>(`/members/${id}`).then((r) => r.data),

    create: (dto: CreateMemberDto) => api.post<Member>('/members', dto).then((r) => r.data),

    update: (id: string, dto: Partial<CreateMemberDto>) =>
        api.patch<Member>(`/members/${id}`, dto).then((r) => r.data),

    setStatus: (id: string, status: string) =>
        api.patch<Member>(`/members/${id}/status`, { status }).then((r) => r.data),

    setPortalPassword: (id: string, password: string) =>
        api.patch(`/members/${id}/set-password`, { password }).then((r) => r.data),
};