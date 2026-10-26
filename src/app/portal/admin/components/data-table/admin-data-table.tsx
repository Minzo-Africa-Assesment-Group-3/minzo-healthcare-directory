"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { DataTable } from "@/components/data-table"
import type { AdminPaginatedResponse } from "../../api/pagination"
import { AdminButton } from "../ui"

export type { AdminPaginatedResponse, AdminPagination } from "../../api/pagination"

interface AdminDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  emptyMessage?: string
  isLoading?: boolean
  onPageChange: (pageNumber: number) => void
  onPageSizeChange?: (pageSize: number) => void
  onRowClick?: (row: TData) => void
  pageSizeOptions?: number[]
  response?: AdminPaginatedResponse<TData>
}

export function AdminDataTable<TData, TValue>({
  columns,
  emptyMessage = "No results found.",
  isLoading = false,
  onPageChange,
  onPageSizeChange,
  onRowClick,
  pageSizeOptions = [10, 20, 50],
  response
}: AdminDataTableProps<TData, TValue>) {
  const pagination = response?.pagination
  const pageNumber = pagination?.pageNumber ?? 1
  const pageSize = pagination?.pageSize ?? pageSizeOptions[0]
  const totalItems = pagination?.totalItems ?? 0
  const totalPages = pagination?.totalPages ?? 1
  const firstItem = totalItems === 0 ? 0 : (pageNumber - 1) * pageSize + 1
  const lastItem = Math.min(pageNumber * pageSize, totalItems)

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <DataTable
        className="rounded-none border-0"
        columns={columns}
        data={response?.data ?? []}
        emptyMessage={emptyMessage}
        isLoading={isLoading}
        onRowClick={onRowClick}
      />

      <div className="flex flex-col gap-4 border-t px-4 py-4 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Showing {firstItem}–{lastItem} of {totalItems} result{totalItems === 1 ? "" : "s"}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          {onPageSizeChange ? (
            <label className="flex items-center gap-2">
              <span>Rows</span>
              <select
                aria-label="Rows per page"
                className="h-10 rounded-xl border border-input bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#0C486D] focus:ring-2 focus:ring-[#0C486D]/20"
                disabled={isLoading}
                onChange={(event) => onPageSizeChange(Number(event.target.value))}
                value={pageSize}
              >
                {pageSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <span aria-live="polite">
            Page {pageNumber} of {totalPages}
          </span>

          <div className="flex items-center gap-2">
            <AdminButton
              aria-label="Previous page"
              disabled={isLoading || !pagination?.hasPreviousPage}
              onClick={() => onPageChange(pageNumber - 1)}
              size="compact"
              type="button"
              variant="outline"
            >
              <ChevronLeft aria-hidden="true" />
              Previous
            </AdminButton>
            <AdminButton
              aria-label="Next page"
              disabled={isLoading || !pagination?.hasNextPage}
              onClick={() => onPageChange(pageNumber + 1)}
              size="compact"
              type="button"
              variant="outline"
            >
              Next
              <ChevronRight aria-hidden="true" />
            </AdminButton>
          </div>
        </div>
      </div>
    </div>
  )
}
