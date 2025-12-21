import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Hammer,
  Briefcase,
  Star,
  CheckCircle,
  ArrowRight,
  Code,
  Palette,
  Camera,
  PenTool,
  Wrench,
  Music,
} from "lucide-react"

const builderCategories = [
  {
    icon: Code,
    title: "Developers",
    description: "Web developers, mobile app developers, and software engineers.",
    skills: ["React", "Node.js", "Python", "Mobile Apps"],
  },
  {
    icon: Palette,
    title: "Designers",
    description: "UI/UX designers, graphic designers, and brand specialists.",
    skills: ["UI/UX", "Branding", "Logo Design", "Illustration"],
  },
  {
    icon: PenTool,
    title: "Content Creators",
    description: "Writers, copywriters, and content strategists.",
    skills: ["Copywriting", "Blog Writing", "Social Media", "SEO Content"],
  },
  {
    icon: Camera,
    title: "Media Specialists",
    description: "Photographers, videographers, and video editors.",
    skills: ["Photography", "Videography", "Editing", "Animation"],
  },
  {
    icon: Wrench,
    title: "Technical Experts",
    description: "IT support, system administrators, and tech consultants.",
    skills: ["IT Support", "Networking", "Cloud", "Security"],
  },
  {
    icon: Music,
    title: "Creative Artists",
    description: "Musicians, voice artists, and audio producers.",
    skills: ["Voice Over", "Music Production", "Podcasting", "Jingles"],
  },
]

const featuredBuilders = [
  {
    name: "Ahmed Ibrahim",
    specialty: "Full-Stack Developer",
    rating: 4.9,
    projects: 45,
    verified: true,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Fatima Yusuf",
    specialty: "UI/UX Designer",
    rating: 5.0,
    projects: 32,
    verified: true,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Musa Abdullahi",
    specialty: "Video Production",
    rating: 4.8,
    projects: 28,
    verified: true,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Aisha Mohammed",
    specialty: "Content Writer",
    rating: 4.9,
    projects: 56,
    verified: true,
    image: "/placeholder.svg?height=100&width=100",
  },
]

const benefits = [
  { title: "Verified Badge", desc: "Stand out with our verified builder badge" },
  { title: "Marketplace Access", desc: "List your services on our marketplace" },
  { title: "Client Connections", desc: "Get matched with clients seeking your skills" },
  { title: "Reputation System", desc: "Build trust through our rating system" },
  { title: "Payment Protection", desc: "Secure payments for all projects" },
  { title: "Community Support", desc: "Join our builder community and network" },
]

const stats = [
  { label: "Active Builders", value: "500+" },
  { label: "Projects Completed", value: "2,000+" },
  { label: "Client Satisfaction", value: "98%" },
  { label: "Total Earnings", value: "₦100M+" },
]

export default function BuilderDepartmentPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4">
          <FadeInUp className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
              <Hammer className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">Builder Department</h1>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto mb-8">
              For freelancers, creators, and skilled individuals. Get verified, showcase your talents, and connect with
              clients on our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply/builder">
                <Button size="lg" className="gap-2">
                  Become a Builder
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/marketplace/builders">
                <Button size="lg" variant="outline" className="bg-transparent">
                  Hire a Builder
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold">{stat.value}</p>
                <p className="text-primary-foreground/80 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <FadeInUp className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Builder Categories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We welcome skilled individuals across various disciplines.
            </p>
          </FadeInUp>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {builderCategories.map((category) => (
              <StaggerItem key={category.title}>
                <Card className="h-full hover:border-primary transition-colors">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <category.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{category.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Featured Builders */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <FadeInUp className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Featured Builders</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Top-rated verified builders on our platform.</p>
          </FadeInUp>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBuilders.map((builder) => (
              <StaggerItem key={builder.name}>
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-4">
                      <img
                        src={builder.image || "/placeholder.svg"}
                        alt={builder.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <h3 className="font-semibold">{builder.name}</h3>
                      {builder.verified && <CheckCircle className="h-4 w-4 text-primary" />}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{builder.specialty}</p>
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        {builder.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        {builder.projects} projects
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div className="text-center mt-8">
            <Link href="/marketplace/builders">
              <Button variant="outline" className="gap-2 bg-transparent">
                View All Builders
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeInUp>
              <h2 className="text-3xl font-bold mb-6">Why Become a Verified Builder?</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit) => (
                  <div key={benefit.title} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{benefit.title}</p>
                      <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeInUp>
            <FadeInUp>
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-4">Ready to Get Started?</h3>
                  <p className="text-muted-foreground mb-6">
                    Apply to become a verified builder and start showcasing your skills to potential clients.
                  </p>
                  <ol className="space-y-3 mb-6">
                    {[
                      "Create your account",
                      "Submit your application with portfolio",
                      "Get verified by our team",
                      "Start receiving client requests",
                    ].map((step, index) => (
                      <li key={step} className="flex items-center gap-3 text-sm">
                        <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                  <Link href="/apply/builder">
                    <Button size="lg" className="w-full gap-2">
                      Apply Now
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <FadeInUp>
            <h2 className="text-3xl font-bold mb-4">Join Our Builder Community</h2>
            <p className="max-w-2xl mx-auto mb-8 text-primary-foreground/80">
              Whether you're a developer, designer, writer, or any other skilled professional - there's a place for you
              here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply/builder">
                <Button size="lg" variant="secondary" className="gap-2">
                  Become a Builder
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/marketplace/builders">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Hire a Builder
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>
    </div>
  )
}
