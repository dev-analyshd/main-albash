import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Shield, Star, Mail, Phone, ArrowLeft, Calendar, Heart } from "lucide-react"

export default async function OrganizationProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: org, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .eq("role", "organization")
    .single()

  if (error || !org) {
    notFound()
  }

  // Get organization's events
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("created_by", id)
    .order("start_date", { ascending: false })
    .limit(6)

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Back */}
      <Link
        href="/departments/organizations"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Directory
      </Link>

      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <Avatar className="h-32 w-32">
              <AvatarImage src={org.avatar_url || undefined} />
              <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                {org.full_name?.charAt(0) || "O"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{org.full_name || "Organization"}</h1>
                {org.is_verified && (
                  <Badge className="bg-green-100 text-green-700 gap-1">
                    <Shield className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>

              <p className="text-lg text-muted-foreground mb-4">
                {org.bio || "Organization verified by AlbashSolutions."}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  {org.reputation_score || 0} reputation
                </span>
                {org.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {org.email}
                  </span>
                )}
                {org.phone_number && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {org.phone_number}
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                <Button className="gap-2">
                  <Heart className="h-4 w-4" />
                  Donate
                </Button>
                <Button variant="outline" className="bg-transparent">
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Events & Programs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {events && events.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Card key={event.id} className="hover:border-primary transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(event.start_date).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{event.description}</p>
                    {event.location && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {event.is_virtual ? "Virtual" : event.location}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No events listed yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
