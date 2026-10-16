export enum UserRole {
    ADMIN = 'ADMIN',
    MAKER = 'MAKER',
    CHECKER = 'CHECKER',
    VIEWER = 'VIEWER',
}

export interface AuthUser {
    id: string;
    username: string;
    fullName: string;
    email: string | null
    roles: UserRole[];
}

export interface LoginResponse {
    accessToken: string;
    user: AuthUser;
}

export interface ApiErrorResponse {
    statusCode: number;
    message: string | string[];
    error: string;
    timestamp: string;
    path: string;
}

export interface MoneyValue {
    $numberDecimal: string;
}

export interface MemberAuthUser {
    id: string;
    membershipNumber: string;
    fullName: string;
}

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}