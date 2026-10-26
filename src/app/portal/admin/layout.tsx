import type { ReactNode } from "react"
import { Roboto_Slab } from "next/font/google"

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-admin",
  display: "swap"
})

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <div className={robotoSlab.variable}>{children}</div>
}
