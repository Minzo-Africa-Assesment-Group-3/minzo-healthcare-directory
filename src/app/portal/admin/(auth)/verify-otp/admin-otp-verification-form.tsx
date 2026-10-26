"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import AuthShell from "@/app/(auth)/auth-shell"
import { notify } from "@/lib/toast"
import { AdminButton } from "../../components/ui"

const OTP_LENGTH = 4

interface VerifyAdminOtpResponse {
  detail?: string
  message?: string
}

export function AdminOtpVerificationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const challengeId = searchParams.get("challengeId")
  const email = searchParams.get("email")
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""))
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const inputs = useRef<(HTMLInputElement | null)[]>([])
  const code = digits.join("")
  const isComplete = code.length === OTP_LENGTH

  useEffect(() => {
    inputs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (cooldown <= 0) return

    const timer = globalThis.setTimeout(() => setCooldown((value) => value - 1), 1_000)

    return () => globalThis.clearTimeout(timer)
  }, [cooldown])

  function fillFrom(startIndex: number, value: string) {
    const values = value.replace(/\D/g, "").slice(0, OTP_LENGTH - startIndex).split("")

    if (values.length === 0) return

    setError(null)
    setDigits((currentDigits) => {
      const nextDigits = [...currentDigits]
      values.forEach((digit, index) => {
        nextDigits[startIndex + index] = digit
      })

      return nextDigits
    })
    inputs.current[Math.min(startIndex + values.length, OTP_LENGTH - 1)]?.focus()
  }

  function handleChange(index: number, value: string) {
    if (!value) {
      setError(null)
      setDigits((currentDigits) => currentDigits.map((digit, currentIndex) => currentIndex === index ? "" : digit))
      return
    }

    fillFrom(index, value)
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      event.preventDefault()
      setDigits((currentDigits) => currentDigits.map((digit, currentIndex) => currentIndex === index - 1 ? "" : digit))
      inputs.current[index - 1]?.focus()
      return
    }

    if (event.key === "ArrowLeft" && index > 0) inputs.current[index - 1]?.focus()
    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) inputs.current[index + 1]?.focus()
  }

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!challengeId) {
      setError("Your administrator login session is missing. Please log in again.")
      return
    }

    if (!isComplete || isVerifying) return

    setIsVerifying(true)
    setError(null)

    const response = await fetch("/api/admin-auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ challengeId, otp: code })
    })
    const data = (await response.json().catch(() => ({}))) as VerifyAdminOtpResponse

    setIsVerifying(false)

    if (!response.ok) {
      const message = data.detail ?? data.message ?? "The verification code is incorrect or has expired."
      setError(message)
      notify.error(message)
      return
    }

    notify.success("Administrator login verified.")
    router.replace("/portal/admin/dashboard")
  }

  function handleResend() {
    if (cooldown > 0 || isResending) return

    setIsResending(true)
    notify.info("Please sign in again to receive a new verification code.")
    router.replace("/portal/admin/login")
  }

  return (
    <AuthShell
      subtitle={email ? `We sent a ${OTP_LENGTH}-digit code to ${email}.` : `We sent a ${OTP_LENGTH}-digit code to your administrator email.`}
      title="Enter verification code"
    >
      <form noValidate onSubmit={handleVerify}>
        <div aria-label="Administrator verification code" className="flex justify-center gap-2 sm:gap-3" role="group">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputs.current[index] = element
              }}
              aria-invalid={Boolean(error)}
              aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
              autoComplete={index === 0 ? "one-time-code" : "off"}
              className={`h-12 w-11 rounded-xl border bg-white text-center text-base text-gray-900 transition-colors focus:outline-none focus:ring-2 sm:w-12 ${error ? "border-red-500 focus:ring-red-500/20" : "border-gray-200 focus:border-[#0C486D] focus:ring-[#0C486D]/20"}`}
              inputMode="numeric"
              maxLength={OTP_LENGTH}
              onChange={(event) => handleChange(index, event.target.value)}
              onFocus={(event) => event.target.select()}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onPaste={(event) => {
                event.preventDefault()
                fillFrom(index, event.clipboardData.getData("text"))
              }}
              pattern="[0-9]*"
              type="text"
              value={digit}
            />
          ))}
        </div>

        <p className={`mt-6 text-center text-sm ${error ? "text-red-600" : "text-gray-500"}`} role={error ? "alert" : undefined}>
          {error ?? "This code expires in 5 minutes."}
        </p>

        <AdminButton disabled={!isComplete || isVerifying} type="submit" width="full">
          {isVerifying ? "Verifying…" : "Verify"}
        </AdminButton>

        <p className="mt-5 text-center font-(family-name:--font-roboto-slab) text-sm font-medium text-gray-900">
          Didn’t receive the code? {cooldown > 0 ? (
            <span className="font-semibold text-[#0C486D]">Resend in {cooldown}s</span>
          ) : (
            <button
              className="font-semibold text-[#0C486D] hover:underline disabled:opacity-50"
              disabled={isResending}
              onClick={handleResend}
              type="button"
            >
              {isResending ? "Sending…" : "Resend code"}
            </button>
          )}
        </p>
      </form>
    </AuthShell>
  )
}
