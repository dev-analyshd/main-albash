import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Globe,
  User,
  Building2,
  Hexagon,
  Store,
  Shield,
  Palette,
  Award,
  FolderKanban,
  PenTool,
  Users,
  GraduationCap,
  Lightbulb,
  Cpu,
  ArrowRight,
} from "lucide-react"

const services = [
  {
    icon: Globe,
    title: "Website Creation",
    description:
      "Professional website development for businesses, portfolios, and e-commerce. Modern, responsive designs.",
    href: "/services/website-creation",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: User,
    title: "Digital Profile Creation",
    description: "Build your verified digital identity with reputation scores, badges, and portfolio showcase.",
    href: "/services/digital-profile",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Building2,
    title: "Business Digitalization",
    description: "Transform your traditional business into a digital enterprise with online presence and tools.",
    href: "/services/business-digitalization",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Hexagon,
    title: "Asset Tokenization",
    description: "Convert physical and digital assets into blockchain tokens for secure ownership and trading.",
    href: "/services/tokenization",
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: Store,
    title: "Marketplace Listing",
    description: "List and sell your products, services, and digital assets on our verified marketplace.",
    href: "/marketplace",
    color: "bg-pink-100 text-pink-600",
  },
  {
    icon: Shield,
    title: "Verification Services",
    description: "Get your identity, business, or products verified for increased trust and visibility.",
    href: "/departments/verification",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: Palette,
    title: "Branding & Design",
    description: "Professional branding, logo design, and visual identity creation for your business.",
    href: "/services/branding",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    icon: Award,
    title: "Certificate Issuing",
    description: "Digital certificates for courses, achievements, and professional qualifications.",
    href: "/services/certificates",
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    icon: FolderKanban,
    title: "Portfolio Building",
    description: "Create a professional portfolio to showcase your work, skills, and achievements.",
    href: "/services/portfolio",
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    icon: PenTool,
    title: "Content Creation",
    description: "Professional content creation support for marketing, social media, and documentation.",
    href: "/services/content-creation",
    color: "bg-red-100 text-red-600",
  },
  {
    icon: GraduationCap,
    title: "Institution Partnership",
    description: "Partner with us to digitize student records, issue certificates, and showcase talent.",
    href: "/services/institutions",
    color: "bg-teal-100 text-teal-600",
  },
  {
    icon: Users,
    title: "Organization Support",
    description: "Digital tools and support for NGOs, community groups, and volunteer organizations.",
    href: "/services/organizations",
    color: "bg-violet-100 text-violet-600",
  },
  {
    icon: Lightbulb,
    title: "Idea Development",
    description: "Turn your innovative ideas into reality with our development support and resources.",
    href: "/services/idea-development",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: Cpu,
    title: "AI-Powered Tools",
    description: "Access advanced AI tools for content generation, analysis, and automation.",
    href: "/marketplace/tools",
    color: "bg-slate-100 text-slate-600",
  },
]

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Services</h1>
        <p className="text-xl text-muted-foreground">
          Comprehensive digital solutions to help you build, grow, and succeed in the modern economy.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {services.map((service) => (
          <Link key={service.title} href={service.href}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${service.color} flex items-center justify-center mb-3`}>
                  <service.icon className="h-6 w-6" />
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">{service.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center">
        <Card className="max-w-2xl mx-auto bg-primary text-primary-foreground">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Need a Custom Solution?</h2>
            <p className="mb-6 text-primary-foreground/80">
              {"Can't find what you're looking for? Contact us for custom solutions tailored to your specific needs."}
            </p>
            <Link href="/contact">
              <Button variant="secondary" size="lg" className="gap-2">
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
