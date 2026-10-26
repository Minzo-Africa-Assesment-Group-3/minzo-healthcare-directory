"use client"

import { useId } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { AdminFormField, getAdminFieldDescribedBy } from "./admin-form-field"

export interface AdminSelectOption {
  label: string
  value: string
}

interface AdminSelectFieldProps {
  description?: string
  disabled?: boolean
  error?: string
  id?: string
  label: string
  onValueChange: (value: string | null) => void
  options: AdminSelectOption[]
  placeholder?: string
  required?: boolean
  value?: string
}

export function AdminSelectField({
  description,
  disabled = false,
  error,
  id,
  label,
  onValueChange,
  options,
  placeholder = "Select an option",
  required = false,
  value
}: AdminSelectFieldProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId

  return (
    <AdminFormField
      description={description}
      error={error}
      htmlFor={fieldId}
      label={label}
      required={required}
    >
      <Select disabled={disabled} onValueChange={onValueChange} value={value}>
        <SelectTrigger
          aria-describedby={getAdminFieldDescribedBy(fieldId, description, error)}
          aria-invalid={error ? true : undefined}
          className="w-full rounded-xl px-4 text-base"
          id={fieldId}
          size="field"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="rounded-xl p-1.5">
          {options.map((option) => (
            <SelectItem className="rounded-lg px-3 py-2 text-base" key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </AdminFormField>
  )
}
