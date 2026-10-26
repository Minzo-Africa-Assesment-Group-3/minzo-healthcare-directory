"use client"

import type { ComponentProps } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { Button } from "@/components/ui/button"

const adminButtonVariants = cva("rounded-full font-semibold", {
  variants: {
    variant: {
      primary:
        "bg-[#0C486D] text-white shadow-[0_12px_24px_-8px_rgba(12,72,109,0.35)] hover:bg-[#0a3b5a] focus-visible:ring-[#0C486D]/30",
      secondary:
        "bg-slate-100 text-slate-800 shadow-sm hover:bg-slate-200 focus-visible:ring-slate-400/30",
      success:
        "bg-[#198754] text-white shadow-[0_12px_24px_-8px_rgba(25,135,84,0.3)] hover:bg-[#146c43] focus-visible:ring-[#198754]/30",
      warning:
        "bg-[#ed8b00] text-white shadow-[0_12px_24px_-8px_rgba(237,139,0,0.3)] hover:bg-[#c97500] focus-visible:ring-[#ed8b00]/30",
      danger:
        "bg-red-600 text-white shadow-[0_12px_24px_-8px_rgba(220,38,38,0.3)] hover:bg-red-700 focus-visible:ring-red-600/30",
      outline:
        "border-[#0C486D] bg-white text-[#0C486D] shadow-none hover:bg-[#0C486D]/5 focus-visible:ring-[#0C486D]/30",
      ghost:
        "bg-transparent text-[#0C486D] shadow-none hover:bg-[#0C486D]/10 focus-visible:ring-[#0C486D]/30"
    },
    width: {
      auto: "",
      full: "w-full"
    },
    size: {
      default: "h-14 px-6 text-base",
      compact: "h-10 px-4 text-sm"
    }
  },
  defaultVariants: {
    variant: "primary",
    width: "auto",
    size: "default"
  }
})

interface AdminButtonProps
  extends Omit<ComponentProps<typeof Button>, "size" | "variant">,
    VariantProps<typeof adminButtonVariants> {}

export function AdminButton({ className, size, variant, width, ...props }: AdminButtonProps) {
  return (
    <Button
      {...props}
      variant="default"
      className={cn(adminButtonVariants({ size, variant, width }), className)}
    />
  )
}
