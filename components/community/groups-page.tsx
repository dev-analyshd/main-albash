"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Users, Lock, Globe, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Group {
  id: string
  name: string
  description: string | null
  image_url: string | null
  category: string
  member_count: number
  is_private: boolean
  created_at: string
  creator?: { full_name: string | null; avatar_url: string | null }
}

interface GroupsPageProps {
  groups: Group[]
  userGroups: string[]
  currentUserId?: string
}

const categoryColors: Record<string, string> = {
  general: "bg-gray-100 text-gray-700",
  tech: "bg-blue-100 text-blue-700",
  design: "bg-purple-100 text-purple-700",
  business: "bg-green-100 text-green-700",
  marketing: "bg-orange-100 text-orange-700",
  nfts: "bg-cyan-100 text-cyan-700",
}

export function GroupsPage({ groups, userGroups: initialUserGroups, currentUserId }: GroupsPageProps) {
  const router = useRouter()
  const supabase = createClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [userGroups, setUserGroups] = useState(initialUserGroups)
  const [joiningGroup, setJoiningGroup] = useState<string | null>(null)

  const filteredGroups = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const myGroups = filteredGroups.filter((g) => userGroups.includes(g.id))
  const discoverGroups = filteredGroups.filter((g) => !userGroups.includes(g.id))

  const handleJoinGroup = async (groupId: string) => {
    if (!currentUserId) {
      router.push("/auth/login?redirect=/community/groups")
      return
    }

    setJoiningGroup(groupId)
    const { error } = await supabase.from("group_members").insert({
      group_id: groupId,
      user_id: currentUserId,
    })

    if (!error) {
      setUserGroups([...userGroups, groupId])
      // Update member count
      await supabase.rpc("increment_group_members", { group_id: groupId })
    }
    setJoiningGroup(null)
  }

  const handleLeaveGroup = async (groupId: string) => {
    if (!currentUserId) return

    setJoiningGroup(groupId)
    await supabase.from("group_members").delete().eq("group_id", groupId).eq("user_id", currentUserId)

    setUserGroups(userGroups.filter((id) => id !== groupId))
    setJoiningGroup(null)
  }

  const GroupCard = ({ group, isMember }: { group: Group; isMember: boolean }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="hover:shadow-md transition-shadow h-full">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
              {group.image_url ? (
                <img
                  src={group.image_url || "/placeholder.svg"}
                  alt={group.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Users className="h-8 w-8 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg truncate">{group.name}</h3>
                {group.is_private ? (
                  <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                ) : (
                  <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{group.description || "No description"}</p>
              <div className="flex items-center gap-3">
                <Badge className={cn(categoryColors[group.category] || "bg-gray-100", "capitalize")}>
                  {group.category}
                </Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {group.member_count} members
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            {isMember ? (
              <>
                <Link href={`/community/groups/${group.id}`} className="flex-1">
                  <Button className="w-full gap-2">
                    Enter Group
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => handleLeaveGroup(group.id)}
                  disabled={joiningGroup === group.id}
                  className="bg-transparent"
                >
                  Leave
                </Button>
              </>
            ) : (
              <Button onClick={() => handleJoinGroup(group.id)} disabled={joiningGroup === group.id} className="w-full">
                {joiningGroup === group.id ? "Joining..." : "Join Group"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <section className="py-12 bg-gradient-to-br from-primary/10 via-background to-background border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Community Groups</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Join groups based on your interests and connect with like-minded builders
            </p>
            <div className="flex items-center gap-4 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search groups..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Link href="/community/groups/create">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Group
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 container mx-auto px-4">
        <Tabs defaultValue="discover">
          <TabsList className="mb-6">
            <TabsTrigger value="discover">Discover ({discoverGroups.length})</TabsTrigger>
            <TabsTrigger value="my-groups">My Groups ({myGroups.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="discover">
            {discoverGroups.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No groups found</p>
                  <p className="text-sm text-muted-foreground">Be the first to create a group!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {discoverGroups.map((group) => (
                  <GroupCard key={group.id} group={group} isMember={false} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-groups">
            {myGroups.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">You haven't joined any groups yet</p>
                  <p className="text-sm text-muted-foreground mb-4">Discover and join groups to connect with others</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {myGroups.map((group) => (
                  <GroupCard key={group.id} group={group} isMember={true} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}
