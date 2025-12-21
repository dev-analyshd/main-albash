import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Wrench, Bug, AlertTriangle, HelpCircle, ArrowRight, CheckCircle } from "lucide-react"

const commonIssues = [
  {
    title: "Can't log in to my account",
    solution:
      "Try resetting your password using the 'Forgot Password' link. If that doesn't work, clear your browser cache and cookies.",
    category: "Account",
  },
  {
    title: "My listing isn't showing up",
    solution:
      "New listings may take up to 24 hours to appear in search results. Make sure your listing is set to 'Active' in your dashboard.",
    category: "Marketplace",
  },
  {
    title: "Payment not going through",
    solution:
      "Check that your payment method is valid and has sufficient funds. Some banks may block first-time transactions - contact your bank if issues persist.",
    category: "Payments",
  },
  {
    title: "NFT minting failed",
    solution:
      "Ensure your wallet is connected and has enough balance for gas fees. Try minting again during off-peak hours when network congestion is lower.",
    category: "Blockchain",
  },
  {
    title: "Verification taking too long",
    solution:
      "Verification typically takes 3-5 business days. If it's been longer, check that all your documents were uploaded correctly and are clearly readable.",
    category: "Verification",
  },
  {
    title: "Can't withdraw funds",
    solution:
      "Ensure your withdrawal method is verified and you've met the minimum withdrawal threshold. Some funds may be on hold pending transaction completion.",
    category: "Payments",
  },
]

export default function TechnicalHelpPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-red-500/10 via-background to-background">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-red-100 text-red-700">Technical Support</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Technical Issues</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Report bugs, errors, or technical problems you're experiencing on the platform.
          </p>
        </div>
      </section>

      <div className="py-16 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Common Issues */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-primary" />
              Common Issues & Solutions
            </h2>
            <div className="space-y-4">
              {commonIssues.map((issue) => (
                <Card key={issue.title}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{issue.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {issue.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{issue.solution}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Report Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Bug className="h-6 w-6 text-red-500" />
              Report a Technical Issue
            </h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Name</label>
                    <Input placeholder="Full name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input type="email" placeholder="you@example.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Issue Category</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="account">Account Issues</SelectItem>
                      <SelectItem value="payments">Payment Problems</SelectItem>
                      <SelectItem value="marketplace">Marketplace Issues</SelectItem>
                      <SelectItem value="blockchain">NFT/Blockchain Issues</SelectItem>
                      <SelectItem value="verification">Verification Problems</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Issue Summary</label>
                  <Input placeholder="Brief description of the problem" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Detailed Description</label>
                  <Textarea
                    placeholder="Please describe the issue in detail. Include steps to reproduce the problem, error messages, and what you expected to happen."
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Browser/Device Info (Optional)</label>
                  <Input placeholder="e.g., Chrome on Windows 11, Safari on iPhone" />
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      For urgent security issues, please email <strong>security@albashsolutionss.com</strong> directly.
                    </p>
                  </div>
                </div>

                <Button className="w-full">
                  Submit Report
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Status */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <Wrench className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-4">System Status</h2>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-green-600 font-medium">All Systems Operational</span>
          </div>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Check our status page for real-time updates on platform availability and any ongoing issues.
          </p>
          <Link href="/status">
            <Button variant="outline">View Status Page</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
