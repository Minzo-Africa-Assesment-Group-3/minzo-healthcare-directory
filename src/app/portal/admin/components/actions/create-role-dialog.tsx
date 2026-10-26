"use client"

import { useState } from "react"

import { useCreateAdminRoleMutation } from "../../api"
import { AdminTextField, AdminTextareaField } from "../forms"
import { AdminButton, AdminModal } from "../ui"

interface CreateRoleDialogProps {
  onOpenChange: (open: boolean) => void
  open: boolean
}

function formatRoleName(value: string): string {
  return value
    .trimStart()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_/, "")
}

export function CreateRoleDialog({ onOpenChange, open }: CreateRoleDialogProps) {
  const [description, setDescription] = useState("")
  const [name, setName] = useState("")
  const createRoleMutation = useCreateAdminRoleMutation()
  const errorMessage = createRoleMutation.error instanceof Error ? createRoleMutation.error.message : null

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await createRoleMutation.mutateAsync({ name, ...(description ? { description } : {}) })
    setName("")
    setDescription("")
    onOpenChange(false)
  }

  return <AdminModal description="Create a role first, then assign its permissions from the role table." footer={<><AdminButton onClick={() => onOpenChange(false)} size="compact" type="button" variant="outline">Cancel</AdminButton><AdminButton disabled={createRoleMutation.isPending} form="create-role-form" size="compact" type="submit">{createRoleMutation.isPending ? "Creating…" : "Create role"}</AdminButton></>} onOpenChange={onOpenChange} open={open} title="Create role"><form className="space-y-4" id="create-role-form" onSubmit={(event) => void submit(event)}><AdminTextField description="The name is formatted automatically, for example: CONTENT_MODERATOR." label="Role name" onChange={(event) => setName(formatRoleName(event.target.value))} required value={name} /><AdminTextareaField label="Description" onChange={(event) => setDescription(event.target.value)} value={description} />{errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}</form></AdminModal>
}
