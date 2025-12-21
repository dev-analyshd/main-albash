"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { FadeInUp } from "@/components/ui/motion-wrapper"

const testimonials = [
  {
    name: "Fatima Abubakar",
    role: "Leather Artisan, Kano",
    avatar: "/nigerian-woman-professional-headshot.jpg",
    content:
      "AlbashSolutions helped me showcase my handcrafted leather bags to customers across Nigeria and beyond. The verification badge gives buyers confidence in my work!",
    rating: 5,
  },
  {
    name: "Dr. Ibrahim Suleiman",
    role: "Polytechnic Lecturer, Kaduna",
    avatar: "/nigerian-man-tech-professional.jpg",
    content:
      "We've partnered with AlbashSolutions to showcase our students' projects. The tokenization feature helps them protect their intellectual property.",
    rating: 5,
  },
  {
    name: "Hauwa Mohammed",
    role: "Shea Butter Producer, Sokoto",
    avatar: "/african-woman-entrepreneur.jpg",
    content:
      "From a small village producer to selling organic shea butter nationwide - AlbashSolutions marketplace made this possible for me and my community.",
    rating: 5,
  },
  {
    name: "Musa Yakubu",
    role: "Traditional Embroiderer, Zaria",
    avatar: "/african-artisan-craftsman.jpg",
    content:
      "My embroidered caps and Agbadas now reach customers in Lagos, Abuja, and even diaspora. The platform truly understands our craft.",
    rating: 5,
  },
  {
    name: "Amina Bello",
    role: "Digital Designer, Jos",
    avatar: "/young-african-professional-woman.jpg",
    content:
      "As a freelance designer, getting verified on AlbashSolutions opened doors to institutional clients. My logo designs are now NFT-protected!",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <FadeInUp className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">What Our Community Says</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Join thousands of creators across Northern Nigeria who have transformed their ideas into reality.
          </p>
        </FadeInUp>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="bg-card rounded-xl p-6 border border-border relative"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />

              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-chart-4 text-chart-4" />
                ))}
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">{testimonial.content}</p>

              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional testimonials in smaller cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {testimonials.slice(3).map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index + 3) * 0.1 }}
              className="bg-card rounded-xl p-5 border border-border flex items-start gap-4"
            >
              <img
                src={testimonial.avatar || "/placeholder.svg"}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-semibold">{testimonial.name}</p>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-chart-4 text-chart-4" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{testimonial.content}</p>
                <p className="text-xs text-muted-foreground/70 mt-2">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
