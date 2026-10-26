"use client"

import { useState } from "react"

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAdminRolesQuery, useInviteAdministratorMutation } from "../../api"
import { AdminSelectField, AdminTextField } from "../forms"
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

  return <Dialog onOpenChange={onOpenChange} open={open}><DialogContent><DialogHeader><DialogTitle>Invite administrator</DialogTitle><DialogDescription>Send an email invitation and assign the administrator’s initial role.</DialogDescription></DialogHeader><form className="space-y-4" onSubmit={(event) => void submit(event)}><AdminTextField label="Display name" onChange={(event) => setDisplayName(event.target.value)} required value={displayName} /><AdminTextField label="Email address" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} /><AdminSelectField disabled={rolesQuery.isLoading} label="Role" onValueChange={(value) => setRoleName(value ?? "")} options={rolesQuery.data?.map((role) => ({ label: role.name, value: role.name })) ?? []} placeholder="Select a role" required value={roleName} />{errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}<DialogFooter><DialogClose render={<AdminButton size="compact" type="button" variant="outline" />}>Cancel</DialogClose><AdminButton disabled={inviteMutation.isPending || !roleName} size="compact" type="submit">{inviteMutation.isPending ? "Sending…" : "Send invitation"}</AdminButton></DialogFooter></form></DialogContent></Dialog>
}
