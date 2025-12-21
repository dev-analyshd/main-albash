"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Play, Sparkles, Shield, Hexagon, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApplyDialog } from "@/components/apply/apply-dialog-context"

export function HeroSection() {
  const { setOpen: setShowApply } = useApplyDialog()
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8"
          >
            <Sparkles className="h-4 w-4" />
            <span>The Future of Digital Ecosystems</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance"
          >
            Your Idea, <span className="text-primary bg-clip-text">Our Technology,</span>  Our Future.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty"
          >
            A hybrid digital/physical ecosystem that helps individuals, students, institutions, and businesses bring
            their vision to life through verification, tokenization, and marketplace integration.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button size="lg" className="gap-2 text-base px-8" onClick={() => setShowApply(true)}>
                Start Your Journey
                <ArrowRight className="h-5 w-5" />
              </Button>
            <Link href="/about">
              <Button size="lg" variant="outline" className="gap-2 text-base px-8 bg-transparent">
                <Play className="h-5 w-5" />
                Watch Demo
              </Button>
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-12"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm">Verified Listings</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Hexagon className="h-5 w-5 text-primary" />
              <span className="text-sm">Blockchain Secured</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm">10K+ Members</span>
            </div>
          </motion.div>
        </div>

        {/* Hero Visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 relative max-w-5xl mx-auto"
        >
          <div className="aspect-video rounded-2xl bg-card border border-border shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
            <div className="relative h-full flex items-center justify-center">
              <div className="grid grid-cols-3 gap-4 p-8 w-full max-w-3xl">
                {/* Preview Cards */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  className="bg-background/80 backdrop-blur rounded-xl p-4 shadow-lg border border-border"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">Ideas</h3>
                  <p className="text-xs text-muted-foreground">Transform concepts into reality</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="bg-background/80 backdrop-blur rounded-xl p-4 shadow-lg border border-border"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                    <Users className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">Talents</h3>
                  <p className="text-xs text-muted-foreground">Showcase your skills</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 }}
                  className="bg-background/80 backdrop-blur rounded-xl p-4 shadow-lg border border-border"
                >
                  <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center mb-3">
                    <Hexagon className="h-5 w-5 text-chart-2" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">NFTs</h3>
                  <p className="text-xs text-muted-foreground">Tokenize your assets</p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
