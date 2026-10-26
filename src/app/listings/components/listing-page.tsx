'use client';

import { useState } from 'react';
import { Roboto_Serif } from 'next/font/google';
// import Navbar from '@/components/landing/navbar';
import { DEFAULT_PAGE_SIZE } from '@/services/business.service';
import { useBusinesses } from './use-business';
import { CATEGORIES, type CategoryId } from './categories';
import SearchBar, { type SearchValues } from './search-bar';
// import CategoryTabs from './category-tabs';
import LocationBanner, { type GeoStatus } from './location-banner';
import BusinessList from './business-list';
import { Suspense } from 'react';
import Navbar from '@/app/(user-dashboard)/components/navbar';

const font = Roboto_Serif({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

const EMPTY_SEARCH: SearchValues = { what: '', where: '' };

export default function ListingPage() {
    const [category, setCategory] = useState<CategoryId>('all');
    const [search, setSearch] = useState<SearchValues>(EMPTY_SEARCH);
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [geo, setGeo] = useState<GeoStatus>('idle');
    const [page, setPage] = useState(1);
    const [resetKey, setResetKey] = useState(0);

    const active = CATEGORIES.find((c) => c.id === category)!;

    const { data, pagination, loading, error, refetch } = useBusinesses({
        pageNumber: page,
        pageSize: DEFAULT_PAGE_SIZE,
        facilityType: active.facilityType,
        search: search.what,
        location: search.where,
        latitude: coords?.lat,
        longitude: coords?.lng,
    });

    const pickCategory = (c: CategoryId) => {
        setCategory(c);
        setPage(1);
    };

    const goToPage = (n: number) => {
        setPage(n);
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const requestLocation = () => {
        if (!('geolocation' in navigator)) return setGeo('unsupported');
        setGeo('loading');
        navigator.geolocation.getCurrentPosition(
            (p) => {
                setCoords({ lat: p.coords.latitude, lng: p.coords.longitude });
                setGeo('granted');
                setPage(1);
            },
            () => setGeo('denied'),
            { enableHighAccuracy: false, timeout: 10000 },
        );
    };

    const clearAll = () => {
        setSearch(EMPTY_SEARCH);
        setCategory('all');
        setCoords(null);
        setGeo('idle');
        setPage(1);
        setResetKey((k) => k + 1);
    };

    return (
        <div className={`${font.className} min-h-dvh bg-white text-gray-900 font-(family-name:--font-roboto-slab)`}>
            {/* <Navbar /> */}

            <Suspense fallback={<div className="py-4" />}>
                <SearchBar
                    key={resetKey}
                    category={category}
                    onCategoryChange={pickCategory}
                    onSearch={(q) => {
                        setSearch(q);
                        setPage(1);
                    }}
                />
            </Suspense>
            {/* <CategoryTabs value={category} onChange={pickCategory} /> */}

            <div className="mx-auto w-full max-w-6xl px-4 pt-4 sm:px-6 lg:px-8">
                <LocationBanner status={geo} onRequest={requestLocation} />

                <BusinessList
                    title={category === 'all' ? 'All businesses' : active.label}
                    items={data}
                    pagination={pagination}
                    loading={loading}
                    error={error}
                    onPageChange={goToPage}
                    onRetry={refetch}
                    onClear={clearAll}
                />
            </div>
        </div >
    );
}