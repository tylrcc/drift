"use client";

import { motion, useReducedMotion } from "framer-motion";

const stats = [
  { label: "Original systems", value: "4" },
  { label: "Source included", value: "100%" },
  { label: "License delivery", value: "Instant" },
  { label: "Black boxes", value: "0" },
];

export function TrustStrip() {
  const reduce = useReducedMotion();
  return (
    <section className="container-page py-16">
      <div className="panel grid grid-cols-2 gap-6 p-8 md:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.05 }}
            className="text-center"
          >
            <p className="display text-3xl md:text-4xl">{s.value}</p>
            <p className="mt-2 text-sm text-[#6e6e73]">{s.label}</p>
          </motion.div>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-[#6e6e73]">
        Research metrics use Drift&apos;s sample generator and are not live brokerage results.
        Futures and leveraged products involve substantial risk of loss.
      </p>
    </section>
  );
}
