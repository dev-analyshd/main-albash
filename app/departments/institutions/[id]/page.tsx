import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { GraduationCap, Shield, Star, Mail, Phone, ArrowLeft, Store } from "lucide-react"

export default async function InstitutionProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: institution, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .eq("role", "institution")
    .single()

  if (error || !institution) {
    notFound()
  }

  // Get institution's listings
  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .eq("user_id", id)
    .eq("is_verified", true)
    .order("created_at", { ascending: false })
    .limit(6)

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Back */}
      <Link
        href="/departments/institutions"
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
              <AvatarImage src={institution.avatar_url || undefined} />
              <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                {institution.full_name?.charAt(0) || "I"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{institution.full_name || "Institution"}</h1>
                {institution.is_verified && (
                  <Badge className="bg-green-100 text-green-700 gap-1">
                    <Shield className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>

              <p className="text-lg text-muted-foreground mb-4">
                {institution.bio || "Educational institution verified by AlbashSolutions."}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  {institution.reputation_score || 0} reputation
                </span>
                {institution.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {institution.email}
                  </span>
                )}
                {institution.phone_number && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {institution.phone_number}
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                <Button>Contact Institution</Button>
                <Button variant="outline" className="bg-transparent">
                  View Services
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Listings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Programs & Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          {listings && listings.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <Link key={listing.id} href={`/marketplace/listing/${listing.id}`}>
                  <Card className="hover:border-primary transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                        {listing.images?.[0] ? (
                          <img
                            src={listing.images[0] || "/placeholder.svg"}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <GraduationCap className="h-8 w-8 text-muted-foreground/50" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold truncate">{listing.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{listing.description}</p>
                      {listing.price && <p className="text-primary font-bold mt-2">${listing.price}</p>}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Store className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No programs or services listed yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
