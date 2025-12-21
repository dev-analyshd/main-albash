import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, Star, Zap, Crown, Building } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Free",
    icon: Star,
    price: "₦0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      { name: "Create up to 5 listings", included: true },
      { name: "Basic marketplace access", included: true },
      { name: "Community forums", included: true },
      { name: "Standard support", included: true },
      { name: "5% transaction fee", included: true },
      { name: "NFT tokenization", included: false },
      { name: "Priority verification", included: false },
      { name: "Advanced analytics", included: false },
    ],
    cta: "Get Started",
    href: "/auth/sign-up",
    popular: false,
  },
  {
    name: "Builder Pro",
    icon: Zap,
    price: "₦5,000",
    period: "per month",
    description: "For serious builders and creators",
    features: [
      { name: "Unlimited listings", included: true },
      { name: "Full marketplace access", included: true },
      { name: "Community forums + groups", included: true },
      { name: "Priority support", included: true },
      { name: "3% transaction fee", included: true },
      { name: "NFT tokenization (5/month)", included: true },
      { name: "Priority verification", included: true },
      { name: "Basic analytics", included: true },
    ],
    cta: "Start Free Trial",
    href: "/auth/sign-up?plan=builder-pro",
    popular: true,
  },
  {
    name: "Business",
    icon: Crown,
    price: "₦15,000",
    period: "per month",
    description: "For established businesses",
    features: [
      { name: "Everything in Builder Pro", included: true },
      { name: "Team accounts (up to 5)", included: true },
      { name: "Advanced analytics dashboard", included: true },
      { name: "Dedicated account manager", included: true },
      { name: "2% transaction fee", included: true },
      { name: "Unlimited NFT tokenization", included: true },
      { name: "Custom storefront", included: true },
      { name: "API access", included: true },
    ],
    cta: "Contact Sales",
    href: "/contact?subject=business",
    popular: false,
  },
  {
    name: "Enterprise",
    icon: Building,
    price: "Custom",
    period: "contact us",
    description: "For institutions & organizations",
    features: [
      { name: "Everything in Business", included: true },
      { name: "Unlimited team accounts", included: true },
      { name: "White-label options", included: true },
      { name: "Custom integrations", included: true },
      { name: "Custom transaction fees", included: true },
      { name: "SLA guarantee", included: true },
      { name: "On-premise deployment", included: true },
      { name: "24/7 dedicated support", included: true },
    ],
    cta: "Contact Us",
    href: "/contact?subject=enterprise",
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4">Pricing</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Simple, Transparent <span className="text-primary">Pricing</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Choose the plan that fits your needs. Start free and upgrade as you grow.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <plan.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">/{plan.period}</span>
                </div>
                <ul className="space-y-3 text-left">
                  {plan.features.map((feature) => (
                    <li key={feature.name} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground/50 shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? "" : "text-muted-foreground/50"}>{feature.name}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href={plan.href} className="w-full">
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                    {plan.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto grid gap-6">
            {[
              {
                q: "Can I change plans later?",
                a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept bank transfers, cards, and cryptocurrency payments for all subscription plans.",
              },
              {
                q: "Is there a free trial for paid plans?",
                a: "Yes, all paid plans come with a 14-day free trial. No credit card required to start.",
              },
              {
                q: "What happens to my listings if I downgrade?",
                a: "Your existing listings remain active. You just won't be able to create new ones beyond your plan limit.",
              },
            ].map((item, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{item.q}</h3>
                  <p className="text-muted-foreground">{item.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
