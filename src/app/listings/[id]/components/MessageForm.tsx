"use client";

import { useState, type FormEvent } from "react";
import s from "./business.module.css";

interface Props {
  onSubmit: (v: { name: string; email: string; message: string }) => void;
}

export default function MessageForm({ onSubmit }: Props) {
  const [v, setV] = useState({ name: "", email: "", message: "" });
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setV((p) => ({ ...p, [k]: e.target.value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(v);
  };

  return (
    <form onSubmit={submit} className={s.form}>
      <label className={s.label}>Your name<input required value={v.name} onChange={set("name")} /></label>
      <label className={s.label}>Email<input required type="email" value={v.email} onChange={set("email")} /></label>
      <label className={s.label}>Message<textarea required rows={5} value={v.message} onChange={set("message")} /></label>
      <button className={s.primaryWide} type="submit">Send message</button>
    </form>
  );
}