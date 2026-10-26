'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { AdminBusinessRegistration, getAdminBusinessRegistrations } from "../../api"
import { AdminDataTable } from "../../components/data-table"
import { AdminButton } from "../../components/ui"
import Link from "next/link"

const registrationStatuses = [
  { label: "All", value: "ALL", variant: "secondary" },
  { label: "Pending Approval", value: "PENDING_APPROVAL", variant: "warning" },
  { label: "Approved", value: "APPROVED", variant: "success" },
  { label: "Rejected", value: "REJECTED", variant: "danger" }
] as const

type RegistrationStatusTab = typeof registrationStatuses[number]["value"]

const registrationStatusClasses = {
  PENDING_APPROVAL: "bg-[#fff3cd] text-[#9a6700]",
  APPROVED: "bg-[#dff3e5] text-[#146c43]",
  REJECTED: "bg-[#fce8e6] text-[#b42318]"
} as const

const columns: ColumnDef<AdminBusinessRegistration>[] = [
  {
    accessorKey: "id",
    header: "Reg #",
    cell: ({ row }) => (
      <span className="text-sm text-[#757575]">{row.original.registrationNumber}</span>
    ),
  },
  {
    accessorKey: "displayName",
    header: "Business Name",
    cell: ({ row }) => {
      return <div>
        <p className="font-medium text-[#212121]">
          {row.original.displayName}
        </p>
        <p className="text-xs text-[#757575]">
          {row.original.primaryLocation?.cityOrTown ??
            row.original.primaryLocation?.county ??
            "No location"}
        </p>
      </div>
    }
  },
  {
    id: "owner",
    header: "Owner",
    cell: ({ row }) =>
      row.original.members.find((member) => member.role === "OWNER")?.user
        .displayName ?? "—",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${registrationStatusClasses[row.original.status]}`}>
        {row.original.status.replaceAll("_", " ")}
      </span>
    ),
  },
  {
    accessorKey: "submittedAt",
    header: "Submitted",
    cell: ({ row }) =>
      row.original.submittedAt
        ? new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(new Date(row.original.submittedAt))
        : "—",
  },
  {
    accessorKey: "",
    header: "Action",
    cell: ({ row }) => row.original.id ?
      <Link
        id={row.original.id}
        href={`/portal/admin/businesses/${row.original.id}`}
        className=" underline text-primary-blue font-sm"
        >
        View </Link>
      : "—",
  },
]

export default function BusinessRegistrationsPage() {
  const router = useRouter()
  const [status, setStatus] = useState<RegistrationStatusTab>("ALL")

  return (
    <div className="space-y-5">
      <div aria-label="Business registration status" className="flex flex-wrap gap-2" role="tablist">
        {registrationStatuses.map((tab) => <AdminButton aria-selected={status === tab.value} className={status !== tab.value ? "opacity-70 hover:opacity-100" : undefined} key={tab.value} onClick={() => setStatus(tab.value)} role="tab" size="compact" type="button" variant={status === tab.value ? tab.variant : "outline"}>{tab.label}</AdminButton>)}
      </div>
      <AdminDataTable
      heading="Business Registrations List"
      columns={columns}
      emptyMessage="No business registrations found."
      fetchData={getAdminBusinessRegistrations}
      filters={status === "ALL" ? {} : { status }}
      queryKey={["admin-business-registrations"]}
      searchPlaceholder="Search business registrations…"
      onRowClick={(business) => router.push(`/portal/admin/businesses/${business.id}`)}
      />
    </div>
  )
}
