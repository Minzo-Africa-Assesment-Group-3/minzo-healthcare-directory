"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"

import { type AdminRole, getPagedRoles } from "../../api"
import { CreateRoleDialog } from "../../components/actions"
import { AdminDataTable } from "../../components/data-table"

const columns: ColumnDef<AdminRole>[] = [
  { accessorKey: "name", header: "Role" },
  { accessorKey: "description", header: "Description", cell: ({ row }) => row.original.description ?? "—" },
  { id: "permissionCount", header: "Permissions", cell: ({ row }) => row.original.permissions.length },
  { accessorKey: "isSystem", header: "Type", cell: ({ row }) => row.original.isSystem ? "System" : "Custom" }
]

export default function AccessControlPage() {
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false)

  return <><AdminDataTable actionLabel="Create role" columns={columns} emptyMessage="No roles found." fetchData={getPagedRoles} hasAction onAction={() => setIsCreateRoleOpen(true)} queryKey={["admin-roles"]} searchPlaceholder="Search roles…" /><CreateRoleDialog onOpenChange={setIsCreateRoleOpen} open={isCreateRoleOpen} /></>
}
