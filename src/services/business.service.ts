import { api } from '@/lib/axios-client';
import type { BusinessDetail, BusinessListResponse, BusinessQuery, BusinessReviewListResponse, ReviewQuery } from '../types/business-types';

export const DEFAULT_PAGE_SIZE = 12;
export const DEFAULT_RADIUS_KM = 100;

// ⚠ Only `pageNumber` and `pageSize` are confirmed by the sample response.
// The other param names below are assumptions: rename them here to match the API.
// Undefined / empty values are dropped, so unsupported filters are simply not sent.
const toParams = (q: BusinessQuery) => ({
    pageNumber: q.pageNumber ?? 1,
    pageSize: q.pageSize ?? DEFAULT_PAGE_SIZE,
    facilityType: q.facilityType || undefined,
    search: q.search?.trim() || undefined,
    county: q.location?.trim() || undefined,
    latitude: q.latitude,
    longitude: q.longitude,
    radiusKm:
        q.latitude !== undefined && q.longitude !== undefined ? (q.radiusKm ?? DEFAULT_RADIUS_KM) : undefined,
});

const revToParams = (q: ReviewQuery) => ({
    pageNumber: q.pageNumber ?? 1,
    pageSize: q.pageSize ?? DEFAULT_PAGE_SIZE,
})

export const businessService = {
    getAll: (query: BusinessQuery = {}, options?: { signal?: AbortSignal }) =>
        api
            .get<BusinessListResponse>('/businesses', {
                params: toParams(query),
                signal: options?.signal,
            })
            .then((r) => r.data),

    getBySlug: (slug: string, options?: { signal?: AbortSignal }) =>
        api
            .get<BusinessDetail>(`/businesses/${encodeURIComponent(slug)}`, { signal: options?.signal })
            .then((r) => r.data),

    getBusinessReview: (query: ReviewQuery, businessId: string | undefined) =>
        api.
            get<BusinessReviewListResponse>(`/businesses/${businessId}/reviews`, {
                params: revToParams(query)
            })
            .then((r) => r.data)
};