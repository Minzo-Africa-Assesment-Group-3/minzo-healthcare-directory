"use client"

import { Icon } from "@iconify/react"

import { AdminProfileMenu } from "./admin-profile-menu"

interface AdminHeaderProps { onOpenMobileNavigation: () => void }

export function AdminHeader({ onOpenMobileNavigation }: AdminHeaderProps) {
  return (
    <header className="h-[126px] shrink-0 bg-[#f5f5f5] px-4 sm:px-8 lg:px-10">
      <div className="mx-auto flex h-full w-full max-w-[1280px] items-center justify-between gap-4">
        <button aria-label="Open navigation" className="rounded-lg p-2 text-[#0c486d] hover:bg-[#dbe4e9] lg:hidden" onClick={onOpenMobileNavigation} type="button"><Icon icon="solar:hamburger-menu-outline" width={25} /></button>
        <label className="hidden h-[50px] w-[540px] items-center gap-[18px] rounded-xl border border-[#ced4da] bg-white px-4 text-[#212121] sm:flex"><Icon icon="solar:magnifer-linear" width={16} /><input aria-label="Search listings, users, and reviews" className="w-full bg-transparent text-xs text-[#212121] outline-none placeholder:text-[#757575]" placeholder="Search listings, users, reviews..." type="search" /></label>
        <div className="ml-auto flex h-[50px] w-[134px] items-center justify-center gap-6 rounded-[24px] border border-[#b4c6d2] bg-transparent"><button aria-label="Notifications" className="flex size-5 items-center justify-center text-[#212121] hover:text-[#0c486d]" type="button"><Icon icon="carbon:notification" width={20} /></button><AdminProfileMenu variant="header" /></div>
      </div>
    </header>
  )
}
