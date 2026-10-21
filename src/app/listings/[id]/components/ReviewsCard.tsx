"use client";

import { useState } from "react";
import { Star, ThumbsUp, MoreHorizontal, CircleUserRound } from "lucide-react";
import { formatCount, type Review } from "@/lib/details";
import s from "./business.module.css";

interface Props {
    reviews: Review[];
    summary: { average: number; total: number; pcts: number[] };
    onAdd: () => void;
}

function Stars({ value, size = 16 }: { value: number; size?: number }) {
    return (
        <span className={s.stars} role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((i) => {
                const fill = Math.max(0, Math.min(1, value - (i - 1)));
                return (
                    <span key={i} className={s.starWrap} style={{ width: size, height: size }}>
                        <Star size={size} fill="#e3e3e3" stroke="none" />
                        <span style={{ width: `${fill * 100}%` }}><Star size={size} fill="#fbd530" stroke="none" /></span>
                    </span>
                );
            })}
        </span>
    );
}

function ReviewItem({ review }: { review: Review }) {
    const [helpful, setHelpful] = useState(false);
    const [menu, setMenu] = useState(false);
    const [reported, setReported] = useState(false);

    return (
        <article className={s.review}>
            <CircleUserRound size={44} strokeWidth={1.4} className={s.reviewAvatar} aria-hidden />
            <div className={s.reviewMain}>
                <div className={s.reviewTop}>
                    <div>
                        <p className={s.reviewer}>{review.name}</p>
                        <p className={s.when}>{review.time}</p>
                    </div>
                    <div className={s.menuWrap}>
                        <button className={s.iconBtn} onClick={() => setMenu((v) => !v)} aria-label="Review options" aria-expanded={menu}>
                            <MoreHorizontal size={18} />
                        </button>
                        {menu && (
                            <button className={s.menu} onClick={() => { setReported(true); setMenu(false); }}>
                                Report review
                            </button>
                        )}
                    </div>
                </div>
                <Stars value={review.rating} size={15} />
                <p className={s.reviewText}>{review.text}</p>
                {reported && <p className={s.when}>Thanks, we’ll take a look at this review.</p>}
                <button
                    className={`${s.helpful} ${helpful ? s.helpfulOn : ""}`}
                    onClick={() => setHelpful((v) => !v)}
                    aria-pressed={helpful}
                >
                    <ThumbsUp size={16} fill={helpful ? "currentColor" : "none"} />
                    Helpful ({review.helpful + (helpful ? 1 : 0)})
                </button>
            </div>
        </article>
    );
}

export default function ReviewsCard({ reviews, summary, onAdd }: Props) {
    const [showAll, setShowAll] = useState(false);
    const visible = showAll ? reviews : reviews.slice(0, 3);

    return (
        <section id="reviews" className={`${s.panel} ${s.anchor}`}>
            <div className={s.panelHead}>
                <h2 className={s.h2}>Reviews</h2>
                {reviews.length > 3 && (
                    <button className={s.link} onClick={() => setShowAll((v) => !v)}>{showAll ? "Show less" : "See all"}</button>
                )}
            </div>

            <div className={s.summary}>
                <div className={s.score}>
                    <p className={s.big}>{summary.average.toFixed(1)}</p>
                    <Stars value={summary.average} size={26} />
                    <p className={s.small}>{formatCount(summary.total)} reviews</p>
                </div>
                <ul className={s.bars}>
                    {summary.pcts.map((p, i) => (
                        <li key={i}>
                            <span className={s.barLabel}>{5 - i} <Star size={12} fill="#1a1a1a" /></span>
                            <span className={s.bar}><span style={{ width: `${p}%` }} /></span>
                            <span className={s.pct}>{p}%</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={s.reviewList}>
                {visible.map((r) => <ReviewItem key={r.id} review={r} />)}
            </div>

            <button className={s.primaryWide} onClick={onAdd}>Add review</button>
        </section>
    );
}