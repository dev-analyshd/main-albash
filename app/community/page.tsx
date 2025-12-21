import { createClient } from "@/lib/supabase/server"
import { DiscussionFeed } from "@/components/community/discussion-feed"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import {
  Users,
  Calendar,
  Award,
  TrendingUp,
  Search,
  Plus,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Lightbulb,
  UsersRound,
  Trophy,
} from "lucide-react"

const discussions = [
  {
    id: 1,
    title: "Best practices for getting your first sale on the marketplace",
    author: { name: "Sarah Chen", avatar: null, verified: true },
    category: "Tips & Tricks",
    replies: 23,
    likes: 45,
    time: "2 hours ago",
  },
  {
    id: 2,
    title: "How to price your digital products effectively",
    author: { name: "Michael Brown", avatar: null, verified: true },
    category: "Pricing",
    replies: 18,
    likes: 32,
    time: "5 hours ago",
  },
  {
    id: 3,
    title: "Introducing myself - New builder from Nigeria",
    author: { name: "Adebayo Okonkwo", avatar: null, verified: false },
    category: "Introductions",
    replies: 12,
    likes: 28,
    time: "1 day ago",
  },
  {
    id: 4,
    title: "NFT tokenization: Is it worth it for small sellers?",
    author: { name: "Emma Wilson", avatar: null, verified: true },
    category: "NFTs",
    replies: 31,
    likes: 67,
    time: "2 days ago",
  },
]

const topMembers = [
  { name: "Alex Rivera", score: 2450, badge: "Diamond", avatar: null },
  { name: "Sarah Chen", score: 2120, badge: "Platinum", avatar: null },
  { name: "Michael Brown", score: 1890, badge: "Platinum", avatar: null },
  { name: "Emma Wilson", score: 1650, badge: "Gold", avatar: null },
  { name: "James Kim", score: 1420, badge: "Gold", avatar: null },
]

const upcomingEvents = [
  {
    title: "Weekly Creator Meetup",
    date: "Dec 15, 2025",
    time: "2:00 PM UTC",
    attendees: 45,
  },
  {
    title: "NFT Workshop: Tokenize Your Work",
    date: "Dec 18, 2025",
    time: "4:00 PM UTC",
    attendees: 128,
  },
  {
    title: "Q&A with Top Sellers",
    date: "Dec 20, 2025",
    time: "6:00 PM UTC",
    attendees: 89,
  },
]

export default async function CommunityPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Verification status for access control
  const { data: profile } = user
    ? await supabase.from("profiles").select("is_verified, verification_status").eq("id", user.id).single()
    : { data: null }
  const isVerified = profile?.is_verified || profile?.verification_status === "VERIFIED"

  // Fetch real discussions
  const { data: realDiscussions } = await supabase
    .from("discussions")
    .select("*, profiles(full_name, avatar_url, is_verified)")
    .order("likes_count", { ascending: false })
    .limit(4)

  // Fetch real top members
  const { data: realTopMembers } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, reputation_score")
    .order("reputation_score", { ascending: false })
    .limit(5)

  const displayDiscussions = realDiscussions?.length
    ? realDiscussions.map((d, i) => ({
        id: d.id,
        title: d.title,
        author: {
          name: d.profiles?.full_name || "Anonymous",
          avatar: d.profiles?.avatar_url,
          verified: d.profiles?.is_verified,
        },
        category: d.category,
        replies: d.replies_count,
        likes: d.likes_count,
        time: formatTimeAgo(d.created_at),
      }))
    : discussions

  const displayTopMembers = realTopMembers?.length
    ? realTopMembers.map((m, i) => ({
        name: m.full_name || "Anonymous",
        score: m.reputation_score,
        badge: getBadgeForScore(m.reputation_score),
        avatar: m.avatar_url,
      }))
    : topMembers

  function formatTimeAgo(date: string) {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (hours < 24) return `${hours} hours ago`
    return `${days} days ago`
  }

  function getBadgeForScore(score: number) {
    if (score >= 5000) return "Diamond"
    if (score >= 2500) return "Platinum"
    if (score >= 1000) return "Gold"
    if (score >= 500) return "Silver"
    return "Bronze"
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4">Community</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Connect, Learn, and Grow <span className="text-primary">Together</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Join thousands of builders, creators, and entrepreneurs sharing knowledge and supporting each other.
            </p>
            <div className="flex items-center gap-4 max-w-lg mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search discussions..." className="pl-10" />
              </div>
              <Link href={isVerified ? "/community/discussions/new" : "/verification"}>
                <Button title={isVerified ? "" : "Verification required to create a new post"}>
                  <Plus className="mr-2 h-4 w-4" />
                  {isVerified ? "New Post" : "Verify to Post"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 container mx-auto px-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/community/discussions">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Discussions</h3>
                  <p className="text-sm text-muted-foreground">Ask questions & share</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/community/groups">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-100">
                  <UsersRound className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Groups</h3>
                  <p className="text-sm text-muted-foreground">Join communities</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/community/mentorship">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-100">
                  <Lightbulb className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Mentorship</h3>
                  <p className="text-sm text-muted-foreground">Get expert guidance</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/community/leaderboard">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-yellow-100">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Leaderboard</h3>
                  <p className="text-sm text-muted-foreground">Top contributors</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Discussions Feed - Twitter-like */}
          <div className="lg:col-span-2">
            <DiscussionFeed />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Members */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Top Members
                </CardTitle>
                <CardDescription>This month's most active contributors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {displayTopMembers.map((member: any, index: number) => (
                  <div key={member.name} className="flex items-center gap-3">
                    <span className="text-lg font-bold text-muted-foreground w-6">{index + 1}</span>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar || undefined} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.score} pts</p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        member.badge === "Diamond"
                          ? "bg-cyan-100 text-cyan-700"
                          : member.badge === "Platinum"
                            ? "bg-purple-100 text-purple-700"
                            : member.badge === "Gold"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                      }
                    >
                      {member.badge}
                    </Badge>
                  </div>
                ))}
                <Link href="/community/leaderboard">
                  <Button variant="outline" className="w-full mt-2 bg-transparent">
                    View Full Leaderboard
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.title} className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.date} · {event.time}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{event.attendees} attending</span>
                    </div>
                  </div>
                ))}
                <Link href="/community/events">
                  <Button variant="outline" className="w-full bg-transparent">
                    View All Events
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">12.5K</p>
                    <p className="text-sm text-muted-foreground">Members</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">3.2K</p>
                    <p className="text-sm text-muted-foreground">Discussions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">28K</p>
                    <p className="text-sm text-muted-foreground">Replies</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">156</p>
                    <p className="text-sm text-muted-foreground">Online Now</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
