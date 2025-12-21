import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function DocsPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4">Documentation</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Documentation</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Complete guide to using albashsolutions marketplace platform
          </p>
        </div>
      </section>

      {/* Documentation Content */}
      <section className="py-12 container mx-auto px-4">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8 prose prose-neutral dark:prose-invert max-w-none">
            <h2>1. Introduction</h2>
            <h3>Overview:</h3>
            <p>
              albashsolutions is a digital marketplace where individuals, businesses, Institutions, Companies and
              organizations can list products, services, ideas, or tokenize assets into NFTs to build on-chain
              reputation.
            </p>
            <h3>Purpose of this document:</h3>
            <ul>
              <li>To guide users on how to apply and navigate albashsolutions</li>
              <li>To provide detailed instructions for all platform features</li>
              <li>To assist developers, partners, and admins in understanding system functionality</li>
            </ul>

            <h2>2. Getting Started</h2>
            <h3>2.1 System Requirements</h3>
            <ul>
              <li>Device: Smartphone (iOS/Android) or Desktop</li>
              <li>Browser: Chrome, Safari, Firefox, Edge (latest versions recommended)</li>
              <li>Internet connection: Stable broadband or mobile data</li>
            </ul>
            <h3>2.2 Accessing albashsolutions</h3>
            <ul>
              <li>Visit: https://albashsolutions.online</li>
              <li>Optional: Convert the website into a mobile app (see Section 3)</li>
            </ul>

            <h2>3. Converting Website to Mobile App</h2>
            <p>Step-by-Step:</p>
            <ol>
              <li>Open your browser and visit https://albashsolutions.online</li>
              <li>Tap the three-dotted menu at the upper-right corner</li>
              <li>Select "Add to Home Screen"</li>
              <li>Tap Install</li>
              <li>Open your phone apps and find albashsolutions as an app</li>
            </ol>

            <h2>4. Account Registration & Application</h2>
            <h3>4.1 How to Apply</h3>
            <ol>
              <li>Open albashsolutions on your device</li>
              <li>Tap the blue icon at the bottom-right corner</li>
              <li>Select your category: Builder, Business, Organization, or Institution</li>
              <li>Fill in the application form with accurate information</li>
              <li>Tap Next through each section</li>
              <li>Submit your application for verification</li>
              <li>Go to your Email for confirmation (you need to confirm your email address after submitting your application)</li>
            </ol>
            <h3>4.2 Verification Process</h3>
            <ul>
              <li>albashsolutions reviews your application</li>
              <li>Approved users receive access to marketplace features</li>
              <li>Users may be asked to submit additional documents for verification</li>
            </ul>

            <h2>5. Marketplace Functionality</h2>
            <h3>5.1 Listing Products or Services</h3>
            <ol>
              <li>Navigate to your dashboard through login process</li>
              <li>Tap Add Product/Service</li>
              <li>Fill in details: title, description, images, price, categories</li>
              <li>Optional: Tokenize your asset as NFT</li>
            </ol>
            <h3>5.2 Buying & Selling</h3>
            <ul>
              <li>Browse listings</li>
              <li>Use filters and search to find products/services</li>
              <li>Purchase securely via integrated payment gateways</li>
            </ul>
            <h3>5.3 Tokenization & Reputation</h3>
            <ul>
              <li>Convert eligible assets into NFTs</li>
              <li>Gain on-chain reputation points</li>
              <li>View and manage tokens in your dashboard</li>
            </ul>

            <h2>6. Security & Privacy</h2>
            <ul>
              <li>All transactions are secured with HTTPS/SSL</li>
              <li>Sensitive data is encrypted and protected</li>
              <li>Users must maintain account security and avoid sharing passwords</li>
              <li>Refer to our Privacy Policy for detailed data protection information.</li>
            </ul>

            <h2>7. User Rights & Responsibilities</h2>
            <ul>
              <li>Users are responsible for the content they post</li>
              <li>Do not upload illegal, harmful, or infringing materials</li>
              <li>Respect platform rules and Nigerian laws</li>
            </ul>

            <h2>8. Admin & Support</h2>
            <ul>
              <li>Admins can approve, reject, or remove listings</li>
              <li>
                Support can be contacted via albashsolutions@gmail.com or through the platform chat
              </li>
            </ul>

            <h2>9. Developer Notes (Optional)</h2>
            <ul>
              <li>API endpoints (if applicable)</li>
              <li>Data schema for assets, users, and transactions</li>
              <li>Tokenization workflow (NFT creation, metadata, and reputation tracking)</li>
              <li>Integration with payment providers</li>
            </ul>

            <h2>10. Terms & Legal</h2>
            <ul>
              <li>Users must comply with the Terms of Service and Privacy Policy</li>
              <li>Nigerian law governs all disputes (NDPA/NDPR compliance)</li>
            </ul>

            <h2>11. FAQ / Troubleshooting</h2>
            <div className="space-y-4">
              <div>
                <p className="font-semibold">Q1: How do I recover my password?</p>
                <p>A: Use the "Forgot Password" link on the login page and follow the instructions.</p>
              </div>
              <div>
                <p className="font-semibold">Q2: What if my application is rejected?</p>
                <p>A: Check for accuracy and completeness, then reapply or contact support.</p>
              </div>
              <div>
                <p className="font-semibold">Q3: Can I delete my account?</p>
                <p>A: Yes, go to account settings and select Delete Account.</p>
              </div>
            </div>

            <h2>12. Contact</h2>
            <ul>
              <li>Support Email: albashsolutions@gmail.com</li>
              <li>Website: https://albashsolutions.online</li>
              <li>Phone: 08051916160</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Quick Links */}
      <section className="py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/apply/builder">
              <Badge
                variant="outline"
                className="py-2 px-4 cursor-pointer hover:bg-primary hover:text-primary-foreground"
              >
                Apply Now
              </Badge>
            </Link>
            <Link href="/check-status">
              <Badge
                variant="outline"
                className="py-2 px-4 cursor-pointer hover:bg-primary hover:text-primary-foreground"
              >
                Check Application Status
              </Badge>
            </Link>
            <Link href="/marketplace">
              <Badge
                variant="outline"
                className="py-2 px-4 cursor-pointer hover:bg-primary hover:text-primary-foreground"
              >
                Browse Marketplace
              </Badge>
            </Link>
            <Link href="/contact">
              <Badge
                variant="outline"
                className="py-2 px-4 cursor-pointer hover:bg-primary hover:text-primary-foreground"
              >
                Contact Support
              </Badge>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
