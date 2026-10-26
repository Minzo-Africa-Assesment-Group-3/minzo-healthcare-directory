"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"

import { type AdminAdministrator, getPagedAdministrators } from "../../api"
import { InviteAdministratorDialog } from "../../components/actions"
import { AdminDataTable } from "../../components/data-table"

const columns: ColumnDef<AdminAdministrator>[] = [
  {
    accessorKey: "displayName",
    header: "Administrator",
    cell: ({ row }) => <div><p className="font-medium text-[#212121]">{row.original.displayName}</p><p className="text-xs text-[#757575]">{row.original.email}</p></div>
  },
  { id: "roles", header: "Roles", cell: ({ row }) => row.original.roles.map((role) => role.name).join(", ") || "—" },
  { accessorKey: "status", header: "Status" }
]

export default function AdministratorsPage() {
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  return <><AdminDataTable actionLabel="Invite administrator" columns={columns} emptyMessage="No administrators found." fetchData={getPagedAdministrators} hasAction onAction={() => setIsInviteOpen(true)} queryKey={["admin-administrators"]} searchPlaceholder="Search administrators…" /><InviteAdministratorDialog onOpenChange={setIsInviteOpen} open={isInviteOpen} /></>
}
