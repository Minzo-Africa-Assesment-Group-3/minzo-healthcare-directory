"use client"

import { useState } from "react"

import { useAdminRolesQuery, useInviteAdministratorMutation } from "../../api"
import { AdminSelectField, AdminTextField } from "../forms"
import { AdminButton, AdminModal } from "../ui"

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

  return <AdminModal description="Send an email invitation and assign the administrator’s initial role." footer={<><AdminButton onClick={() => onOpenChange(false)} size="compact" type="button" variant="outline">Cancel</AdminButton><AdminButton disabled={inviteMutation.isPending || !roleName} form="invite-administrator-form" size="compact" type="submit">{inviteMutation.isPending ? "Sending…" : "Send invitation"}</AdminButton></>} onOpenChange={onOpenChange} open={open} title="Invite administrator"><form className="space-y-4" id="invite-administrator-form" onSubmit={(event) => void submit(event)}><AdminTextField label="Display name" onChange={(event) => setDisplayName(event.target.value)} required value={displayName} /><AdminTextField label="Email address" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} /><AdminSelectField disabled={rolesQuery.isLoading} label="Role" onValueChange={(value) => setRoleName(value ?? "")} options={rolesQuery.data?.map((role) => ({ label: role.name, value: role.name })) ?? []} placeholder="Select a role" required value={roleName} />{errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}</form></AdminModal>
}
