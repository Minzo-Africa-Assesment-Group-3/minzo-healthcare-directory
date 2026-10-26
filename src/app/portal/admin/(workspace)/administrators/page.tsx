"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"

import { type AdminAdministrator, type AdminInvitation, getAdminInvitations, getPagedAdministrators } from "../../api"
import { InviteAdministratorDialog, RevokeAdministratorInvitationDialog } from "../../components/actions"
import { AdminDataTable } from "../../components/data-table"
import { AdminButton } from "../../components/ui"

const columns: ColumnDef<AdminAdministrator>[] = [
  {
    accessorKey: "displayName",
    header: "Administrator",
    cell: ({ row }) => <div><p className="font-medium text-[#212121]">{row.original.displayName}</p><p className="text-xs text-[#757575]">{row.original.email}</p></div>
  },
  { id: "roles", header: "Roles", cell: ({ row }) => row.original.roles.map((role) => role.name).join(", ") || "—" },
  { accessorKey: "status", header: "Status" }
]

const invitationStatuses = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Revoked", value: "REVOKED" }
] as const

type InvitationStatusTab = typeof invitationStatuses[number]["value"]

const invitationStatusClasses = {
  PENDING: "bg-[#fff3cd] text-[#9a6700]",
  ACCEPTED: "bg-[#dff3e5] text-[#146c43]",
  REVOKED: "bg-[#fce8e6] text-[#b42318]"
} as const

function createInvitationColumns(onRevoke: (invitation: AdminInvitation) => void): ColumnDef<AdminInvitation>[] {
  return [
    {
      accessorKey: "displayName",
      header: "Invited administrator",
      cell: ({ row }) => <div><p className="font-medium text-[#212121]">{row.original.displayName}</p><p className="text-xs text-[#757575]">{row.original.email}</p></div>
    },
    { id: "role", header: "Role", cell: ({ row }) => row.original.role.name },
    { id: "invitedBy", header: "Invited by", cell: ({ row }) => row.original.invitedBy.displayName },
    {
      accessorKey: "expiresAt",
      header: "Expires",
      cell: ({ row }) => new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(row.original.expiresAt))
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${invitationStatusClasses[row.original.status]}`}>{row.original.status}</span>
    },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => row.original.status === "PENDING" ? <AdminButton onClick={(event) => { event.stopPropagation(); onRevoke(row.original) }} size="compact" type="button" variant="danger">Revoke</AdminButton> : "—"
    }
  ]
}

export default function AdministratorsPage() {
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"administrators" | "invitations">("administrators")
  const [invitationStatus, setInvitationStatus] = useState<InvitationStatusTab>("ALL")
  const [invitationToRevoke, setInvitationToRevoke] = useState<AdminInvitation | null>(null)
  const invitationColumns = createInvitationColumns(setInvitationToRevoke)

  return <div className="space-y-5"><div aria-label="Administrator management section" className="flex flex-wrap gap-2" role="tablist"><AdminButton aria-selected={activeTab === "administrators"} onClick={() => setActiveTab("administrators")} role="tab" size="compact" type="button" variant={activeTab === "administrators" ? "primary" : "outline"}>Administrators</AdminButton><AdminButton aria-selected={activeTab === "invitations"} onClick={() => setActiveTab("invitations")} role="tab" size="compact" type="button" variant={activeTab === "invitations" ? "primary" : "outline"}>Pending Invitations</AdminButton></div>{activeTab === "administrators" ? <AdminDataTable actionLabel="Invite administrator" columns={columns} emptyMessage="No administrators found." fetchData={getPagedAdministrators} hasAction onAction={() => setIsInviteOpen(true)} queryKey={["admin-administrators"]} searchPlaceholder="Search administrators…" /> : <><div aria-label="Invitation status" className="flex flex-wrap gap-2" role="tablist">{invitationStatuses.map((tab) => <AdminButton aria-selected={invitationStatus === tab.value} className={invitationStatus !== tab.value ? "opacity-70 hover:opacity-100" : undefined} key={tab.value} onClick={() => setInvitationStatus(tab.value)} role="tab" size="compact" type="button" variant={invitationStatus === tab.value ? "primary" : "outline"}>{tab.label}</AdminButton>)}</div><AdminDataTable actionLabel="Invite administrator" columns={invitationColumns} emptyMessage="No administrator invitations found." fetchData={getAdminInvitations} hasAction onAction={() => setIsInviteOpen(true)} filters={invitationStatus === "ALL" ? {} : { status: invitationStatus }} queryKey={["admin-invitations"]} searchPlaceholder="Search invitations…" /></>}<InviteAdministratorDialog onOpenChange={setIsInviteOpen} open={isInviteOpen} /><RevokeAdministratorInvitationDialog invitation={invitationToRevoke} onOpenChange={(open) => { if (!open) setInvitationToRevoke(null) }} open={Boolean(invitationToRevoke)} /></div>
}
