export interface AdminNavigationItem {
  href: string
  icon: string
  label: string
}

export const ADMIN_NAVIGATION_ITEMS: AdminNavigationItem[] = [
  { href: "/portal/admin/dashboard", icon: "hugeicons:dashboard-circle", label: "Dashboard" },
  { href: "/portal/admin/businesses", icon: "famicons:business-outline", label: "Business Registrations" },
  { href: "/portal/admin/business-claims", icon: "carbon:document-add", label: "Business Claims" },
  { href: "/portal/admin/administrators", icon: "ic:outline-account-circle", label: "Administrators" },
  { href: "/portal/admin/customer-reviews", icon: "mage:stars-b-fill", label: "Customer Reviews" },
  { href: "/portal/admin/directory", icon: "material-symbols-light:location-city-outline", label: "Counties & Cities" },
  { href: "/portal/admin/access-control", icon: "ant-design:safety-certificate-outlined", label: "Roles & Permissions" },
  { href: "/portal/admin/audit-logs", icon: "wpf:statistics", label: "Audit Logs" }
]

export function getAdminPageTitle(pathname: string): string {
  const item = ADMIN_NAVIGATION_ITEMS.find((navigationItem) => pathname === navigationItem.href || pathname.startsWith(`${navigationItem.href}/`))

  return item?.label ?? "Admin portal"
}
