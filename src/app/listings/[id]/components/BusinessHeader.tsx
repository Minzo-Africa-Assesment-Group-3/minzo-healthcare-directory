"use client";

import { Hospital, FlaskConical, Pill, Brain, Smile, Heart, MapPin, Star } from "lucide-react";
import type { BusinessDetails } from "@/lib/details";
import { formatCount } from "@/lib/details";
import type { CategoryId } from "@/lib/types";
import type { ComponentType } from "react";
import s from "./business.module.css";

const ICONS: Record<CategoryId, ComponentType<{ size?: number; fill?: string }>> = {
    hospital: Hospital, lab: FlaskConical, pharmacy: Pill, "mental-health": Brain, dental: Smile,
};

interface Props {
    business: BusinessDetails;
    rating: number;
    total: number;
    following: boolean;
    onToggleFollow: () => void;
}

export default function BusinessHeader({ business: b, rating, total, following, onToggleFollow }: Props) {
    const Icon = ICONS[b.category];
    return (
        <header className={s.header}>
            <div className={s.cover}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.image ?? "/listings/facility-image.jpg"} alt={`${b.name} building`} onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
            </div>

            <div className={s.identity}>
                <div className={s.avatar} aria-hidden><Icon size={96} /></div>

                <div className={s.info}>
                    <h1 className={s.name}>{b.name}</h1>
                    <p className={s.type}>{b.type}</p>
                    <p className={s.metaRow}>
                        <MapPin size={22} aria-hidden /> {b.city}
                        <span className={s.dot} aria-hidden />
                        {b.distanceKm.toFixed(1)} Km
                    </p>
                    <p className={`${s.metaRow} ${s.small}`}>
                        <Star size={18} fill="#f5d547" stroke="#1a1a1a" aria-hidden />
                        <strong>{rating.toFixed(1)}</strong>
                        <span className={s.muted}>({formatCount(total)} reviews)</span>
                    </p>
                </div>

                <div className={s.actions}>
                    <button
                        className={`${s.heart} ${following ? s.heartOn : ""}`}
                        onClick={onToggleFollow}
                        aria-pressed={following}
                        aria-label={following ? "Unfollow" : "Follow"}
                    >
                        <Heart size={30} fill={following ? "currentColor" : "none"} />
                    </button>
                    <button className={s.primary} onClick={onToggleFollow}>{following ? "Following" : "Follow"}</button>
                </div>
            </div>
        </header>
    );
}