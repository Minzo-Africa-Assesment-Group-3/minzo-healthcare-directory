"use client"

import { Suspense, useState, type ReactNode } from "react"

import { AdminHeader, AdminSidebar } from "../components/ui"

interface AdminWorkspaceLayoutProps {
  children: ReactNode
}

export default function AdminWorkspaceLayout({ children }: AdminWorkspaceLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-dvh w-full bg-[#f5f5f5] font-(family-name:--font-admin) text-[#212121] ">
      <AdminSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onToggleCollapsed={() => setCollapsed((value) => !value)}
      />
      <div className={`flex min-h-dvh min-w-0 flex-col transition-[margin] duration-200 ${collapsed ? "lg:ml-[120px]" : "lg:ml-[308px]"}`}>
        <AdminHeader onOpenMobileNavigation={() => setMobileOpen(true)} />
        <main className="min-w-0 flex-1 overflow-auto px-4 pb-10 pt-8 sm:px-8 lg:px-10">
          <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-slate-200" />}>
            <div className="mx-auto w-full max-w-[1280px]">{children}</div>
          </Suspense>
        </main>
      </div>
    </div>
  )
}
