"use client"

import { useId } from "react"
import type { ComponentProps } from "react"

import { Input } from "@/components/ui/input"
import { cn } from "cn"
import { AdminFormField, getAdminFieldDescribedBy } from "./admin-form-field"

interface AdminTextFieldProps extends Omit<ComponentProps<typeof Input>, "id"> {
  description?: string
  error?: string
  id?: string
  label: string
  required?: boolean
}

export function AdminTextField({
  description,
  error,
  id,
  label,
  required = false,
  className,
  ...inputProps
}: AdminTextFieldProps) {
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
      <Input
        {...inputProps}
        aria-describedby={getAdminFieldDescribedBy(fieldId, description, error)}
        aria-invalid={error ? true : undefined}
        className={cn("h-12 rounded-xl px-4 text-base md:text-base", className)}
        id={fieldId}
      />
    </AdminFormField>
  )
}
