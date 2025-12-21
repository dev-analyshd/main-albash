import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { GraduationCap, Globe, Palette, FileText, ArrowRight, Building, Users, Megaphone } from "lucide-react"

const services = [
  {
    icon: Globe,
    title: "Website Creation",
    description:
      "Custom educational websites with learning management features, student portals, and responsive design.",
  },
  {
    icon: Palette,
    title: "Branding & Identity",
    description: "Complete branding packages including colors, typography, and brand guidelines for institutions.",
  },
  {
    icon: FileText,
    title: "Logo Design",
    description: "Professional logo design that represents your institution's values and mission.",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    description: "Social media management, SEO optimization, and online advertising for student recruitment.",
  },
  {
    icon: FileText,
    title: "Document Systems",
    description: "Certificate generation, transcript management, and digital verification systems.",
  },
  {
    icon: Users,
    title: "Student Portals",
    description: "Custom portals for student registration, fee payment, and academic tracking.",
  },
]

const portfolio = [
  {
    name: "Annur Academy",
    type: "Islamic School",
    services: ["Website Creation", "Branding", "Logo Design", "Student Portal"],
    description: "Complete digital transformation for this leading Islamic educational institution.",
    image: "/islamic-school-website-modern.jpg",
    featured: true,
  },
  {
    name: "Qatar Academy",
    type: "International School",
    services: ["Website Redesign", "Brand Refresh", "Digital Marketing"],
    description: "Modern website redesign with multilingual support and online enrollment system.",
    image: "/international-school-website.jpg",
    featured: true,
  },
  {
    name: "Haqqul Mubin",
    type: "Islamic Institute",
    services: ["Logo Design", "Branding", "Website Creation"],
    description: "Traditional yet modern branding that reflects Islamic heritage and values.",
    image: "/islamic-institute-branding.jpg",
    featured: false,
  },
  {
    name: "Dependable Academy",
    type: "Vocational School",
    services: ["Website Creation", "Student Management System"],
    description: "Comprehensive platform for vocational training with course management.",
    image: "/vocational-school-platform.jpg",
    featured: false,
  },
  {
    name: "Governors College",
    type: "Higher Education",
    services: ["Full Branding", "Website", "Document Verification"],
    description: "End-to-end digital solution for this prestigious higher education institution.",
    image: "/college-university-website.jpg",
    featured: true,
  },
]

const stats = [
  { label: "Institutions Served", value: "50+" },
  { label: "Students Impacted", value: "25K+" },
  { label: "Websites Created", value: "40+" },
  { label: "Years Experience", value: "5+" },
]

export default function InstitutionDepartmentPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4">
          <FadeInUp className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
              <GraduationCap className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">Institution Department</h1>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto mb-8">
              Empowering educational institutions with digital solutions - from stunning websites to complete branding
              and student management systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply/institution">
                <Button size="lg" className="gap-2">
                  Apply as Institution
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-transparent">
                  Request Consultation
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
            <h2 className="text-3xl font-bold mb-4">Our Services for Institutions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive digital solutions tailored for educational institutions of all sizes.
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
            <h2 className="text-3xl font-bold mb-4">Institutions We've Worked With</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Proud to have served these educational institutions with our digital solutions.
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
                    {project.featured && <Badge className="absolute top-3 right-3 bg-primary">Featured</Badge>}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{project.type}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.services.map((service) => (
                        <Badge key={service} variant="secondary" className="text-xs">
                          {service}
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

      {/* Process */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <FadeInUp className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How We Work With Institutions</h2>
          </FadeInUp>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Consultation", desc: "Understanding your institution's needs" },
                { step: "02", title: "Planning", desc: "Creating a tailored digital strategy" },
                { step: "03", title: "Development", desc: "Building your digital solutions" },
                { step: "04", title: "Launch & Support", desc: "Deployment and ongoing support" },
              ].map((item, index) => (
                <FadeInUp key={item.step} className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">{item.step}</span>
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </FadeInUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <FadeInUp>
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Institution?</h2>
            <p className="max-w-2xl mx-auto mb-8 text-primary-foreground/80">
              Join the growing list of institutions that have partnered with AlbashSolutions for their digital
              transformation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply/institution">
                <Button size="lg" variant="secondary" className="gap-2">
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>
    </div>
  )
}
