"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"

import { type AdminCity, type AdminCounty, getAdminCities, getAdminCounties } from "../../api"
import { CreateDirectoryItemDialog } from "../../components/actions"
import { AdminButton } from "../../components/ui"
import { AdminDataTable } from "../../components/data-table"

const countyColumns: ColumnDef<AdminCounty>[] = [
  { accessorKey: "name", header: "County" },
  { accessorKey: "slug", header: "Slug" },
  { accessorKey: "isActive", header: "Status", cell: ({ row }) => row.original.isActive ? "Active" : "Inactive" }
]

const cityColumns: ColumnDef<AdminCity>[] = [
  { accessorKey: "name", header: "City or town" },
  { accessorKey: "slug", header: "Slug" },
  { accessorKey: "countyId", header: "County ID" },
  { accessorKey: "isActive", header: "Status", cell: ({ row }) => row.original.isActive ? "Active" : "Inactive" }
]

export default function DirectoryPage() {
  const [catalogue, setCatalogue] = useState<"counties" | "cities">("counties")
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  return <div className="space-y-5"><div className="flex gap-2"><AdminButton onClick={() => setCatalogue("counties")} type="button" variant={catalogue === "counties" ? "primary" : "outline"}>Counties</AdminButton><AdminButton onClick={() => setCatalogue("cities")} type="button" variant={catalogue === "cities" ? "primary" : "outline"}>Cities & towns</AdminButton></div>{catalogue === "counties" ? <AdminDataTable actionLabel="Add county" columns={countyColumns} emptyMessage="No counties found." fetchData={getAdminCounties} hasAction onAction={() => setIsCreateOpen(true)} queryKey={["admin-counties"]} searchPlaceholder="Search counties…" /> : <AdminDataTable actionLabel="Add city or town" columns={cityColumns} emptyMessage="No cities or towns found." fetchData={getAdminCities} hasAction onAction={() => setIsCreateOpen(true)} queryKey={["admin-cities"]} searchPlaceholder="Search cities…" />}{<CreateDirectoryItemDialog item={catalogue === "counties" ? "county" : "city"} onOpenChange={setIsCreateOpen} open={isCreateOpen} />}</div>
}
