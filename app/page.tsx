import { HeroSection } from "@/components/home/hero-section"
import { HeroIllustration } from "@/components/home/hero-illustration"
import { FeaturesSection } from "@/components/home/features-section"
import { MarketplacePreview } from "@/components/home/marketplace-preview"
import { HowItWorks } from "@/components/home/how-it-works"
import { AnnouncementsSection } from "@/components/home/announcements-section"
import { StatsSection } from "@/components/home/stats-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { CTASection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <section className="py-12 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Your Transformation Journey</h2>
            <p className="text-muted-foreground">From traditional ideas to digital success</p>
          </div>
          <HeroIllustration />
        </div>
      </section>
      <FeaturesSection />
      <MarketplacePreview />
      <HowItWorks />
      <AnnouncementsSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  )
}
