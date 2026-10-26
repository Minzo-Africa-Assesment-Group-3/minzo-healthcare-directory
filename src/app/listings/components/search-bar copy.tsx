"use client";

import { useState, type FormEvent } from "react";
import { Search, MapPin, Clock } from "lucide-react";
import { CATEGORIES } from "@/lib/data";
import type { CategoryId } from "@/lib/types";
import s from "./listing.module.css";

interface Props {
  category: CategoryId | "all";
  onCategoryChange: (c: CategoryId | "all") => void;
  onSearch: (q: { location: string; time: string }) => void;
}

export default function SearchBar({ category, onCategoryChange, onSearch }: Props) {
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSearch({ location: location.trim(), time });
  };

  return (
    <div className={s.searchWrap}>
      <form className={s.search} onSubmit={submit} role="search" aria-label="Find care">
        <label className={s.field}>
          <Search size={18} aria-hidden />
          <span className={s.fieldText}>
            <span className={s.fieldLabel}>Category</span>
            <select
              className={`${s.control} ${s.filled}`}
              value={category}
              onChange={(e) => onCategoryChange(e.target.value as CategoryId | "all")}
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </span>
        </label>

        <label className={s.field}>
          <MapPin size={18} aria-hidden />
          <span className={s.fieldText}>
            <span className={s.fieldLabel}>Location</span>
            <input
              className={`${s.control} ${location ? s.filled : ""}`}
              type="text"
              placeholder="Where"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </span>
        </label>

        <label className={s.field}>
          <Clock size={18} aria-hidden />
          <span className={s.fieldText}>
            <span className={s.fieldLabel}>When</span>
            <input
              className={`${s.control} ${time ? s.filled : ""}`}
              type="time"
              aria-label="Time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </span>
        </label>

        <button type="submit" className={s.searchBtn}>Search</button>
      </form>
    </div>
  );
}