"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { getAdminCounties, useCreateCityMutation, useCreateCountyMutation } from "../../api"
import { AdminSelectField, AdminTextField } from "../forms"
import { AdminButton, AdminModal } from "../ui"

interface CreateDirectoryItemDialogProps {
  item: "city" | "county"
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function CreateDirectoryItemDialog({ item, onOpenChange, open }: CreateDirectoryItemDialogProps) {
  const [countyId, setCountyId] = useState("")
  const [name, setName] = useState("")
  const countiesQuery = useQuery({ queryKey: ["admin-counties", "all"], queryFn: () => getAdminCounties({ pageNumber: 1, pageSize: 20 }), enabled: item === "city" && open })
  const createCountyMutation = useCreateCountyMutation()
  const createCityMutation = useCreateCityMutation()
  const isPending = createCountyMutation.isPending || createCityMutation.isPending
  const mutationError = createCountyMutation.error ?? createCityMutation.error
  const errorMessage = mutationError instanceof Error ? mutationError.message : null

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (item === "county") await createCountyMutation.mutateAsync({ name })
    else await createCityMutation.mutateAsync({ countyId, name })
    setName("")
    setCountyId("")
    onOpenChange(false)
  }

  const title = item === "county" ? "Add county" : "Add city or town"

  return <AdminModal description="Add a location to the directory catalogue." footer={<><AdminButton onClick={() => onOpenChange(false)} size="compact" type="button" variant="outline">Cancel</AdminButton><AdminButton disabled={isPending || (item === "city" && !countyId)} form="create-directory-item-form" size="compact" type="submit">{isPending ? "Saving…" : title}</AdminButton></>} onOpenChange={onOpenChange} open={open} title={title}><form className="space-y-4" id="create-directory-item-form" onSubmit={(event) => void submit(event)}>{item === "city" ? <AdminSelectField disabled={countiesQuery.isLoading} label="County" onValueChange={(value) => setCountyId(value ?? "")} options={countiesQuery.data?.data.map((county) => ({ label: county.name, value: county.id })) ?? []} placeholder="Select a county" required value={countyId} /> : null}<AdminTextField label="Name" onChange={(event) => setName(event.target.value)} required value={name} />{errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}</form></AdminModal>
}
