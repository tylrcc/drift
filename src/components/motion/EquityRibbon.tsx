"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Soft equity-curve visual for the hero. Decorative, not live P&L. */
export function EquityRibbon() {
  const reduce = useReducedMotion();
  const points = [
    40, 42, 41, 45, 48, 47, 52, 56, 55, 60, 64, 63, 68, 72, 70, 78, 82, 86, 84, 92,
  ];
  const w = 1000;
  const h = 280;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((p - min) / (max - min)) * (h * 0.7) - h * 0.15;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8 }}
      className="panel relative overflow-hidden p-4 md:p-6"
    >
      <div className="mb-3 flex items-center justify-between text-xs text-[#6e6e73]">
        <span>Research equity ribbon</span>
        <span>Illustrative</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-48 w-full md:h-64" role="img" aria-label="Equity curve">
        <defs>
          <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,113,227,0.28)" />
            <stop offset="100%" stopColor="rgba(0,113,227,0)" />
          </linearGradient>
        </defs>
        <motion.path
          d={`${path} L${w},${h} L0,${h} Z`}
          fill="url(#fill)"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.1 }}
        />
        <motion.path
          d={path}
          fill="none"
          stroke="#0071e3"
          strokeWidth="3.5"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        />
      </svg>
    </motion.div>
  );
}
