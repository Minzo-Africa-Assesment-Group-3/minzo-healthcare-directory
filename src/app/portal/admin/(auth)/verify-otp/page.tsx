import { Suspense } from "react"

import Loading from "@/components/Loading"
import { AdminOtpVerificationForm } from "./admin-otp-verification-form"

export default function AdminVerifyOtpPage() {
  return (
    <Suspense fallback={<Loading message="Loading administrator verification" />}>
      <AdminOtpVerificationForm />
    </Suspense>
  )
}
