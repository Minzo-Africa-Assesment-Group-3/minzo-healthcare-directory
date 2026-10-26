"use client"

import { useId, useState } from "react"
import type { ComponentProps } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "cn"
import { AdminFormField, getAdminFieldDescribedBy } from "./admin-form-field"

interface AdminPasswordFieldProps extends Omit<ComponentProps<typeof Input>, "id" | "type"> {
  description?: string
  error?: string
  id?: string
  label?: string
  required?: boolean
}

export function AdminPasswordField({
  description,
  error,
  id,
  label = "Password",
  required = false,
  className,
  ...inputProps
}: AdminPasswordFieldProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const [visible, setVisible] = useState(false)

  return (
    <AdminFormField
      description={description}
      error={error}
      htmlFor={fieldId}
      label={label}
      required={required}
    >
      <div className="relative">
        <Input
          {...inputProps}
          aria-describedby={getAdminFieldDescribedBy(fieldId, description, error)}
          aria-invalid={error ? true : undefined}
          className={cn("h-12 rounded-xl px-4 pr-12 text-base md:text-base", className)}
          id={fieldId}
          type={visible ? "text" : "password"}
        />
        <Button
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute top-0 right-0 text-muted-foreground hover:text-foreground"
          onClick={() => setVisible((current) => !current)}
          size="icon"
          type="button"
          variant="ghost"
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </Button>
      </div>
    </AdminFormField>
  )
}
