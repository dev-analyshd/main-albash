import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-20">
      <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4">Legal</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: December 2025</p>
        </div>
      </section>

      <section className="py-12 container mx-auto px-4">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8 prose prose-neutral dark:prose-invert max-w-none">
            <h2>PRIVACY POLICY</h2>
            <p className="text-lg font-semibold mb-4">Albashsolutions Marketplace</p>
            <p>
              This Privacy Policy explains how albashsolutionss ("we", "our", "us") collects, uses, stores, and protects
              your personal information when you access our website, services, marketplace, mobile features, or any
              related platforms.
            </p>
            <p>By using https://albashsolutionss.online, you agree to the terms described in this Privacy Policy.</p>

            <h2>1. Information We Collect</h2>
            <p>We collect information to provide better services to our users. This includes:</p>

            <h3>1.1 Personal Information</h3>
            <p>When you register, apply, or create an account, we may collect:</p>
            <ul>
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Business or organizational details</li>
              <li>Identification information (if required for verification)</li>
              <li>Payment details (processed through secure third parties)</li>
            </ul>

            <h3>1.2 Usage & Technical Information</h3>
            <p>Automatically collected when you visit our site:</p>
            <ul>
              <li>IP address</li>
              <li>Device type</li>
              <li>Browser type</li>
              <li>Operating system</li>
              <li>Pages visited</li>
              <li>Clicks, actions, and navigation</li>
              <li>Time spent on pages</li>
            </ul>

            <h3>1.3 Uploaded Content</h3>
            <p>Any data you upload to the platform, including:</p>
            <ul>
              <li>Product/service listings</li>
              <li>Business documents</li>
              <li>Images, files, or multimedia</li>
              <li>Ideas or asset details for tokenization</li>
            </ul>

            <h3>1.4 Cookies & Tracking Technologies</h3>
            <p>We use cookies to:</p>
            <ul>
              <li>Improve user experience</li>
              <li>Remember preferences</li>
              <li>Analyze traffic</li>
              <li>Provide personalized content</li>
              <li>Enhance site security</li>
            </ul>
            <p>You can disable cookies in your browser settings.</p>

            <h2>2. How We Use Your Information</h2>
            <p>We use your data to:</p>
            <ul>
              <li>Create and manage your account</li>
              <li>Verify your identity and eligibility</li>
              <li>Process applications and listings</li>
              <li>Improve our platform and security</li>
              <li>Send notifications, updates, and promotional messages</li>
              <li>Provide customer support</li>
              <li>Facilitate transactions within the marketplace</li>
              <li>Prevent fraud, abuse, or illegal activities</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>3. Legal Basis for Processing</h2>
            <p>We process your data based on:</p>
            <ul>
              <li>Your consent</li>
              <li>Contractual necessity (to deliver our service)</li>
              <li>Legitimate interest</li>
              <li>Compliance with applicable laws</li>
            </ul>

            <h2>4. Sharing & Disclosure of Information</h2>
            <p>We do not sell your personal data.</p>
            <p>However, we may share information with:</p>
            <ul>
              <li>Service providers (hosting, payment, analytics)</li>
              <li>Verification partners (for identity or business checks)</li>
              <li>Legal authorities (when required by law)</li>
              <li>Business partners involved in marketplace transactions</li>
              <li>Technical support providers</li>
            </ul>
            <p>All third parties operate under confidentiality and security agreements.</p>

            <h2>5. Data Storage & Security</h2>
            <p>We employ industry-standard security measures to protect your data from:</p>
            <ul>
              <li>Unauthorized access</li>
              <li>Loss</li>
              <li>Alteration</li>
              <li>Misuse</li>
              <li>Disclosure</li>
            </ul>
            <p>Security measures include:</p>
            <ul>
              <li>Encrypted data transmission (HTTPS/SSL)</li>
              <li>Secure servers and firewalls</li>
              <li>Access limitations</li>
              <li>Regular audits</li>
            </ul>

            <h2>6. Your Rights</h2>
            <p>Depending on your region, you may have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data (Right to be Forgotten)</li>
              <li>Restrict or object to processing</li>
              <li>Withdraw consent at any time</li>
              <li>Request data portability</li>
              <li>Opt-out of marketing communications</li>
            </ul>
            <p>To exercise any right, contact: albashsolutionss@gmail.com</p>

            <h2>7. Data Retention</h2>
            <p>We keep your data only for as long as necessary to:</p>
            <ul>
              <li>Provide our services</li>
              <li>Comply with legal requirements</li>
              <li>Resolve disputes</li>
              <li>Enforce agreements</li>
            </ul>
            <p>You may request deletion at any time.</p>

            <h2>8. Children's Privacy</h2>
            <p>Our platform is not intended for children under 13 years.</p>
            <p>We do not knowingly collect information from minors.</p>
            <p>If you believe a minor has provided data, contact us immediately.</p>

            <h2>9. Third-Party Links</h2>
            <p>Our website may contain links to third-party sites.</p>
            <p>We are not responsible for their content or privacy practices.</p>
            <p>Always review their policies before interacting.</p>

            <h2>10. Changes to This Privacy Policy</h2>
            <p>We may update or modify this policy from time to time.</p>
            <p>When changes occur:</p>
            <ul>
              <li>We will update the "Last Updated" date</li>
              <li>We may notify users through email or platform alerts</li>
              <li>Continued use of our platform means you accept the updated policy.</li>
            </ul>

            <h2>11. Contact Information</h2>
            <p>For inquiries, complaints, or requests:</p>
            <ul>
              <li>Email: albashsolutionss@gmail.com</li>
              <li>Website: https://albashsolutionss.online</li>
              <li>Address: No. B8, New Saye Plaza, Dakwa, Bwari, Abuja.</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
