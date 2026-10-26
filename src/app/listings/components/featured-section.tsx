"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import type { BusinessWithDistance } from "@/lib/types";
import BusinessCard from "./business-card";
import s from "./listing.module.css";
import { Business } from "@/types/business-types";

interface Props {
    title: string;
    items: Business[];
    expanded: boolean;
    onToggle: () => void;
    onClear: () => void;
}

export default function FeaturedSection({ title, items, expanded, onToggle, onClear }: Props) {
    const track = useRef<HTMLDivElement>(null);
    const [edge, setEdge] = useState({ start: true, end: false });

    const measure = useCallback(() => {
        const el = track.current;
        if (!el) return;
        setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
    }, []);

    useEffect(() => {
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [measure, items, expanded]);

    const scroll = (dir: 1 | -1) => {
        const el = track.current;
        if (el) el.scrollBy({ left: dir * (el.clientWidth * 0.8) });
    };

    return (
        <section className={s.section} aria-labelledby="featured-title">
            <div className={s.container}>
                <div className={s.sectionHead}>
                    <h2 id="featured-title" className={s.sectionTitle}>{title}</h2>
                    {items.length > 0 && (
                        <button className={s.seeAll} onClick={onToggle} aria-expanded={expanded}>
                            {expanded ? "Show less" : "See all"}
                        </button>
                    )}
                </div>

                {items.length === 0 ? (
                    <div className={s.empty}>
                        <p>No businesses match your search. Try another location or time.</p>
                        <button className={s.pill} onClick={onClear}>Clear search</button>
                    </div>
                ) : expanded ? (
                    <div className={s.grid}>
                        {items.map((b) => <BusinessCard key={b.id} business={b} />)}
                    </div>
                ) : (
                    <div className={s.carouselWrap}>
                        <button className={`${s.arrow} ${s.arrowL}`} onClick={() => scroll(-1)} disabled={edge.start} aria-label="Previous">
                            <ChevronLeft size={20} />
                        </button>
                        <div className={s.track} ref={track} onScroll={measure}>
                            {items.map((b) => <BusinessCard key={b.id} business={b} />)}
                        </div>
                        <button className={`${s.arrow} ${s.arrowR}`} onClick={() => scroll(1)} disabled={edge.end} aria-label="Next">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}