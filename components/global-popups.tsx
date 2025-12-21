"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FileText, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useApplyDialog } from "@/components/apply/apply-dialog-context"
import { createClient } from "@/lib/supabase/client"
import type { Profile } from "@/lib/types"

export function GlobalPopups() {
  const { setOpen: setShowApply } = useApplyDialog()
  const [showCheckStatus, setShowCheckStatus] = useState(false)
  const [applicationId, setApplicationId] = useState("")
  const [user, setUser] = useState<Profile | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user: authUser },
          error,
        } = await supabase.auth.getUser()

        if (error || !authUser) {
          setUser(null)
          return
        }

        const { data } = await supabase.from("profiles").select("*").eq("id", authUser.id).single()

        setUser(data)
      } catch (err) {
        console.error("Error fetching user:", err)
        setUser(null)
      }
    }

    fetchUser()
  }, [])

  // Hide buttons if user is logged in
  if (user) {
    return null
  }

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1 }}>
          <Button size="lg" className="rounded-full shadow-lg gap-2" onClick={() => setShowApply(true)}>
            <FileText className="h-5 w-5" />
            <span className="hidden sm:inline">Apply</span>
          </Button>
        </motion.div>
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.1 }}>
          <Button
            size="lg"
            variant="secondary"
            className="rounded-full shadow-lg gap-2"
            onClick={() => setShowCheckStatus(true)}
          >
            <Search className="h-5 w-5" />
            <span className="hidden sm:inline">Status</span>
          </Button>
        </motion.div>
      </div>

      {/* Check Status Dialog */}
      <Dialog open={showCheckStatus} onOpenChange={setShowCheckStatus}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Check Application Status</DialogTitle>
            <DialogDescription>Enter your application ID to track your progress</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="application-id">Application ID</Label>
              <Input
                id="application-id"
                placeholder="e.g., APP-2024-XXXXX"
                value={applicationId}
                onChange={(e) => setApplicationId(e.target.value)}
              />
            </div>
            <Link href={`/check-status?id=${applicationId}`} onClick={() => setShowCheckStatus(false)}>
              <Button className="w-full" disabled={!applicationId}>
                Check Status
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground text-center">
              Or{" "}
              <Link
                href="/auth/login"
                className="text-primary hover:underline"
                onClick={() => setShowCheckStatus(false)}
              >
                login to your account
              </Link>{" "}
              to view all applications
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
