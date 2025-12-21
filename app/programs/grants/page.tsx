import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Gift, Calendar, DollarSign, Target, ArrowRight, CheckCircle, Info } from "lucide-react"

const grants = [
  {
    title: "Artisan Starter Grant",
    description: "Funding for traditional craftsmen to digitize their business and join the marketplace.",
    amount: "₦100,000 - ₦250,000",
    deadline: "January 31, 2025",
    eligibility: ["Traditional craftsmen", "Based in Northern Nigeria", "New to digital platforms"],
    benefits: ["Cash grant", "Free platform training", "3 months of premium features", "Dedicated mentor"],
    status: "Open",
  },
  {
    title: "Women Entrepreneur Grant",
    description: "Supporting women-owned businesses to scale through digital transformation.",
    amount: "₦150,000 - ₦500,000",
    deadline: "February 28, 2025",
    eligibility: ["Women-owned business", "Operating for 1+ years", "Revenue under ₦5M annually"],
    benefits: ["Cash grant", "Business coaching", "Marketing support", "Network access"],
    status: "Open",
  },
  {
    title: "Innovation Grant",
    description: "For innovative ideas that solve local problems using technology.",
    amount: "₦500,000 - ₦2,000,000",
    deadline: "March 15, 2025",
    eligibility: ["Innovative tech solution", "Proof of concept", "Team of 2-5 members"],
    benefits: ["Cash grant", "Incubation support", "Technical mentorship", "Investor introductions"],
    status: "Coming Soon",
  },
  {
    title: "Student Builder Grant",
    description: "Supporting students to turn academic projects into viable businesses.",
    amount: "₦50,000 - ₦150,000",
    deadline: "Rolling Applications",
    eligibility: ["Current student", "Valid student ID", "Original project/idea"],
    benefits: ["Cash grant", "Platform premium access", "Mentorship", "Internship opportunity"],
    status: "Open",
  },
]

export default function GrantsPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-chart-4/10 via-background to-background">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4">Programs</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Grants & Funding</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Access funding opportunities to grow your business, launch your idea, or digitize your craft.
          </p>
        </div>
      </section>

      {/* Grants List */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-2">
          {grants.map((grant) => (
            <Card key={grant.title} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-chart-4/10">
                      <Gift className="h-6 w-6 text-chart-4" />
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-1">{grant.title}</CardTitle>
                      <CardDescription>{grant.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={grant.status === "Open" ? "default" : "secondary"}>{grant.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Grant Amount</p>
                    <p className="font-semibold flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {grant.amount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Deadline</p>
                    <p className="font-semibold flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {grant.deadline}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    Eligibility
                  </p>
                  <ul className="space-y-1">
                    {grant.eligibility.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <p className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Info className="h-4 w-4" />
                    Benefits
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {grant.benefits.map((benefit) => (
                      <Badge key={benefit} variant="outline">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full" disabled={grant.status !== "Open"}>
                  {grant.status === "Open" ? "Apply Now" : "Coming Soon"}
                  {grant.status === "Open" && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Want to Fund Grants?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Partner with us to support local entrepreneurs and make a lasting impact in Northern Nigeria.
          </p>
          <Link href="/contact?subject=partnership">
            <Button variant="outline">Become a Grant Partner</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
