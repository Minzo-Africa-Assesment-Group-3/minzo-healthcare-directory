"use client"

import type { ReactNode } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const adminModalVariants = cva(
  "gap-5 rounded-2xl border border-[#dce5ea] bg-white p-10 text-[#212121] shadow-[0_24px_60px_-20px_rgba(15,62,91,0.28)]",
  {
    variants: {
      size: {
        compact: "sm:max-w-md",
        default: "sm:max-w-lg",
        wide: "sm:max-w-2xl",
        extraWide: "sm:max-w-4xl"
      },
      tone: {
        default: "",
        danger: "border-[#f3c8c4]"
      }
    },
    defaultVariants: {
      size: "default",
      tone: "default"
    }
  }
)

interface AdminModalProps extends VariantProps<typeof adminModalVariants> {
  children: ReactNode
  className?: string
  description?: string
  footer?: ReactNode
  onOpenChange: (open: boolean) => void
  open: boolean
  title: string
}

export function AdminModal({ children, className, description, footer, onOpenChange, open, size, title, tone }: AdminModalProps) {
  return <Dialog onOpenChange={onOpenChange} open={open}>
    <DialogContent className={cn(adminModalVariants({ size, tone }), className)}>
      <DialogHeader className="gap-1.5 pr-8"><DialogTitle className="text-lg font-semibold text-[#163b56]">{title}
      </DialogTitle>{description ? <DialogDescription className="text-sm leading-6 text-[#65717a]">{description}</DialogDescription> : null}
      </DialogHeader>{children}{footer ? <DialogFooter className="-mx-6 -mb-6 rounded-b-2xl border-[#e7edf0] bg-[#f8fafb] px-6 py-4">{footer}</DialogFooter> : null}</DialogContent>
  </Dialog>
}
