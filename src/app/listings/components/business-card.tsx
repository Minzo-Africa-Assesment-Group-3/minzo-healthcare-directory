import Link from "next/link";
import { Star } from "lucide-react";
import type { BusinessWithDistance } from "@/lib/types";
import s from "./listing.module.css";

export default function BusinessCard({ business: b }: { business: BusinessWithDistance }) {
    return (
        <Link href={`/listings/${b.id}`} className={s.card}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                className={s.cardImg}
                src={b.image ?? "/listings/facility-image.jpg"}
                alt=""
                loading="lazy"
                onError={(e) => (e.currentTarget.style.visibility = "hidden")}
            />
            <div className={s.cardBody}>
                <h3 className={s.cardName}>{b.name}</h3>
                <p className={s.cardType}>{b.type}</p>
                <div className={s.meta}>
                    <span className={s.rating}>
                        <Star size={18} fill="#f5d547" stroke="#1a1a1a" aria-hidden />
                        {b.rating.toFixed(1)}
                        <span className={s.reviews}>({b.reviews} reviews)</span>
                    </span>
                    <span className={s.distance}>{b.distance.toFixed(1)} Km</span>
                </div>
            </div>
        </Link>
    );
}