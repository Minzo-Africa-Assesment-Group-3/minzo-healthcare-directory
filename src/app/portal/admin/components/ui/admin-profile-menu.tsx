"use client"

import { useState } from "react"
import { Icon } from "@iconify/react"
import { useRouter } from "next/navigation"

import { notify } from "@/lib/toast"

type AdminProfileMenuVariant = "header" | "sidebar"

const fallbackEmail = "Email unavailable"

export function AdminProfileMenu({ variant }: { variant: AdminProfileMenuVariant }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [email] = useState(() => {
    if (typeof window === "undefined") return fallbackEmail

    return globalThis.sessionStorage.getItem("minzo-admin-email") ?? fallbackEmail
  })

  async function handleLogout() {
    await fetch("/api/admin-auth/logout", { method: "POST", credentials: "include" }).catch(() => undefined)
    notify.success("You have been signed out.")
    router.replace("/portal/admin/login")
  }

  const isHeader = variant === "header"

  return (
    <div className={`relative ${isHeader ? "" : "w-full"}`}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={isHeader ? "Open administrator menu" : "Open administrator profile menu"}
        className={isHeader ? "flex size-8 items-center justify-center rounded-2xl bg-[#e7edf0] text-[#0c486d] hover:bg-[#dbe4e9]" : "flex w-full items-center justify-between rounded-lg text-left"}
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {isHeader ? <Icon icon="bi:person-fill" width={20} /> : <><span className="flex items-center gap-3"><span className="flex size-12 items-center justify-center rounded-full bg-[#0c486d] text-base font-semibold text-[#f5f5f5]">AD</span><span className="min-w-0"><span className="block truncate text-base font-semibold leading-6 text-[#0c486d]">Admin User</span><span className="block text-sm leading-5 text-[#6c757d]">Super Admin</span></span></span><Icon aria-hidden="true" icon={open ? "basil:caret-up-outline" : "basil:caret-down-outline"} width={20} /></>}
      </button>

      {open ? <div className={`absolute z-50 w-72 rounded-xl border border-[#e0e0e0] bg-white p-2 shadow-[0_12px_30px_rgba(12,72,109,0.14)] ${isHeader ? "right-0 top-[calc(100%+8px)]" : "bottom-[calc(100%+12px)] left-0"}`} role="menu">
        <div className="flex items-center gap-3 px-3 py-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#0c486d] text-sm font-semibold text-white">AD</div><div className="min-w-0"><p className="truncate text-sm font-semibold text-[#0c486d]">Admin User</p><p className="text-xs text-[#6c757d]">Super Admin</p><p className="mt-1 truncate text-xs text-[#6c757d]">{email}</p></div></div>
        <div className="border-t border-[#e0e0e0] pt-2"><button className="flex h-10 w-full items-center gap-2 rounded-lg px-3 text-sm font-medium text-[#212121] hover:bg-red-50 hover:text-red-600" onClick={handleLogout} role="menuitem" type="button"><Icon icon="solar:logout-2-outline" width={19} />Log out</button></div>
      </div> : null}
    </div>
  )
}
