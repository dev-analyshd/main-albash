import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { GlobalPopups } from "@/components/global-popups"
import { Toaster } from "@/components/ui/toaster"
import { ApplyDialogProvider } from "@/components/apply/apply-dialog-context"
import { ApplyDialog } from "@/components/apply/apply-dialog"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AlbashSolutions - Digitize Your Ideas, Talents & Products",
  description:
    "A hybrid digital/physical ecosystem that helps individuals, students, institutions, small businesses, and organizations digitize their ideas, talents, products, and services.",
  generator: "v0.app",
  manifest: "/manifest.json",
  keywords: ["marketplace", "tokenization", "NFT", "verification", "digital products", "blockchain"],
  authors: [{ name: "AlbashSolutions" }],
  icons: {
    icon: [{ url: "/albash logo.png" }],
    apple: "/albash logo.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#3B82F6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <ApplyDialogProvider>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <GlobalPopups />
          <ApplyDialog />
        <Toaster />
        <Analytics />
        </ApplyDialogProvider>
      </body>
    </html>
  )
}
