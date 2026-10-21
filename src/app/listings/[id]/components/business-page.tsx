"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { serif } from "@/lib/fonts";
import { summarize, type BusinessDetails, type Review } from "@/lib/details";
import BusinessHeader from "./BusinessHeader";
import ProfileTabs from "./ProfileTabs";
import AboutCard from "./AboutCard";
import ServicesCard from "./ServicesCard";
import ReviewsCard from "./ReviewsCard";
import ContactCard from "./ContactCard";
import Modal from "./Modal";
import ReviewForm from "./ReviewForm";
import MessageForm from "./MessageForm";
import s from "./business.module.css";
import Navbar from "@/components/landing/navbar";

export default function BusinessProfile({ business }: { business: BusinessDetails }) {
    const key = `minzo:follow:${business.id}`;
    const subscribeFollowing = useCallback((onChange: () => void) => {
        const onStorage = (event: StorageEvent) => {
            if (event.key === key) onChange();
        };
        window.addEventListener("storage", onStorage);
        window.addEventListener("minzo:follow-changed", onChange);
        return () => {
            window.removeEventListener("storage", onStorage);
            window.removeEventListener("minzo:follow-changed", onChange);
        };
    }, [key]);
    const getFollowing = useCallback(() => {
        try { return localStorage.getItem(key) === "1"; } catch { return false; }
    }, [key]);
    const following = useSyncExternalStore(subscribeFollowing, getFollowing, () => false);
    const [added, setAdded] = useState<Review[]>([]);
    const [modal, setModal] = useState<null | "review" | "message">(null);
    const [toast, setToast] = useState("");

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(""), 3000);
        return () => clearTimeout(t);
    }, [toast]);

    const notify = (m: string) => setToast(m);

    const toggleFollow = () => {
        const next = !following;
        try { localStorage.setItem(key, next ? "1" : "0"); } catch { }
        window.dispatchEvent(new Event("minzo:follow-changed"));
        // TODO: call your follow / unfollow API here
        notify(next ? `You’re following ${business.name}` : `You unfollowed ${business.name}`);
    };

    const reviews = useMemo(() => [...added, ...business.reviewList], [added, business.reviewList]);
    const summary = useMemo(
        () => summarize({ rating: business.rating, total: business.reviews }, added),
        [business.rating, business.reviews, added]
    );

    return (
        <div className={`${s.page} ${serif.className}`}>
            <Navbar />

            <main className={s.container}>
                <BusinessHeader business={business} rating={summary.average} total={summary.total} following={following} onToggleFollow={toggleFollow} />
                <ProfileTabs />

                <div className={s.stack}>
                    <AboutCard about={business.about} />
                    <ServicesCard services={business.services} />
                    <div className={s.twoCol}>
                        <ReviewsCard reviews={reviews} summary={summary} onAdd={() => setModal("review")} />
                        <ContactCard business={business} following={following} onMessage={() => setModal("message")} onToggleFollow={toggleFollow} />
                    </div>
                </div>
            </main>

            <Modal open={modal === "review"} title="Add review" onClose={() => setModal(null)}>
                <ReviewForm
                    onSubmit={({ rating, text }) => {
                        setAdded((a) => [{ id: `new-${Date.now()}`, name: "You", time: "Just now", rating, text, helpful: 0 }, ...a]);
                        setModal(null);
                        notify("Review posted");
                    }}
                />
            </Modal>
            <Modal open={modal === "message"} title={`Message ${business.name}`} onClose={() => setModal(null)}>
                <MessageForm
                    onSubmit={() => {
                        setModal(null);
                        notify("Message sent");
                    }}
                />
            </Modal>

            <div className={s.toast} role="status" aria-live="polite">{toast}</div>
        </div>
    );
}