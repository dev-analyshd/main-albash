import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import CheckStatusContent from "./check-status-content"

function CheckStatusFallback() {
  return (
    <div className="pt-20 min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

export default function CheckStatusPage() {
  return (
    <Suspense fallback={<CheckStatusFallback />}>
      <CheckStatusContent />
    </Suspense>
  )
}
