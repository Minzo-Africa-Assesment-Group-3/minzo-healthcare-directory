"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { type AdminAuditLog, getAuditLogs } from "../../api"
import { AdminDataTable } from "../../components/data-table"

const columns: ColumnDef<AdminAuditLog>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => (
      <span className="text-sm text-[#757575]">{row?.index + 1}</span>
    ),
  },
  { accessorKey: "action", header: "Action", cell: ({ row }) => row.original.action.replaceAll("_", " ") },
  { id: "entity", header: "Entity", cell: ({ row }) => `${row.original.entity.type} · ${row.original.entity.id}` },
  { id: "actor", header: "Actor", cell: ({ row }) => row.original.actor.admin?.displayName ?? row.original.actor.reference ?? row.original.actor.type },
  {
    accessorKey: "createdAt",
    header: "When",
    cell: ({ row }) => new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(row.original.createdAt))
  }
]

export default function AuditLogsPage() {
  return <AdminDataTable columns={columns} emptyMessage="No audit logs found." extendedFilter={{ enable: true, filters: [{ accessor: "actorType", label: "Actor type", options: [{ label: "Administrator", value: "ADMIN" }, { label: "Automation", value: "AUTOMATION" }], type: "SelectFilter" }, { accessor: "action", label: "Action", placeholder: "For example: BUSINESS_APPROVED", type: "TextFilter" }, { accessor: "entityType", label: "Entity type", placeholder: "For example: BUSINESS", type: "TextFilter" }, { accessor: "entityId", label: "Entity ID", placeholder: "Enter an ID", type: "TextFilter" }] }} fetchData={getAuditLogs} queryKey={["admin-audit-logs"]} showSearch={false} />
}
