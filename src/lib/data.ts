import type { Business, CategoryId } from "./types";

export const CATEGORIES: { id: CategoryId | "all"; label: string }[] = [
    { id: "all", label: "All" },
    { id: "hospital", label: "Hospitals" },
    { id: "lab", label: "Labs" },
    { id: "pharmacy", label: "Pharmacies" },
    { id: "mental-health", label: "Mental health" },
    { id: "dental", label: "Dental care" },
];

const b = (
    id: string, name: string, type: string, category: CategoryId, area: string,
    rating: number, reviews: number, distanceKm: number, lat: number, lng: number,
    opens = "00:00", closes = "24:00"
): Business => ({ id, name, type, category, area, rating, reviews, distanceKm, lat, lng, opens, closes });

// Replace with your API / DB call. Add `image: "/hospital.jpg"` to use real photos.
export const BUSINESSES: Business[] = [
    b("1", "Lagos State General Hospital", "General Hospital", "hospital", "Ikeja", 4.7, 23, 2.4, 6.6018, 3.3515),
    b("2", "Ikorodu General Hospital", "General Hospital", "hospital", "Ikorodu", 4.5, 41, 3.1, 6.6194, 3.5105),
    b("3", "Lagoon Specialist Hospital", "Specialist Hospital", "hospital", "Victoria Island", 4.8, 87, 12.6, 6.4281, 3.4219),
    b("4", "Mainland Medical Centre", "Teaching Hospital", "hospital", "Yaba", 4.3, 19, 9.8, 6.5095, 3.3711),
    b("5", "Crown Diagnostics", "Diagnostic Lab", "lab", "Ikorodu", 4.6, 32, 1.9, 6.6155, 3.5072, "07:00", "19:00"),
    b("6", "PathCare Labs", "Pathology Lab", "lab", "Surulere", 4.4, 15, 11.2, 6.5000, 3.3566, "08:00", "18:00"),
    b("7", "HealthPlus Pharmacy", "Pharmacy", "pharmacy", "Ikorodu", 4.2, 58, 0.8, 6.6210, 3.5130, "08:00", "22:00"),
    b("8", "Medplus Pharmacy", "Pharmacy", "pharmacy", "Ikeja", 4.5, 74, 2.7, 6.6050, 3.3490),
    b("9", "Serene Minds Clinic", "Therapy Centre", "mental-health", "Lekki", 4.9, 26, 18.4, 6.4698, 3.5852, "09:00", "17:00"),
    b("10", "Calm Harbour Counselling", "Counselling", "mental-health", "Yaba", 4.6, 12, 9.5, 6.5120, 3.3780, "10:00", "18:00"),
    b("11", "BrightSmile Dental", "Dental Clinic", "dental", "Ikorodu", 4.7, 36, 2.2, 6.6170, 3.5090, "08:00", "20:00"),
    b("12", "Pearl Dental Studio", "Dental Clinic", "dental", "Ikeja", 4.4, 21, 3.5, 6.6000, 3.3400, "09:00", "18:00"),
];