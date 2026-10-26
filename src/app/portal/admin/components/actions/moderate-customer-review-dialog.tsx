"use client"

import { useState } from "react"

import { type AdminCustomerReview, useModerateCustomerReviewMutation } from "../../api"
import { AdminTextareaField } from "../forms"
import { AdminButton, AdminModal } from "../ui"

interface ModerateCustomerReviewDialogProps {
  onOpenChange: (open: boolean) => void
  open: boolean
  review: AdminCustomerReview | null
}

export function ModerateCustomerReviewDialog({ onOpenChange, open, review }: ModerateCustomerReviewDialogProps) {
  const [decision, setDecision] = useState<"REJECTED" | null>(null)
  const [reason, setReason] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const moderationMutation = useModerateCustomerReviewMutation()

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setDecision(null)
      setReason("")
      setErrorMessage(null)
    }

    onOpenChange(nextOpen)
  }

  async function moderateReview(nextDecision: "APPROVED" | "REJECTED") {
    if (!review) return

    if (nextDecision === "REJECTED" && !reason.trim()) {
      setErrorMessage("A reason is required when rejecting a customer review.")
      return
    }

    setErrorMessage(null)

    try {
      await moderationMutation.mutateAsync(nextDecision === "APPROVED"
        ? { reviewId: review.id, decision: "APPROVED" }
        : { reviewId: review.id, decision: "REJECTED", reason: reason.trim() })
      handleOpenChange(false)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "The customer review could not be moderated.")
    }
  }

  const reviewer = review?.isAnonymous ? "Anonymous reviewer" : review ? review.author.displayName : "Customer reviewer"

  return <AdminModal description="Review the customer feedback before deciding whether it remains publicly visible." footer={decision === "REJECTED" ? <><AdminButton disabled={moderationMutation.isPending} onClick={() => setDecision(null)} size="compact" type="button" variant="outline">Back</AdminButton><AdminButton disabled={moderationMutation.isPending || !reason.trim()} onClick={() => void moderateReview("REJECTED")} size="compact" type="button" variant="danger">{moderationMutation.isPending ? "Rejecting…" : "Reject review"}</AdminButton></> : <><AdminButton onClick={() => handleOpenChange(false)} size="compact" type="button" variant="outline">Close</AdminButton><AdminButton disabled={moderationMutation.isPending || !review} onClick={() => void moderateReview("APPROVED")} size="compact" type="button" variant="success">{moderationMutation.isPending ? "Approving…" : "Approve review"}</AdminButton><AdminButton disabled={moderationMutation.isPending || !review} onClick={() => setDecision("REJECTED")} size="compact" type="button" variant="danger">Reject review</AdminButton></>} onOpenChange={handleOpenChange} open={open} size="wide" title={decision === "REJECTED" ? "Reject customer review" : "Moderate customer review"} tone={decision === "REJECTED" ? "danger" : "default"}><div className="space-y-5"><dl className="grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2"><div><dt className="text-[#6b7280]">Business</dt><dd className="mt-1 font-semibold text-[#212121]">{review?.business.displayName ?? "—"}</dd></div><div><dt className="text-[#6b7280]">Reviewer</dt><dd className="mt-1 font-semibold text-[#212121]">{reviewer}</dd></div><div><dt className="text-[#6b7280]">Rating</dt><dd className="mt-1 font-semibold text-[#212121]">{review ? `${review.stars}/5` : "—"}</dd></div><div><dt className="text-[#6b7280]">Current moderation</dt><dd className="mt-1 font-semibold text-[#212121]">{review?.moderationStatus.replaceAll("_", " ") ?? "—"}</dd></div></dl><div className="rounded-xl border border-[#e4eaed] bg-[#f8fafb] p-4"><p className="text-sm leading-6 text-[#343a40]">{review?.text ?? "—"}</p></div>{review?.lastModeration ? <p className="text-sm text-[#6b7280]">Last moderated by {review.lastModeration.moderatedBy === "AI" ? "AI" : "a Minzo administrator"}{review.lastModeration.reason ? `: ${review.lastModeration.reason}` : "."}</p> : null}{decision === "REJECTED" ? <AdminTextareaField description="This reason is recorded in the moderation history and sent to the reviewer." label="Rejection reason" onChange={(event) => setReason(event.target.value)} required value={reason} /> : null}{errorMessage ? <p className="text-sm text-destructive" role="alert">{errorMessage}</p> : null}</div></AdminModal>
}
