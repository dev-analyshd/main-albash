import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Clock, Users, Video, Plus, CalendarPlus, ExternalLink, Bell } from "lucide-react"
import Link from "next/link"

export default async function EventsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: events } = await supabase.from("events").select("*").order("start_date", { ascending: true }).limit(20)

  // Sample events for now
  const upcomingEvents = [
    {
      id: "1",
      title: "Northern Nigeria Artisans Meetup",
      description: "Connect with fellow artisans and share your craft",
      date: "2025-01-15",
      time: "10:00 AM",
      location: "Kano Cultural Center",
      type: "in-person",
      attendees: 45,
      registered: true,
    },
    {
      id: "2",
      title: "E-Commerce Masterclass",
      description: "Learn how to scale your online business",
      date: "2025-01-20",
      time: "2:00 PM",
      location: "Online",
      type: "virtual",
      attendees: 120,
      registered: false,
    },
    {
      id: "3",
      title: "Blockchain for Creators Workshop",
      description: "Understanding NFTs and tokenization for your products",
      date: "2025-01-25",
      time: "11:00 AM",
      location: "Tech Hub Abuja",
      type: "hybrid",
      attendees: 80,
      registered: false,
    },
  ]

  const myEvents = upcomingEvents.filter((e) => e.registered)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground mt-1">Discover workshops, meetups, and networking opportunities</p>
        </div>
        <Link href="/community/events">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="registered">My Events ({myEvents.length})</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Calendar className="h-12 w-12 text-primary/50" />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Badge
                      variant={event.type === "virtual" ? "secondary" : event.type === "hybrid" ? "outline" : "default"}
                    >
                      {event.type === "virtual" ? (
                        <>
                          <Video className="h-3 w-3 mr-1" /> Virtual
                        </>
                      ) : event.type === "hybrid" ? (
                        "Hybrid"
                      ) : (
                        <>
                          <MapPin className="h-3 w-3 mr-1" /> In-Person
                        </>
                      )}
                    </Badge>
                    {event.registered && <Badge className="bg-green-100 text-green-700">Registered</Badge>}
                  </div>

                  <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>

                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(event.date).toLocaleDateString("en-NG", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{event.attendees} attending</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {event.registered ? (
                      <>
                        <Button variant="outline" size="sm" className="flex-1 gap-1 bg-transparent">
                          <CalendarPlus className="h-4 w-4" />
                          Add to Calendar
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Bell className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" className="flex-1">
                        Register Now
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="registered" className="mt-6">
          {myEvents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {myEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden border-primary/20">
                  <div className="h-32 bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                    <Calendar className="h-12 w-12 text-primary/70" />
                  </div>
                  <CardContent className="p-4">
                    <Badge className="bg-green-100 text-green-700 mb-2">Registered</Badge>
                    <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full gap-1 bg-transparent">
                      <ExternalLink className="h-4 w-4" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold text-lg">No registered events</h3>
                <p className="text-muted-foreground text-center mt-2">Browse upcoming events and register to attend</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          <Card>
            <CardContent className="flex flex-col items-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No past events to show</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
