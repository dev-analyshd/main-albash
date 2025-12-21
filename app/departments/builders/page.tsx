import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Search, Star, Shield, Briefcase, ArrowRight, Lightbulb } from "lucide-react"

export default async function BuildersDirectoryPage() {
  const supabase = await createClient()

  const { data: builders } = await supabase
    .from("profiles")
    .select("*, listings(count)")
    .eq("role", "builder")
    .eq("is_verified", true)
    .order("reputation_score", { ascending: false })
    .limit(50)

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <Badge className="mb-4">Directory</Badge>
        <h1 className="text-4xl font-bold mb-4">Verified Builders</h1>
        <p className="text-xl text-muted-foreground">
          Connect with verified builders, innovators, and creators. All builders on this page have been verified by
          AlbashSolutions.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-lg mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search builders by name, skill, or location..." className="pl-10" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{builders?.length || 0}</p>
            <p className="text-sm text-muted-foreground">Verified Builders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-chart-2">500+</p>
            <p className="text-sm text-muted-foreground">Ideas Listed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-chart-3">15+</p>
            <p className="text-sm text-muted-foreground">Categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-chart-4">98%</p>
            <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Builders Grid */}
      {builders && builders.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {builders.map((builder) => (
            <Link key={builder.id} href={`/profile/${builder.id}`}>
              <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20 mb-4 ring-2 ring-primary/20">
                      <AvatarImage src={builder.avatar_url || undefined} />
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {builder.full_name?.charAt(0) || "B"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {builder.full_name || "Builder"}
                      </h3>
                      <Shield className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {builder.bio || "Verified AlbashSolutions builder"}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        {builder.reputation_score || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Lightbulb className="h-4 w-4" />
                        {builder.listings?.[0]?.count || 0} listings
                      </span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Verified Builder
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Briefcase className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-semibold text-lg mb-2">No Verified Builders Yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to join our verified builders directory.</p>
            <Link href="/apply/builder">
              <Button>
                Apply as Builder
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* CTA */}
      <Card className="mt-12 bg-primary text-primary-foreground">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Want to Join the Directory?</h2>
          <p className="mb-6 text-primary-foreground/80">
            Apply to become a verified builder and showcase your ideas, talents, and innovations.
          </p>
          <Link href="/apply/builder">
            <Button variant="secondary" size="lg">
              Apply Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
