"use client"

import { useRouter } from "next/navigation"
import type { ColumnDef } from "@tanstack/react-table"

import { type AdminBusinessClaim, getAdminBusinessClaims } from "../../api"
import { AdminDataTable } from "../../components/data-table"

const columns: ColumnDef<AdminBusinessClaim>[] = [
  { accessorKey: "business.displayName", header: "Business" },
  {
    id: "claimant",
    header: "Claimant",
    cell: ({ row }) => <div><p className="font-medium text-[#212121]">{row.original.claimant.displayName}</p><p className="text-xs text-[#757575]">{row.original.claimant.email}</p></div>
  },
  { accessorKey: "requestedRole", header: "Requested role" },
  { accessorKey: "status", header: "Status", cell: ({ row }) => row.original.status.replaceAll("_", " ") },
  {
    accessorKey: "createdAt",
    header: "Submitted",
    cell: ({ row }) => new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(row.original.createdAt))
  }
]

export default function BusinessClaimsPage() {
  const router = useRouter()

  return <AdminDataTable columns={columns} emptyMessage="No business claims found." extendedFilter={{ enable: true, filters: [{ accessor: "status", label: "Claim status", options: [{ label: "Pending", value: "PENDING" }, { label: "Approved", value: "APPROVED" }, { label: "Rejected", value: "REJECTED" }], type: "SelectFilter" }] }} fetchData={getAdminBusinessClaims} onRowClick={(claim) => router.push(`/portal/admin/business-claims/${claim.id}`)} queryKey={["admin-business-claims"]} showSearch={false} />
}
