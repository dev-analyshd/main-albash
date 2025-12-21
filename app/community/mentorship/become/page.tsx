"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Award, Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const expertiseOptions = [
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
  "Product Management",
  "Content Creation",
]

export default function BecomeMentorPage() {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [expertise, setExpertise] = useState<string[]>([])
  const [formData, setFormData] = useState({
    bio: "",
    hourly_rate: "",
  })

  const router = useRouter()

  const toggleExpertise = (area: string) => {
    setExpertise((prev) => (prev.includes(area) ? prev.filter((e) => e !== area) : [...prev, area]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push("/auth/sign-in")
      return
    }

    const { error } = await supabase.from("mentors").insert({
      user_id: user.id,
      bio: formData.bio,
      expertise,
      hourly_rate: formData.hourly_rate ? Number.parseFloat(formData.hourly_rate) : null,
      is_available: true,
    })

    if (!error) {
      setSuccess(true)
      setTimeout(() => router.push("/community/mentorship"), 2000)
    }

    setSubmitting(false)
  }

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-12 pb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">You're Now a Mentor!</h2>
            <p className="text-muted-foreground">Redirecting to mentorship hub...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Link
          href="/community/mentorship"
          className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Mentorship Hub
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Become a Mentor
          </CardTitle>
          <CardDescription>Share your expertise and help others grow in the community</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="bio">About You *</Label>
              <Textarea
                id="bio"
                placeholder="Tell potential mentees about your experience, what you can help with, and your mentoring style..."
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Areas of Expertise *</Label>
              <p className="text-sm text-muted-foreground mb-3">Select all areas you can mentor in</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {expertiseOptions.map((area) => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox
                      id={area}
                      checked={expertise.includes(area)}
                      onCheckedChange={() => toggleExpertise(area)}
                    />
                    <Label htmlFor={area} className="text-sm cursor-pointer">
                      {area}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="hourly_rate">Hourly Rate (USD)</Label>
              <Input
                id="hourly_rate"
                type="number"
                min="0"
                step="1"
                placeholder="Leave empty for free sessions"
                value={formData.hourly_rate}
                onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">Leave empty to offer free mentorship sessions</p>
            </div>

            <Button type="submit" className="w-full" disabled={submitting || expertise.length === 0 || !formData.bio}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitting ? "Setting Up..." : "Become a Mentor"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
