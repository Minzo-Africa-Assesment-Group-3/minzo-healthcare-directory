'use client'

import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { AdminBusinessRegistration, getAdminBusinessRegistrations } from "../../api"
import { AdminDataTable } from "../../components/data-table"
import Link from "next/link"


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
      <span className="text-sm">
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

  return (
    <AdminDataTable
      heading="Business Registrations List"
      columns={columns}
      emptyMessage="No business registrations found."
      fetchData={getAdminBusinessRegistrations}
      queryKey={["admin-business-registrations"]}
      searchPlaceholder="Search business registrations…"
      onRowClick={(business) => router.push(`/portal/admin/businesses/${business.id}`)}
      isFilterVisibleOnStart
      extendedFilter={{
        enable: true,
        filters: [
          {
            accessor: "status",
            label: "Registration status",
            options: [
              { label: "Pending approval", value: "PENDING_APPROVAL" },
              { label: "Approved", value: "APPROVED" },
              { label: "Rejected", value: "REJECTED" }
            ],
            type: "SelectFilter"
          }
        ]
      }}
    />
  )
}
