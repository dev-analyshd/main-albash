"use client"

import { motion } from "framer-motion"
import { Shield, Hexagon, Store, Palette, Award, Users, Building2, Rocket } from "lucide-react"
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper"

const features = [
  {
    icon: Shield,
    title: "Verification System",
    description: "Multi-department verification ensures all listings and users are authenticated and trustworthy.",
  },
  {
    icon: Hexagon,
    title: "Tokenization & NFTs",
    description: "Convert your ideas, talents, and products into blockchain-secured digital assets.",
  },
  {
    icon: Store,
    title: "Marketplace",
    description: "Buy, sell, and trade physical products, digital goods, and tokenized assets.",
  },
  {
    icon: Palette,
    title: "Studio Tools",
    description: "Create websites, portfolios, marketing materials, and more with our built-in tools.",
  },
  {
    icon: Award,
    title: "Reputation System",
    description: "Build credibility through verified transactions, reviews, and on-chain reputation.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Connect with mentors, join discussions, and build in public with fellow creators.",
  },
  {
    icon: Building2,
    title: "For Everyone",
    description: "Whether you are a builder, institution, business, or organization, we have you covered.",
  },
  {
    icon: Rocket,
    title: "Programs & Grants",
    description: "Access bootcamps, funding opportunities, and student programs to accelerate growth.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <FadeInUp className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">Everything You Need to Succeed</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            A complete ecosystem designed to help you digitize, verify, and monetize your creations.
          </p>
        </FadeInUp>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-card rounded-xl p-6 border border-border h-full transition-shadow hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
