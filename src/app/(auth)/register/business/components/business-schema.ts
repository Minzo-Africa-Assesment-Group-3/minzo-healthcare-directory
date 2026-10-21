import { z } from 'zod';

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

export const STAFF_ROLES = [
    { value: 'DOCTOR', label: 'Doctor' },
    { value: 'NURSE', label: 'Nurse' },
    { value: 'MIDWIFE', label: 'Midwife' },
    { value: 'PHARMACIST', label: 'Pharmacist' },
    { value: 'LAB_TECHNICIAN', label: 'Lab technician' },
    { value: 'DENTIST', label: 'Dentist' },
    { value: 'ADMINISTRATOR', label: 'Administrator' },
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

export const DEFAULT_LOCATION_NAME = 'Main Branch'; // no field for this in Figma
export const MAX_DOC_MB = 10;

/* ---------- Schema ---------- */

const phoneRe = /^\+?[\d\s-]{7,15}$/;
const urlRe = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i;
const timeRe = /^([01]\d|2[0-3]):[0-5]\d$/;

const inRange = (min: number, max: number) => (v: string) =>
    v === '' || (!Number.isNaN(Number(v)) && Number(v) >= min && Number(v) <= max);

export const businessSchema = z.object({
    // 1. Business details
    businessName: z.string().trim().min(2, 'Enter your business name'),
    facilityType: z.string().min(1, 'Select a facility type'),
    description: z.string().trim().min(1, 'Enter a short description'),

    // 2. Contact details (all optional)
    contactEmail: z.string().trim().email('Enter a valid email address').or(z.literal('')),
    contactPhone: z.string().trim().regex(phoneRe, 'Enter a valid phone number').or(z.literal('')),
    websiteUrl: z.string().trim().regex(urlRe, 'Enter a valid website address').or(z.literal('')),

    // 3. Address & map
    county: z.string().min(1, 'Select a county'),
    city: z.string().min(1, 'Select a city'),
    addressLine: z.string().trim().min(2, 'Enter the address'),
    timezone: z.string().min(1, 'Select a timezone'),
    longitude: z.string().trim().refine(inRange(-180, 180), 'Longitude must be between -180 and 180'),
    latitude: z.string().trim().refine(inRange(-90, 90), 'Latitude must be between -90 and 90'),

    // 4. Operating hours
    openingHours: z
        .array(z.object({ day: z.string(), opensAt: z.string(), closesAt: z.string(), closed: z.boolean() }))
        .superRefine((rows, ctx) => {
            rows.forEach((r, i) => {
                if (r.closed) return;
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
    services: z.array(z.string()),

    // 6. Staff members (optional; a row needs both fields or neither)
    staffMembers: z
        .array(z.object({ fullName: z.string().trim(), role: z.string() }))
        .superRefine((rows, ctx) => {
            rows.forEach((r, i) => {
                if (r.fullName && !r.role) ctx.addIssue({ code: 'custom', path: [i, 'role'], message: 'Select a role' });
                if (!r.fullName && r.role) ctx.addIssue({ code: 'custom', path: [i, 'fullName'], message: 'Enter a full name' });
            });
        }),

    // 7. Personal details (the user)
    fullName: z.string().trim().min(2, 'Enter your full name'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    phone: z.string().min(1, 'Phone number is required').regex(phoneRe, 'Enter a valid phone number'),
    document: z.custom<File | undefined>().superRefine((f, ctx) => {
        if (!f) return ctx.addIssue({ code: 'custom', message: 'Upload your registration document' });
        if (f.size > MAX_DOC_MB * 1024 * 1024)
            return ctx.addIssue({ code: 'custom', message: `File must be ${MAX_DOC_MB} MB or smaller` });
        if (!(f.type === 'application/pdf' || f.type.startsWith('image/')))
            ctx.addIssue({ code: 'custom', message: 'Upload a PDF or a photo' });
    }),

    // 9. Password
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type BusinessFormValues = z.infer<typeof businessSchema>;

export const defaultValues: BusinessFormValues = {
    businessName: '',
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
    openingHours: DAYS.map((d) => ({ day: d.value, opensAt: '08:00', closesAt: '17:00', closed: false })),
    services: [],
    staffMembers: [{ fullName: '', role: '' }],
    fullName: '',
    email: '',
    phone: '',
    document: undefined,
    password: '',
};

// Which fields each data step owns (used to validate step-by-step)
export const STEP_FIELDS: (keyof BusinessFormValues)[][] = [
    ['businessName', 'facilityType', 'description'],
    ['contactEmail', 'contactPhone', 'websiteUrl'],
    ['county', 'city', 'addressLine', 'timezone', 'longitude', 'latitude'],
    ['openingHours'],
    ['services'],
    ['staffMembers'],
    ['fullName', 'email', 'phone', 'document'],
];

/* ---------- Payload ---------- */

const blank = (v: string) => (v.trim() === '' ? undefined : v.trim());
const withProtocol = (v?: string) => (v && !/^https?:\/\//i.test(v) ? `https://${v}` : v);

export function buildPayload(v: BusinessFormValues) {
    const lat = blank(v.latitude);
    const lng = blank(v.longitude);

    return {
        user: {
            displayName: v.fullName.trim(),
            email: v.email.trim(),
            password: v.password,
            phone: v.phone.trim(),
        },
        business: {
            displayName: v.businessName.trim(),
            legalName: v.businessName.trim(), // ⚠ no legal-name field in Figma
            // registrationNumber: not collected in Figma
            membershipRole: 'OWNER',
        },
        primaryLocation: {
            name: DEFAULT_LOCATION_NAME,
            facilityType: v.facilityType,
            contactEmail: blank(v.contactEmail),
            contactPhone: blank(v.contactPhone),
            websiteUrl: withProtocol(blank(v.websiteUrl)),
            description: v.description.trim(),
            timezone: v.timezone,
            location: {
                addressLine: v.addressLine.trim(),
                county: v.county,
                cityOrTown: v.city,
                ...(lat && lng ? { latitude: Number(lat), longitude: Number(lng) } : {}),
            },
            // ⚠ Item shapes below are assumptions: adjust to your API
            openingHours: v.openingHours.map((h) => ({
                dayOfWeek: h.day,
                isClosed: h.closed,
                opensAt: h.closed ? null : h.opensAt,
                closesAt: h.closed ? null : h.closesAt,
            })),
            services: v.services,
            staffMembers: v.staffMembers
                .filter((s) => s.fullName)
                .map((s) => ({ fullName: s.fullName, role: s.role })),
        },
    };
}
