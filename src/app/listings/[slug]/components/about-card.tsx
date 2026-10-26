import type { BusinessDetail, BusinessDetailLocation } from './types';

const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function AboutCard({ business: b, location: loc }: { business: BusinessDetail; location: BusinessDetailLocation }) {
    const facts: { label: string; value: string }[] = [
        ...(b.legalName && b.legalName !== b.displayName ? [{ label: 'Registered as', value: b.legalName }] : []),
        ...(b.verificationStatus === 'VERIFIED' && b.approvedAt ? [{ label: 'Verified on', value: fmtDate(b.approvedAt) }] : []),
        { label: 'Address', value: loc.addressLine },
    ];

    return (
        <section id="overview" className="scroll-mt-32 rounded-xl border border-gray-200 p-5 sm:p-6">
            <h2 className="text-base font-semibold text-gray-950 sm:text-lg">About</h2>
            <p className={`mt-3 text-sm leading-relaxed sm:text-[15px] ${loc.description ? 'text-gray-800' : 'text-gray-500'}`}>
                {loc.description ?? 'This business hasn’t added a description yet.'}
            </p>

            <dl className="mt-5 grid gap-x-6 gap-y-3 border-t border-gray-100 pt-4 sm:grid-cols-2">
                {facts.map((f) => (
                    <div key={f.label} className={f.label === 'Address' ? 'sm:col-span-2' : ''}>
                        <dt className="text-xs text-gray-500">{f.label}</dt>
                        <dd className="mt-0.5 text-sm font-medium text-gray-900">{f.value}</dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}