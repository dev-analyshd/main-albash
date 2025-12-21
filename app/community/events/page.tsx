import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Users, MapPin, Video, ArrowRight } from "lucide-react"

const events = [
  {
    id: 1,
    title: "Weekly Creator Meetup",
    description:
      "Join us for our weekly community meetup where we discuss tips, share wins, and connect with fellow creators.",
    date: "Dec 15, 2025",
    time: "2:00 PM UTC",
    type: "online",
    attendees: 45,
    host: { name: "Community Team", avatar: null },
    tags: ["Networking", "Q&A"],
  },
  {
    id: 2,
    title: "NFT Workshop: Tokenize Your Work",
    description:
      "Learn how to tokenize your digital assets and leverage blockchain technology for ownership verification.",
    date: "Dec 18, 2025",
    time: "4:00 PM UTC",
    type: "online",
    attendees: 128,
    host: { name: "Alex Rivera", avatar: null },
    tags: ["Workshop", "NFTs", "Blockchain"],
  },
  {
    id: 3,
    title: "Q&A with Top Sellers",
    description: "Get insights from our most successful marketplace sellers. Ask questions and learn from the best.",
    date: "Dec 20, 2025",
    time: "6:00 PM UTC",
    type: "online",
    attendees: 89,
    host: { name: "Sarah Chen", avatar: null },
    tags: ["Q&A", "Sales", "Tips"],
  },
  {
    id: 4,
    title: "Lagos Creator Meetup",
    description: "In-person meetup for creators in Lagos. Network, collaborate, and build connections.",
    date: "Dec 22, 2025",
    time: "3:00 PM WAT",
    type: "in-person",
    location: "Lagos, Nigeria",
    attendees: 32,
    host: { name: "Adebayo Okonkwo", avatar: null },
    tags: ["In-Person", "Networking"],
  },
]

export default function EventsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4">Events</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Community <span className="text-primary">Events</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Join workshops, meetups, and learning sessions with the AlbashSolutions community.
            </p>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-12 container mx-auto px-4">
        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
            <TabsTrigger value="my-events">My Events</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-8">
            <div className="grid gap-6 md:grid-cols-2">
              {events.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-2 bg-primary" />
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{event.title}</CardTitle>
                        <CardDescription className="mt-2">{event.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {event.type === "online" ? (
                          <>
                            <Video className="h-4 w-4" />
                            <span>Online Event</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{event.attendees} attending</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={event.host.avatar || undefined} />
                          <AvatarFallback>{event.host.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{event.host.name}</p>
                          <p className="text-xs text-muted-foreground">Host</p>
                        </div>
                      </div>
                      <Button>
                        Register
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="past" className="mt-8">
            <p className="text-muted-foreground text-center py-12">Past events will be shown here</p>
          </TabsContent>

          <TabsContent value="my-events" className="mt-8">
            <p className="text-muted-foreground text-center py-12">Events you've registered for will appear here</p>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}
