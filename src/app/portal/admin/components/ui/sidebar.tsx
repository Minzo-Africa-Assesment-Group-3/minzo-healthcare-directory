"use client"

import Image from "next/image"
import Link from "next/link"
import { Icon } from "@iconify/react"
import { usePathname } from "next/navigation"
import { ADMIN_NAVIGATION_ITEMS } from "./portal-nav-items"
import { AdminProfileMenu } from "./admin-profile-menu"

interface AdminSidebarProps {
  collapsed: boolean
  mobileOpen: boolean
  onCloseMobile: () => void
  onToggleCollapsed: () => void
}

export function AdminSidebar({ collapsed, mobileOpen, onCloseMobile, onToggleCollapsed }: AdminSidebarProps) {
  const pathname = usePathname()
  return (
    <>
      <button aria-label="Close navigation" className={`fixed  inset-0 z-30 bg-slate-950/45 transition-opacity  lg:hidden ${mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`} onClick={onCloseMobile} type="button" />
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[287px]  flex-col bg-[#f8f9fa] lg:bg-inherit px-4 py-7 transition-[transform,width] duration-200 lg:px-0 lg:pb-[14px] lg:pt-11 lg:translate-x-0 ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"} ${collapsed ? "lg:w-[88px]" : ""}`}>
        <div className={`flex h-12 items-center ${collapsed ? "justify-center" : "justify-between pl-2"}`}>
          <Link aria-label="Minzo admin dashboard" className="flex items-center gap-[4px]" href="/portal/admin/dashboard">
            <Image alt="Minzo" quality={9} className=" aspect-square h-[56px] w-[56px]" width={56} height={56} priority src="/img_admin_sidebar.png" />
            <span className="text-lg text-[#0C486D] font-semibold">Minzo</span>
          </Link>
          <button aria-label="Close navigation" className="rounded-lg p-2 text-slate-600 hover:bg-slate-200 lg:hidden" onClick={onCloseMobile} type="button"><Icon icon="solar:close-circle-linear" width={24} /></button>
        </div>

        <div className="mt-8 flex min-h-0 flex-1 flex-col rounded-md border border-[#e0e0e0] bg-[#f8f9fa] px-5 py-10">
          <nav aria-label="Admin navigation" className="flex-1 space-y-[7px] overflow-y-auto">
            {ADMIN_NAVIGATION_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return <Link aria-current={isActive ? "page" : undefined} className={`flex min-h-11 items-center rounded-lg px-2.5 py-2 text-base leading-6 transition ${collapsed ? "justify-center" : "gap-2.5"} ${isActive ? "bg-[#dbe4e9] font-medium text-[#0c486d]" : "font-normal text-[#212121] hover:bg-[#dbe4e9] hover:text-[#0c486d]"}`} href={item.href} key={item.href} onClick={onCloseMobile} title={collapsed ? item.label : undefined}><Icon icon={item.icon} width={item.href === "/portal/admin/dashboard" ? 24 : 20} /><span className={collapsed ? "sr-only" : "truncate"}>{item.label}</span></Link>
            })}
          </nav>

          <div className={`mt-6 ${collapsed ? "space-y-3" : ""}`}>
            {!collapsed ? <AdminProfileMenu variant="sidebar" /> : null}
            <button aria-label={collapsed ? "Expand navigation" : "Collapse navigation"} className="mt-3 hidden h-10 w-full items-center justify-center rounded-lg text-[#6c757d] hover:bg-[#dbe4e9] lg:flex" onClick={onToggleCollapsed} type="button"><Icon icon="solar:sidebar-minimalistic-outline" width={21} /></button>
          </div>
        </div>
      </aside>
    </>
  )
}
