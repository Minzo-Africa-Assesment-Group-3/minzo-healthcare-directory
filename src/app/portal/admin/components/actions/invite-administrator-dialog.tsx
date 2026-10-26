"use client"

import { useState } from "react"

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

import { useAdminRolesQuery, useInviteAdministratorMutation } from "../../api"
import { AdminButton } from "../ui"

interface InviteAdministratorDialogProps {
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function InviteAdministratorDialog({ onOpenChange, open }: InviteAdministratorDialogProps) {
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [roleName, setRoleName] = useState("")
  const rolesQuery = useAdminRolesQuery()
  const inviteMutation = useInviteAdministratorMutation()
  const errorMessage = inviteMutation.error instanceof Error ? inviteMutation.error.message : null

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await inviteMutation.mutateAsync({ displayName, email, roleName })
    setDisplayName("")
    setEmail("")
    setRoleName("")
    onOpenChange(false)
  }

  return <Dialog onOpenChange={onOpenChange} open={open}><DialogContent><DialogHeader><DialogTitle>Invite administrator</DialogTitle><DialogDescription>Send an email invitation and assign the administrator’s initial role.</DialogDescription></DialogHeader><form className="space-y-4" onSubmit={(event) => void submit(event)}><label className="block space-y-1.5"><span className="text-sm font-medium">Display name</span><Input onChange={(event) => setDisplayName(event.target.value)} required value={displayName} /></label><label className="block space-y-1.5"><span className="text-sm font-medium">Email address</span><Input onChange={(event) => setEmail(event.target.value)} required type="email" value={email} /></label><label className="block space-y-1.5"><span className="text-sm font-medium">Role</span><select className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm" disabled={rolesQuery.isLoading} onChange={(event) => setRoleName(event.target.value)} required value={roleName}><option value="">Select a role</option>{rolesQuery.data?.map((role) => <option key={role.id} value={role.name}>{role.name}</option>)}</select></label>{errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}<DialogFooter><DialogClose render={<AdminButton size="compact" type="button" variant="outline" />}>Cancel</DialogClose><AdminButton disabled={inviteMutation.isPending || !roleName} size="compact" type="submit">{inviteMutation.isPending ? "Sending…" : "Send invitation"}</AdminButton></DialogFooter></form></DialogContent></Dialog>
}
