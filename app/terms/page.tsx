import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-20">
      <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4">Legal</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: December 2025</p>
        </div>
      </section>

      <section className="py-12 container mx-auto px-4">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8 prose prose-neutral dark:prose-invert max-w-none">
            <p>
              Welcome to albashsolutionss ("we", "our", "us"). By accessing or using our website, mobile apps, or
              services (collectively "Services"), you agree to these Terms of Service ("Terms"). If you do not agree,
              you may not use our Services.
            </p>

            <h2>1. Eligibility</h2>
            <p>
              You must be at least 18 years old or have legal authority to use our Services. By using albashsolutionss,
              you represent and warrant that you meet these requirements.
            </p>

            <h2>2. Account Registration</h2>
            <ul>
              <li>You may need to create an account to access certain features.</li>
              <li>Provide accurate and complete information.</li>
              <li>Keep your login credentials secure; you are responsible for all activity under your account.</li>
              <li>We may suspend or terminate accounts that provide false information or violate these Terms.</li>
            </ul>

            <h2>3. User Responsibilities</h2>
            <p>You agree to:</p>
            <ul>
              <li>
                Use the Services in compliance with Nigerian laws, NDPA/NDPR, and international laws as applicable.
              </li>
              <li>
                Not upload, post, or transmit content that is illegal, harmful, offensive, or infringes on others' rights.
              </li>
              <li>Not attempt to gain unauthorized access to our platform or data.</li>
              <li>Be responsible for your own products, services, or content listed on albashsolutionss.</li>
            </ul>

            <h2>4. Services Provided</h2>
            <p>
              albashsolutionss is a digital marketplace that allows individuals, businesses, and organizations to:
            </p>
            <ul>
              <li>Apply for account registration.</li>
              <li>List products, services, ideas, or assets.</li>
              <li>Tokenize assets into NFTs and build on-chain reputation.</li>
              <li>Buy, sell, or exchange items within the marketplace.</li>
            </ul>
            <p>
              We reserve the right to modify, suspend, or discontinue any part of the Services without notice.
            </p>

            <h2>5. Intellectual Property</h2>
            <ul>
              <li>All content, logos, trademarks, and software of albashsolutionss are our property.</li>
              <li>
                Users retain ownership of their content but grant albashsolutionss a worldwide, non-exclusive,
                royalty-free license to display and distribute content within the Services.
              </li>
              <li>You may not reproduce, distribute, or use our intellectual property without written permission.</li>
            </ul>

            <h2>6. Payment and Transactions</h2>
            <ul>
              <li>All financial transactions are processed securely through authorized payment processors.</li>
              <li>Users are responsible for any fees associated with payments, subscriptions, or services.</li>
              <li>We are not liable for any disputes arising from transactions between users.</li>
            </ul>

            <h2>7. User Content</h2>
            <ul>
              <li>Users are solely responsible for content they upload, post, or share.</li>
              <li>albashsolutionss does not guarantee the accuracy, legality, or quality of user content.</li>
              <li>We may remove content that violates these Terms or applicable law.</li>
            </ul>

            <h2>8. Privacy</h2>
            <p>
              Your use of albashsolutionss is also governed by our Privacy Policy, which explains how we collect, use,
              and protect your personal data.
            </p>

            <h2>9. Limitation of Liability</h2>
            <ul>
              <li>albashsolutionss is provided "as is" and "as available".</li>
              <li>
                We are not liable for any direct, indirect, incidental, or consequential damages arising from use or
                inability to use the Services.
              </li>
              <li>We do not guarantee uninterrupted or error-free service.</li>
            </ul>

            <h2>10. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless albashsolutionss, its affiliates, officers, and employees from
              any claims, damages, losses, liabilities, or expenses arising from:
            </p>
            <ul>
              <li>Your use of the Services</li>
              <li>Violation of these Terms</li>
              <li>Violation of applicable laws</li>
            </ul>

            <h2>11. Termination</h2>
            <ul>
              <li>
                We may suspend or terminate your account or access for violations of these Terms or illegal activity.
              </li>
              <li>Users may close their accounts at any time.</li>
              <li>Termination does not relieve users of obligations accrued prior to termination.</li>
            </ul>

            <h2>12. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the Federal Republic of Nigeria, including the NDPA/NDPR. Any
              dispute will be resolved in Nigerian courts unless otherwise mutually agreed.
            </p>

            <h2>13. Changes to Terms</h2>
            <ul>
              <li>We may update these Terms from time to time.</li>
              <li>Updated Terms are effective immediately upon posting.</li>
              <li>Continued use of albashsolutionss constitutes acceptance of the updated Terms.</li>
            </ul>

            <h2>14. Contact Information</h2>
            <p>For inquiries about these Terms:</p>
            <ul>
              <li>Email: albashsolutionss@gmail.com</li>
              <li>Website: https://albashsolutionss.online</li>
              <li>
                Address: No. B8, New Saye Plaza, Dakwa, Bwari, Abuja
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
