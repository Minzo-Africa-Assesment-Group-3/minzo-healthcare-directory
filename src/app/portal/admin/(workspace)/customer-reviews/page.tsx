"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"

import { type AdminCustomerReview, getCustomerReviews } from "../../api"
import { ModerateCustomerReviewDialog } from "../../components/actions"
import { AdminDataTable } from "../../components/data-table"
import { AdminButton } from "../../components/ui"

const moderationStatusClasses = {
  UNREVIEWED: "bg-[#fff3cd] text-[#9a6700]",
  APPROVED: "bg-[#dff3e5] text-[#146c43]",
  FLAGGED: "bg-[#e8eefb] text-[#1d4ed8]",
  REJECTED: "bg-[#fce8e6] text-[#b42318]"
} as const

function createColumns(onModerate: (review: AdminCustomerReview) => void): ColumnDef<AdminCustomerReview>[] {
  return [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => (
      <span className="text-sm text-[#757575]">{row?.index + 1}</span>
    ),
  },
  { accessorKey: "business.displayName", header: "Business" },
  {
    id: "author",
    header: "Reviewer",
    cell: ({ row }) => row.original.isAnonymous ? "Anonymous" : row.original.author.displayName
  },
  { accessorKey: "stars", header: "Rating", cell: ({ row }) => `${row.original.stars}/5` },
  { accessorKey: "text", header: "Review", cell: ({ row }) => <p className="max-w-md truncate">{row.original.text}</p> },
  { accessorKey: "moderationStatus", header: "Moderation", cell: ({ row }) => <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${moderationStatusClasses[row.original.moderationStatus]}`}>{row.original.moderationStatus.replaceAll("_", " ")}</span> },
  {
    accessorKey: "submittedAt",
    header: "Submitted",
    cell: ({ row }) => new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(row.original.submittedAt))
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => <AdminButton onClick={(event) => { event.stopPropagation(); onModerate(row.original) }} size="compact" type="button" variant="outline">Moderate</AdminButton>
  }
]
}

export default function CustomerReviewsPage() {
  const [reviewToModerate, setReviewToModerate] = useState<AdminCustomerReview | null>(null)
  const columns = createColumns(setReviewToModerate)

  return <><AdminDataTable heading="Customer Reviews" columns={columns} emptyMessage="No customer reviews found." extendedFilter={{ enable: true, filters: [{ accessor: "moderationStatus", label: "Moderation status", options: [{ label: "Unreviewed", value: "UNREVIEWED" }, { label: "Approved", value: "APPROVED" }, { label: "Flagged", value: "FLAGGED" }, { label: "Rejected", value: "REJECTED" }], type: "SelectFilter" }] }} fetchData={getCustomerReviews} queryKey={["admin-customer-reviews"]} searchPlaceholder="Search reviews…" /><ModerateCustomerReviewDialog onOpenChange={(open) => { if (!open) setReviewToModerate(null) }} open={Boolean(reviewToModerate)} review={reviewToModerate} /></>
}
