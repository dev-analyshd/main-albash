import { Suspense } from "react"
import { SignUpForm } from "@/components/auth/sign-up-form"
import { Loader2 } from "lucide-react"

function SignUpFormFallback() {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-20">
      <Suspense fallback={<SignUpFormFallback />}>
        <SignUpForm />
      </Suspense>
    </div>
  )
}
