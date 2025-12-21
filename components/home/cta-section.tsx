"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApplyDialog } from "@/components/apply/apply-dialog-context"

export function CTASection() {
  const { setOpen: setShowApply } = useApplyDialog()
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent" />
          <div className="absolute inset-0 bg-[url('/abstract-geometric-flow.png')] opacity-10" />

          {/* Content */}
          <div className="relative px-8 py-16 sm:px-12 sm:py-20 lg:px-16 lg:py-24 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm font-medium mb-6"
            >
              <Sparkles className="h-4 w-4" />
              <span>Start Today</span>
            </motion.div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 text-balance">
              Ready to Transform Your Ideas?
            </h2>

            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-10 text-pretty">
              Join thousands of builders, institutions, and businesses who are already part of the AlbashSolutions
              ecosystem.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="secondary" className="gap-2 text-base px-8" onClick={() => setShowApply(true)}>
                  Apply Now
                  <ArrowRight className="h-5 w-5" />
                </Button>
              <Link href="/marketplace">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 text-base px-8 bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Explore Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
