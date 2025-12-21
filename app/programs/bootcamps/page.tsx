import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Rocket, Calendar, Clock, Users, CheckCircle, ArrowRight } from "lucide-react"

const bootcamps = [
  {
    title: "Digital Skills Bootcamp",
    description: "Learn essential digital skills including web development, digital marketing, and e-commerce.",
    duration: "2 weeks",
    format: "Hybrid (Online + In-person)",
    nextSession: "January 15, 2025",
    spots: 30,
    price: "Free",
    topics: ["Web Development Basics", "Digital Marketing", "E-commerce Setup", "Social Media Strategy"],
  },
  {
    title: "NFT & Blockchain Bootcamp",
    description: "Understand blockchain technology and learn to create, mint, and sell NFTs on the marketplace.",
    duration: "1 week",
    format: "Online",
    nextSession: "January 22, 2025",
    spots: 25,
    price: "₦15,000",
    topics: ["Blockchain Fundamentals", "NFT Creation", "Smart Contracts Basics", "Marketplace Integration"],
  },
  {
    title: "Artisan to Digital Bootcamp",
    description: "Help traditional craftsmen digitize their businesses and reach online customers.",
    duration: "3 weeks",
    format: "In-person (Kano)",
    nextSession: "February 1, 2025",
    spots: 20,
    price: "Free",
    topics: ["Product Photography", "Online Store Setup", "Order Management", "Digital Payments"],
  },
  {
    title: "Business Growth Accelerator",
    description: "Intensive program for established businesses looking to scale through digital transformation.",
    duration: "4 weeks",
    format: "Hybrid",
    nextSession: "February 15, 2025",
    spots: 15,
    price: "₦50,000",
    topics: ["Business Strategy", "Financial Management", "Team Building", "Market Expansion"],
  },
]

export default function BootcampsPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4">Programs</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Bootcamps</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Intensive training programs designed to help you build skills, grow your business, and succeed on the
            platform.
          </p>
        </div>
      </section>

      {/* Bootcamps List */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2">
          {bootcamps.map((bootcamp) => (
            <Card key={bootcamp.title} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2">{bootcamp.title}</CardTitle>
                    <CardDescription>{bootcamp.description}</CardDescription>
                  </div>
                  <Badge variant={bootcamp.price === "Free" ? "default" : "secondary"}>{bootcamp.price}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {bootcamp.duration}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {bootcamp.spots} spots
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {bootcamp.nextSession}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Rocket className="h-4 w-4" />
                    {bootcamp.format}
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm font-medium mb-2">What you'll learn:</p>
                  <ul className="space-y-1">
                    {bootcamp.topics.map((topic) => (
                      <li key={topic} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button className="w-full">
                  Register Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Can't find the right bootcamp?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Let us know what skills you want to learn and we'll create a program for you.
          </p>
          <Link href="/contact">
            <Button variant="outline">Suggest a Bootcamp</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
