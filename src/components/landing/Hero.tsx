"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EquityRibbon } from "@/components/motion/EquityRibbon";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden pb-10 pt-16 md:pt-24">
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
          Original trading algorithms with full source, research backtests, and instant
          license delivery. Light enough to live with. Serious enough to sell.
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
      <div className="container-page mt-14">
        <EquityRibbon />
      </div>
    </section>
  );
}
