import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Briefcase, Globe, Palette, ShoppingBag, ArrowRight, TrendingUp, Camera, Megaphone, Store } from "lucide-react"

const services = [
  {
    icon: Globe,
    title: "E-commerce Setup",
    description: "Online stores with payment integration, inventory management, and delivery tracking.",
  },
  {
    icon: Palette,
    title: "Brand Identity",
    description: "Logo design, packaging, and complete visual identity for your business.",
  },
  {
    icon: Camera,
    title: "Product Photography",
    description: "Professional product photos and videos for marketing and online listings.",
  },
  {
    icon: Megaphone,
    title: "Social Media Marketing",
    description: "Content creation, ad campaigns, and social media management.",
  },
  {
    icon: Store,
    title: "Marketplace Listing",
    description: "Get your products listed on our verified marketplace platform.",
  },
  {
    icon: TrendingUp,
    title: "Business Growth",
    description: "Analytics, insights, and strategies to scale your business.",
  },
]

const businessCategories = [
  {
    category: "Agriculture & Farming",
    businesses: [
      { name: "Fresh Farms Co.", services: ["E-commerce", "Branding", "Social Media"], type: "Organic Farming" },
      { name: "Green Harvest", services: ["Product Photography", "Marketplace"], type: "Vegetable Supply" },
      { name: "Golden Grain Farms", services: ["Website", "Packaging Design"], type: "Grain Production" },
    ],
    icon: "🌾",
  },
  {
    category: "Food & Cooking",
    businesses: [
      { name: "Mama's Kitchen", services: ["Branding", "Social Media", "E-commerce"], type: "Home Cooking" },
      { name: "Spice Master", services: ["Packaging", "Product Photography"], type: "Spice Business" },
      { name: "Fresh Bites Catering", services: ["Website", "Marketing"], type: "Catering Service" },
    ],
    icon: "🍳",
  },
  {
    category: "Fashion & Tailoring",
    businesses: [
      { name: "Elegant Stitches", services: ["Branding", "E-commerce", "Photography"], type: "Custom Tailoring" },
      { name: "Modern Threads", services: ["Website", "Social Media"], type: "Fashion Design" },
      { name: "Royal Attire", services: ["Full Branding", "Marketplace"], type: "Traditional Wear" },
    ],
    icon: "👔",
  },
  {
    category: "Handcrafts & Arts",
    businesses: [
      { name: "Craft Haven", services: ["E-commerce", "Photography"], type: "Handmade Crafts" },
      { name: "Artisan Works", services: ["Branding", "Marketplace"], type: "Art & Decor" },
    ],
    icon: "🎨",
  },
]

const stats = [
  { label: "Businesses Served", value: "200+" },
  { label: "Products Listed", value: "5K+" },
  { label: "Revenue Generated", value: "₦50M+" },
  { label: "Success Rate", value: "95%" },
]

export default function BusinessDepartmentPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4">
          <FadeInUp className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
              <Briefcase className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">Business Department</h1>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto mb-8">
              Empowering small businesses, traders, and entrepreneurs to go digital and reach more customers through our
              comprehensive business solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply/business">
                <Button size="lg" className="gap-2">
                  Register Your Business
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/marketplace/businesses">
                <Button size="lg" variant="outline" className="bg-transparent">
                  Browse Businesses
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold">{stat.value}</p>
                <p className="text-primary-foreground/80 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <FadeInUp className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Services for Small Businesses</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to digitize your business and reach more customers.
            </p>
          </FadeInUp>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <StaggerItem key={service.title}>
                <Card className="h-full hover:border-primary transition-colors">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                    <p className="text-muted-foreground text-sm">{service.description}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Business Categories */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <FadeInUp className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Businesses We've Helped</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From farming to fashion, we've helped businesses across various industries go digital.
            </p>
          </FadeInUp>

          <div className="space-y-12">
            {businessCategories.map((category) => (
              <FadeInUp key={category.category}>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <span className="text-3xl">{category.icon}</span>
                    {category.category}
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.businesses.map((business) => (
                    <Card key={business.name} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{business.type}</span>
                        </div>
                        <h4 className="text-lg font-semibold mb-3">{business.name}</h4>
                        <div className="flex flex-wrap gap-2">
                          {business.services.map((service) => (
                            <Badge key={service} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <FadeInUp className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
          </FadeInUp>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "AlbashSolutions helped me take my tailoring business online. Now I receive orders from across Nigeria!",
                name: "Fatima A.",
                business: "Elegant Stitches",
                growth: "300% increase in orders",
              },
              {
                quote: "The e-commerce platform they built for my farm produce business has been a game changer.",
                name: "Ibrahim M.",
                business: "Fresh Farms Co.",
                growth: "5x revenue growth",
              },
              {
                quote: "Professional branding and social media management helped my cooking business go viral.",
                name: "Amina Y.",
                business: "Mama's Kitchen",
                growth: "10K+ followers",
              },
            ].map((story, index) => (
              <FadeInUp key={index}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-4">"{story.quote}"</p>
                    <div className="border-t pt-4">
                      <p className="font-semibold">{story.name}</p>
                      <p className="text-sm text-muted-foreground">{story.business}</p>
                      <Badge className="mt-2 bg-green-100 text-green-700">{story.growth}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <FadeInUp>
            <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Business?</h2>
            <p className="max-w-2xl mx-auto mb-8 text-primary-foreground/80">
              Join hundreds of businesses that have transformed their operations with AlbashSolutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply/business">
                <Button size="lg" variant="secondary" className="gap-2">
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>
    </div>
  )
}
