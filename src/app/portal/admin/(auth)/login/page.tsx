import { Suspense } from "react"

import Loading from "@/components/Loading"
import { AdminLoginForm } from "./admin-login-form"

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<Loading message="Loading admin login" />}>
      <AdminLoginForm />
    </Suspense>
  )
}
