"use client";

import { useMemo, useState } from "react";
import { Roboto_Serif } from "next/font/google";
import { BUSINESSES, CATEGORIES } from "@/lib/data";
import { haversineKm, isOpenAt } from "@/lib/geo";
import type { BusinessWithDistance, CategoryId } from "@/lib/types";
import SearchBar from "./search-bar";
import CategoryTabs from "./category-tabs";
import LocationBanner, { type GeoStatus } from "./location-banner";
import FeaturedSection from "./featured-section";
import s from "./listing.module.css";
import Navbar from "@/components/landing/navbar";

const font = Roboto_Serif({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function ListingPage() {
    const [category, setCategory] = useState<CategoryId | "all">("hospital");
    const [query, setQuery] = useState({ location: "", time: "" });
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [geo, setGeo] = useState<GeoStatus>("idle");
    const [expanded, setExpanded] = useState(false);
    const [resetKey, setResetKey] = useState(0);

    const requestLocation = () => {
        if (!("geolocation" in navigator)) return setGeo("unsupported");
        setGeo("loading");
        navigator.geolocation.getCurrentPosition(
            (p) => {
                setCoords({ lat: p.coords.latitude, lng: p.coords.longitude });
                setGeo("granted");
            },
            () => setGeo("denied"),
            { enableHighAccuracy: false, timeout: 10000 }
        );
    };

    const items = useMemo<BusinessWithDistance[]>(() => {
        const loc = query.location.toLowerCase();
        return BUSINESSES.filter((b) => category === "all" || b.category === category)
            .filter((b) => !loc || `${b.area} ${b.name}`.toLowerCase().includes(loc))
            .filter((b) => isOpenAt(query.time, b.opens, b.closes))
            .map((b) => ({ ...b, distance: coords ? haversineKm(coords, b) : b.distanceKm }))
            .sort((a, b) => a.distance - b.distance);
    }, [category, query, coords]);

    const label = CATEGORIES.find((c) => c.id === category)?.label ?? "";
    const title = category === "all" ? "Featured businesses" : `Featured ${label}`;

    const pickCategory = (c: CategoryId | "all") => {
        setCategory(c);
        setExpanded(false);
    };

    return (
        <div className={`${s.page} ${font.className}`}>
            {/* <div className={s.navSlot} id="navbar-slot" /> */}
            <Navbar />

            <SearchBar
                key={resetKey}
                category={category}
                onCategoryChange={pickCategory}
                onSearch={(q) => { setQuery(q); setExpanded(false); }}
            />
            <CategoryTabs value={category} onChange={pickCategory} />
            <LocationBanner status={geo} onRequest={requestLocation} />
            <FeaturedSection
                title={title}
                items={items}
                expanded={expanded}
                onToggle={() => setExpanded((v) => !v)}
                onClear={() => { setQuery({ location: "", time: "" }); setResetKey((k) => k + 1); }}
            />
        </div>
    );
}