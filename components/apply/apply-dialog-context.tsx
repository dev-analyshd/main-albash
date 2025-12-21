"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type ApplyDialogContextType = {
  open: boolean
  setOpen: (open: boolean) => void
}

const ApplyDialogContext = createContext<ApplyDialogContextType | undefined>(undefined)

export function ApplyDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  return <ApplyDialogContext.Provider value={{ open, setOpen }}>{children}</ApplyDialogContext.Provider>
}

export function useApplyDialog() {
  const context = useContext(ApplyDialogContext)
  if (context === undefined) {
    throw new Error("useApplyDialog must be used within an ApplyDialogProvider")
  }
  return context
}

