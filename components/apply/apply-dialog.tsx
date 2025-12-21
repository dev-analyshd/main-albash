"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useApplyDialog } from "./apply-dialog-context"

export function ApplyDialog() {
  const { open, setOpen } = useApplyDialog()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
    }
    if (open) {
      checkAuth()
    }
  }, [open])

  const handleVerificationType = (type: string) => {
    setOpen(false)
    if (isAuthenticated) {
      // Authenticated users go to verification page
      router.push("/verification")
    } else {
      // Unauthenticated users go to login
      router.push(`/auth/login?redirect=/verification`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Get Started with AlbashSolutions</DialogTitle>
          <DialogDescription>
            {isAuthenticated
              ? "Choose your verification type to unlock platform features"
              : "Choose your application type to get started"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-4 bg-transparent"
            onClick={() => handleVerificationType("builder")}
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">B</span>
            </div>
            <div className="text-left">
              <div className="font-medium">Builder</div>
              <div className="text-sm text-muted-foreground">For individuals with ideas & talents</div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-4 bg-transparent"
            onClick={() => handleVerificationType("institution")}
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">I</span>
            </div>
            <div className="text-left">
              <div className="font-medium">Institution</div>
              <div className="text-sm text-muted-foreground">For schools & educational bodies</div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-4 bg-transparent"
            onClick={() => handleVerificationType("business")}
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">S</span>
            </div>
            <div className="text-left">
              <div className="font-medium">Small Business</div>
              <div className="text-sm text-muted-foreground">For small businesses & startups</div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-4 bg-transparent"
            onClick={() => handleVerificationType("company")}
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">C</span>
            </div>
            <div className="text-left">
              <div className="font-medium">Company</div>
              <div className="text-sm text-muted-foreground">For established companies</div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-4 bg-transparent"
            onClick={() => handleVerificationType("organization")}
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">O</span>
            </div>
            <div className="text-left">
              <div className="font-medium">Organization</div>
              <div className="text-sm text-muted-foreground">For NGOs & non-profits</div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

