import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { Search, BookOpen, MessageCircle, Mail, FileText, Shield, CreditCard, Users, ArrowRight } from "lucide-react"

const categories = [
  { name: "Getting Started", icon: BookOpen, articles: 12 },
  { name: "Selling & Listings", icon: FileText, articles: 18 },
  { name: "Verification", icon: Shield, articles: 8 },
  { name: "Payments", icon: CreditCard, articles: 15 },
  { name: "Community", icon: Users, articles: 10 },
  { name: "Account", icon: MessageCircle, articles: 14 },
]

const faqs = [
  {
    question: "How do I get verified on AlbashSolutions?",
    answer:
      "To get verified, go to the Apply section and choose your account type (Builder, Institution, Business, Company, or Organization). Complete the application form with accurate information and supporting documents. Our verification team will review your application within 3-5 business days.",
  },
  {
    question: "What are the fees for selling on the marketplace?",
    answer:
      "AlbashSolutions charges a small percentage fee on successful transactions. The exact fee depends on your account type and verification status. Verified sellers enjoy lower fees. Check our pricing page for detailed information.",
  },
  {
    question: "How does NFT tokenization work?",
    answer:
      "NFT tokenization allows you to mint your digital assets as blockchain tokens, providing proof of ownership and authenticity. When you create a listing, you can enable tokenization which will mint an NFT representing your asset. This adds an extra layer of trust and enables new monetization options.",
  },
  {
    question: "Can I sell physical products?",
    answer:
      "Yes! AlbashSolutions is a hybrid marketplace supporting both digital and physical products. For physical products, you'll need to handle shipping directly with buyers. We recommend using verified shipping services and providing tracking information.",
  },
  {
    question: "How do I withdraw my earnings?",
    answer:
      "Go to your Dashboard > Wallet to manage your earnings. You can withdraw funds to your connected bank account or payment method. Withdrawals are processed within 1-3 business days depending on your location and payment method.",
  },
  {
    question: "What happens if there's a dispute?",
    answer:
      "If a dispute arises, both parties can open a support ticket through the platform. Our dispute resolution team will review the case, examine evidence from both sides, and make a fair decision. We encourage clear communication and documentation to resolve issues quickly.",
  },
]

export default function HelpPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4">Help Center</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              How can we <span className="text-primary">help you?</span>
            </h1>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search for help articles..." className="pl-12 h-14 text-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">Browse by Category</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.name} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 rounded-lg bg-primary/10">
                  <category.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.articles} articles</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground ml-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <Card>
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
          <p className="text-muted-foreground">Our support team is here to assist you</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-sm text-muted-foreground mb-4">Chat with our support team in real-time</p>
              <Button className="w-full">Start Chat</Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-sm text-muted-foreground mb-4">Get a response within 24 hours</p>
              <Link href="/contact">
                <Button variant="outline" className="w-full bg-transparent">
                  Send Email
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
