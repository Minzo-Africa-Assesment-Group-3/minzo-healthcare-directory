"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import AuthShell from "@/app/(auth)/auth-shell"
import { AdminPasswordField } from "@/app/portal/admin/components/forms"
import { AdminButton } from "@/app/portal/admin/components/ui"
import { notify } from "@/lib/toast"

const acceptInvitationSchema = z.object({
  confirmPassword: z.string().min(1, "Please confirm your password"),
  password: z.string().min(12, "Password must be at least 12 characters").max(128, "Password must not exceed 128 characters")
}).refine((values) => values.password === values.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
})

type AcceptInvitationValues = z.infer<typeof acceptInvitationSchema>

interface AcceptInvitationResponse {
  detail?: string
  message?: string
}

export function AcceptAdminInvitationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const { formState: { errors, isSubmitting }, handleSubmit, register, setError } = useForm<AcceptInvitationValues>({
    resolver: zodResolver(acceptInvitationSchema)
  })

  async function onSubmit(values: AcceptInvitationValues) {
    if (!token) {
      setError("root", { message: "This invitation link is missing its token. Ask an administrator to send a new invitation." })
      return
    }

    const response = await fetch("/api/admin-auth/accept-invitation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: values.password, token })
    })
    const data = (await response.json().catch(() => ({}))) as AcceptInvitationResponse

    if (!response.ok) {
      const message = data.detail ?? data.message ?? "This invitation could not be accepted."
      setError("root", { message })
      notify.error(message)
      return
    }

    notify.success("Your administrator account has been created. Please sign in.")
    router.replace("/portal/admin/login?invitation=accepted")
  }

  return <AuthShell showBack={false} subtitle="Create a password to activate your Minzo administrator account." title="Accept administrator invitation"><form className="space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}><AdminPasswordField {...register("password")} autoComplete="new-password" error={errors.password?.message} label="Create password" placeholder="At least 12 characters" required /><AdminPasswordField {...register("confirmPassword")} autoComplete="new-password" error={errors.confirmPassword?.message} label="Confirm password" placeholder="Enter the same password again" required />{errors.root?.message ? <p className="text-sm text-destructive" role="alert">{errors.root.message}</p> : null}<AdminButton disabled={isSubmitting || !token} type="submit" width="full">{isSubmitting ? "Creating account…" : "Accept invitation"}</AdminButton>{!token ? <p className="text-center text-sm text-destructive">This invitation link is invalid. Ask an administrator to send a new invitation.</p> : null}</form></AuthShell>
}
