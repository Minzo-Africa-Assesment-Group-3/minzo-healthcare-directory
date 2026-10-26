"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Check, ExternalLink, X } from "lucide-react"

import { getClaimEvidenceDownloadUrl, useAdminBusinessClaimQuery, useModerateBusinessClaimMutation } from "../../../api"
import { AdminButton } from "../../../components/ui"

function formatDate(value: string | null): string {
  if (!value) return "—"

  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
}

function DetailItem({ label, value }: { label: string; value: string | null | undefined }) {
  return <div className="space-y-1"><dt className="text-xs font-medium uppercase tracking-wide text-[#6c757d]">{label}</dt><dd className="text-sm leading-6 text-[#212121]">{value || "—"}</dd></div>
}

export default function BusinessClaimDetailPage() {
  const params = useParams<{ claimId: string }>()
  const router = useRouter()
  const [decision, setDecision] = useState<"APPROVED" | "REJECTED" | null>(null)
  const [reviewNote, setReviewNote] = useState("")
  const [isOpeningEvidence, setIsOpeningEvidence] = useState(false)
  const [evidenceError, setEvidenceError] = useState<string | null>(null)
  const claimQuery = useAdminBusinessClaimQuery(params.claimId)
  const moderationMutation = useModerateBusinessClaimMutation()
  const moderationError = moderationMutation.error instanceof Error ? moderationMutation.error.message : null

  async function openEvidence() {
    setEvidenceError(null)
    setIsOpeningEvidence(true)
    try {
      const authorization = await getClaimEvidenceDownloadUrl(params.claimId)
      globalThis.open(authorization.url, "_blank", "noopener,noreferrer")
    } catch (error) {
      setEvidenceError(error instanceof Error ? error.message : "Unable to open the evidence document.")
    } finally {
      setIsOpeningEvidence(false)
    }
  }

  async function moderateClaim(nextDecision: "APPROVED" | "REJECTED") {
    if (nextDecision === "REJECTED" && !reviewNote.trim()) {
      setDecision("REJECTED")
      return
    }

    await moderationMutation.mutateAsync(nextDecision === "APPROVED"
      ? { claimId: params.claimId, decision: "APPROVED", ...(reviewNote.trim() ? { reviewNote: reviewNote.trim() } : {}) }
      : { claimId: params.claimId, decision: "REJECTED", reviewNote: reviewNote.trim() }
    )
    router.push("/portal/admin/business-claims")
  }

  if (claimQuery.isLoading) return <div className="space-y-5"><div className="h-8 w-64 animate-pulse rounded bg-slate-200" /><div className="h-72 animate-pulse rounded-2xl bg-slate-200" /></div>

  if (claimQuery.isError || !claimQuery.data) {
    return <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800"><h1 className="text-lg font-semibold">Unable to load the business claim</h1><p className="mt-2 text-sm">Please return to the claims list and try again.</p><AdminButton className="mt-4" onClick={() => router.push("/portal/admin/business-claims")} size="compact" type="button" variant="outline">Back to claims</AdminButton></section>
  }

  const claim = claimQuery.data
  const canModerate = claim.status === "PENDING"

  return <div className="space-y-6 pb-10"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><Link className="inline-flex items-center gap-2 text-sm font-medium text-[#0C486D] hover:underline" href="/portal/admin/business-claims"><ArrowLeft size={16} />Business claims</Link><h1 className="mt-3 text-2xl font-semibold text-[#212121]">{claim.business.displayName}</h1><p className="mt-1 text-sm text-[#6c757d]">Review this ownership claim and its supporting evidence.</p></div><span className="inline-flex w-fit rounded-full bg-[#e7edf0] px-3 py-1 text-sm font-semibold text-[#0C486D]">{claim.status}</span></div>

    <section className="rounded-2xl border border-[#e0e0e0] bg-white p-6"><h2 className="text-base font-semibold text-[#212121]">Claim details</h2><dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3"><DetailItem label="Business" value={claim.business.displayName} /><DetailItem label="Requested role" value={claim.requestedRole} /><DetailItem label="Submitted" value={formatDate(claim.createdAt)} /><DetailItem label="Claimant" value={claim.claimant.displayName} /><DetailItem label="Email" value={claim.claimant.email} /><DetailItem label="Phone" value={claim.claimant.phone} /><DetailItem label="Claimant note" value={claim.claimantNote} /></dl></section>

    <section className="rounded-2xl border border-[#e0e0e0] bg-white p-6"><h2 className="text-base font-semibold text-[#212121]">Evidence document</h2><dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3"><DetailItem label="File name" value={claim.evidenceDocument.originalFileName} /><DetailItem label="File type" value={claim.evidenceDocument.mimeType} /><DetailItem label="File size" value={`${(claim.evidenceDocument.sizeBytes / 1024).toFixed(1)} KB`} /></dl><div className="mt-5">{evidenceError ? <p className="mb-3 text-sm text-red-600">{evidenceError}</p> : null}<AdminButton disabled={isOpeningEvidence} onClick={() => void openEvidence()} size="compact" type="button" variant="outline"><ExternalLink size={16} />{isOpeningEvidence ? "Opening…" : "Open evidence"}</AdminButton></div></section>

    <section className="rounded-2xl border border-[#e0e0e0] bg-white p-6"><h2 className="text-base font-semibold text-[#212121]">Claim decision</h2>{canModerate ? <div className="mt-5 space-y-4"><label className="block space-y-1.5"><span className="text-xs font-medium uppercase tracking-wide text-[#6c757d]">Decision note {decision === "REJECTED" ? "(required for rejection)" : "(optional)"}</span><textarea className="min-h-28 w-full rounded-xl border border-[#ced4da] p-3 text-sm outline-none focus:border-[#0C486D] focus:ring-2 focus:ring-[#0C486D]/20" onChange={(event) => setReviewNote(event.target.value)} placeholder="Explain the decision for the claimant." value={reviewNote} /></label>{decision === "REJECTED" && !reviewNote.trim() ? <p className="text-sm text-red-600">A rejection reason is required.</p> : null}{moderationError ? <p className="text-sm text-red-600">{moderationError}</p> : null}<div className="flex flex-wrap gap-3"><AdminButton disabled={moderationMutation.isPending} onClick={() => void moderateClaim("APPROVED")} size="compact" type="button"><Check size={16} />{moderationMutation.isPending ? "Saving…" : "Approve claim"}</AdminButton><AdminButton disabled={moderationMutation.isPending} onClick={() => setDecision("REJECTED")} size="compact" type="button" variant="danger"><X size={16} />Reject claim</AdminButton>{decision === "REJECTED" ? <AdminButton disabled={moderationMutation.isPending || !reviewNote.trim()} onClick={() => void moderateClaim("REJECTED")} size="compact" type="button" variant="danger">Confirm rejection</AdminButton> : null}</div></div> : <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3"><DetailItem label="Current decision" value={claim.status} /><DetailItem label="Decision note" value={claim.reviewNote} /><DetailItem label="Reviewed" value={formatDate(claim.reviewedAt)} /></dl>}</section>
  </div>
}
