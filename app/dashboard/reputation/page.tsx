import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, TrendingUp, TrendingDown, Award, Shield, Zap, Target } from "lucide-react"

export default async function ReputationPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("reputation_score, is_verified")
    .eq("id", user?.id)
    .single()

  const { data: reputationLogs } = await supabase
    .from("reputation_logs")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  const score = profile?.reputation_score || 0
  const maxScore = 1000
  const percentage = (score / maxScore) * 100

  const getLevel = (score: number) => {
    if (score >= 800) return { name: "Diamond", color: "text-cyan-500", icon: Award }
    if (score >= 600) return { name: "Platinum", color: "text-purple-500", icon: Shield }
    if (score >= 400) return { name: "Gold", color: "text-yellow-500", icon: Star }
    if (score >= 200) return { name: "Silver", color: "text-gray-400", icon: Zap }
    return { name: "Bronze", color: "text-orange-600", icon: Target }
  }

  const level = getLevel(score)
  const LevelIcon = level.icon

  const positiveChanges = reputationLogs?.filter((l) => l.change > 0).reduce((sum, l) => sum + l.change, 0) || 0
  const negativeChanges =
    reputationLogs?.filter((l) => l.change < 0).reduce((sum, l) => sum + Math.abs(l.change), 0) || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reputation</h1>
        <p className="text-muted-foreground mt-1">Track your reputation score and see how it impacts your visibility</p>
      </div>

      {/* Score Overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-4xl font-bold">{score}</p>
                    <p className="text-sm text-muted-foreground">/ {maxScore}</p>
                  </div>
                </div>
                <div
                  className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-background border ${level.color}`}
                >
                  <div className="flex items-center gap-1">
                    <LevelIcon className="h-4 w-4" />
                    <span className="font-medium text-sm">{level.name}</span>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Your Reputation Level</h3>
                <Progress value={percentage} className="h-3 mb-4" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>0</span>
                  <span>200</span>
                  <span>400</span>
                  <span>600</span>
                  <span>800</span>
                  <span>1000</span>
                </div>
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm">
                    {score < 200 && "Build your reputation by completing transactions and getting verified."}
                    {score >= 200 && score < 400 && "Great progress! Keep completing successful transactions."}
                    {score >= 400 && score < 600 && "You're a trusted member of the community!"}
                    {score >= 600 && score < 800 && "Excellent reputation! You're among the top members."}
                    {score >= 800 && "Outstanding! You've achieved Diamond status."}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm">Points Earned</span>
              </div>
              <span className="font-semibold text-green-600">+{positiveChanges}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span className="text-sm">Points Lost</span>
              </div>
              <span className="font-semibold text-red-600">-{negativeChanges}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm">Verified</span>
              </div>
              <Badge variant={profile?.is_verified ? "default" : "secondary"}>
                {profile?.is_verified ? "Yes" : "No"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How to Earn */}
      <Card>
        <CardHeader>
          <CardTitle>How to Earn Reputation</CardTitle>
          <CardDescription>Actions that increase your reputation score</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { action: "Complete a sale", points: "+10", icon: Star },
              { action: "Get verified", points: "+50", icon: Shield },
              { action: "Receive 5-star review", points: "+5", icon: Award },
              { action: "Mint an NFT", points: "+20", icon: Zap },
            ].map((item) => (
              <div key={item.action} className="p-4 border rounded-lg text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="font-medium">{item.action}</p>
                <p className="text-green-600 font-semibold mt-1">{item.points}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle>Reputation History</CardTitle>
          <CardDescription>Recent changes to your reputation score</CardDescription>
        </CardHeader>
        <CardContent>
          {reputationLogs && reputationLogs.length > 0 ? (
            <div className="space-y-4">
              {reputationLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${log.change > 0 ? "bg-green-100" : "bg-red-100"}`}>
                      {log.change > 0 ? (
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{log.reason}</p>
                      <p className="text-sm text-muted-foreground">{new Date(log.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge variant={log.change > 0 ? "default" : "destructive"} className="font-mono">
                    {log.change > 0 ? "+" : ""}
                    {log.change}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Star className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No reputation activity yet</p>
              <p className="text-sm mt-1">Complete transactions to start building your reputation</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
