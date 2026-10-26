"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { type AdminCustomerReview, getCustomerReviews } from "../../api"
import { AdminDataTable } from "../../components/data-table"

const columns: ColumnDef<AdminCustomerReview>[] = [
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
  { accessorKey: "moderationStatus", header: "Moderation", cell: ({ row }) => row.original.moderationStatus.replaceAll("_", " ") },
  {
    accessorKey: "submittedAt",
    header: "Submitted",
    cell: ({ row }) => new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(row.original.submittedAt))
  }
]

export default function CustomerReviewsPage() {
  return <AdminDataTable heading="Customer Reviews" columns={columns} emptyMessage="No customer reviews found." extendedFilter={{ enable: true, filters: [{ accessor: "moderationStatus", label: "Moderation status", options: [{ label: "Unreviewed", value: "UNREVIEWED" }, { label: "Approved", value: "APPROVED" }, { label: "Flagged", value: "FLAGGED" }, { label: "Rejected", value: "REJECTED" }], type: "SelectFilter" }] }} fetchData={getCustomerReviews} queryKey={["admin-customer-reviews"]} searchPlaceholder="Search reviews…" />
}
