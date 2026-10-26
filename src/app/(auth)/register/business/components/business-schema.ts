import { z } from 'zod';
import type { DayOfWeek, RegisterBusinessPayload } from '@/types/business-reg-types';

/* ---------- Reference data (move to your API when it exists) ---------- */

export const DAYS = [
    { value: 'MONDAY', short: 'Mon' },
    { value: 'TUESDAY', short: 'Tue' },
    { value: 'WEDNESDAY', short: 'Wed' },
    { value: 'THURSDAY', short: 'Thur' },
    { value: 'FRIDAY', short: 'Fri' },
    { value: 'SATURDAY', short: 'Sat' },
    { value: 'SUNDAY', short: 'Sun' },
] as const;

// ⚠ Enum values are placeholders: align with your backend
export const FACILITY_TYPES = [
    { value: 'HOSPITAL', label: 'Hospital' },
    { value: 'CLINIC', label: 'Clinic' },
    { value: 'PHARMACY', label: 'Pharmacy' },
    { value: 'LABORATORY', label: 'Laboratory' },
    { value: 'DENTAL', label: 'Dental care' },
    { value: 'MENTAL_HEALTH', label: 'Mental health' },
];

// ⚠ Only GENERAL_PRACTITIONER is confirmed by the sample payload
export const PROFESSIONS = [
    { value: 'GENERAL_PRACTITIONER', label: 'General practitioner' },
    { value: 'DENTIST', label: 'Dentist' },
    { value: 'NURSE', label: 'Nurse' },
    { value: 'PHARMACIST', label: 'Pharmacist' },
    { value: 'PEDIATRICIAN', label: 'Pediatrician' },
    { value: 'OPHTHALMOLOGIST', label: 'Ophthamologist' },
    { value: 'OTHER', label: 'Other' },
];

export const TIMEZONES = [
    { value: 'Africa/Monrovia', label: 'Africa/Monrovia (GMT)' },
    { value: 'Africa/Accra', label: 'Africa/Accra (GMT)' },
    { value: 'Africa/Lagos', label: 'Africa/Lagos (WAT)' },
    { value: 'UTC', label: 'UTC' },
];

export const CITIES_BY_COUNTY: Record<string, string[]> = {
    Bomi: ['Tubmanburg'],
    Bong: ['Gbarnga'],
    Gbarpolu: ['Bopolu'],
    'Grand Bassa': ['Buchanan'],
    'Grand Cape Mount': ['Robertsport'],
    'Grand Gedeh': ['Zwedru'],
    'Grand Kru': ['Barclayville'],
    Lofa: ['Voinjama'],
    Margibi: ['Kakata', 'Harbel'],
    Maryland: ['Harper'],
    Montserrado: ['Monrovia', 'Paynesville', 'Caldwell', 'Careysburg'],
    Nimba: ['Sanniquellie', 'Ganta'],
    'River Cess': ['Cestos City'],
    'River Gee': ['Fish Town'],
    Sinoe: ['Greenville'],
};
export const COUNTIES = Object.keys(CITIES_BY_COUNTY).map((c) => ({ value: c, label: c }));

export const SUGGESTED_SERVICES = [
    'Emergency', 'Dentistry', 'Pharmacy', 'Gynaecologist', 'Laboratory', 'Radiology',
    'Paediatrics', 'Maternity', 'Surgery', 'Optometry', 'Physiotherapy', 'Mental health',
];

export const LIMITS = { description: 1000, service: 60, maxServices: 30 };
export const DEFAULT_COUNTRY_CODE = '231'; // Liberia: used when a number is typed without a country code

/* ---------- Helpers (exported for the UI + tests) ---------- */

/** "0770 000 000" / "231770000000" / "+231 770-000-000" → "+231770000000" */
export function normalizePhone(raw: string): string {
    const d = raw.replace(/[^\d+]/g, '');
    if (!d) return '';
    if (d.startsWith('+')) return `+${d.slice(1).replace(/\+/g, '')}`;
    if (d.startsWith('00')) return `+${d.slice(2)}`;
    if (d.startsWith(DEFAULT_COUNTRY_CODE)) return `+${d}`;
    return `+${DEFAULT_COUNTRY_CODE}${d.replace(/^0+/, '')}`;
}
export const isValidPhone = (v: string) => /^\+[1-9]\d{6,14}$/.test(normalizePhone(v));

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** http(s) only, must look like a real host, no embedded credentials */
export function isSafeUrl(v: string): boolean {
    try {
        const u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
        return ['http:', 'https:'].includes(u.protocol) && u.hostname.includes('.') && !u.username && !u.password;
    } catch {
        return false;
    }
}
const withProtocol = (v: string) => (/^https?:\/\//i.test(v) ? v : `https://${v}`);

const COMMON_PASSWORDS = new Set([
    'password', 'password1', '12345678', '123456789', 'qwerty123', '11111111', 'iloveyou', 'abc12345', 'letmein1', 'admin123',
]);

export const PASSWORD_RULES = [
    { id: 'len', label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
    { id: 'letter', label: 'A letter', test: (p: string) => /[A-Za-z]/.test(p) },
    { id: 'number', label: 'A number', test: (p: string) => /\d/.test(p) },
];

/** 0–4, for the strength meter only (the rules above are what's enforced) */
export function passwordScore(p: string): number {
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (p.length >= 12) s++;
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
    if (/\d/.test(p) && /[^A-Za-z0-9]/.test(p)) s++;
    return Math.min(s, 4);
}

/* ---------- Schema ---------- */

const text = (min: number, max: number, requiredMsg: string) =>
    z.string().trim().min(min, requiredMsg).max(max, `Use ${max} characters or fewer`);

const inRange = (min: number, max: number) => (v: string) =>
    v === '' || (!Number.isNaN(Number(v)) && Number(v) >= min && Number(v) <= max);

const timeRe = /^([01]\d|2[0-3]):[0-5]\d$/;

const optionalPhone = z.string().trim().max(25).refine((v) => v === '' || isValidPhone(v), 'Enter a valid phone number, e.g. +231 770 000 000');

export const businessSchema = z.object({
    // 1. Business details
    businessName: text(2, 120, 'Enter your business name'),
    legalName: z.string().trim().max(150, 'Use 150 characters or fewer'),
    registrationNumber: z
        .string()
        .trim()
        .min(3, 'Enter your business registration number')
        .max(50, 'Use 50 characters or fewer')
        .regex(/^[A-Za-z0-9][A-Za-z0-9\-/. ]*$/, 'Use letters, numbers, spaces and - / . only'),
    facilityType: z.string().min(1, 'Select a facility type'),
    description: text(10, LIMITS.description, 'Describe your business in at least 10 characters'),

    // 2. Contact details (optional)
    contactEmail: z.string().trim().max(254).refine((v) => v === '' || emailRe.test(v), 'Enter a valid email address'),
    contactPhone: optionalPhone,
    websiteUrl: z.string().trim().max(200).refine((v) => v === '' || isSafeUrl(v), 'Enter a valid website address'),

    // 3. Address & map
    county: z.string().min(1, 'Select a county'),
    city: z.string().min(1, 'Select a city'),
    addressLine: text(3, 200, 'Enter the street address'),
    timezone: z.string().min(1, 'Select a timezone'),
    longitude: z.string().trim().refine(inRange(-180, 180), 'Longitude must be between -180 and 180'),
    latitude: z.string().trim().refine(inRange(-90, 90), 'Latitude must be between -90 and 90'),

    // 4. Operating hours
    openingHours: z
        .array(
            z.object({
                day: z.string(),
                opensAt: z.string(),
                closesAt: z.string(),
                closed: z.boolean(),
                is24Hours: z.boolean(),
            }),
        )
        .superRefine((rows, ctx) => {
            rows.forEach((r, i) => {
                if (r.closed || r.is24Hours) return;
                if (!timeRe.test(r.opensAt)) {
                    ctx.addIssue({ code: 'custom', path: [i, 'opensAt'], message: 'Set an opening time' });
                } else if (!timeRe.test(r.closesAt)) {
                    ctx.addIssue({ code: 'custom', path: [i, 'closesAt'], message: 'Set a closing time' });
                } else if (r.closesAt <= r.opensAt) {
                    ctx.addIssue({ code: 'custom', path: [i, 'closesAt'], message: 'Closing time must be after opening time' });
                }
            });
        }),

    // 5. Services (optional)
    services: z.array(z.string().trim().min(2).max(LIMITS.service)).max(LIMITS.maxServices),

    // 6. Staff (optional; a started row needs a name + profession)
    staffMembers: z
        .array(
            z.object({
                displayName: z.string().trim().max(100),
                profession: z.string(),
                professionalTitle: z.string().trim().max(100),
                phone: z.string().trim().max(25),
                email: z.string().trim().max(254),
                yearsExperience: z.string().trim(),
                isPublic: z.boolean(),
            }),
        )
        .superRefine((rows, ctx) => {
            rows.forEach((r, i) => {
                const started = !!(r.displayName || r.profession || r.professionalTitle || r.phone || r.email || r.yearsExperience);
                if (!started) return;
                const add = (path: string, message: string) => ctx.addIssue({ code: 'custom', path: [i, path], message });
                if (r.displayName.length < 2) add('displayName', 'Enter a full name');
                if (!r.profession) add('profession', 'Select a profession');
                if (r.phone && !isValidPhone(r.phone)) add('phone', 'Enter a valid phone number');
                if (r.email && !emailRe.test(r.email)) add('email', 'Enter a valid email address');
                if (r.yearsExperience && !(/^\d{1,3}$/.test(r.yearsExperience) && Number(r.yearsExperience) <= 100)) {
                    add('yearsExperience', 'Enter a number from 0 to 100');
                }
            });
        }),

    // 7. Personal details (the owner account)
    fullName: text(2, 100, 'Enter your full name'),
    email: z.string().trim().min(1, 'Email is required').max(254).refine((v) => emailRe.test(v), 'Enter a valid email address'),
    phone: z.string().trim().min(1, 'Phone number is required').max(25).refine(isValidPhone, 'Enter a valid phone number, e.g. +231 770 000 000'),

    // 9. Password + consent (client-side only; not part of the payload)
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password must be 128 characters or fewer')
        .refine((p) => /[A-Za-z]/.test(p), 'Include at least one letter')
        .refine((p) => /\d/.test(p), 'Include at least one number')
        .refine((p) => !COMMON_PASSWORDS.has(p.toLowerCase()), 'That password is too common. Choose something harder to guess'),
    acceptedTerms: z.boolean().refine((v) => v, 'Accept the Terms and Privacy Policy to continue'),
});

export type BusinessFormValues = z.infer<typeof businessSchema>;

export const emptyStaffRow: BusinessFormValues['staffMembers'][number] = {
    displayName: '',
    profession: '',
    professionalTitle: '',
    phone: '',
    email: '',
    yearsExperience: '',
    isPublic: false,
};

export const defaultValues: BusinessFormValues = {
    businessName: '',
    legalName: '',
    registrationNumber: '',
    facilityType: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    websiteUrl: '',
    county: '',
    city: '',
    addressLine: '',
    timezone: 'Africa/Monrovia',
    longitude: '',
    latitude: '',
    openingHours: DAYS.map((d) => ({ day: d.value, opensAt: '08:00', closesAt: '17:00', closed: false, is24Hours: false })),
    services: [],
    staffMembers: [{ ...emptyStaffRow }],
    fullName: '',
    email: '',
    phone: '',
    password: '',
    acceptedTerms: false,
};

// Which fields each data step owns (validated step-by-step)
export const STEP_FIELDS: (keyof BusinessFormValues)[][] = [
    ['businessName', 'legalName', 'registrationNumber', 'facilityType', 'description'],
    ['contactEmail', 'contactPhone', 'websiteUrl'],
    ['county', 'city', 'addressLine', 'timezone', 'longitude', 'latitude'],
    ['openingHours'],
    ['services'],
    ['staffMembers'],
    ['fullName', 'email', 'phone'],
];

// ⚠ API error paths → form fields. Extend once you see the real validation error format.
export const API_FIELD_TO_FORM: Record<string, keyof BusinessFormValues> = {
    'user.email': 'email',
    'user.phone': 'phone',
    'user.displayName': 'fullName',
    'user.password': 'password',
    'business.displayName': 'businessName',
    'business.legalName': 'legalName',
    'business.registrationNumber': 'registrationNumber',
    'primaryLocation.facilityType': 'facilityType',
    'primaryLocation.description': 'description',
    'primaryLocation.contactEmail': 'contactEmail',
    'primaryLocation.contactPhone': 'contactPhone',
    'primaryLocation.websiteUrl': 'websiteUrl',
    'primaryLocation.timezone': 'timezone',
    'primaryLocation.location.addressLine': 'addressLine',
    'primaryLocation.location.county': 'county',
    'primaryLocation.location.cityOrTown': 'city',
};

/* ---------- Payload ---------- */

/** strip control characters, collapse whitespace */
const clean = (s: string) => s.replace(/[\u0000-\u001F\u007F]/g, '').replace(/\s+/g, ' ').trim();
const blank = (s: string) => clean(s) || undefined;

export function buildPayload(v: BusinessFormValues): RegisterBusinessPayload {
    const businessName = clean(v.businessName);
    const lat = blank(v.latitude);
    const lng = blank(v.longitude);
    const website = blank(v.websiteUrl);
    const phone = blank(v.contactPhone);

    return {
        user: {
            email: v.email.trim().toLowerCase(),
            password: v.password, // never trimmed or logged
            displayName: clean(v.fullName),
            phone: normalizePhone(v.phone),
        },
        business: {
            displayName: businessName,
            legalName: blank(v.legalName) ?? businessName,
            registrationNumber: clean(v.registrationNumber),
            membershipRole: 'OWNER',
        },
        primaryLocation: {
            name: businessName,
            facilityType: v.facilityType,
            contactEmail: blank(v.contactEmail)?.toLowerCase(),
            contactPhone: phone ? normalizePhone(phone) : undefined,
            websiteUrl: website ? withProtocol(website) : undefined,
            description: clean(v.description),
            timezone: v.timezone,
            location: {
                addressLine: clean(v.addressLine),
                county: v.county,
                cityOrTown: v.city,
                ...(lat && lng ? { latitude: Number(lat), longitude: Number(lng) } : {}),
            },
            openingHours: v.openingHours.map((h) => ({
                dayOfWeek: h.day as DayOfWeek,
                isClosed: h.closed,
                is24Hours: h.is24Hours,
                periods: h.closed || h.is24Hours ? [] : [{ opensAt: h.opensAt, closesAt: h.closesAt }],
            })),
            services: v.services
                .map(clean)
                .filter((s, i, all) => s && all.findIndex((x) => x.toLowerCase() === s.toLowerCase()) === i),
            staffMembers: v.staffMembers
                .filter((s) => s.displayName.trim())
                .map((s) => ({
                    displayName: clean(s.displayName),
                    profession: s.profession,
                    professionalTitle: blank(s.professionalTitle),
                    phone: blank(s.phone) ? normalizePhone(s.phone) : undefined,
                    email: blank(s.email)?.toLowerCase(),
                    yearsExperience: s.yearsExperience ? Number(s.yearsExperience) : undefined,
                    isPublic: s.isPublic,
                })),
        },
    };
}