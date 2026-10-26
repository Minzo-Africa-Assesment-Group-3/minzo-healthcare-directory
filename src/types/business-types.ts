// Shapes returned by GET /api/v1/businesses

import { CustomerReviews } from "@/app/listings/[slug]/components/reviews-card";

// Known values from the API so far; the union stays open for new ones
export type FacilityType = 'HOSPITAL' | 'CLINIC' | 'PHARMACY' | (string & {});

export interface BusinessService {
    id: string;
    name: string;
    slug: string;
}

export interface BusinessLocation {
    id: string;
    name: string;
    facilityType: FacilityType;
    addressLine: string;
    county: string;
    cityOrTown: string;
    latitude: number | null;
    longitude: number | null;
    isPrimary: boolean;
}

export interface Business {
    id: string;
    displayName: string;
    slug: string;
    verificationStatus: 'VERIFIED' | (string & {});
    isClaimed: boolean;
    location: BusinessLocation;
    services: BusinessService[];
    rating: {
        averageRating: number | null;
        reviewCount: number;
        ratingWindowMonths: number;
    };
    distanceKm: number | null;
}

export interface Pagination {
    totalItems: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPageUrl: string | null;
    previousPageUrl: string | null;
}

export interface BusinessListResponse {
    data: Business[];
    pagination: Pagination;
}

export interface BusinessReviewListResponse {
    data: CustomerReviews[];
    pagination: Pagination;
}

export interface BusinessQuery {
    pageNumber?: number;
    pageSize?: number;
    facilityType?: string;
    search?: string; // name or service
    location?: string; // county / city / town
    latitude?: number;
    longitude?: number;
    radiusKm?: number;
}

export interface ReviewQuery {
    pageNumber: number;
    pageSize: number;
}


/* ---------- GET /api/v1/businesses/{slug} ---------- */

export type DayOfWeek =
    | 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface OpeningPeriod {
    id: string;
    dayOfWeek: DayOfWeek;
    opensAt: string; // "12:00 AM"
    closesAt: string; // "12:00 PM"
    closesNextDay: boolean;
}

export interface BusinessDetailLocation {
    id: string;
    name: string;
    slug: string;
    facilityType: FacilityType;
    contactEmail: string | null;
    contactPhone: string | null;
    websiteUrl: string | null;
    description: string | null;
    addressLine: string;
    county: string;
    cityOrTown: string;
    latitude: number | null;
    longitude: number | null;
    timezone: string;
    isPrimary: boolean;
    openingPeriods: OpeningPeriod[];
    services: BusinessService[];
    professionals: unknown[]; // empty in the sample: shape unknown
}

export interface BusinessDetail {
    id: string;
    displayName: string;
    legalName: string;
    slug: string;
    verificationStatus: 'VERIFIED' | (string & {});
    isClaimed: boolean;
    approvedAt: string | null;
    rating: { averageRating: number | null; reviewCount: number; ratingWindowMonths: number };
    gallery: { coverImage: string | null; images: string[] };
    locations: BusinessDetailLocation[];
    isFollowedByCurrentUser?: boolean;
    refetch?: () => null
}