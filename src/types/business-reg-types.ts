// POST /api/v1/auth/register/business

export type DayOfWeek =
    | 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface RegisterOpeningHours {
    dayOfWeek: DayOfWeek;
    isClosed: boolean;
    is24Hours: boolean;
    periods: { opensAt: string; closesAt: string }[];
}

export interface RegisterStaffMember {
    displayName: string;
    profession: string;
    professionalTitle?: string;
    phone?: string;
    email?: string;
    yearsExperience?: number;
    isPublic: boolean;
}

export interface RegisterBusinessPayload {
    user: {
        email: string;
        password: string;
        displayName: string;
        phone: string;
    };
    business: {
        displayName: string;
        legalName: string;
        registrationNumber: string;
        membershipRole: 'OWNER';
    };
    primaryLocation: {
        name: string;
        facilityType: string;
        contactEmail?: string;
        contactPhone?: string;
        websiteUrl?: string;
        description: string;
        timezone: string;
        location: {
            addressLine: string;
            county: string;
            cityOrTown: string;
            latitude?: number;
            longitude?: number;
        };
        openingHours: RegisterOpeningHours[];
        services: string[];
        staffMembers: RegisterStaffMember[];
    };
}

export interface RegisterBusinessResponse {
    message?: string;
}