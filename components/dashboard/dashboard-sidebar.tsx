"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  Store,
  FileText,
  Wallet,
  Star,
  Settings,
  HelpCircle,
  Wrench,
  Users,
  Calendar,
  Bell,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
  Coins,
  Gavel,
  BarChart3,
  Megaphone,
  FolderTree,
  Palette,
  ArrowLeftRight,
} from "lucide-react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface DashboardSidebarProps {
  profile: {
    id: string
    full_name: string | null
    avatar_url: string | null
    role: string
    account_type: string
    reputation_score: number
    is_verified: boolean
  } | null
}

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Store, label: "My Listings", href: "/dashboard/listings" },
  { icon: FileText, label: "Applications", href: "/dashboard/applications" },
  { icon: Gavel, label: "My Auctions", href: "/dashboard/auctions" },
  { icon: ArrowLeftRight, label: "Swaps", href: "/dashboard/swaps" },
  { icon: Coins, label: "Transactions", href: "/dashboard/transactions" },
  { icon: Wallet, label: "Wallet", href: "/dashboard/wallet" },
  { icon: Star, label: "Reputation", href: "/dashboard/reputation" },
  { icon: Palette, label: "Studio", href: "/studio" },
  { icon: Wrench, label: "My Tools", href: "/dashboard/tools" },
  { icon: Calendar, label: "Events", href: "/dashboard/events" },
  { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
  { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
]

const adminItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard/admin" },
  { icon: Shield, label: "Verification Management", href: "/dashboard/admin/verification" },
  { icon: Store, label: "Listings Management", href: "/dashboard/admin/listings" },
  { icon: Users, label: "Users & Roles", href: "/dashboard/admin/users" },
  { icon: FolderTree, label: "Departments", href: "/dashboard/admin/departments" },
  { icon: MessageSquare, label: "Community Management", href: "/dashboard/admin/community" },
  { icon: Megaphone, label: "Announcements", href: "/dashboard/admin/announcements" },
  { icon: Coins, label: "Payments & Transactions", href: "/dashboard/admin/transactions" },
  { icon: FileText, label: "Reports & Logs", href: "/dashboard/admin/reports" },
  { icon: Settings, label: "System Settings", href: "/dashboard/admin/settings" },
]

export function DashboardSidebar({ profile }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const isAdmin = profile?.role === "admin" || profile?.role === "verifier"

  return (
    <aside
      className={cn("relative flex flex-col border-r bg-card transition-all duration-300", collapsed ? "w-16" : "w-64")}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border bg-background shadow-md"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      <div className={cn("flex items-center gap-2 border-b p-4", collapsed && "justify-center")}>
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/albash logo.png"
            alt="AlbashSolutions Logo"
            width={32}
            height={32}
            className="rounded-lg shrink-0"
          />
          {!collapsed && <span className="font-bold text-lg">AlbashSolutions</span>}
        </Link>
      </div>

      <div className={cn("flex items-center gap-3 border-b p-4", collapsed && "justify-center")}>
        {profile && (
          <>
            <Avatar className="h-10 w-10 ring-2 ring-primary/20">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {profile.full_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{profile.full_name || "User"}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs capitalize">
                    {profile.account_type}
                  </Badge>
                  {profile.is_verified && <Badge className="text-xs bg-green-500/10 text-green-600">Verified</Badge>}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    isActive && "bg-primary/10 text-primary",
                    collapsed && "justify-center px-2",
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Button>
              </Link>
            )
          })}

          {isAdmin && (
            <>
              {!collapsed && (
                <div className="px-3 py-2 mt-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Admin</p>
                </div>
              )}
              {adminItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3",
                        isActive && "bg-primary/10 text-primary",
                        collapsed && "justify-center px-2",
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </Button>
                  </Link>
                )
              })}
            </>
          )}
        </nav>
      </ScrollArea>

      <div className="border-t p-2 space-y-1">
        <Link href="/dashboard/settings">
          <Button variant="ghost" className={cn("w-full justify-start gap-3", collapsed && "justify-center px-2")}>
            <Settings className="h-4 w-4" />
            {!collapsed && <span>Settings</span>}
          </Button>
        </Link>
        <Link href="/help">
          <Button variant="ghost" className={cn("w-full justify-start gap-3", collapsed && "justify-center px-2")}>
            <HelpCircle className="h-4 w-4" />
            {!collapsed && <span>Help</span>}
          </Button>
        </Link>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-destructive hover:text-destructive",
            collapsed && "justify-center px-2",
          )}
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </aside>
  )
}
