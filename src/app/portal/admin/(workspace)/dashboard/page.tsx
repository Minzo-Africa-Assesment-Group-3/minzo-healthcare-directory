"use client"

import { Icon } from "@iconify/react"
import Link from "next/link"

import { type AdminDashboardActivity, useGetAdminDashboardDataQuery } from "../../api/dashboard"

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

function formatRelativeTime(value: string): string {
  const differenceInSeconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000))

  if (differenceInSeconds < 60) return "Just now"

  const differenceInMinutes = Math.floor(differenceInSeconds / 60)

  if (differenceInMinutes < 60) return `${differenceInMinutes} minute${differenceInMinutes === 1 ? "" : "s"} ago`

  const differenceInHours = Math.floor(differenceInMinutes / 60)

  if (differenceInHours < 24) return `${differenceInHours} hour${differenceInHours === 1 ? "" : "s"} ago`

  const differenceInDays = Math.floor(differenceInHours / 24)

  return `${differenceInDays} day${differenceInDays === 1 ? "" : "s"} ago`
}

function formatAction(action: string | null): string {
  if (!action) return "Administrator action"

  const actionLabels: Record<string, string> = {
    "admin.invited": "Administrator invited",
    "admin.invitation.accepted": "Administrator invitation accepted",
    "admin.invitation.revoked": "Administrator invitation revoked",
    "business.claim.approved": "Business claim approved",
    "business.claim.rejected": "Business claim rejected",
    "business.registration.approved": "Business registration approved",
    "business.registration.rejected": "Business registration rejected",
    "customer_review.moderated": "Customer review moderated"
  }

  return actionLabels[action] ?? action.replaceAll(/[._]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function getActivityPresentation(activity: AdminDashboardActivity) {
  if (activity.type === "BUSINESS_REGISTRATION_SUBMITTED") {
    return {
      action: "Review",
      detail: `${activity.entity.name ?? "A business"} submitted a registration`,
      href: `/portal/admin/businesses/${activity.entity.id}`,
      icon: "solar:buildings-2-bold-duotone",
      label: "New business registration",
      tone: "blue"
    }
  }

  if (activity.type === "BUSINESS_CLAIM_SUBMITTED") {
    return {
      action: "Review",
      detail: `${activity.entity.name ?? "A business"} has an ownership claim`,
      href: `/portal/admin/business-claims/${activity.entity.id}`,
      icon: "solar:user-plus-bold-duotone",
      label: "Business claim submitted",
      tone: "blue"
    }
  }

  if (activity.type === "CUSTOMER_REVIEW_SUBMITTED") {
    return {
      action: "View",
      detail: `New customer review for ${activity.entity.name ?? "a business"}`,
      href: "/portal/admin/customer-reviews",
      icon: "solar:star-bold-duotone",
      label: "Customer review submitted",
      tone: "orange"
    }
  }

  const href = activity.entity.type === "BUSINESS"
    ? `/portal/admin/businesses/${activity.entity.id}`
    : activity.entity.type === "BUSINESS_CLAIM"
      ? `/portal/admin/business-claims/${activity.entity.id}`
      : activity.entity.type === "CUSTOMER_REVIEW"
        ? "/portal/admin/customer-reviews"
        : null

  return {
    action: href ? "View" : null,
    detail: activity.entity.name ?? activity.entity.type.replaceAll("_", " "),
    href,
    icon: "solar:shield-check-bold-duotone",
    label: formatAction(activity.action),
    tone: "green"
  }
}

export default function AdminDashboardPage() {
  const dashboardQuery = useGetAdminDashboardDataQuery()

  if (dashboardQuery.isLoading) return <DashboardSkeleton />

  if (dashboardQuery.isError || !dashboardQuery.data) {
    return <section className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800"><h1 className="text-lg font-bold">Unable to load dashboard</h1><p className="mt-2 text-sm">Please refresh the page or try again shortly.</p></section>
  }

  const { businesses, changes, claims, recentActivities, reviews, users } = dashboardQuery.data

  return (
    <div className="w-full  space-y-12 pb-10">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div className="space-y-3"><h1 className="text-[28px] font-semibold leading-8 text-black">Welcome Back, Admin</h1><p className="text-base font-normal leading-6 text-black">Here’s what’s happening with Minzo today.</p></div><div className="flex h-[55px] w-[169px] shrink-0 items-center justify-center gap-3 rounded-lg bg-[#e7edf0] text-right text-[#0c486d]"><Icon icon="solar:calendar-outline" width={20} /><div><p className="text-sm font-semibold leading-5">{getDateLabel()}</p><p className="text-xs font-medium leading-4 text-[#6c757d]">{getTimeLabel()}</p></div></div></section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-[18px]">
        <DashboardMetricCard accent="teal" detail={`${changes.businessesRegisteredThisWeek.toLocaleString()} registered this week`} icon="solar:buildings-2-bold-duotone" label="Total Businesses" value={businesses.total} />
        <DashboardMetricCard accent="green" detail={`${changes.claimsSubmittedThisWeek.toLocaleString()} submitted this week`} icon="solar:verified-check-bold-duotone" label="Pending Claims" value={claims.pending} />
        <DashboardMetricCard accent="orange" detail={`${changes.reviewsSubmittedThisWeek.toLocaleString()} submitted this week`} icon="solar:star-bold-duotone" label="Pending Moderations" value={reviews.unreviewed} />
        <DashboardMetricCard accent="teal" detail={`${changes.usersRegisteredThisWeek.toLocaleString()} registered this week`} icon="solar:users-group-rounded-bold-duotone" label="Registered Users Accounts." value={users.total} />
      </div>

      <section className="space-y-7"><div className="flex items-center justify-between"><h2 className="text-base font-semibold leading-6 text-black">Recent Activity</h2><Link className="text-sm font-semibold leading-5 text-[#198754] hover:underline" href="/portal/admin/audit-logs">View all</Link></div><div className="overflow-hidden rounded-2xl">{recentActivities.length ? recentActivities.map((activity, index) => {
        const presentation = getActivityPresentation(activity)

        return <div className={`flex min-h-20 flex-col gap-4 border border-[#e0e0e0] p-5 sm:flex-row sm:items-center ${index === 0 ? "rounded-t-2xl" : "-mt-px"} ${index === recentActivities.length - 1 ? "rounded-b-2xl" : ""}`} key={activity.id}><div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${presentation.tone === "orange" ? "bg-[#fff7e4] text-[#ed6c02]" : presentation.tone === "green" ? "bg-[#e8f7ef] text-[#198754]" : "bg-[#dbe7ed] text-[#0c486d]"}`}><Icon icon={presentation.icon} width={22} /></div><div className="min-w-0 flex-1"><p className="text-sm font-normal leading-5 text-black">{presentation.label}</p><p className="mt-1 text-xs font-normal leading-4 text-[#757575]">{presentation.detail}</p></div><div className="flex w-full shrink-0 items-center justify-between sm:w-[226px]"><p className="text-xs font-normal leading-4 text-[#757575]">{formatRelativeTime(activity.occurredAt)}</p>{presentation.href && presentation.action ? <Link className="flex h-9 w-[79px] items-center justify-center rounded-xl bg-[#dbe4e9] text-xs font-normal leading-4 text-[#0c486d] hover:bg-[#cbdbe2]" href={presentation.href}>{presentation.action}</Link> : null}</div></div>
      }) : <div className="rounded-2xl border border-[#e0e0e0] p-6 text-sm text-[#757575]">No recent activity yet.</div>}</div></section>
    </div>
  )
}
