"use client"

import { useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Check, ExternalLink, X } from "lucide-react"

import { useAdminBusinessRegistrationQuery, useModerateBusinessMutation } from "../../../api"
import { AdminButton } from "../../../components/ui"

function formatDate(value: string | null): string {
  if (!value) return "—"

  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
}

function DetailItem({ label, value }: { label: string; value: ReactNode }) {
  return <div className="space-y-1"><dt className="text-xs font-medium uppercase tracking-wide text-[#6c757d]">{label}</dt><dd className="text-sm leading-6 text-[#212121]">{value || "—"}</dd></div>
}

export default function BusinessRegistrationDetailPage() {
  const params = useParams<{ businessId: string }>()
  const router = useRouter()
  const [decision, setDecision] = useState<"APPROVED" | "REJECTED" | null>(null)
  const [reviewNote, setReviewNote] = useState("")
  const businessQuery = useAdminBusinessRegistrationQuery(params.businessId)
  const moderationMutation = useModerateBusinessMutation()
  const errorMessage = moderationMutation.error instanceof Error ? moderationMutation.error.message : null

  useEffect(() => {
    console.log("businessQuery.data", businessQuery.data)
  }, [businessQuery.data])


  async function moderateBusiness(nextDecision: "APPROVED" | "REJECTED") {
    if (nextDecision === "REJECTED" && !reviewNote.trim()) {
      setDecision("REJECTED")
      return
    }

    await moderationMutation.mutateAsync(nextDecision === "APPROVED"
      ? { businessId: params.businessId, decision: "APPROVED", ...(reviewNote.trim() ? { reviewNote: reviewNote.trim() } : {}) }
      : { businessId: params.businessId, decision: "REJECTED", reviewNote: reviewNote.trim() }
    )
    router.push("/portal/admin/businesses")
  }

  if (businessQuery.isLoading) return <div className="space-y-5"><div className="h-8 w-64 animate-pulse rounded bg-slate-200" /><div className="h-80 animate-pulse rounded-2xl bg-slate-200" /></div>

  if (businessQuery.isError || !businessQuery.data) {
    return <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800"><h1 className="text-lg font-semibold">Unable to load the registration</h1><p className="mt-2 text-sm">Please return to the registrations list and try again.</p><AdminButton className="mt-4" onClick={() => router.push("/portal/admin/businesses")} size="compact" type="button" variant="outline">Back to registrations</AdminButton></section>
  }

  const business = businessQuery.data
  const canModerate = business.status === "PENDING_APPROVAL"

  return <div className="space-y-6 pb-10"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><Link className="inline-flex items-center gap-2 text-sm font-medium text-[#0C486D] hover:underline" href="/portal/admin/businesses"><ArrowLeft size={16} />Business registrations</Link><h1 className="mt-3 text-2xl font-semibold text-[#212121]">{business.displayName} &nbsp; <span>|</span> &nbsp; <span className="">{business.registrationNumber}</span></h1><p className="mt-1 text-sm text-[#6c757d]"></p></div><span className="inline-flex w-fit rounded-full bg-[#e7edf0] px-3 py-1 text-sm font-semibold text-[#0C486D]">{business.status.replaceAll("_", " ")}</span></div>

    <section className="rounded-2xl border border-[#e0e0e0] bg-white p-6"><h2 className="text-base font-semibold text-[#212121]">Business information</h2><dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3"><DetailItem label="Display name" value={business.displayName} /><DetailItem label="Legal name" value={business.legalName} /><DetailItem label="Registration number" value={business.registrationNumber} /><DetailItem label="Submitted" value={formatDate(business.submittedAt)} /><DetailItem label="Verification" value={business.verificationStatus} /><DetailItem label="Registration source" value={business.source.replaceAll("_", " ")} /></dl></section>

    <section className="rounded-2xl border border-[#e0e0e0] bg-white p-6"><h2 className="text-base font-semibold text-[#212121]">Primary contact and membership</h2><dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">{business.members.map((member) => <DetailItem key={member.user.id} label={`${member.role.toLocaleLowerCase()} member`} value={<><span className="block">{member.user.displayName}</span><span className="block text-[#6c757d]">{member.user.email}</span><span className="block text-[#6c757d]">{member.user.phone ?? "No phone number"}</span></>} />)}</dl></section>

    <section className="rounded-2xl border border-[#e0e0e0] bg-white p-6"><h2 className="text-base font-semibold text-[#212121]">Locations</h2><div className="mt-5 divide-y divide-[#e9ecef]">{business.locations.map((location) => <article className="py-5 first:pt-0 last:pb-0" key={location.id}><dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3"><DetailItem label="Location name" value={location.name} /><DetailItem label="Status" value={location.status} /><DetailItem label="Address" value={[location.addressLine, location.cityOrTown, location.county].filter(Boolean).join(", ") || "No address supplied"} /><DetailItem label="Facility type" value={location.facilityType} /><DetailItem label="Phone" value={location.contactPhone} /><DetailItem label="Email" value={location.contactEmail} /><DetailItem label="Timezone" value={location.timezone} /><DetailItem label="Services" value={location.services.length ? location.services.map((service) => service.name).join(", ") : "No services supplied"} /></dl></article>)}</div></section>

    <section className="rounded-2xl border border-[#e0e0e0] bg-white p-6"><h2 className="text-base font-semibold text-[#212121]">Registration document</h2><dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">{business.registrationDocument ? <><DetailItem label="File name" value={business.registrationDocument.originalFileName} /><DetailItem label="File type" value={business.registrationDocument.mimeType} /><DetailItem label="File size" value={`${(business.registrationDocument.sizeBytes / 1024).toFixed(1)} KB`} /><DetailItem label="Document" value={<a className="inline-flex items-center gap-2 font-medium text-[#0C486D] hover:underline" href={business.registrationDocument.downloadUrl} rel="noreferrer" target="_blank">Open document <ExternalLink size={15} /></a>} /></> : <DetailItem label="Document" value="No registration document was attached." />}</dl></section>

    <section className="rounded-2xl border border-[#e0e0e0] bg-white p-6"><h2 className="text-base font-semibold text-[#212121]">Registration decision</h2>{canModerate ? <div className="mt-5 space-y-4"><label className="block space-y-1.5"><span className="text-xs font-medium uppercase tracking-wide text-[#6c757d]">Decision note {decision === "REJECTED" ? "(required for rejection)" : "(optional)"}</span><textarea className="min-h-28 w-full rounded-xl border border-[#ced4da] p-3 text-sm outline-none focus:border-[#0C486D] focus:ring-2 focus:ring-[#0C486D]/20" onChange={(event) => setReviewNote(event.target.value)} placeholder="Explain the decision for the business owner." value={reviewNote} /></label>{decision === "REJECTED" && !reviewNote.trim() ? <p className="text-sm text-red-600">A rejection reason is required.</p> : null}{errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}<div className="flex flex-wrap gap-3"><AdminButton disabled={moderationMutation.isPending} onClick={() => void moderateBusiness("APPROVED")} size="compact" type="button"><Check size={16} />{moderationMutation.isPending ? "Saving…" : "Approve registration"}</AdminButton><AdminButton disabled={moderationMutation.isPending} onClick={() => setDecision("REJECTED")} size="compact" type="button" variant="danger"><X size={16} />Reject registration</AdminButton>{decision === "REJECTED" ? <AdminButton disabled={moderationMutation.isPending || !reviewNote.trim()} onClick={() => void moderateBusiness("REJECTED")} size="compact" type="button" variant="danger">Confirm rejection</AdminButton> : null}</div></div> : <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3"><DetailItem label="Current decision" value={business.status.replaceAll("_", " ")} /><DetailItem label="Decision note" value={business.reviewNote} /><DetailItem label="Reviewed" value={formatDate(business.reviewedAt)} /></dl>}</section>
  </div>
}
