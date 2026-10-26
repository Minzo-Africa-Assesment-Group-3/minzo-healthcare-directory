"use client"

import { useId } from "react"
import type { ComponentProps } from "react"

import { Textarea } from "@/components/ui/textarea"
import { cn } from "cn"

import { AdminFormField, getAdminFieldDescribedBy } from "./admin-form-field"

interface AdminTextareaFieldProps extends Omit<ComponentProps<typeof Textarea>, "id"> {
  description?: string
  error?: string
  id?: string
  label: string
  required?: boolean
}

export function AdminTextareaField({ description, error, id, label, required = false, className, ...textareaProps }: AdminTextareaFieldProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId

  return <AdminFormField description={description} error={error} htmlFor={fieldId} label={label} required={required}><Textarea {...textareaProps} aria-describedby={getAdminFieldDescribedBy(fieldId, description, error)} aria-invalid={error ? true : undefined} className={cn("min-h-28 rounded-xl px-4 py-3 text-base md:text-base", className)} id={fieldId} /></AdminFormField>
}
