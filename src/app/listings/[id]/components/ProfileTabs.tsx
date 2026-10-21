"use client";

import { useEffect, useState } from "react";
import s from "./business.module.css";

const TABS = [
    { id: "overview", label: "Overview" },
    { id: "services", label: "Services" },
    { id: "reviews", label: "Reviews" },
    { id: "contact", label: "Contact" },
];

export default function ProfileTabs() {
    const [active, setActive] = useState("overview");

    useEffect(() => {
        const els = TABS.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
        const io = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
            { rootMargin: "-30% 0px -60% 0px" }
        );
        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);

    const go = (id: string) => {
        setActive(id);
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <nav className={s.tabs} aria-label="Profile sections">
            {TABS.map((t) => (
                <button
                    key={t.id}
                    className={`${s.tab} ${active === t.id ? s.tabActive : ""}`}
                    aria-current={active === t.id ? "true" : undefined}
                    onClick={() => go(t.id)}
                >
                    {t.label}
                </button>
            ))}
        </nav>
    );
}