'use client';

import { useState, type FormEvent } from 'react';
import { Star } from 'lucide-react';

export default function ReviewForm({ onSubmit }: { onSubmit: (v: { rating: number; text: string }) => void }) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [text, setText] = useState('');
    const [error, setError] = useState('');

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (!rating) return setError('Choose a star rating.');
        if (text.trim().length < 10) return setError('Write at least 10 characters.');
        onSubmit({ rating, text: text.trim() });
    };

    return (
        <form onSubmit={submit} className="space-y-4" noValidate>
            <div role="radiogroup" aria-label="Your rating" className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => {
                    const on = i <= (hover || rating);
                    return (
                        <button
                            key={i}
                            type="button"
                            role="radio"
                            aria-checked={rating === i}
                            aria-label={`${i} star${i > 1 ? 's' : ''}`}
                            onClick={() => { setRating(i); setError(''); }}
                            onMouseEnter={() => setHover(i)}
                            onMouseLeave={() => setHover(0)}
                            className="rounded p-0.5 focus-visible:outline-2 focus-visible:outline-[#0C486D]"
                        >
                            <Star className={`h-8 w-8 ${on ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                        </button>
                    );
                })}
            </div>

            <label className="block text-sm font-medium text-gray-900">
                Your review
                <textarea
                    rows={5}
                    value={text}
                    onChange={(e) => { setText(e.target.value); setError(''); }}
                    placeholder="Tell others about your visit"
                    className="mt-1.5 w-full resize-none rounded-xl border border-gray-300 px-3 py-2.5 text-sm font-normal focus:border-[#0C486D] focus:outline-none focus:ring-2 focus:ring-[#0C486D]/20"
                />
            </label>

            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

            <button type="submit" className="h-11 w-full rounded-full bg-[#0C486D] text-sm font-semibold text-white hover:bg-[#0a3b5a]">
                Post review
            </button>
        </form>
    );
}