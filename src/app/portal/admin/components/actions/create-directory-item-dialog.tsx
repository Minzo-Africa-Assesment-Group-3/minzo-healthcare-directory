"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

import { getAdminCounties, useCreateCityMutation, useCreateCountyMutation } from "../../api"
import { AdminButton } from "../ui"

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

  return <Dialog onOpenChange={onOpenChange} open={open}><DialogContent><DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>Add a location to the directory catalogue.</DialogDescription></DialogHeader><form className="space-y-4" onSubmit={(event) => void submit(event)}>{item === "city" ? <label className="block space-y-1.5"><span className="text-sm font-medium">County</span><select className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm" disabled={countiesQuery.isLoading} onChange={(event) => setCountyId(event.target.value)} required value={countyId}><option value="">Select a county</option>{countiesQuery.data?.data.map((county) => <option key={county.id} value={county.id}>{county.name}</option>)}</select></label> : null}<label className="block space-y-1.5"><span className="text-sm font-medium">Name</span><Input onChange={(event) => setName(event.target.value)} required value={name} /></label>{errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}<DialogFooter><DialogClose render={<AdminButton size="compact" type="button" variant="outline" />}>Cancel</DialogClose><AdminButton disabled={isPending || (item === "city" && !countyId)} size="compact" type="submit">{isPending ? "Saving…" : title}</AdminButton></DialogFooter></form></DialogContent></Dialog>
}
