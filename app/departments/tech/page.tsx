import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { MessageSquare, BookOpen, Wrench, HelpCircle, ArrowRight, Mail, Phone, Clock } from "lucide-react"

const supportCategories = [
  {
    icon: HelpCircle,
    title: "General Help",
    description: "Get help with account, listings, and general platform usage",
    href: "/help",
  },
  {
    icon: Wrench,
    title: "Technical Issues",
    description: "Report bugs, errors, or technical problems",
    href: "/help/technical",
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Chat with our support team in real-time",
    href: "/help/chat",
  },
  {
    icon: BookOpen,
    title: "Documentation",
    description: "Browse guides, tutorials, and FAQs",
    href: "/docs",
  },
]

const faqs = [
  {
    question: "How do I get verified?",
    answer:
      "Submit your application through the appropriate department (Builder, Business, Institution, or Organization). Our team will review your documents and respond within 3-5 business days.",
  },
  {
    question: "How does payment work?",
    answer:
      "We support multiple payment methods including bank transfer (via Paystack/Flutterwave), cryptocurrency, and direct bank transfer. Funds are held in escrow until the buyer confirms receipt.",
  },
  {
    question: "What is NFT tokenization?",
    answer:
      "NFT tokenization converts your physical or digital assets into unique blockchain tokens, providing proof of ownership and enabling secure trading on the marketplace.",
  },
  {
    question: "How do I increase my reputation score?",
    answer:
      "Complete your profile, get verified, create listings, make sales, receive positive reviews, and participate in community discussions to earn reputation points.",
  },
]

export default function TechDepartmentPage() {
  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge className="mb-4">Tech Department</Badge>
        <h1 className="text-4xl font-bold mb-4">Technical Support</h1>
        <p className="text-xl text-muted-foreground">
          Get help with technical issues, learn how to use the platform, and access developer resources.
        </p>
      </div>

      {/* Support Categories */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {supportCategories.map((category) => (
          <Link key={category.title} href={category.href}>
            <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <category.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{category.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-16">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Submit a Support Request</CardTitle>
            <CardDescription>Describe your issue and we'll get back to you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="your@email.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Input placeholder="Brief description of your issue" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea placeholder="Describe your issue in detail..." rows={5} />
            </div>
            <Button className="w-full">
              Submit Request
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* FAQs */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Quick answers to common questions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">{faq.question}</h4>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
            <Link href="/docs">
              <Button variant="outline" className="w-full bg-transparent">
                View All FAQs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Contact Info */}
      <Card>
        <CardContent className="p-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Email Support</h3>
              <p className="text-muted-foreground">support@albashsolutionss.com</p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Phone Support</h3>
              <p className="text-muted-foreground">+234 XXX XXX XXXX</p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Support Hours</h3>
              <p className="text-muted-foreground">Mon - Fri: 9AM - 6PM WAT</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
