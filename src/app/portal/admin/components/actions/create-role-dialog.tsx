"use client"

import { useState } from "react"

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { useCreateAdminRoleMutation } from "../../api"
import { AdminButton } from "../ui"

interface CreateRoleDialogProps {
  onOpenChange: (open: boolean) => void
  open: boolean
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

  return <Dialog onOpenChange={onOpenChange} open={open}><DialogContent><DialogHeader><DialogTitle>Create role</DialogTitle><DialogDescription>Create a role first, then assign its permissions from the role table.</DialogDescription></DialogHeader><form className="space-y-4" onSubmit={(event) => void submit(event)}><label className="block space-y-1.5"><span className="text-sm font-medium">Role name</span><Input onChange={(event) => setName(event.target.value)} required value={name} /></label><label className="block space-y-1.5"><span className="text-sm font-medium">Description</span><Textarea onChange={(event) => setDescription(event.target.value)} value={description} /></label>{errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}<DialogFooter><DialogClose render={<AdminButton size="compact" type="button" variant="outline" />}>Cancel</DialogClose><AdminButton disabled={createRoleMutation.isPending} size="compact" type="submit">{createRoleMutation.isPending ? "Creating…" : "Create role"}</AdminButton></DialogFooter></form></DialogContent></Dialog>
}
