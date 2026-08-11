"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroPerformanceChart } from "@/components/motion/HeroPerformanceChart";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden pb-10 pt-14 md:pt-20">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#0071e3]/15 blur-3xl"
        animate={reduce ? undefined : { x: [0, 24, 0], y: [0, 12, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-40 h-80 w-80 rounded-full bg-[#f0ebe3]/80 blur-3xl"
        animate={reduce ? undefined : { x: [0, -18, 0], y: [0, -14, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container-page relative z-10">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-5 text-sm font-medium tracking-wide text-[#0071e3]"
        >
          Algorithmic trading, quietly done
        </motion.p>
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="display max-w-3xl text-5xl leading-[1.05] text-[#1d1d1f] md:text-7xl"
        >
          Drift
        </motion.h1>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="mt-5 max-w-xl text-lg leading-relaxed text-[#6e6e73] md:text-xl"
        >
          Original trading algorithms with full source, research curves you can scrub, and
          instant license delivery. Hover the blue equity path to read return and drawdown at
          every point.
        </motion.p>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <Link href="/products" className="btn btn-primary">
            See algorithms <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/#how-it-works" className="btn btn-secondary">
            How it works
          </Link>
        </motion.div>
      </div>
      <div className="container-page mt-12">
        <HeroPerformanceChart />
      </div>
    </section>
  );
}
