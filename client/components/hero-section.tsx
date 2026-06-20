"use client";

import { motion, type Variants } from "framer-motion";
import { ChevronRight } from "lucide-react";
import DigitalLoomBackground from "@/components/ui/digital-loom-background";
import { TradeCard } from "@/components/trade-card";
import type { Trade } from "@/lib/api";

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.8,
      ease: "easeInOut",
    },
  }),
};

type HeroSectionProps = {
  featuredTrade: Trade;
};

export function HeroSection({ featuredTrade }: HeroSectionProps) {
  return (
    <DigitalLoomBackground
      backgroundColor="#000000"
      threadColor="rgba(100, 100, 255, 0.5)"
      threadCount={80}
      contentClassName="items-center px-6 pt-28 pb-16 md:pt-36 md:pb-24"
    >
      <div className="mx-auto w-full max-w-4xl text-center">
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={0}
          className="mb-6 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm text-white/80 backdrop-blur-md"
        >
          Now tracking congressional &amp; SEC filings
        </motion.div>

        <motion.h1
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-4xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl md:leading-[1.05]"
        >
          They trade on what they know.
          <br />
          <span className="text-gradient">Now you can see it.</span>
        </motion.h1>

        <motion.p
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={2}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg"
        >
          Lantern tracks stock trades from politicians, executives, and fund
          managers — and uses AI to tell you what it actually means.
        </motion.p>

        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={3}
          className="mt-10 flex items-center justify-center"
        >
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-black shadow-lg shadow-white/20 transition-transform hover:scale-105 md:text-base"
          >
            See How It Works
            <ChevronRight className="h-4 w-4" />
          </a>
        </motion.div>
      </div>

      <motion.div
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        custom={4}
        className="relative mx-auto mt-16 w-full max-w-3xl"
      >
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/60 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] ring-1 ring-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            </div>
            <div className="mx-auto flex h-6 w-48 items-center justify-center rounded-md bg-white/[0.04] text-[10px] text-white/30">
              app.lantern.finance/feed
            </div>
          </div>
          <div className="p-4 md:p-6">
            <TradeCard trade={featuredTrade} featured />
          </div>
        </div>

        <div className="absolute -left-4 top-1/4 hidden rounded-xl border border-white/10 bg-black/80 px-4 py-3 shadow-xl backdrop-blur-md md:block lg:-left-16">
          <p className="font-mono text-2xl font-bold text-gold-400">9.2</p>
          <p className="text-[10px] uppercase tracking-wider text-white/40">
            Avg signal score
          </p>
        </div>
        <div className="absolute -right-4 bottom-1/4 hidden rounded-xl border border-blue-500/20 bg-black/80 px-4 py-3 shadow-xl backdrop-blur-md md:block lg:-right-12">
          <p className="text-xs font-medium text-blue-400">● Live</p>
          <p className="mt-0.5 text-[10px] text-white/40">12 trades today</p>
        </div>
      </motion.div>
    </DigitalLoomBackground>
  );
}
