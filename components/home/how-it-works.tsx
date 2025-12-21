"use client"

import { motion } from "framer-motion"
import { FileText, Shield, Store, Hexagon } from "lucide-react"
import { FadeInUp } from "@/components/ui/motion-wrapper"

const steps = [
  {
    icon: FileText,
    title: "Apply",
    description: "Submit your application as a builder, institution, business, or organization.",
    color: "bg-chart-1",
  },
  {
    icon: Shield,
    title: "Get Verified",
    description: "Our department reviews and verifies your credentials and submissions.",
    color: "bg-chart-2",
  },
  {
    icon: Store,
    title: "List & Sell",
    description: "Add your products, services, or ideas to the marketplace.",
    color: "bg-chart-3",
  },
  {
    icon: Hexagon,
    title: "Tokenize",
    description: "Convert your assets into NFTs and build on-chain reputation.",
    color: "bg-chart-4",
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <FadeInUp className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Get started in four simple steps and join our growing ecosystem.
          </p>
        </FadeInUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-full h-0.5 bg-border" />
              )}

              <div className="relative flex flex-col items-center text-center">
                {/* Step Number */}
                <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center z-10">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-4`}>
                  <step.icon className="h-8 w-8 text-background" />
                </div>

                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
