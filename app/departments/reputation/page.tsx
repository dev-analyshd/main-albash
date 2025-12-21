import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Award, TrendingUp, Shield, Trophy, Target, Zap, Crown } from "lucide-react"

const reputationTiers = [
  { name: "Newcomer", min: 0, max: 99, color: "bg-gray-500", icon: Star },
  { name: "Bronze", min: 100, max: 499, color: "bg-orange-600", icon: Award },
  { name: "Silver", min: 500, max: 999, color: "bg-gray-400", icon: Shield },
  { name: "Gold", min: 1000, max: 2499, color: "bg-yellow-500", icon: Trophy },
  { name: "Platinum", min: 2500, max: 4999, color: "bg-purple-500", icon: Crown },
  { name: "Diamond", min: 5000, max: 999999, color: "bg-cyan-500", icon: Zap },
]

const earningMethods = [
  { action: "Complete profile", points: 50, description: "Fill out all profile information" },
  { action: "Get verified", points: 200, description: "Pass verification process" },
  { action: "Create listing", points: 25, description: "Add a new product or service" },
  { action: "Make a sale", points: 50, description: "Successfully sell an item" },
  { action: "Receive 5-star review", points: 30, description: "Get positive feedback" },
  { action: "Help community", points: 15, description: "Answer questions in discussions" },
  { action: "Refer a user", points: 100, description: "Bring new users to platform" },
  { action: "Complete course", points: 75, description: "Finish a learning program" },
]

export default async function ReputationDepartmentPage() {
  const supabase = await createClient()

  const { data: topUsers } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, reputation_score, is_verified, role")
    .order("reputation_score", { ascending: false })
    .limit(10)

  function getTierForScore(score: number) {
    return reputationTiers.find((tier) => score >= tier.min && score <= tier.max) || reputationTiers[0]
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge className="mb-4">Reputation Department</Badge>
        <h1 className="text-4xl font-bold mb-4">Build Your Reputation</h1>
        <p className="text-xl text-muted-foreground">
          Your reputation score reflects your trustworthiness and activity on AlbashSolutions. Higher scores unlock more
          opportunities.
        </p>
      </div>

      {/* Tiers */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Reputation Tiers</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {reputationTiers.map((tier) => (
            <Card key={tier.name} className="text-center">
              <CardContent className="p-4">
                <div className={`w-12 h-12 rounded-full ${tier.color} flex items-center justify-center mx-auto mb-3`}>
                  <tier.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold">{tier.name}</h3>
                <p className="text-sm text-muted-foreground">{tier.min.toLocaleString()}+ pts</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-16">
        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Top Contributors
            </CardTitle>
            <CardDescription>Users with the highest reputation scores</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topUsers?.map((user, index) => {
              const tier = getTierForScore(user.reputation_score || 0)
              return (
                <div key={user.id} className="flex items-center gap-4">
                  <span className="text-lg font-bold text-muted-foreground w-6">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}`}
                  </span>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar_url || undefined} />
                    <AvatarFallback>{user.full_name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{user.full_name || "User"}</p>
                      {user.is_verified && <Shield className="h-4 w-4 text-green-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{(user.reputation_score || 0).toLocaleString()}</p>
                    <Badge variant="secondary" className={`text-xs text-white ${tier.color}`}>
                      {tier.name}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* How to Earn */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              How to Earn Points
            </CardTitle>
            <CardDescription>Complete actions to increase your reputation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {earningMethods.map((method) => (
              <div key={method.action} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{method.action}</p>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </div>
                <Badge className="bg-green-100 text-green-700">+{method.points} pts</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Benefits */}
      <Card className="mb-16">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Benefits of Higher Reputation</CardTitle>
          <CardDescription>Unlock exclusive features as you grow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-3">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold mb-1">Priority Listing</h3>
              <p className="text-sm text-muted-foreground">Your products appear higher in search results</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-1">Trust Badge</h3>
              <p className="text-sm text-muted-foreground">Display your tier badge on your profile</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-1">Lower Fees</h3>
              <p className="text-sm text-muted-foreground">Reduced transaction fees for top users</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-1">Early Access</h3>
              <p className="text-sm text-muted-foreground">Be first to try new features</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
