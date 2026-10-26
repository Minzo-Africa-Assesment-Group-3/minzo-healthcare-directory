"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import AuthShell from "@/app/(auth)/auth-shell"
import { notify } from "@/lib/toast"
import { AdminPasswordField, AdminTextField } from "../../components/forms"
import { AdminButton } from "../../components/ui"

const adminLoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required").max(128)
})

type AdminLoginValues = z.infer<typeof adminLoginSchema>

interface AdminLoginResponse {
  challengeId?: string
  detail?: string
  maskedEmail?: string
  message?: string
}

export function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<AdminLoginValues>({ resolver: zodResolver(adminLoginSchema) })

  useEffect(() => {
    if (searchParams.get("expired") === "1") {
      notify.error("Your administrator session expired. Please log in again.")
    }
  }, [searchParams])

  async function onSubmit(values: AdminLoginValues) {
    setServerError(null)
    globalThis.sessionStorage.setItem("minzo-admin-email", values.email)

    const response = await fetch("/api/admin-auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(values)
    })
    const data = (await response.json().catch(() => ({}))) as AdminLoginResponse

    if (!response.ok) {
      const message = data.detail ?? data.message ?? "Invalid administrator email or password."
      setServerError(message)
      notify.error(message)
      return
    }

    if (!data.challengeId) {
      const message = "The administration login service did not return a verification challenge."
      setServerError(message)
      notify.error(message)
      return
    }

    const otpParameters = new URLSearchParams({
      challengeId: data.challengeId,
      email: data.maskedEmail ?? values.email
    })

    notify.success("A verification code has been sent to your administrator email.")
    router.push(`/portal/admin/verify-otp?${otpParameters.toString()}`)
  }

  return (
    <AuthShell
      subtitle="Enter your administrator email and password to continue."
      title="Admin portal sign in"
    >
      <form className="space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
        <AdminTextField
          {...register("email")}
          autoComplete="email"
          error={errors.email?.message}
          label="Email"
          placeholder="e.g. admin@minzo.africa"
          required
          type="email"
        />

        <AdminPasswordField
          {...register("password")}
          autoComplete="current-password"
          error={errors.password?.message}
          placeholder="Enter your password"
          required
        />

        {serverError ? (
          <p className="text-sm text-destructive" role="alert">
            {serverError}
          </p>
        ) : null}

        <AdminButton
          disabled={isSubmitting}
          type="submit"
          width="full"
        >
          {isSubmitting ? "Logging in…" : "Log in"}
        </AdminButton>
      </form>
    </AuthShell>
  )
}
