import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Megaphone, Calendar, Sparkles, Users, Building2, Award, ArrowRight, Bell } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const allAnnouncements = [
  {
    id: 1,
    type: "update",
    title: "Platform Launch: AlbashSolutions Now Live!",
    description:
      "We're excited to announce the official launch of AlbashSolutions - the hybrid digital/physical ecosystem designed to help individuals, students, institutions, small businesses, and organizations digitize their ideas, talents, products, and services. Start your journey from traditional to digital today and join thousands of builders transforming their futures.",
    date: "2024-12-01",
    isNew: true,
    icon: Sparkles,
    color: "bg-primary text-primary-foreground",
    link: "/about",
  },
  {
    id: 2,
    type: "partnership",
    title: "New Partnership with Northern Nigeria Craftsmen Association",
    description:
      "We've partnered with local artisan groups across Kano, Kaduna, and Sokoto to bring authentic Northern Nigerian products to the digital marketplace. This partnership will help traditional craftsmen reach global markets while preserving cultural heritage through digital verification and tokenization.",
    date: "2024-11-28",
    isNew: true,
    icon: Users,
    color: "bg-chart-2 text-background",
    link: "/departments/businesses",
  },
  {
    id: 3,
    type: "feature",
    title: "NFT Minting Now Available for Verified Builders",
    description:
      "Verified builders can now tokenize their creations and sell them as NFTs on our marketplace. This feature enables creators to establish provable ownership of their digital and physical assets, building on-chain reputation that travels with them across the ecosystem.",
    date: "2024-11-25",
    isNew: false,
    icon: Award,
    color: "bg-chart-4 text-background",
    link: "/studio/builder",
  },
  {
    id: 4,
    type: "event",
    title: "Upcoming: Digital Skills Bootcamp for Students",
    description:
      "Join our free 2-week bootcamp designed to help students build digital portfolios and enter the marketplace. Learn website creation, digital branding, and how to tokenize your academic projects. Limited spots available - register now to secure your place.",
    date: "2024-12-15",
    isNew: false,
    icon: Calendar,
    color: "bg-chart-3 text-background",
    link: "/programs/bootcamps",
  },
  {
    id: 5,
    type: "milestone",
    title: "1000+ Verified Listings Milestone Reached!",
    description:
      "Our community has grown to over 1000 verified products, services, and digital assets. Thank you to all our builders, institutions, and businesses for making this possible. Together, we're building the future of digital commerce in Northern Nigeria and beyond.",
    date: "2024-11-20",
    isNew: false,
    icon: Building2,
    color: "bg-accent text-accent-foreground",
    link: "/marketplace",
  },
  {
    id: 6,
    type: "update",
    title: "New Verification Department: Idea Verification",
    description:
      "We've launched a dedicated Idea Verification department to help builders protect and validate their innovative concepts before bringing them to market. Get your ideas verified and establish prior art on the blockchain.",
    date: "2024-11-15",
    isNew: false,
    icon: Sparkles,
    color: "bg-primary/80 text-primary-foreground",
    link: "/departments/verification",
  },
  {
    id: 7,
    type: "partnership",
    title: "Educational Partnership with 50+ Institutions",
    description:
      "AlbashSolutions has partnered with over 50 educational institutions across Northern Nigeria to digitize student portfolios, issue verifiable certificates, and showcase student talent on our marketplace.",
    date: "2024-11-10",
    isNew: false,
    icon: Users,
    color: "bg-chart-2/80 text-background",
    link: "/departments/institutions",
  },
  {
    id: 8,
    type: "feature",
    title: "Multi-Payment Support: Crypto & Fiat Now Live",
    description:
      "You can now pay for products and services using both cryptocurrency (including Konet chain) and traditional fiat payments through Paystack and Flutterwave. More payment options mean more accessibility for all users.",
    date: "2024-11-05",
    isNew: false,
    icon: Award,
    color: "bg-chart-4/80 text-background",
    link: "/marketplace",
  },
]

export default function AnnouncementsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <Megaphone className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">Official Announcements</h1>
        <p className="text-xl text-muted-foreground">
          Stay updated with the latest news, partnerships, features, and platform milestones.
        </p>
      </div>

      {/* Subscribe Card */}
      <Card className="max-w-2xl mx-auto mb-12 bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="p-3 rounded-full bg-primary/20">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-semibold mb-1">Never Miss an Update</h3>
              <p className="text-sm text-muted-foreground">
                Enable notifications to get the latest announcements delivered to your dashboard.
              </p>
            </div>
            <Link href="/dashboard/notifications">
              <Button>Enable Notifications</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Announcements List */}
      <div className="space-y-6 max-w-4xl mx-auto">
        {allAnnouncements.map((announcement) => (
          <Link key={announcement.id} href={announcement.link}>
            <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className={`p-4 rounded-xl ${announcement.color} self-start shrink-0`}>
                    <announcement.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-semibold text-xl group-hover:text-primary transition-colors">
                        {announcement.title}
                      </h3>
                      {announcement.isNew && <Badge className="bg-red-500 text-white shrink-0">New</Badge>}
                    </div>
                    <p className="text-muted-foreground mb-4">{announcement.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(announcement.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="text-sm text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read more <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
