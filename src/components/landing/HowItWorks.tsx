"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Download, KeyRound, Sparkles } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    icon: Sparkles,
    title: "Pick an algo",
    body: "Browse backtested research packages. Choose by style, trade frequency, and risk appetite.",
    details: ["Four original systems", "Full metric transparency", "Source included"],
  },
  {
    icon: KeyRound,
    title: "Checkout and unlock",
    body: "Pay once for lifetime, or monthly. Your license key lands in the vault immediately.",
    details: ["Instant license key", "Email receipt", "Stripe ready when you connect keys"],
  },
  {
    icon: Download,
    title: "Download and run",
    body: "Pull the Python package, reproduce the research, then wire your own broker adapter.",
    details: ["Full source zip", "Research runner included", "No black box binaries"],
  },
];

export function HowItWorks() {
  const reduce = useReducedMotion();
  return (
    <section id="how-it-works" className="container-page py-24">
      <p className="mb-3 text-sm font-medium text-[#0071e3]">How it works</p>
      <h2 className="display max-w-2xl text-4xl md:text-5xl">Three steps. That is it.</h2>
      <p className="mt-4 max-w-xl text-[#6e6e73]">
        No coding required to buy. The code is there when you want to understand every line.
      </p>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="panel p-6"
          >
            <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e8f1fc] text-[#0071e3]">
              <step.icon className="h-5 w-5" />
            </div>
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.14em] text-[#6e6e73]">
              Step {i + 1}
            </p>
            <h3 className="text-xl font-medium tracking-tight">{step.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-[#6e6e73]">{step.body}</p>
            <ul className="mt-5 space-y-2 text-sm text-[#1d1d1f]">
              {step.details.map((d) => (
                <li key={d} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 rounded-full bg-[#0071e3]" />
                  {d}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
      <div className="mt-10">
        <Link href="/products" className="btn btn-blue">
          See our algorithms
        </Link>
      </div>
    </section>
  );
}
