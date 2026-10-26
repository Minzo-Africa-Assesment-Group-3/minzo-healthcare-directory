import { Globe, Mail, MapPin, Navigation, PhoneCall } from 'lucide-react';
import type { BusinessDetail, BusinessDetailLocation } from './types';

const host = (url: string) => {
    try {
        return new URL(url).hostname.replace(/^www\./, '');
    } catch {
        return url;
    }
};

const withProtocol = (url: string) => (/^https?:\/\//i.test(url) ? url : `https://${url}`);

export default function ContactCard({ business: b, location: loc }: { business: BusinessDetail; location: BusinessDetailLocation }) {
    const place = loc.latitude !== null && loc.longitude !== null
        ? `${loc.latitude},${loc.longitude}`
        : encodeURIComponent(`${b.displayName}, ${loc.addressLine}`);
    const mapsSearch = `https://www.google.com/maps/search/?api=1&query=${place}`;
    const directions = `https://www.google.com/maps/dir/?api=1&destination=${place}`;

    const rows = [
        loc.contactPhone && { icon: PhoneCall, text: loc.contactPhone, href: `tel:${loc.contactPhone.replace(/\s/g, '')}` },
        loc.contactEmail && { icon: Mail, text: loc.contactEmail, href: `mailto:${loc.contactEmail}` },
        { icon: MapPin, text: loc.addressLine, href: mapsSearch, external: true },
        loc.websiteUrl && { icon: Globe, text: host(loc.websiteUrl), href: withProtocol(loc.websiteUrl), external: true },
    ].filter(Boolean) as { icon: typeof Globe; text: string; href: string; external?: boolean }[];

    return (
        <section className="rounded-2xl border border-gray-200 bg-[#F6F8FA] p-5">
            <h2 className="mb-3 text-base font-semibold text-gray-950">Contact</h2>

            <ul className="space-y-3.5 rounded-xl border border-gray-200 bg-white p-4">
                {rows.map(({ icon: Icon, text, href, external }) => (
                    <li key={href} className="flex items-start gap-3 text-sm">
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#1B8A52]" aria-hidden />
                        <a
                            href={href}
                            {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                            className="min-w-0 wrap-break-word text-gray-900 hover:text-[#0C486D] hover:underline"
                        >
                            {text}
                        </a>
                    </li>
                ))}
            </ul>

            <a
                href={directions}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-[#0C486D] bg-white text-sm font-semibold text-[#0C486D] transition-colors hover:bg-[#0C486D]/5"
            >
                <Navigation className="h-4 w-4" aria-hidden />
                Get directions
            </a>
        </section>
    );
}