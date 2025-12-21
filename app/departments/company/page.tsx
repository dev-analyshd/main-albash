import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Building2, Globe, Palette, BarChart3, CheckCircle, ArrowRight, Shield, Smartphone, Server } from "lucide-react"

const services = [
  {
    icon: Globe,
    title: "Corporate Websites",
    description: "Professional corporate websites with CMS, multi-language support, and advanced features.",
  },
  {
    icon: Palette,
    title: "Corporate Branding",
    description: "Complete brand identity including logo, colors, typography, and brand guidelines.",
  },
  {
    icon: Smartphone,
    title: "Mobile Applications",
    description: "Custom mobile apps for iOS and Android to extend your digital presence.",
  },
  {
    icon: Server,
    title: "Enterprise Solutions",
    description: "ERP, CRM, and custom software solutions for your business operations.",
  },
  {
    icon: BarChart3,
    title: "Digital Marketing",
    description: "SEO, SEM, social media campaigns, and performance marketing.",
  },
  {
    icon: Shield,
    title: "Verification & Compliance",
    description: "Business verification, documentation, and regulatory compliance support.",
  },
]

const portfolio = [
  {
    name: "A.Y Milk",
    industry: "Dairy Industry",
    services: ["Full Branding", "Website", "Packaging Design", "Digital Marketing"],
    description:
      "Complete brand transformation for this growing dairy company, from logo design to e-commerce platform.",
    image: "/dairy-company-branding-milk.jpg",
    results: "200% brand recognition increase",
  },
  {
    name: "Rufaidah Yoghurt",
    industry: "Food & Beverage",
    services: ["Branding", "Packaging", "Social Media", "E-commerce"],
    description: "Modern branding and digital presence for premium yoghurt brand targeting health-conscious consumers.",
    image: "/yoghurt-brand-packaging-modern.jpg",
    results: "Expanded to 5 new cities",
  },
  {
    name: "Northern Commodities Ltd",
    industry: "Trading",
    services: ["Corporate Website", "CRM System", "Business Automation"],
    description: "Enterprise solution for commodity trading with real-time inventory and client management.",
    image: "/trading-company-corporate-website.jpg",
    results: "40% operational efficiency",
  },
  {
    name: "Sahara Logistics",
    industry: "Transportation",
    services: ["Website", "Mobile App", "Tracking System"],
    description: "Fleet management and tracking solution with customer-facing mobile application.",
    image: "/logistics-company-truck-delivery.jpg",
    results: "Real-time tracking for 100+ vehicles",
  },
  {
    name: "Prime Construction Co.",
    industry: "Construction",
    services: ["Corporate Branding", "Website", "Project Portfolio"],
    description: "Professional digital presence showcasing construction projects and capabilities.",
    image: "/construction-company-building.jpg",
    results: "50% more project inquiries",
  },
  {
    name: "TechNova Solutions",
    industry: "Technology",
    services: ["Website Redesign", "Brand Refresh", "Marketing"],
    description: "Complete digital overhaul for technology consulting firm.",
    image: "/tech-company-modern-office.jpg",
    results: "3x lead generation",
  },
]

const stats = [
  { label: "Companies Served", value: "75+" },
  { label: "Enterprise Projects", value: "120+" },
  { label: "Revenue Impact", value: "₦200M+" },
  { label: "Client Retention", value: "92%" },
]

export default function CompanyDepartmentPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4">
          <FadeInUp className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
              <Building2 className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">Company Department</h1>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto mb-8">
              Enterprise-grade digital solutions for established companies. From corporate branding to custom software
              development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply/company">
                <Button size="lg" className="gap-2">
                  Partner With Us
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-transparent">
                  Request Proposal
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
            <h2 className="text-3xl font-bold mb-4">Enterprise Solutions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive digital services designed for established companies and corporations.
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
            <h2 className="text-3xl font-bold mb-4">Companies We've Partnered With</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Delivering measurable results for companies across various industries.
            </p>
          </FadeInUp>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolio.map((project) => (
              <StaggerItem key={project.name}>
                <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-3 right-3 bg-primary">{project.industry}</Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.services.map((service) => (
                        <Badge key={service} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">{project.results}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeInUp>
              <h2 className="text-3xl font-bold mb-6">Why Companies Choose AlbashSolutions</h2>
              <div className="space-y-4">
                {[
                  { title: "Dedicated Account Manager", desc: "Single point of contact for all your needs" },
                  { title: "Scalable Solutions", desc: "Systems that grow with your business" },
                  { title: "Enterprise Security", desc: "Bank-grade security for your data" },
                  { title: "24/7 Support", desc: "Round-the-clock technical assistance" },
                  { title: "Custom Development", desc: "Tailored solutions for unique requirements" },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeInUp>
            <FadeInUp>
              <div className="bg-muted rounded-2xl p-8">
                <h3 className="text-xl font-semibold mb-4">Request a Proposal</h3>
                <p className="text-muted-foreground mb-6">
                  Tell us about your company's needs and we'll prepare a customized proposal.
                </p>
                <Link href="/contact">
                  <Button size="lg" className="w-full gap-2">
                    Contact Our Enterprise Team
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <FadeInUp>
            <h2 className="text-3xl font-bold mb-4">Ready to Scale Your Company?</h2>
            <p className="max-w-2xl mx-auto mb-8 text-primary-foreground/80">
              Partner with AlbashSolutions for enterprise-grade digital transformation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply/company">
                <Button size="lg" variant="secondary" className="gap-2">
                  Start Partnership
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
