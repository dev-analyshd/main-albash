import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Palette,
  Code,
  FileText,
  ImageIcon,
  Video,
  Briefcase,
  GraduationCap,
  Rocket,
  Sparkles,
  ArrowRight,
  Lock,
  Coins,
  Award,
  Layout,
} from "lucide-react"

const studioTools = [
  {
    id: "nft-mint",
    name: "NFT Minting",
    description: "Tokenize your assets, art, and ideas as NFTs",
    icon: Coins,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    href: "/studio/nft-mint",
    features: ["Multi-chain", "Royalties", "Batch Mint", "Metadata"],
  },
  {
    id: "certificate",
    name: "Certificate Generator",
    description: "Create professional certificates and credentials",
    icon: Award,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    href: "/studio/certificate",
    features: ["Templates", "Custom Branding", "Downloadable", "Shareable"],
  },
  {
    id: "banner",
    name: "Banner Maker",
    description: "Design eye-catching banners and headers",
    icon: Layout,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    href: "/studio/banner",
    features: ["Social Sizes", "Gradients", "Export Options", "Templates"],
  },
  {
    id: "portfolio",
    name: "Portfolio Builder",
    description: "Build and publish your professional portfolio",
    icon: Briefcase,
    color: "text-green-600",
    bgColor: "bg-green-100",
    href: "/studio/portfolio",
    features: ["Themes", "Live Preview", "Custom Domain", "SEO Ready"],
  },
  {
    id: "design",
    name: "Design Studio",
    description: "Create stunning visuals, logos, and brand assets",
    icon: Palette,
    color: "text-pink-500",
    bgColor: "bg-pink-100",
    href: "/studio/design",
    features: ["Logo Maker", "Brand Kit", "Social Templates", "Color Palettes"],
  },
  {
    id: "code",
    name: "Code Workspace",
    description: "Build and prototype web applications",
    icon: Code,
    color: "text-blue-500",
    bgColor: "bg-blue-100",
    href: "/studio/code",
    features: ["Live Preview", "Code Templates", "API Tester", "Export Options"],
  },
  {
    id: "content",
    name: "Content Creator",
    description: "Write and format professional documents",
    icon: FileText,
    color: "text-green-500",
    bgColor: "bg-green-100",
    href: "/studio/content",
    features: ["Rich Editor", "Templates", "AI Assist", "Collaboration"],
  },
  {
    id: "media",
    name: "Media Editor",
    description: "Edit images, videos, and audio files",
    icon: ImageIcon,
    color: "text-purple-500",
    bgColor: "bg-purple-100",
    href: "/studio/media",
    features: ["Image Editor", "Video Trimmer", "Audio Mixer", "Filters"],
  },
  {
    id: "business",
    name: "Business Tools",
    description: "Invoices, contracts, and business documents",
    icon: Briefcase,
    color: "text-orange-500",
    bgColor: "bg-orange-100",
    href: "/studio/business",
    features: ["Invoice Generator", "Contract Templates", "Proposals", "Reports"],
  },
  {
    id: "learning",
    name: "Learning Hub",
    description: "Courses and tutorials to level up your skills",
    icon: GraduationCap,
    color: "text-cyan-500",
    bgColor: "bg-cyan-100",
    href: "/studio/learning",
    features: ["Video Courses", "Tutorials", "Certifications", "Community Q&A"],
  },
]

export default async function StudioPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase.from("profiles").select("is_verified, account_type").eq("id", user.id).single()
    profile = data
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-background overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4">Creative Suite</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Your <span className="text-primary">Digital Studio</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Access powerful tools to design, build, create, and grow. Everything you need to bring your ideas to life
              in one place.
            </p>
            {!user && (
              <Link href="/auth/sign-up">
                <Button size="lg" className="gap-2">
                  <Sparkles className="h-5 w-5" />
                  Get Started Free
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {studioTools.map((tool) => {
            const isLocked = !user || !profile?.is_verified

            return (
              <Card
                key={tool.id}
                className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden"
              >
                {isLocked && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="text-center">
                      <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="font-medium">Verification Required</p>
                      <Link href={user ? "/apply/builder" : "/auth/sign-up"}>
                        <Button variant="link" className="mt-1">
                          {user ? "Get Verified" : "Sign Up"}
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${tool.bgColor} ${tool.color}`}>
                      <tool.icon className="h-6 w-6" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <CardTitle className="mt-4">{tool.name}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tool.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <Link href={tool.href}>
                    <Button variant="outline" className="w-full mt-4 bg-transparent">
                      Open Studio
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Use AlbashSolutions Studio?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              All the tools you need, integrated with your marketplace presence
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Rocket,
                title: "Launch Faster",
                description: "Pre-built templates and AI assistance help you create professional assets in minutes",
              },
              {
                icon: Sparkles,
                title: "Stay Consistent",
                description: "Your brand assets sync across all tools for a unified professional presence",
              },
              {
                icon: Video,
                title: "Multi-Format",
                description: "Export your work in multiple formats optimized for different platforms",
              },
            ].map((feature) => (
              <Card key={feature.title}>
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
