import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Hexagon, Shield, Coins, FileCheck, ArrowRight, Lock, Globe, Zap } from "lucide-react"

const services = [
  {
    icon: Hexagon,
    title: "NFT Minting",
    description: "Convert your physical or digital assets into unique NFTs on the blockchain.",
    href: "/studio/builder",
  },
  {
    icon: Shield,
    title: "Asset Verification",
    description: "Verify ownership and authenticity of assets using blockchain technology.",
    href: "/departments/verification",
  },
  {
    icon: Coins,
    title: "Token Creation",
    description: "Create custom tokens for your business, community, or project.",
    href: "/services/tokenization",
  },
  {
    icon: FileCheck,
    title: "Smart Contracts",
    description: "Deploy smart contracts for automated agreements and transactions.",
    href: "/services/tokenization",
  },
]

const benefits = [
  {
    icon: Lock,
    title: "Immutable Proof",
    description: "Once on the blockchain, your ownership records cannot be altered or deleted.",
  },
  {
    icon: Globe,
    title: "Global Recognition",
    description: "Your tokenized assets are recognized and tradeable worldwide.",
  },
  {
    icon: Zap,
    title: "Instant Transfers",
    description: "Transfer ownership of assets instantly without intermediaries.",
  },
]

export default function BlockchainDepartmentPage() {
  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge className="mb-4">Blockchain Department</Badge>
        <h1 className="text-4xl font-bold mb-4">Tokenization & NFT Services</h1>
        <p className="text-xl text-muted-foreground">
          Leverage blockchain technology to verify, tokenize, and trade your assets with complete transparency and
          security.
        </p>
      </div>

      {/* Services */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {services.map((service) => (
          <Link key={service.title} href={service.href}>
            <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{service.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* How It Works */}
      <Card className="mb-16">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">How Tokenization Works</CardTitle>
          <CardDescription>Simple steps to tokenize your assets on AlbashSolutions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: "Submit Asset", desc: "Upload details and proof of ownership" },
              { step: 2, title: "Verification", desc: "Our team verifies authenticity" },
              { step: 3, title: "Minting", desc: "Asset is minted as NFT on blockchain" },
              { step: 4, title: "Trade", desc: "List and trade on marketplace" },
            ].map((item, index) => (
              <div key={item.step} className="text-center relative">
                {index < 3 && <div className="hidden md:block absolute top-6 left-[60%] w-full h-0.5 bg-border" />}
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mx-auto mb-4 relative z-10">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Why Tokenize Your Assets?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit) => (
            <Card key={benefit.title}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-chart-4/10 flex items-center justify-center shrink-0">
                    <benefit.icon className="h-5 w-5 text-chart-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Card className="bg-gradient-to-r from-chart-4 to-chart-5 text-white">
        <CardContent className="p-8 text-center">
          <Hexagon className="h-12 w-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold mb-4">Ready to Tokenize Your Assets?</h2>
          <p className="mb-6 text-white/80 max-w-xl mx-auto">
            Join hundreds of creators who have already tokenized their physical and digital assets on AlbashSolutions.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/studio/builder">
              <Button variant="secondary" size="lg">
                Start Minting
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/marketplace/tokenized">
              <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10">
                Browse NFTs
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
