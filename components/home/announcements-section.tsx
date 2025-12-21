"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Megaphone,
  Calendar,
  ArrowRight,
  Sparkles,
  Users,
  Building2,
  Award,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

const announcements = [
  {
    id: 1,
    type: "update",
    title: "Platform Launch: AlbashSolutions Now Live!",
    description:
      "We're excited to announce the official launch of AlbashSolutions. Start your journey from traditional to digital today.",
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
      "We've partnered with local artisan groups to bring authentic Northern Nigerian products to the digital marketplace.",
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
    description: "Verified builders can now tokenize their creations and sell them as NFTs on our marketplace.",
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
      "Join our free 2-week bootcamp designed to help students build digital portfolios and enter the marketplace.",
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
    description: "Our community has grown to over 1000 verified products, services, and digital assets.",
    date: "2024-11-20",
    isNew: false,
    icon: Building2,
    color: "bg-accent text-accent-foreground",
    link: "/marketplace",
  },
]

export function AnnouncementsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const visibleCount = 3

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1 >= announcements.length ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 < 0 ? announcements.length - 1 : prev - 1))
  }

  const getVisibleAnnouncements = () => {
    const visible = []
    for (let i = 0; i < Math.min(visibleCount, announcements.length); i++) {
      const index = (currentIndex + i) % announcements.length
      visible.push(announcements[index])
    }
    return visible
  }

  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Megaphone className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold">Official Announcements</h2>
            </div>
            <p className="text-muted-foreground text-lg">
              Stay updated with the latest news, partnerships, and platform updates.
            </p>
          </motion.div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevSlide} className="bg-transparent">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextSlide} className="bg-transparent">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Link href="/announcements">
              <Button variant="outline" className="gap-2 bg-transparent ml-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Announcements Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {getVisibleAnnouncements().map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={announcement.link}>
                  <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${announcement.color}`}>
                          <announcement.icon className="h-5 w-5" />
                        </div>
                        {announcement.isNew && <Badge className="bg-red-500 text-white">New</Badge>}
                      </div>

                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {announcement.title}
                      </h3>

                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{announcement.description}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {new Date(announcement.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {announcements.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "w-6 bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
