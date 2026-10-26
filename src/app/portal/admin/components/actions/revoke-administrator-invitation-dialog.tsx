"use client"

import { useState } from "react"

import { type AdminInvitation, useRevokeAdministratorInvitationMutation } from "../../api"
import { AdminButton, AdminModal } from "../ui"

interface RevokeAdministratorInvitationDialogProps {
  invitation: AdminInvitation | null
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function RevokeAdministratorInvitationDialog({ invitation, onOpenChange, open }: RevokeAdministratorInvitationDialogProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const revokeMutation = useRevokeAdministratorInvitationMutation()

  async function revokeInvitation() {
    if (!invitation) return

    setErrorMessage(null)

    try {
      await revokeMutation.mutateAsync(invitation.id)
      onOpenChange(false)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "The administrator invitation could not be revoked.")
    }
  }

  return <AdminModal description={`The invitation sent to ${invitation?.email ?? "this administrator"} will no longer be usable.`} footer={<><AdminButton onClick={() => onOpenChange(false)} size="compact" type="button" variant="outline">Keep invitation</AdminButton><AdminButton disabled={revokeMutation.isPending || !invitation} onClick={() => void revokeInvitation()} size="compact" type="button" variant="danger">{revokeMutation.isPending ? "Revoking…" : "Revoke invitation"}</AdminButton></>} onOpenChange={onOpenChange} open={open} title="Revoke administrator invitation" tone="danger"><div className="space-y-2"><p className="text-sm leading-6 text-[#4b5563]">The invited administrator will not be able to use the existing link to create an account.</p>{errorMessage ? <p className="text-sm text-destructive" role="alert">{errorMessage}</p> : null}</div></AdminModal>
}
