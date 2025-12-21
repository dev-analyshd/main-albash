import { FadeInUp } from "@/components/ui/motion-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Shield, FileCheck, UserCheck, ArrowRight, Fingerprint, Building2 } from "lucide-react"

const services = [
  {
    icon: FileCheck,
    title: "Document Verification",
    description: "Verify authenticity of documents, certificates, and credentials.",
  },
  {
    icon: UserCheck,
    title: "Identity Authentication",
    description: "Comprehensive identity verification for individuals and organizations.",
  },
  {
    icon: Fingerprint,
    title: "Credential Validation",
    description: "Validate professional licenses, certifications, and qualifications.",
  },
  {
    icon: Building2,
    title: "Business Registration",
    description: "Verify business registrations, licenses, and legal documentation.",
  },
]

const process = [
  { step: 1, title: "Submit Application", description: "Fill out the application form with your details" },
  { step: 2, title: "Document Upload", description: "Upload supporting documents for verification" },
  { step: 3, title: "Review Process", description: "Our team reviews your application (2-3 business days)" },
  { step: 4, title: "Verification Complete", description: "Receive verified status and marketplace access" },
]

const stats = [
  { value: "2-3", label: "Days Average Review Time" },
  { value: "99%", label: "Verification Accuracy" },
  { value: "24/7", label: "Support Available" },
  { value: "50K+", label: "Successful Verifications" },
]

export default function VerificationDepartmentPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <FadeInUp className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">Verification Department</h1>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Your central hub for document verification, identity authentication, and credential validation. Building
              trust in the AlbashSolutions ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply/builder">
                <Button size="lg" className="gap-2">
                  Start Verification
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

      {/* Services */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <FadeInUp className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive verification services to ensure trust and authenticity across the platform.
            </p>
          </FadeInUp>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <FadeInUp key={service.title} delay={index * 0.1}>
                <Card className="h-full hover:border-primary transition-colors">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <FadeInUp className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Verification Process</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our streamlined process ensures quick and thorough verification.
            </p>
          </FadeInUp>

          <div className="max-w-4xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map((item, index) => (
                <FadeInUp key={item.step} delay={index * 0.15}>
                  <div className="relative text-center">
                    {index < process.length - 1 && (
                      <div className="hidden lg:block absolute top-6 left-[60%] w-full h-0.5 bg-border" />
                    )}
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mx-auto mb-4 relative z-10">
                      {item.step}
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </FadeInUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-3xl p-8 sm:p-12">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <FadeInUp key={stat.label} delay={index * 0.1}>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary-foreground mb-2">{stat.value}</div>
                    <p className="text-primary-foreground/80">{stat.label}</p>
                  </div>
                </FadeInUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <FadeInUp>
            <h2 className="text-3xl font-bold mb-4">Ready to Get Verified?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Start your verification journey today and unlock the full potential of the AlbashSolutions platform.
            </p>
            <Link href="/apply/builder">
              <Button size="lg" className="gap-2">
                Submit Application
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </FadeInUp>
        </div>
      </section>
    </div>
  )
}
