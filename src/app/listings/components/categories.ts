import {
    Brain, Building2, FlaskConical, Hospital, LayoutGrid, Pill, Smile, Stethoscope, type LucideIcon,
} from 'lucide-react';

export type CategoryId = 'all' | 'hospital' | 'clinic' | 'lab' | 'pharmacy' | 'mental-health' | 'dental';

// ⚠ facilityType values for lab / dental / mental-health are guesses: HOSPITAL, CLINIC and
// PHARMACY are confirmed by the API sample. Align the rest with your enum.
export const CATEGORIES: { id: CategoryId; label: string; facilityType?: string; icon: LucideIcon }[] = [
    { id: 'all', label: 'All', icon: LayoutGrid },
    { id: 'hospital', label: 'Hospitals', facilityType: 'HOSPITAL', icon: Hospital },
    { id: 'clinic', label: 'Clinics', facilityType: 'CLINIC', icon: Stethoscope },
    { id: 'lab', label: 'Labs', facilityType: 'LABORATORY', icon: FlaskConical },
    { id: 'pharmacy', label: 'Pharmacies', facilityType: 'PHARMACY', icon: Pill },
    { id: 'mental-health', label: 'Mental health', facilityType: 'MENTAL_HEALTH', icon: Brain },
    { id: 'dental', label: 'Dental care', facilityType: 'DENTAL', icon: Smile },
];

const FACILITY_META: Record<string, { label: string; icon: LucideIcon }> = {
    HOSPITAL: { label: 'Hospital', icon: Hospital },
    CLINIC: { label: 'Clinic', icon: Stethoscope },
    PHARMACY: { label: 'Pharmacy', icon: Pill },
    LABORATORY: { label: 'Laboratory', icon: FlaskConical },
    DENTAL: { label: 'Dental care', icon: Smile },
    MENTAL_HEALTH: { label: 'Mental health', icon: Brain },
};

const titleCase = (s: string) => s.toLowerCase().replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

export const facilityMeta = (type: string) =>
    FACILITY_META[type] ?? { label: titleCase(type), icon: Building2 };