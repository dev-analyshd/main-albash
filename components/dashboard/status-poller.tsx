"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface StatusPollerProps {
  isPending: boolean
}

// Polls verification status to keep dashboard in sync without manual refresh
export function StatusPoller({ isPending }: StatusPollerProps) {
  const router = useRouter()
  const [polling, setPolling] = useState(isPending)

  useEffect(() => {
    if (!isPending) return
    setPolling(true)

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/verification", { cache: "no-store" })
        if (!res.ok) return
        const data = await res.json()
        const latest = data?.data?.[0]
        const status = latest?.status
        if (status === "approved" || status === "rejected") {
          setPolling(false)
          router.refresh()
        }
      } catch (err) {
        console.error("Status poll error:", err)
      }
    }, 8000) // 8s interval for light load

    return () => clearInterval(interval)
  }, [isPending, router])

  if (!polling) return null

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
      <Badge variant="outline" className="flex items-center gap-2">
        <Loader2 className="h-3 w-3 animate-spin" />
        Live status updates
      </Badge>
    </div>
  )
}

