"use client";

import { MapPin } from "lucide-react";
import s from "./listing.module.css";

export type GeoStatus = "idle" | "loading" | "granted" | "denied" | "unsupported";

const MESSAGES: Record<GeoStatus, string> = {
    idle: "Turn on location to see the businesses closest to you.",
    loading: "Finding your location…",
    granted: "Showing the businesses closest to you.",
    denied: "Location is blocked. Allow it in your browser settings to see what’s closest.",
    unsupported: "Your browser doesn’t support location.",
};

interface Props {
    status: GeoStatus;
    onRequest: () => void;
}

export default function LocationBanner({ status, onRequest }: Props) {
    return (
        <div className={s.banner} aria-live="polite">
            <p className={s.bannerText}>{MESSAGES[status]}</p>
            {status !== "granted" && status !== "unsupported" && (
                <button className={s.pill} onClick={onRequest} disabled={status === "loading"}>
                    <MapPin size={20} aria-hidden />
                    {status === "denied" ? "Try again" : "Use my location"}
                </button>
            )}
        </div>
    );
}