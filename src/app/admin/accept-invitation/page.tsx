import { Suspense } from "react"

import Loading from "@/components/Loading"
import { AcceptAdminInvitationForm } from "./accept-admin-invitation-form"

export default function AcceptAdminInvitationPage() {
  return <Suspense fallback={<Loading message="Loading invitation" />}><AcceptAdminInvitationForm /></Suspense>
}
