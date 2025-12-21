import Link from "next/link"
import Image from "next/image"
import { XTwitterIcon, FacebookIcon, TikTokIcon, YouTubeIcon, WhatsAppIcon } from "@/components/icons/social-icons"

const footerLinks = {
  platform: [
    { href: "/marketplace", label: "Marketplace" },
    { href: "/marketplace/ideas", label: "Ideas" },
    { href: "/marketplace/talents", label: "Talents" },
    { href: "/marketplace/tools", label: "Tools" },
    { href: "/store", label: "Store" },
  ],
  services: [
    { href: "/services", label: "All Services" },
    { href: "/services/website-creation", label: "Website Creation" },
    { href: "/services/digital-profile", label: "Digital Profile" },
    { href: "/services/tokenization", label: "Tokenization" },
    { href: "/departments/verification", label: "Verification" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/team", label: "Our Team" },
    { href: "/announcements", label: "News & Updates" },
    { href: "/contact", label: "Contact" },
    { href: "/careers", label: "Careers" },
    { href: "/press", label: "Press" },
  ],
  resources: [
    { href: "/community", label: "Community" },
    { href: "/programs", label: "Programs" },
    { href: "/docs", label: "Documentation" },
    { href: "/help", label: "Help Center" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/cookies", label: "Cookie Policy" },
  ],
}

const socialLinks = [
  { href: "https://x.com/albashsolutions", icon: XTwitterIcon, label: "X (Twitter)" },
  { href: "https://web.facebook.com/profile.php?id=100076069236843", icon: FacebookIcon, label: "Facebook" },
  { href: "https://www.tiktok.com/@albashsolutions", icon: TikTokIcon, label: "TikTok" },
  { href: "https://youtube.com/@albashsolutions", icon: YouTubeIcon, label: "YouTube" },
  { href: "https://wa.me/2348051916160", icon: WhatsAppIcon, label: "WhatsApp" },
]

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/albash logo.png"
                alt="Albash Solutions Logo"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <span className="font-bold text-lg">AlbashSolutions</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              Empowering innovation through technology and community-driven solutions. Transforming traditional ideas
              into digital success.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links - NEW */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} AlbashSolutions. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
