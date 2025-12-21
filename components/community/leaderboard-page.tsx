"use client"

import { motion } from "framer-motion"
import { Trophy, Medal, Award, Crown, Star, Target, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface LeaderboardEntry {
  id: string
  full_name: string | null
  avatar_url: string | null
  reputation_score: number
  is_verified: boolean
  account_type: string
}

interface LeaderboardPageProps {
  leaderboard: LeaderboardEntry[]
  currentUserId?: string
  userRank: number | null
}

const getBadge = (score: number) => {
  if (score >= 5000) return { name: "Diamond", color: "bg-cyan-100 text-cyan-700", icon: Crown }
  if (score >= 2500) return { name: "Platinum", color: "bg-purple-100 text-purple-700", icon: Trophy }
  if (score >= 1000) return { name: "Gold", color: "bg-yellow-100 text-yellow-700", icon: Medal }
  if (score >= 500) return { name: "Silver", color: "bg-gray-200 text-gray-700", icon: Award }
  return { name: "Bronze", color: "bg-orange-100 text-orange-700", icon: Star }
}

const getNextBadge = (score: number) => {
  if (score >= 5000) return { target: 10000, name: "Legend" }
  if (score >= 2500) return { target: 5000, name: "Diamond" }
  if (score >= 1000) return { target: 2500, name: "Platinum" }
  if (score >= 500) return { target: 1000, name: "Gold" }
  return { target: 500, name: "Silver" }
}

export function LeaderboardPage({ leaderboard, currentUserId, userRank }: LeaderboardPageProps) {
  const topThree = leaderboard.slice(0, 3)
  const restOfList = leaderboard.slice(3)
  const currentUser = leaderboard.find((u) => u.id === currentUserId)

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <section className="py-12 bg-gradient-to-br from-primary/10 via-background to-background border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4">Leaderboard</Badge>
            <h1 className="text-4xl font-bold mb-4">Community Champions</h1>
            <p className="text-lg text-muted-foreground">
              Recognize and celebrate the most active and helpful members of our community
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Leaderboard */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top 3 Podium */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Top Champions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-center gap-4 py-8">
                  {/* 2nd Place */}
                  {topThree[1] && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-center"
                    >
                      <Avatar className="h-20 w-20 mx-auto ring-4 ring-gray-300">
                        <AvatarImage src={topThree[1].avatar_url || "/placeholder.svg"} />
                        <AvatarFallback className="text-2xl">{topThree[1].full_name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="mt-3 p-4 bg-gray-100 rounded-lg">
                        <Medal className="h-6 w-6 text-gray-500 mx-auto mb-1" />
                        <p className="font-semibold truncate max-w-24">{topThree[1].full_name || "Anonymous"}</p>
                        <p className="text-sm text-muted-foreground">{topThree[1].reputation_score} pts</p>
                      </div>
                    </motion.div>
                  )}

                  {/* 1st Place */}
                  {topThree[0] && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-center -mt-8"
                    >
                      <Crown className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                      <Avatar className="h-24 w-24 mx-auto ring-4 ring-yellow-400">
                        <AvatarImage src={topThree[0].avatar_url || "/placeholder.svg"} />
                        <AvatarFallback className="text-3xl">{topThree[0].full_name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="mt-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <Trophy className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
                        <p className="font-semibold truncate max-w-28">{topThree[0].full_name || "Anonymous"}</p>
                        <p className="text-sm text-muted-foreground">{topThree[0].reputation_score} pts</p>
                      </div>
                    </motion.div>
                  )}

                  {/* 3rd Place */}
                  {topThree[2] && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-center"
                    >
                      <Avatar className="h-20 w-20 mx-auto ring-4 ring-orange-300">
                        <AvatarImage src={topThree[2].avatar_url || "/placeholder.svg"} />
                        <AvatarFallback className="text-2xl">{topThree[2].full_name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="mt-3 p-4 bg-orange-50 rounded-lg">
                        <Award className="h-6 w-6 text-orange-500 mx-auto mb-1" />
                        <p className="font-semibold truncate max-w-24">{topThree[2].full_name || "Anonymous"}</p>
                        <p className="text-sm text-muted-foreground">{topThree[2].reputation_score} pts</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Full Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle>Full Rankings</CardTitle>
                <CardDescription>Top 100 community members by reputation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {restOfList.map((user, index) => {
                    const rank = index + 4
                    const badge = getBadge(user.reputation_score)
                    const BadgeIcon = badge.icon
                    const isCurrentUser = user.id === currentUserId

                    return (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className={cn(
                          "flex items-center gap-4 p-3 rounded-lg transition-colors",
                          isCurrentUser ? "bg-primary/10 border border-primary/20" : "hover:bg-muted",
                        )}
                      >
                        <span className="text-lg font-bold text-muted-foreground w-8">#{rank}</span>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
                          <AvatarFallback>{user.full_name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">{user.full_name || "Anonymous"}</p>
                            {user.is_verified && (
                              <Badge className="h-5 text-xs bg-green-500/10 text-green-600">Verified</Badge>
                            )}
                            {isCurrentUser && <Badge variant="outline">You</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground capitalize">{user.account_type}</p>
                        </div>
                        <Badge className={cn(badge.color, "gap-1")}>
                          <BadgeIcon className="h-3 w-3" />
                          {badge.name}
                        </Badge>
                        <span className="font-bold text-primary">{user.reputation_score}</span>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your Rank */}
            {currentUser && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Your Rank
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <span className="text-5xl font-bold text-primary">#{userRank}</span>
                    <p className="text-muted-foreground mt-1">out of {leaderboard.length} members</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Current Points</span>
                      <span className="font-bold">{currentUser.reputation_score}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Current Badge</span>
                      <Badge className={getBadge(currentUser.reputation_score).color}>
                        {getBadge(currentUser.reputation_score).name}
                      </Badge>
                    </div>
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Next: {getNextBadge(currentUser.reputation_score).name}</span>
                        <span>
                          {currentUser.reputation_score}/{getNextBadge(currentUser.reputation_score).target}
                        </span>
                      </div>
                      <Progress
                        value={(currentUser.reputation_score / getNextBadge(currentUser.reputation_score).target) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* How to Earn Points */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Earn Points
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <span className="text-sm">Complete a sale</span>
                  <Badge variant="secondary">+50 pts</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <span className="text-sm">Get verified</span>
                  <Badge variant="secondary">+100 pts</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <span className="text-sm">Receive 5-star review</span>
                  <Badge variant="secondary">+25 pts</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <span className="text-sm">Help in community</span>
                  <Badge variant="secondary">+10 pts</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <span className="text-sm">Create a listing</span>
                  <Badge variant="secondary">+15 pts</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Badge Tiers */}
            <Card>
              <CardHeader>
                <CardTitle>Badge Tiers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Crown className="h-5 w-5 text-cyan-500" />
                  <div className="flex-1">
                    <p className="font-medium">Diamond</p>
                    <p className="text-xs text-muted-foreground">5,000+ points</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Trophy className="h-5 w-5 text-purple-500" />
                  <div className="flex-1">
                    <p className="font-medium">Platinum</p>
                    <p className="text-xs text-muted-foreground">2,500+ points</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Medal className="h-5 w-5 text-yellow-500" />
                  <div className="flex-1">
                    <p className="font-medium">Gold</p>
                    <p className="text-xs text-muted-foreground">1,000+ points</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="font-medium">Silver</p>
                    <p className="text-xs text-muted-foreground">500+ points</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-orange-500" />
                  <div className="flex-1">
                    <p className="font-medium">Bronze</p>
                    <p className="text-xs text-muted-foreground">0+ points</p>
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
