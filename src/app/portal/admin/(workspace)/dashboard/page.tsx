"use client"

import { Icon } from "@iconify/react"

import { useGetAdminDashboardDataQuery } from "../../api/dashboard"

interface DashboardMetricCardProps {
  accent: "green" | "orange" | "teal"
  detail: string
  icon: string
  label: string
  value: number
}

const accentClasses = {
  green: "bg-[#eaf7ec] text-[#62ae71]",
  orange: "bg-[#fff7e4] text-[#f09a00]",
  teal: "bg-[#eaf6f2] text-[#55a66b]"
}

function DashboardMetricCard({ accent, detail, icon, label, value }: DashboardMetricCardProps) {
  return <section className="h-[150px] rounded-2xl border border-[#e0e0e0] bg-[#f8f9fa] p-5"><div className="flex items-center justify-between gap-1"><div className="min-w-0"><p className="whitespace-nowrap text-sm font-medium leading-5 text-[#212121]">{label}</p><p className="mt-2 text-[28px] font-semibold leading-8 text-[#212121]">{value.toLocaleString()}</p></div><div className={`flex size-8 shrink-0 items-center justify-center rounded-full ${accentClasses[accent]}`}><Icon icon={icon} width={20} /></div></div><p className="mt-3 text-[11px] font-normal leading-4 text-[#757575]">{detail}</p></section>
}

function DashboardSkeleton() {
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <div className="h-36 animate-pulse rounded-2xl bg-slate-200" key={index} />)}</div>
}

function getDateLabel() {
  return new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }).format(new Date())
}

function getTimeLabel() {
  const time = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Africa/Lagos" }).format(new Date())

  return `${time} (WAT)`
}

export default function AdminDashboardPage() {
  const dashboardQuery = useGetAdminDashboardDataQuery()

  if (dashboardQuery.isLoading) return <DashboardSkeleton />

  if (dashboardQuery.isError || !dashboardQuery.data) {
    return <section className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800"><h1 className="text-lg font-bold">Unable to load dashboard</h1><p className="mt-2 text-sm">Please refresh the page or try again shortly.</p></section>
  }

  const { businesses, claims, reviews, users } = dashboardQuery.data
  const recentActivity = [
    { detail: `${businesses.pendingApproval} registrations waiting for a decision`, icon: "solar:buildings-2-outline", label: "New Listing Submitted", time: "2 hours ago", tone: "blue" },
    { detail: `${reviews.flagged} review${reviews.flagged === 1 ? "" : "s"} flagged for attention`, icon: "solar:flag-2-bold", label: "Review Flagged", time: "3 hours ago", tone: "red" },
    { detail: `${claims.pending} claim${claims.pending === 1 ? "" : "s"} waiting for review`, icon: "solar:user-plus-outline", label: "Account request", time: "4 hours ago", tone: "blue" },
    { detail: `${businesses.unclaimed} imported listing${businesses.unclaimed === 1 ? "" : "s"} remain unclaimed`, icon: "solar:refresh-circle-outline", label: "Listing updated", time: "5 hours ago", tone: "green" }
  ]

  return (
    <div className="w-full  space-y-12 pb-10">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div className="space-y-3"><h1 className="text-[28px] font-semibold leading-8 text-black">Welcome Back, Admin</h1><p className="text-base font-normal leading-6 text-black">Here’s what’s happening with Minzo today.</p></div><div className="flex h-[55px] w-[169px] shrink-0 items-center justify-center gap-3 rounded-lg bg-[#e7edf0] text-right text-[#0c486d]"><Icon icon="solar:calendar-outline" width={20} /><div><p className="text-sm font-semibold leading-5">{getDateLabel()}</p><p className="text-xs font-medium leading-4 text-[#6c757d]">{getTimeLabel()}</p></div></div></section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-[18px]">
        <DashboardMetricCard accent="teal" detail={`${businesses.pendingApproval.toLocaleString()} awaiting review`} icon="solar:buildings-2-bold-duotone" label="Total Businesses" value={businesses.total} />
        <DashboardMetricCard accent="green" detail={`${claims.approved.toLocaleString()} approved claims`} icon="solar:verified-check-bold-duotone" label="Pending Claims" value={claims.pending} />
        <DashboardMetricCard accent="orange" detail={`+ ${reviews.unreviewed.toLocaleString()} this week`} icon="solar:star-bold-duotone" label="Pending Moderations" value={reviews.unreviewed} />
        <DashboardMetricCard accent="teal" detail={`${users.pendingEmailVerification.toLocaleString()} pending verification`} icon="solar:users-group-rounded-bold-duotone" label="Registered Users Accounts." value={users.total} />
      </div>

      <section className="space-y-7"><div className="flex items-center justify-between"><h2 className="text-base font-semibold leading-6 text-black">Recent Activity</h2><button className="text-sm font-semibold leading-5 text-[#198754] hover:underline" type="button">View all</button></div><div className="overflow-hidden rounded-2xl">{recentActivity.map((activity, index) => <div className={`flex min-h-20 flex-col gap-4 border border-[#e0e0e0] p-5 sm:flex-row sm:items-center ${index === 0 ? "rounded-t-2xl" : "-mt-px"} ${index === recentActivity.length - 1 ? "rounded-b-2xl" : ""}`} key={activity.label}><div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${activity.tone === "red" ? "bg-[#fff0ed] text-[#dc3545]" : activity.tone === "green" ? "bg-[#e8f7ef] text-[#198754]" : "bg-[#dbe7ed] text-[#0c486d]"}`}><Icon icon={activity.icon} width={22} /></div><div className="min-w-0 flex-1"><p className="text-sm font-normal leading-5 text-black">{activity.label}</p><p className="mt-1 text-xs font-normal leading-4 text-[#757575]">{activity.detail}</p></div><div className="flex w-full shrink-0 items-center justify-between sm:w-[226px]"><p className="text-xs font-normal leading-4 text-[#757575]">{activity.time}</p><button className={`flex h-9 w-[79px] items-center justify-center rounded-xl text-xs font-normal leading-4 ${activity.tone === "red" ? "bg-[rgba(237,108,2,0.1)] text-[#ed6c02]" : "bg-[#dbe4e9] text-[#0c486d]"}`} type="button">{activity.label === "Listing updated" ? "View" : "Review"}</button></div></div>)}</div></section>
    </div>
  )
}
