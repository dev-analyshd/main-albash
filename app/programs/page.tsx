import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { GraduationCap, Rocket, Users, Award, ArrowRight, CheckCircle, Clock } from "lucide-react"

export default async function ProgramsPage() {
  const supabase = await createClient()

  const { data: programs } = await supabase.from("programs").select("*").eq("is_active", true).order("created_at")

  const benefits = [
    "Access to exclusive resources and tools",
    "Mentorship from industry experts",
    "Networking opportunities",
    "Priority support and verification",
    "Discounted marketplace fees",
    "Certificate upon completion",
  ]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4">Programs</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Accelerate Your <span className="text-primary">Growth</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Join our specialized programs designed to help builders, students, and businesses achieve their goals
              faster.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Available Programs</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs?.map((program) => (
            <Card key={program.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant={program.is_active ? "default" : "secondary"}>
                    {program.is_active ? "Open" : "Closed"}
                  </Badge>
                </div>
                <CardTitle className="mt-4">{program.name}</CardTitle>
                <CardDescription>{program.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{program.duration || "8 weeks"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Limited spots available</span>
                  </div>
                </div>
              </CardContent>
              <div className="p-6 pt-0">
                <Link href={`/programs/${program.id}`}>
                  <Button className="w-full">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}

          {(!programs || programs.length === 0) && (
            <>
              {[
                {
                  name: "Builder Bootcamp",
                  description: "Intensive 8-week program to launch your first product on the marketplace",
                },
                {
                  name: "Student Accelerator",
                  description: "Special program for students to monetize their skills and build portfolios",
                },
                {
                  name: "Business Launch",
                  description: "Help small businesses establish their digital presence and start selling",
                },
                {
                  name: "Creator Fellowship",
                  description: "For established creators looking to scale their operations",
                },
                {
                  name: "Institution Partnership",
                  description: "Comprehensive program for educational institutions and organizations",
                },
              ].map((program, i) => (
                <Card key={i} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <GraduationCap className="h-6 w-6 text-primary" />
                      </div>
                      <Badge>Open</Badge>
                    </div>
                    <CardTitle className="mt-4">{program.name}</CardTitle>
                    <CardDescription>{program.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>8 weeks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Limited spots available</span>
                      </div>
                    </div>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button className="w-full">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </>
          )}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Program Benefits</h2>
              <p className="text-muted-foreground mb-8">
                All our programs come with a comprehensive set of benefits designed to help you succeed.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Rocket className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-2xl">500+</h3>
                  <p className="text-muted-foreground">Program Graduates</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-2xl">92%</h3>
                  <p className="text-muted-foreground">Success Rate</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-2xl">50+</h3>
                  <p className="text-muted-foreground">Expert Mentors</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-2xl">5</h3>
                  <p className="text-muted-foreground">Active Programs</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="py-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Apply now to join one of our programs and take the next step in your journey.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/apply/builder">
                  <Button variant="secondary" size="lg">
                    Apply Now
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
