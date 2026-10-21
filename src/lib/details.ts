import { BUSINESSES } from "./data";
import type { Business, CategoryId } from "./types";

export interface Review {
    id: string;
    name: string;
    time: string;
    rating: number;
    text: string;
    helpful: number;
}

export interface BusinessDetails extends Business {
    about: string;
    services: string[];
    phone: string;
    email: string;
    address: string;
    website: string;
    city: string;
    reviewList: Review[];
}

const SERVICES: Record<CategoryId, string[]> = {
    hospital: ["Surgery", "Cardiology", "Radiology", "Laboratory services"],
    lab: ["Blood tests", "Urinalysis", "Imaging", "Home sample collection"],
    pharmacy: ["Prescription refills", "Over-the-counter medicine", "Vaccinations", "Home delivery"],
    "mental-health": ["Individual therapy", "Couples counselling", "Psychiatric assessment", "Support groups"],
    dental: ["Check-ups & cleaning", "Fillings", "Braces", "Teeth whitening"],
};

const REVIEWS: Review[] = [
    { id: "r1", name: "Jane Doe", time: "2 minutes ago", rating: 5, helpful: 12, text: "Excellent service and very professional staff. The doctors and nurses were very attentive and caring. Highly recommend!" },
    { id: "r2", name: "Tunde Bello", time: "3 days ago", rating: 5, helpful: 7, text: "Booking was easy and I was seen within twenty minutes. Clean facility and clear communication throughout." },
    { id: "r3", name: "Amaka Obi", time: "1 week ago", rating: 4, helpful: 4, text: "Great care overall. Parking can be tight in the afternoon, but the team made up for it." },
    { id: "r4", name: "Ibrahim Musa", time: "2 weeks ago", rating: 5, helpful: 3, text: "They explained every step of the procedure and followed up the next day. Very reassuring." },
    { id: "r5", name: "Chioma Eze", time: "1 month ago", rating: 3, helpful: 1, text: "Good doctors, but the waiting area was crowded. Would go back." },
];

export function getBusinessDetails(id: string): BusinessDetails | null {
    const b = BUSINESSES.find((x) => x.id === id);
    if (!b) return null;
    const slug = b.name.toLowerCase().replace(/[^a-z0-9]+/g, "");
    return {
        ...b,
        city: "Lagos, Nigeria",
        about: `${b.name} is a leading ${b.type.toLowerCase()} in ${b.area}, providing numerous services like ${SERVICES[b.category].slice(0, 3).join(", ").toLowerCase()} and more. Our team is committed to accessible, compassionate care for every patient.`,
        services: SERVICES[b.category],
        phone: "+234 803 123 1436",
        email: `${slug.slice(0, 18)}@gmail.com`,
        address: `${b.area}, Lagos State, Nigeria`,
        website: `www.${slug}.com`,
        reviewList: REVIEWS,
    };
}

const SHARES = [0.72, 0.18, 0.08, 0.02, 0.02]; // 5★ → 1★, mock distribution

export function summarize(base: { rating: number; total: number }, added: Review[]) {
    const counts = SHARES.map((s) => Math.round(s * base.total));
    added.forEach((r) => (counts[5 - r.rating] += 1));
    const total = base.total + added.length;
    const sumAdded = added.reduce((a, r) => a + r.rating, 0);
    const average = (base.rating * base.total + sumAdded) / total;
    const pcts = counts.map((c) => Math.round((c / (counts.reduce((a, b) => a + b, 0) || 1)) * 100));
    return { average, total, pcts };
}

export const formatCount = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n));