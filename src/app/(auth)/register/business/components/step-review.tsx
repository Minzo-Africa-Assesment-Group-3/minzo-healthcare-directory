'use client';

import { useFormContext } from 'react-hook-form';
import { ArrowRight, PlusCircle } from 'lucide-react';
import { DAYS, FACILITY_TYPES, STAFF_ROLES, TIMEZONES, type BusinessFormValues } from './business-schema';
import { outlineBtn, slab } from './wizard-ui';

const labelOf = (opts: { value: string; label: string }[], v: string) => opts.find((o) => o.value === v)?.label;

function Card({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
    return (
        <section className={`rounded-2xl bg-[#F4F4F4] p-4 ${slab}`}>
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-950">{title}</h3>
                <button
                    type="button"
                    onClick={onEdit}
                    aria-label={`Edit ${title}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/70 py-1.5 pl-3 pr-2 text-xs font-medium text-[#0C486D] hover:bg-white"
                >
                    Edit <ArrowRight className="h-4 w-4 text-gray-900" aria-hidden />
                </button>
            </div>
            <dl className="space-y-3">{children}</dl>
        </section>
    );
}

function Item({ label, value, empty = 'Not provided' }: { label: string; value?: string; empty?: string }) {
    return (
        <div>
            <dt className="text-xs text-gray-500">{label}</dt>
            <dd className={`mt-0.5 break-words text-sm ${value ? 'font-semibold text-gray-950' : 'font-medium text-gray-700'}`}>
                {value || empty}
            </dd>
        </div>
    );
}

const pill = 'rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-900';

export default function StepReview({ goTo }: { goTo: (step: number) => void }) {
    const { watch } = useFormContext<BusinessFormValues>();
    const v = watch();
    const staff = v.staffMembers.filter((s) => s.fullName);

    return (
        <div className="space-y-4">
            <Card title="Business Details" onEdit={() => goTo(0)}>
                <Item label="Business name" value={v.businessName} />
                <Item label="Facility type" value={labelOf(FACILITY_TYPES, v.facilityType)} empty="Not selected" />
                <Item label="Description" value={v.description} />
            </Card>

            <Card title="Contact Details" onEdit={() => goTo(1)}>
                <Item label="Contact Email (Optional)" value={v.contactEmail} />
                <Item label="Contact Phone (Optional)" value={v.contactPhone} />
                <Item label="Website URL (Optional)" value={v.websiteUrl} />
            </Card>

            <Card title="Address & Map" onEdit={() => goTo(2)}>
                <Item label="County" value={v.county} empty="Not selected" />
                <Item label="City" value={v.city} empty="Not selected" />
                <Item label="Address Line" value={v.addressLine} />
                <Item label="Timezone" value={labelOf(TIMEZONES, v.timezone)} empty="Not selected" />
                <Item label="Longitude" value={v.longitude} />
                <Item label="Latitude" value={v.latitude} />
            </Card>

            <Card title="Operating hours" onEdit={() => goTo(3)}>
                <ul className="space-y-2">
                    {DAYS.map((d, i) => {
                        const h = v.openingHours[i];
                        return (
                            <li key={d.value} className="flex items-center gap-3 text-sm">
                                <span className="w-10 shrink-0 font-semibold text-gray-950">{d.short}</span>
                                {h?.closed ? (
                                    <span className={`${pill} text-gray-500`}>Closed</span>
                                ) : (
                                    <>
                                        <span className={pill}>{h?.opensAt}</span>
                                        <span aria-hidden>-</span>
                                        <span className={pill}>{h?.closesAt}</span>
                                    </>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </Card>

            <Card title="Services Rendered" onEdit={() => goTo(4)}>
                <div>
                    <dt className="text-xs text-gray-500">Optional services</dt>
                    <dd className="mt-1">
                        {v.services.length ? (
                            <ul className="flex flex-wrap gap-2">
                                {v.services.map((s) => (
                                    <li key={s} className={pill}>{s}</li>
                                ))}
                            </ul>
                        ) : (
                            <span className="text-sm font-medium text-gray-700">Not added</span>
                        )}
                    </dd>
                </div>
            </Card>

            <Card title="Staff members" onEdit={() => goTo(5)}>
                {staff.length ? (
                    <ul className="space-y-2">
                        {staff.map((s, i) => (
                            <li key={i} className="text-sm font-semibold text-gray-950">
                                {s.fullName}
                                <span className="font-normal text-gray-600"> · {labelOf(STAFF_ROLES, s.role)}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm font-medium text-gray-700">No staff members added</p>
                )}
                <button type="button" onClick={() => goTo(5)} className={`${outlineBtn} mt-2 w-full`}>
                    <PlusCircle className="h-5 w-5" aria-hidden />
                    Add staff member
                </button>
            </Card>

            <Card title="Final representative" onEdit={() => goTo(6)}>
                <Item label="Full name" value={v.fullName} />
                <Item label="Email address" value={v.email} />
                <Item label="Phone number" value={v.phone} />
                <Item label="Registration document" value={v.document?.name} empty="No file uploaded" />
            </Card>
        </div>
    );
}
