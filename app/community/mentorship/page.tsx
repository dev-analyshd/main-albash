import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Search, Star, Users, Clock, Award, MessageSquare, Shield, Briefcase } from "lucide-react"

const expertiseAreas = [
  "Web Development",
  "Mobile Apps",
  "UI/UX Design",
  "Business Strategy",
  "Marketing",
  "Blockchain",
  "AI/ML",
  "Data Science",
  "Finance",
  "Leadership",
]

export default async function MentorshipPage() {
  const supabase = await createClient()

  const { data: mentors } = await supabase
    .from("mentors")
    .select(
      `
      *,
      profile:profiles(id, full_name, avatar_url, is_verified, reputation_score, role)
    `,
    )
    .eq("is_available", true)
    .order("rating", { ascending: false })
    .limit(20)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-12 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <Badge className="mb-4">Mentorship Hub</Badge>
            <h1 className="text-4xl font-bold mb-4">
              Learn from <span className="text-primary">Experienced Mentors</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Connect with verified experts who can guide your journey. Get personalized advice, feedback, and support.
            </p>
            <div className="flex gap-4">
              <Link href="/community/mentorship/become">
                <Button variant="outline" className="bg-transparent">
                  Become a Mentor
                </Button>
              </Link>
              <Link href="/community/mentorship/requests">
                <Button>Find a Mentor</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mentors?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Active Mentors</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">500+</p>
                  <p className="text-sm text-muted-foreground">Sessions Done</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">4.8</p>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Award className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">10</p>
                  <p className="text-sm text-muted-foreground">Expertise Areas</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search mentors by name or expertise..." className="pl-10" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {expertiseAreas.map((area) => (
              <Badge
                key={area}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              >
                {area}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Mentors Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Mentors</TabsTrigger>
              <TabsTrigger value="top">Top Rated</TabsTrigger>
              <TabsTrigger value="new">New Mentors</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {mentors && mentors.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mentors.map((mentor) => (
                    <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={mentor.profile?.avatar_url || undefined} />
                            <AvatarFallback className="text-lg">
                              {mentor.profile?.full_name?.charAt(0) || "M"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{mentor.profile?.full_name}</h3>
                              {mentor.profile?.is_verified && <Shield className="h-4 w-4 text-primary" />}
                            </div>
                            <p className="text-sm text-muted-foreground capitalize">{mentor.profile?.role}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={`h-3 w-3 ${s <= Math.round(mentor.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">({mentor.total_sessions} sessions)</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{mentor.bio || "No bio yet"}</p>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {mentor.expertise?.slice(0, 3).map((exp: string) => (
                            <Badge key={exp} variant="secondary" className="text-xs">
                              {exp}
                            </Badge>
                          ))}
                          {mentor.expertise?.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{mentor.expertise.length - 3}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {mentor.hourly_rate ? `$${mentor.hourly_rate}/hr` : "Free"}
                            </span>
                          </div>
                          <Link href={`/community/mentorship/${mentor.id}`}>
                            <Button size="sm">Request Session</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">No Mentors Yet</h3>
                    <p className="text-muted-foreground mb-4">Be the first mentor in our community!</p>
                    <Link href="/community/mentorship/become">
                      <Button>Become a Mentor</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="top">
              <p className="text-muted-foreground text-center py-8">Top rated mentors will appear here</p>
            </TabsContent>

            <TabsContent value="new">
              <p className="text-muted-foreground text-center py-8">New mentors will appear here</p>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">How Mentorship Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: 1,
                title: "Find a Mentor",
                description: "Browse mentors and find someone who matches your needs",
              },
              { step: 2, title: "Request Session", description: "Send a request explaining what you'd like to learn" },
              { step: 3, title: "Schedule Meeting", description: "Once accepted, schedule a convenient time for both" },
              { step: 4, title: "Learn & Grow", description: "Have your session and accelerate your growth" },
            ].map((item) => (
              <Card key={item.step}>
                <CardContent className="p-6 text-center">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
