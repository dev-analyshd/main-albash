import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Briefcase, Shield, Star, ArrowRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default async function BusinessesDirectoryPage() {
  const supabase = await createClient()

  // Get verified businesses
  const { data: businesses } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "business")
    .eq("is_verified", true)
    .order("reputation_score", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
          <Briefcase className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Verified Businesses</h1>
        <p className="text-lg text-muted-foreground">
          Browse our directory of verified small businesses and entrepreneurs.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search businesses..." className="pl-10" />
        </div>
      </div>

      {/* Directory Grid */}
      {businesses && businesses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business) => (
            <Link key={business.id} href={`/departments/businesses/${business.id}`}>
              <Card className="h-full hover:shadow-lg hover:border-primary transition-all cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={business.avatar_url || undefined} />
                      <AvatarFallback className="text-xl bg-primary/10 text-primary">
                        {business.full_name?.charAt(0) || "B"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{business.full_name || "Business"}</h3>
                        <Shield className="h-4 w-4 text-primary shrink-0" />
                      </div>
                      <Badge variant="secondary" className="mb-2">
                        Verified Business
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mt-4 line-clamp-2">
                    {business.bio || "Business verified by AlbashSolutions."}
                  </p>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {business.reputation_score || 0} reputation
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1 text-primary p-0">
                      View Profile
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="max-w-md mx-auto">
          <CardContent className="py-12 text-center">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="font-semibold mb-2">No Verified Businesses Yet</h3>
            <p className="text-muted-foreground mb-4">Be the first business to get verified!</p>
            <Link href="/apply/business">
              <Button>Apply for Verification</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* CTA */}
      <div className="text-center mt-16">
        <Card className="max-w-2xl mx-auto bg-primary text-primary-foreground">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Own a Small Business?</h2>
            <p className="mb-6 text-primary-foreground/80">
              Get verified and listed in our directory to reach more customers and build trust.
            </p>
            <Link href="/apply/business">
              <Button variant="secondary" size="lg" className="gap-2">
                Apply for Verification
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
