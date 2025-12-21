import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Search, Users, MessageSquare, Lightbulb, BookOpen, HeartHandshake, Plus, Lock, Globe } from "lucide-react"

const roomTypes = [
  { id: "project", label: "Project", icon: Lightbulb, color: "bg-blue-100 text-blue-600" },
  { id: "study", label: "Study Group", icon: BookOpen, color: "bg-green-100 text-green-600" },
  { id: "brainstorm", label: "Brainstorm", icon: Lightbulb, color: "bg-yellow-100 text-yellow-600" },
  { id: "support", label: "Support", icon: HeartHandshake, color: "bg-pink-100 text-pink-600" },
]

export default async function CollaborationPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase.from("profiles").select("is_verified, verification_status").eq("id", user.id).single()
    : { data: null }
  const isVerified = profile?.is_verified || profile?.verification_status === "VERIFIED"

  const { data: rooms } = await supabase
    .from("collaboration_rooms")
    .select(
      `
      *,
      owner:profiles!collaboration_rooms_owner_id_fkey(id, full_name, avatar_url),
      members:room_members(count)
    `,
    )
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(20)

  // Get user's rooms
  let myRooms: any[] = []
  if (user) {
    const { data } = await supabase
      .from("room_members")
      .select(
        `
        room:collaboration_rooms(*, owner:profiles!collaboration_rooms_owner_id_fkey(full_name, avatar_url), members:room_members(count))
      `,
      )
      .eq("user_id", user.id)
    myRooms = data?.map((rm) => rm.room).filter(Boolean) || []
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-12 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <Badge className="mb-4">Collaboration Rooms</Badge>
            <h1 className="text-4xl font-bold mb-4">
              Build <span className="text-primary">Together</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Join collaboration rooms to work on projects, study together, brainstorm ideas, or get support from the
              community.
            </p>
            <Link href={isVerified ? "/community/collaboration/create" : "/verification"}>
              <Button className="gap-2" title={isVerified ? "" : "Verification required to create a room"}>
                <Plus className="h-4 w-4" />
                {isVerified ? "Create Room" : "Verify to Create"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search rooms..." className="pl-10" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {roomTypes.map((type) => (
              <Badge
                key={type.id}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground gap-1"
              >
                <type.icon className="h-3 w-3" />
                {type.label}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Rooms</TabsTrigger>
              <TabsTrigger value="my-rooms">My Rooms ({myRooms.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {rooms && rooms.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rooms.map((room) => {
                    const typeInfo = roomTypes.find((t) => t.id === room.room_type)
                    const TypeIcon = typeInfo?.icon || Lightbulb
                    const memberCount = room.members?.[0]?.count || 0

                    return (
                      <Card key={room.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className={`p-2 rounded-lg ${typeInfo?.color || "bg-muted"}`}>
                              <TypeIcon className="h-5 w-5" />
                            </div>
                            <div className="flex items-center gap-1">
                              {room.is_public ? (
                                <Globe className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Lock className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                          <CardTitle className="mt-3 line-clamp-1">{room.name}</CardTitle>
                          <CardDescription className="line-clamp-2">{room.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {room.tags?.slice(0, 3).map((tag: string) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={room.owner?.avatar_url || undefined} />
                                <AvatarFallback className="text-xs">{room.owner?.full_name?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-muted-foreground truncate max-w-[80px]">
                                {room.owner?.full_name}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>
                                  {memberCount}/{room.max_members}
                                </span>
                              </div>
                              <Link href={`/community/collaboration/${room.id}`}>
                                <Button size="sm">Join</Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">No Rooms Yet</h3>
                    <p className="text-muted-foreground mb-4">Be the first to create a collaboration room!</p>
                    <Link href="/community/collaboration/create">
                      <Button>Create Room</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="my-rooms">
              {myRooms.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myRooms.map((room) => {
                    const typeInfo = roomTypes.find((t) => t.id === room.room_type)
                    const TypeIcon = typeInfo?.icon || Lightbulb
                    const memberCount = room.members?.[0]?.count || 0

                    return (
                      <Card key={room.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className={`p-2 rounded-lg ${typeInfo?.color || "bg-muted"}`}>
                              <TypeIcon className="h-5 w-5" />
                            </div>
                            <Badge variant="outline">Joined</Badge>
                          </div>
                          <CardTitle className="mt-3 line-clamp-1">{room.name}</CardTitle>
                          <CardDescription className="line-clamp-2">{room.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between pt-3 border-t">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>{memberCount} members</span>
                            </div>
                            <Link href={`/community/collaboration/${room.id}`}>
                              <Button size="sm" variant="secondary">
                                Enter
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">No Rooms Joined</h3>
                    <p className="text-muted-foreground mb-4">Join a room to start collaborating!</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
