"use client"

import { motion } from "framer-motion"
import {
  Lightbulb,
  Hammer,
  Building2,
  Coins,
  Shield,
  Users,
  Store,
  GraduationCap,
  Briefcase,
  Sparkles,
  ArrowRight,
} from "lucide-react"

// Animated illustration showing the transformation journey
export function HeroIllustration() {
  return (
    <div className="relative w-full max-w-4xl mx-auto h-[400px] sm:h-[500px]">
      {/* Central Hub */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
      >
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-2xl shadow-primary/30">
          <Sparkles className="h-10 w-10 sm:h-14 sm:w-14 text-primary-foreground" />
        </div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="absolute inset-0 rounded-full border-2 border-primary/30"
        />
        <motion.div
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.3 }}
          className="absolute inset-0 rounded-full border border-primary/20"
        />
      </motion.div>

      {/* Journey Path - Traditional to Digital */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500">
        <motion.path
          d="M 100 250 Q 200 150 400 250 Q 600 350 700 250"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="3"
          strokeDasharray="10 5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--muted-foreground))" />
            <stop offset="50%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--chart-2))" />
          </linearGradient>
        </defs>
      </svg>

      {/* Stage 1: Traditional Idea */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
            <Lightbulb className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground" />
          </div>
          <span className="text-xs font-medium text-muted-foreground">Idea</span>
        </div>
      </motion.div>

      {/* Stage 2: Builder */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute left-[20%] top-[15%] sm:top-[20%]"
      >
        <div className="flex flex-col items-center gap-2">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-chart-1/20 flex items-center justify-center border border-chart-1/40"
          >
            <Hammer className="h-6 w-6 sm:h-7 sm:w-7 text-chart-1" />
          </motion.div>
          <span className="text-xs font-medium">Builder</span>
        </div>
      </motion.div>

      {/* Stage 3: Verification */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1 }}
        className="absolute left-[35%] top-[60%] sm:top-[65%]"
      >
        <div className="flex flex-col items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-chart-2/20 flex items-center justify-center border border-chart-2/40"
          >
            <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-chart-2" />
          </motion.div>
          <span className="text-xs font-medium">Verified</span>
        </div>
      </motion.div>

      {/* Stage 4: Marketplace */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="absolute right-[35%] top-[15%] sm:top-[20%]"
      >
        <div className="flex flex-col items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-chart-3/20 flex items-center justify-center border border-chart-3/40"
          >
            <Store className="h-6 w-6 sm:h-7 sm:w-7 text-chart-3" />
          </motion.div>
          <span className="text-xs font-medium">Marketplace</span>
        </div>
      </motion.div>

      {/* Stage 5: Tokenized Success */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.7 }}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <motion.div
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(var(--chart-4), 0)",
                "0 0 20px 10px rgba(var(--chart-4), 0.2)",
                "0 0 0 0 rgba(var(--chart-4), 0)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-chart-4 to-chart-5 flex items-center justify-center"
          >
            <Coins className="h-7 w-7 sm:h-8 sm:w-8 text-background" />
          </motion.div>
          <span className="text-xs font-medium text-chart-4">Tokenized</span>
        </div>
      </motion.div>

      {/* Floating Elements - User Types */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute top-4 left-[45%]"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
          className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"
        >
          <GraduationCap className="h-5 w-5 text-primary" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-8 left-[25%]"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
          className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center"
        >
          <Briefcase className="h-5 w-5 text-accent" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4 }}
        className="absolute bottom-12 right-[25%]"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
          className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center"
        >
          <Building2 className="h-5 w-5 text-chart-2" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6 }}
        className="absolute top-12 right-[20%]"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1.5 }}
          className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center"
        >
          <Users className="h-5 w-5 text-chart-3" />
        </motion.div>
      </motion.div>

      {/* Journey Label */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.8 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center"
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Traditional</span>
          <ArrowRight className="h-4 w-4" />
          <span className="text-primary font-medium">Digital Future</span>
        </div>
      </motion.div>
    </div>
  )
}
