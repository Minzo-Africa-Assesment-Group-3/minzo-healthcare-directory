"use client";

import { useState, type FormEvent } from "react";
import { Star } from "lucide-react";
import s from "./business.module.css";

interface Props {
    onSubmit: (v: { rating: number; text: string }) => void;
}

export default function ReviewForm({ onSubmit }: Props) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [text, setText] = useState("");
    const [error, setError] = useState("");

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (!rating) return setError("Choose a star rating.");
        if (text.trim().length < 10) return setError("Write at least 10 characters.");
        onSubmit({ rating, text: text.trim() });
    };

    return (
        <form onSubmit={submit} className={s.form}>
            <div className={s.starPick} role="radiogroup" aria-label="Your rating">
                {[1, 2, 3, 4, 5].map((i) => (
                    <button
                        type="button" key={i} role="radio" aria-checked={rating === i} aria-label={`${i} star${i > 1 ? "s" : ""}`}
                        onClick={() => { setRating(i); setError(""); }}
                        onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)}
                    >
                        <Star size={32} fill={i <= (hover || rating) ? "#fbd530" : "none"} stroke={i <= (hover || rating) ? "#fbd530" : "#9aa5af"} />
                    </button>
                ))}
            </div>
            <label className={s.label}>
                Your review
                <textarea rows={5} value={text} onChange={(e) => { setText(e.target.value); setError(""); }} placeholder="Tell others about your visit" />
            </label>
            {error && <p className={s.error} role="alert">{error}</p>}
            <button className={s.primaryWide} type="submit">Post review</button>
        </form>
    );
}