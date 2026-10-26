import { Brain, Building2, FlaskConical, Hospital, Pill, Smile, Stethoscope, type LucideIcon } from 'lucide-react';

const META: Record<string, { label: string; icon: LucideIcon }> = {
    HOSPITAL: { label: 'Hospital', icon: Hospital },
    CLINIC: { label: 'Clinic', icon: Stethoscope },
    PHARMACY: { label: 'Pharmacy', icon: Pill },
    LABORATORY: { label: 'Laboratory', icon: FlaskConical },
    DENTAL: { label: 'Dental care', icon: Smile },
    MENTAL_HEALTH: { label: 'Mental health', icon: Brain },
};

const titleCase = (s: string) => s.toLowerCase().replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

export const facilityMeta = (type: string) => META[type] ?? { label: titleCase(type), icon: Building2 };