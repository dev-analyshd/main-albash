import { FadeInUp } from "@/components/ui/motion-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Users,
  Shield,
  Hexagon,
  Code,
  CheckCircle,
  Globe,
  Building2,
  Heart,
  TrendingUp,
  GraduationCap,
  Briefcase,
  FileText,
  DollarSign,
  Lock,
  Sparkles,
  ArrowRight,
  Target,
  Zap,
  Network,
  Award,
} from "lucide-react"

const foundationalRoles = [
  {
    icon: Target,
    title: "Founder / Vision Architect",
    description: "Holds the full philosophy, ethics, and long-term direction",
    responsibilities: [
      "Define what is 'verifiable value'",
      "Approve new departments",
      "Decide reputation logic",
      "Strategic partnerships",
      "Protect AlbashSolution from mission drift",
    ],
    currentHolder: "Bashar Halilu Mada",
    status: "filled",
  },
  {
    icon: Code,
    title: "Chief System Architect",
    description: "Designs how everything connects (website, verification, marketplace, departments, blockchain, physical offices)",
    responsibilities: [
      "Overall system flow (apply → verify → list → earn → reputation)",
      "Role-based access logic",
      "Database architecture",
      "Backend rules",
      "Scalability design",
    ],
    currentHolder: "Analys HD",
    status: "filled",
  },
  {
    icon: Shield,
    title: "Head of Verification & Trust",
    description: "Guardian of credibility, trust, and legitimacy",
    responsibilities: [
      "Design verification standards",
      "Create verification tests & criteria",
      "Approve verifiers",
      "Prevent fraud",
      "Oversee reputation scoring",
    ],
    currentHolder: "Aisha Patel",
    status: "filled",
  },
  {
    icon: Hexagon,
    title: "Blockchain & Tokenization Lead",
    description: "Translates real-world value into on-chain assets",
    responsibilities: [
      "Tokenization logic (ideas, talents, assets)",
      "NFT standards",
      "Wallet & payment flow",
      "Chain partnerships (e.g., Konet)",
      "Smart contract auditing",
    ],
    currentHolder: "Open",
    status: "hiring",
  },
  {
    icon: Sparkles,
    title: "Product & Experience Lead",
    description: "Make AlbashSolution usable by any age, any literacy level",
    responsibilities: [
      "UX flow for low digital literacy users",
      "Multi-language logic",
      "Simple wording",
      "Accessibility",
      "Emotion-based design (pain → pleasure → empowerment)",
    ],
    currentHolder: "Open",
    status: "hiring",
  },
]

const operationalRoles = [
  {
    icon: Zap,
    title: "Technical Lead / Full-Stack Engineering Lead",
    description: "Turns blueprints into working reality",
    responsibilities: [
      "Frontend (Next.js / PWA)",
      "Backend (APIs, auth, verification)",
      "Server reliability",
      "Security",
      "Deployment & updates",
    ],
    currentHolder: "Analys HD",
    status: "filled",
  },
  {
    icon: CheckCircle,
    title: "Verification Department Managers",
    description: "Experts who judge real value across sectors",
    departments: [
      "Idea & Innovation",
      "Talent & Skills",
      "Institution & Education",
      "Business & SMEs",
      "Organization & NGOs",
      "Agriculture & Physical Assets",
      "Creative & Cultural Assets",
    ],
    responsibilities: [
      "Review applications",
      "Approve or reject",
      "Assign reputation scores",
      "Maintain standards per sector",
    ],
    currentHolder: "Multiple Openings",
    status: "hiring",
  },
  {
    icon: Users,
    title: "Community & Builder Ecosystem Manager",
    description: "Turns users into collaborators",
    responsibilities: [
      "Moderate community discussions",
      "Help fragmented ideas find teams",
      "Organize programs & challenges",
      "Support builders emotionally & technically",
    ],
    currentHolder: "Aminu Sahabi",
    status: "filled",
  },
  {
    icon: Building2,
    title: "Marketplace & Listings Manager",
    description: "Keeps the marketplace functional, fair, and valuable",
    responsibilities: [
      "Listing quality control",
      "Category organization",
      "Market integrity",
      "Conflict resolution",
      "Auction moderation",
    ],
    currentHolder: "Open",
    status: "hiring",
  },
  {
    icon: Award,
    title: "Reputation & Scoring Analyst",
    description: "Ensures reputation is meaningful, not gamed",
    responsibilities: [
      "Design scoring logic",
      "Monitor abuse",
      "Adjust weightings",
      "Tie reputation to privileges",
      "Analyze trust metrics",
    ],
    currentHolder: "Open",
    status: "hiring",
  },
  {
    icon: FileText,
    title: "Legal, Ethics & Policy Lead",
    description: "Protects the platform and users",
    responsibilities: [
      "Terms & conditions",
      "Privacy policy",
      "IP ownership logic",
      "Tokenization legality",
      "Dispute resolution framework",
    ],
    currentHolder: "Open",
    status: "hiring",
  },
]

const expansionRoles = [
  {
    icon: GraduationCap,
    title: "Institutional Partnerships Lead",
    description: "Onboards schools, universities, training centers",
    responsibilities: [
      "School programs",
      "Student talent showcases",
      "Certificate verification",
      "Education digital transformation",
    ],
    currentHolder: "Open",
    status: "future",
  },
  {
    icon: Briefcase,
    title: "Business & SME Enablement Lead",
    description: "Helps traditional businesses go digital",
    responsibilities: [
      "Website & branding services",
      "Product digitization",
      "Marketplace onboarding",
      "Payment adoption (crypto + fiat)",
    ],
    currentHolder: "Open",
    status: "future",
  },
  {
    icon: FileText,
    title: "Content & Storytelling Lead",
    description: "Shows transformation stories",
    responsibilities: [
      "'From idea → founder → company' narratives",
      "Case studies",
      "Videos",
      "Community highlights",
    ],
    currentHolder: "Open",
    status: "future",
  },
  {
    icon: Globe,
    title: "Regional Operations Lead",
    description: "Bridges online system with real-world communities",
    responsibilities: [
      "Physical offices",
      "Local verifiers",
      "On-ground onboarding",
      "Rural inclusion",
    ],
    currentHolder: "Open",
    status: "future",
  },
  {
    icon: DollarSign,
    title: "Finance & Treasury Manager",
    description: "Manages sustainability",
    responsibilities: [
      "Platform fees",
      "Token treasury",
      "Revenue distribution",
      "Budgeting",
      "Reporting",
    ],
    currentHolder: "Open",
    status: "future",
  },
  {
    icon: Lock,
    title: "Security & Risk Officer",
    description: "Protects platform and users",
    responsibilities: [
      "Fraud detection",
      "Smart contract risk",
      "Account abuse prevention",
      "Incident response",
    ],
    currentHolder: "Open",
    status: "future",
  },
]

export default function TeamPage() {
  return (
    <div className="pt-20 min-h-screen">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4">
          <FadeInUp className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4">Our Team</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">
              Building Trust Infrastructure, Not Just a Platform
            </h1>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              AlbashSolution is a trust infrastructure, a verification authority, a marketplace, and a social system.
              Our team structure reflects this philosophy: <strong>Verification &gt; marketing, Reputation &gt; money,
                Structure &gt; speed</strong>.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/about">
                <Button variant="outline" className="gap-2">
                  About Us
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/apply/builder">
                <Button className="gap-2">
                  Join the Team
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Core Philosophy */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <FadeInUp className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Our Core Truth</CardTitle>
                <CardDescription>
                  AlbashSolution is not a startup with a few devs. It is a trust infrastructure that requires dedicated
                  expertise across multiple domains.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 rounded-lg bg-primary/5">
                    <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="font-semibold">Verification &gt; Marketing</p>
                    <p className="text-sm text-muted-foreground">Trust is our foundation</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-accent/5">
                    <Award className="h-8 w-8 mx-auto mb-2 text-accent" />
                    <p className="font-semibold">Reputation &gt; Money</p>
                    <p className="text-sm text-muted-foreground">Value over profit</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-chart-2/5">
                    <Network className="h-8 w-8 mx-auto mb-2 text-chart-2" />
                    <p className="font-semibold">Structure &gt; Speed</p>
                    <p className="text-sm text-muted-foreground">Built to last</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeInUp>
        </div>
      </section>

      {/* Foundational Core Team */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <FadeInUp className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Target className="h-4 w-4" />
              <span>FOUNDATIONAL</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Foundational Core Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These roles define AlbashSolution's identity and must exist from Day 1. They are non-negotiable.
            </p>
          </FadeInUp>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foundationalRoles.map((role, index) => (
              <FadeInUp key={role.title} delay={index * 0.1}>
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <role.icon className="h-6 w-6 text-primary" />
                      </div>
                      <Badge
                        variant={role.status === "filled" ? "default" : role.status === "hiring" ? "secondary" : "outline"}
                      >
                        {role.status === "filled" ? "Filled" : role.status === "hiring" ? "Hiring" : "Future"}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{role.title}</CardTitle>
                    <CardDescription>{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="mb-4">
                      <p className="text-sm font-semibold mb-2">Current Holder:</p>
                      <p className="text-sm text-muted-foreground">{role.currentHolder}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold mb-2">Key Responsibilities:</p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {role.responsibilities.map((resp, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Operational Core Team */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <FadeInUp className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              <Zap className="h-4 w-4" />
              <span>OPERATIONAL</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Operational Core Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These roles keep the ecosystem alive and running daily.
            </p>
          </FadeInUp>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {operationalRoles.map((role, index) => (
              <FadeInUp key={role.title} delay={index * 0.1}>
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                        <role.icon className="h-6 w-6 text-accent" />
                      </div>
                      <Badge
                        variant={role.status === "filled" ? "default" : role.status === "hiring" ? "secondary" : "outline"}
                      >
                        {role.status === "filled" ? "Filled" : role.status === "hiring" ? "Hiring" : "Future"}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{role.title}</CardTitle>
                    <CardDescription>{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    {role.departments && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold mb-2">Departments:</p>
                        <div className="flex flex-wrap gap-2">
                          {role.departments.map((dept, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {dept}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mb-4">
                      <p className="text-sm font-semibold mb-2">Current Holder:</p>
                      <p className="text-sm text-muted-foreground">{role.currentHolder}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold mb-2">Key Responsibilities:</p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {role.responsibilities.map((resp, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-accent mt-1">•</span>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Expansion & Scale Roles */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <FadeInUp className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-chart-2/10 text-chart-2 text-sm font-medium mb-4">
              <TrendingUp className="h-4 w-4" />
              <span>EXPANSION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Expansion & Scale Roles</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These roles unlock growth and sustainability (Phase 2-3).
            </p>
          </FadeInUp>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expansionRoles.map((role, index) => (
              <FadeInUp key={role.title} delay={index * 0.1}>
                <Card className="h-full flex flex-col opacity-75">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-chart-2/10 flex items-center justify-center">
                        <role.icon className="h-6 w-6 text-chart-2" />
                      </div>
                      <Badge variant="outline">Future</Badge>
                    </div>
                    <CardTitle className="text-xl">{role.title}</CardTitle>
                    <CardDescription>{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="mb-4">
                      <p className="text-sm font-semibold mb-2">Current Holder:</p>
                      <p className="text-sm text-muted-foreground">{role.currentHolder}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold mb-2">Key Responsibilities:</p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {role.responsibilities.map((resp, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-chart-2 mt-1">•</span>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <FadeInUp>
            <Users className="h-12 w-12 text-primary-foreground mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
              Join the AlbashSolution Team
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              We're building a trust infrastructure that transforms how value is created, verified, and exchanged. If
              you share our vision, we'd love to hear from you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="gap-2">
                  Contact Us
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/apply/builder">
                <Button size="lg" variant="outline" className="gap-2 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                  Apply to Join
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

