import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Users, Globe, Palette, Heart, CheckCircle, ArrowRight, Calendar, Megaphone, HandHeart } from "lucide-react"

const services = [
  {
    icon: Globe,
    title: "Organization Websites",
    description: "Professional websites with donation systems, event management, and volunteer portals.",
  },
  {
    icon: Palette,
    title: "Visual Identity",
    description: "Logos, branding materials, and visual assets that communicate your mission.",
  },
  {
    icon: Heart,
    title: "Donation Systems",
    description: "Secure online donation platforms with recurring giving and campaign tracking.",
  },
  {
    icon: Calendar,
    title: "Event Management",
    description: "Event registration, ticketing, and promotion tools for your organization.",
  },
  {
    icon: Users,
    title: "Member Management",
    description: "Membership portals, directories, and communication tools.",
  },
  {
    icon: Megaphone,
    title: "Awareness Campaigns",
    description: "Digital marketing and social media campaigns to amplify your cause.",
  },
]

const portfolio = [
  {
    name: "Hope Foundation",
    type: "Charity",
    services: ["Website", "Donation System", "Campaign Management"],
    description: "Complete digital platform for this charity supporting orphans and widows.",
    image: "/charity-foundation-helping-children.jpg",
    impact: "Raised ₦50M+ in donations",
  },
  {
    name: "Youth Empowerment Network",
    type: "NGO",
    services: ["Branding", "Website", "Event Platform"],
    description: "Digital presence for youth development and skill acquisition programs.",
    image: "/youth-empowerment-training.jpg",
    impact: "5,000+ youth trained",
  },
  {
    name: "Green Earth Initiative",
    type: "Environmental",
    services: ["Website", "Volunteer Portal", "Campaign Tools"],
    description: "Platform for environmental conservation and tree planting campaigns.",
    image: "/environmental-conservation-tree-planting.jpg",
    impact: "100,000+ trees planted",
  },
  {
    name: "Women in Tech Nigeria",
    type: "Professional Association",
    services: ["Website", "Member Portal", "Event Management"],
    description: "Community platform connecting and empowering women in technology.",
    image: "/women-tech-conference-networking.jpg",
    impact: "3,000+ members",
  },
  {
    name: "Health for All Initiative",
    type: "Healthcare NGO",
    services: ["Full Branding", "Website", "Outreach Tools"],
    description: "Digital tools for community health education and outreach programs.",
    image: "/placeholder.svg?height=300&width=400",
    impact: "50+ communities reached",
  },
  {
    name: "Islamic Relief Association",
    type: "Religious Organization",
    services: ["Website", "Donation Platform", "Event Calendar"],
    description: "Comprehensive platform for charitable giving and community programs.",
    image: "/placeholder.svg?height=300&width=400",
    impact: "20,000+ beneficiaries",
  },
]

const stats = [
  { label: "Organizations Served", value: "100+" },
  { label: "Funds Raised", value: "₦150M+" },
  { label: "Lives Impacted", value: "50K+" },
  { label: "Events Managed", value: "500+" },
]

export default function OrganizationDepartmentPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4">
          <FadeInUp className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
              <HandHeart className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">Organization Department</h1>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto mb-8">
              Amplifying the impact of NGOs, charities, associations, and community organizations through digital
              transformation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply/organization">
                <Button size="lg" className="gap-2">
                  Register Your Organization
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-transparent">
                  Discuss Your Mission
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

      {/* Services */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <FadeInUp className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Services for Organizations</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Digital tools designed to help organizations maximize their impact and reach.
            </p>
          </FadeInUp>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <StaggerItem key={service.title}>
                <Card className="h-full hover:border-primary transition-colors">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                    <p className="text-muted-foreground text-sm">{service.description}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Portfolio */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <FadeInUp className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Organizations Making Impact</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Proud to support these organizations in their mission to create positive change.
            </p>
          </FadeInUp>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolio.map((org) => (
              <StaggerItem key={org.name}>
                <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    <img src={org.image || "/placeholder.svg"} alt={org.name} className="w-full h-full object-cover" />
                    <Badge className="absolute top-3 right-3 bg-primary">{org.type}</Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{org.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{org.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {org.services.map((service) => (
                        <Badge key={service} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium">{org.impact}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Special Offer */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <FadeInUp>
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <Badge className="mb-4">Special Offer</Badge>
                    <h2 className="text-3xl font-bold mb-4">Non-Profit Discount</h2>
                    <p className="text-muted-foreground mb-6">
                      Registered NGOs and charitable organizations receive up to 50% discount on our services. We
                      believe in supporting those who support others.
                    </p>
                    <ul className="space-y-2 mb-6">
                      {[
                        "50% off website development",
                        "Free consultation sessions",
                        "Discounted maintenance plans",
                        "Priority support",
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-center md:text-right">
                    <Link href="/apply/organization">
                      <Button size="lg" className="gap-2">
                        Apply for Discount
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeInUp>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <FadeInUp>
            <h2 className="text-3xl font-bold mb-4">Ready to Amplify Your Impact?</h2>
            <p className="max-w-2xl mx-auto mb-8 text-primary-foreground/80">
              Let us help you reach more people and make a bigger difference in your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply/organization">
                <Button size="lg" variant="secondary" className="gap-2">
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>
    </div>
  )
}
