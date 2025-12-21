import Link from "next/link"
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, GraduationCap, Briefcase, Building2, HandHeart, Hammer } from "lucide-react"

const departments = [
  {
    icon: Shield,
    name: "Verification Department",
    slug: "verification",
    description: "Central hub for document verification, identity authentication, and credential validation.",
    features: ["Document Verification", "Identity Authentication", "Credential Validation", "Background Checks"],
  },
  {
    icon: Hammer,
    name: "Builder Department",
    slug: "builder",
    description: "For freelancers, creators, and skilled individuals offering their talents and services.",
    features: ["Skill Verification", "Portfolio Showcase", "Client Matching", "Reputation Building"],
  },
  {
    icon: GraduationCap,
    name: "Institution Department",
    slug: "institution",
    description: "Supporting educational institutions with digital transformation - websites, branding, and more.",
    features: ["Website Creation", "Branding & Logo", "Student Portals", "Digital Marketing"],
  },
  {
    icon: Briefcase,
    name: "Business Department",
    slug: "business",
    description: "Empowering small businesses to go digital - from farming to tailoring to cooking.",
    features: ["E-commerce Setup", "Product Photography", "Social Media", "Marketplace Listing"],
  },
  {
    icon: Building2,
    name: "Company Department",
    slug: "company",
    description: "Enterprise solutions for established companies - A.Y Milk, Rufaidah Yoghurt, and more.",
    features: ["Corporate Websites", "Custom Software", "Brand Development", "Enterprise Solutions"],
  },
  {
    icon: HandHeart,
    name: "Organization Department",
    slug: "organization",
    description: "Amplifying impact for NGOs, charities, and community organizations.",
    features: ["Donation Platforms", "Event Management", "Member Portals", "Awareness Campaigns"],
  },
]

export default function DepartmentsPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <FadeInUp className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">Our Departments</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Six specialized departments working together to verify, support, and empower our community members.
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((dept) => (
              <StaggerItem key={dept.slug}>
                <Link href={`/departments/${dept.slug}`}>
                  <div className="bg-card rounded-xl border border-border p-6 h-full hover:border-primary hover:shadow-lg transition-all group">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <dept.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{dept.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{dept.description}</p>
                    <ul className="space-y-2 mb-6">
                      {dept.features.map((feature) => (
                        <li key={feature} className="text-sm flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button variant="ghost" className="gap-2 p-0 h-auto text-primary">
                      Learn More
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <FadeInUp>
            <h2 className="text-3xl font-bold mb-4">Need Help From a Department?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Our verification experts are ready to assist you with your application process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply/builder">
                <Button size="lg" className="gap-2">
                  Submit Application
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/check-status">
                <Button size="lg" variant="outline" className="bg-transparent">
                  Check Status
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>
    </div>
  )
}
