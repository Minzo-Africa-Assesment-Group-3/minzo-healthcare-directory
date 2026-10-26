import type { ReactNode } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { Label } from "@/components/ui/label"

const adminFormFieldVariants = cva("grid", {
  variants: {
    spacing: {
      default: "gap-2",
      compact: "gap-1"
    }
  },
  defaultVariants: {
    spacing: "default"
  }
})

interface AdminFormFieldProps extends VariantProps<typeof adminFormFieldVariants> {
  children: ReactNode
  className?: string
  description?: string
  error?: string
  htmlFor: string
  label: string
  required?: boolean
}

export function AdminFormField({
  children,
  className,
  description,
  error,
  htmlFor,
  label,
  required = false,
  spacing
}: AdminFormFieldProps) {
  const descriptionId = description ? `${htmlFor}-description` : undefined
  const errorId = error ? `${htmlFor}-error` : undefined

  return (
    <div className={cn(adminFormFieldVariants({ spacing }), className)}>
      <Label className="text-sm font-semibold text-[#343a40]" htmlFor={htmlFor}>
        {label}
        {required ? <span className="text-destructive">*</span> : null}
      </Label>
      {description ? (
        <p id={descriptionId} className="text-sm leading-5 text-muted-foreground">
          {description}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function getAdminFieldDescribedBy(id: string, description?: string, error?: string): string | undefined {
  const ids = [description ? `${id}-description` : undefined, error ? `${id}-error` : undefined].filter(Boolean)

  return ids.length > 0 ? ids.join(" ") : undefined
}
