"use client";

import { LayoutGrid, Hospital, FlaskConical, Pill, Brain, Smile } from "lucide-react";
import type { ComponentType } from "react";
import { CATEGORIES } from "@/lib/data";
import type { CategoryId } from "@/lib/types";
import s from "./listing.module.css";

const ICONS: Record<string, ComponentType<{ size?: number; "aria-hidden"?: boolean }>> = {
    all: LayoutGrid,
    hospital: Hospital,
    lab: FlaskConical,
    pharmacy: Pill,
    "mental-health": Brain,
    dental: Smile,
};

interface Props {
    value: CategoryId | "all";
    onChange: (c: CategoryId | "all") => void;
}

export default function CategoryTabs({ value, onChange }: Props) {
    return (
        <div className={s.tabsBar}>
            <div className={s.tabs} role="tablist" aria-label="Categories">
                {CATEGORIES.map(({ id, label }) => {
                    const Icon = ICONS[id];
                    const active = id === value;
                    return (
                        <button
                            key={id}
                            role="tab"
                            aria-selected={active}
                            className={`${s.tab} ${active ? s.tabActive : ""}`}
                            onClick={() => onChange(id)}
                        >
                            <Icon size={18} aria-hidden />
                            {label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}