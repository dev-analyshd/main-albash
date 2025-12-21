import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GraduationCap, BookOpen, Briefcase, Award, Users, ArrowRight, Calendar, CheckCircle, Star } from "lucide-react"

const programs = [
  {
    icon: BookOpen,
    title: "Student Portfolio Program",
    description: "Build a professional digital portfolio showcasing your academic projects and skills.",
    duration: "Self-paced",
    benefits: ["Free portfolio hosting", "Professional templates", "Shareable profile link", "Verification badge"],
    cta: "Start Building",
    href: "/apply/builder",
  },
  {
    icon: Briefcase,
    title: "Internship Connect",
    description: "Get matched with businesses and organizations for internship opportunities.",
    duration: "Ongoing",
    benefits: [
      "Direct employer connections",
      "Skills assessment",
      "Interview preparation",
      "Certificate on completion",
    ],
    cta: "Find Internships",
    href: "/community/mentorship",
  },
  {
    icon: Award,
    title: "Academic Project Marketplace",
    description: "List and potentially monetize your academic projects, research, and innovations.",
    duration: "Ongoing",
    benefits: ["Project verification", "IP protection", "Buyer connections", "Royalty payments"],
    cta: "List Your Project",
    href: "/dashboard/listings/new",
  },
  {
    icon: Users,
    title: "Campus Ambassador Program",
    description: "Represent AlbashSolutions on your campus and earn rewards.",
    duration: "Semester-based",
    benefits: ["Monthly stipend", "Premium features", "Leadership experience", "Network access"],
    cta: "Apply Now",
    href: "/apply/builder",
  },
]

const achievements = [
  { number: "5,000+", label: "Student Members" },
  { number: "50+", label: "Partner Institutions" },
  { number: "₦2M+", label: "Grants Distributed" },
  { number: "200+", label: "Internships Facilitated" },
]

export default function StudentProgramsPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-chart-2/10 via-background to-background">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4">Programs</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Student Programs</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Special programs designed to help students build skills, showcase talent, and kickstart careers.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-primary">{stat.number}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-12">Available Programs</h2>
        <div className="grid gap-8 md:grid-cols-2">
          {programs.map((program) => (
            <Card key={program.title} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-chart-2/10">
                    <program.icon className="h-6 w-6 text-chart-2" />
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-1">{program.title}</CardTitle>
                    <CardDescription>{program.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4" />
                  Duration: {program.duration}
                </div>

                <div className="mb-6 flex-1">
                  <p className="text-sm font-medium mb-2">Program Benefits:</p>
                  <ul className="space-y-2">
                    {program.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href={program.href}>
                  <Button className="w-full">
                    {program.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Student Success Stories</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Aisha Yusuf",
                school: "ABU Zaria",
                story:
                  "Through the portfolio program, I landed an internship at a tech company before graduating. Now I'm working full-time!",
              },
              {
                name: "Ibrahim Musa",
                school: "BUK Kano",
                story:
                  "I sold my final year project on the marketplace. The buyer funded its development into a full product!",
              },
              {
                name: "Fatima Bello",
                school: "UDUS Sokoto",
                story:
                  "The campus ambassador program gave me leadership skills and a network that helped me start my own business.",
              },
            ].map((testimonial) => (
              <Card key={testimonial.name}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-chart-4 text-chart-4" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.story}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.school}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <GraduationCap className="h-12 w-12 mx-auto mb-4 text-chart-2" />
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Join thousands of students already building their future on AlbashSolutions.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button>Create Student Account</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
