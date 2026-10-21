import { PhoneCall, Mail, MapPin, Globe } from "lucide-react";
import type { BusinessDetails } from "@/lib/details";
import s from "./business.module.css";

interface Props {
    business: BusinessDetails;
    following: boolean;
    onMessage: () => void;
    onToggleFollow: () => void;
}

export default function ContactCard({ business: b, following, onMessage, onToggleFollow }: Props) {
    const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${b.name}, ${b.address}`)}`;
    return (
        <section id="contact" className={`${s.panel} ${s.anchor}`}>
            <h2 className={`${s.h2} ${s.contactTitle}`}>Contact</h2>
            <ul className={s.contactList}>
                <li><PhoneCall size={24} /><a href={`tel:${b.phone.replace(/\s/g, "")}`}>{b.phone}</a></li>
                <li><Mail size={24} fill="currentColor" stroke="#fff" /><a href={`mailto:${b.email}`}>{b.email}</a></li>
                <li><MapPin size={24} /><a href={maps} target="_blank" rel="noreferrer">{b.address}</a></li>
                <li><Globe size={24} /><a href={`https://${b.website}`} target="_blank" rel="noreferrer">{b.website}</a></li>
            </ul>
            <button className={s.primaryWide} onClick={onMessage}>Send a message</button>
            <button className={s.outlineWide} onClick={onToggleFollow}>{following ? "Following" : "Follow"}</button>
        </section>
    );
}