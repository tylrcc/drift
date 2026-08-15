"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { Product } from "@/lib/products/catalog";
import { formatPct, formatUsd, cn } from "@/lib/utils";

const accents: Record<Product["accent"], string> = {
  blue: "from-[#e8f1fc] to-white",
  mist: "from-[#e8eef5] to-white",
  sand: "from-[#f0ebe3] to-white",
  ink: "from-[#ececef] to-white",
};

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const reduce = useReducedMotion();
  const spark = product.equityCurve.filter((_, i) => i % 4 === 0);
  const vals = spark.map((p) => p.equity);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = max - min || 1;
  const w = 220;
  const h = 56;
  const path = spark
    .map((p, i) => {
      const x = (i / Math.max(1, spark.length - 1)) * w;
      const y = h - ((p.equity - min) / span) * (h - 8) - 4;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay: index * 0.06 }}
      whileHover={reduce ? undefined : { y: -6 }}
      className="panel group overflow-hidden"
    >
      <div className={cn("relative h-36 bg-gradient-to-br", accents[product.accent])}>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          whileHover={reduce ? undefined : { scale: 1.04 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
        >
          <Image
            src={product.avatar}
            alt={`${product.name} portrait`}
            width={96}
            height={96}
            className="rounded-full shadow-[0_12px_30px_rgba(29,29,31,0.16)] ring-4 ring-white/70"
          />
        </motion.div>
      </div>
      <div className="p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-xl font-medium tracking-tight">{product.name}</h3>
          {product.badge ? (
            <span className="rounded-full bg-black/[0.04] px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-[#6e6e73]">
              {product.badge}
            </span>
          ) : null}
        </div>
        <p className="min-h-[3rem] text-sm leading-relaxed text-[#6e6e73]">{product.tagline}</p>

        <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 h-14 w-full" aria-hidden>
          <path d={path} fill="none" stroke="#0071e3" strokeWidth="2" strokeLinecap="round" />
        </svg>

        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-black/5 pt-5 text-center">
          <Metric label="Win rate" value={formatPct(product.metrics.winRate)} />
          <Metric label="Profit factor" value={product.metrics.profitFactor.toFixed(2)} />
          <Metric label="Max DD" value={formatPct(product.metrics.maxDrawdownPct)} />
        </div>
        <div className="mt-6 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-[#6e6e73]">From</p>
            <p className="text-lg font-medium">
              {formatUsd(product.monthlyPriceCents)}
              <span className="text-sm font-normal text-[#6e6e73]"> /mo</span>
            </p>
          </div>
          <Link href={`/products/${product.slug}`} className="btn btn-primary px-4 py-2 text-sm">
            View
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-[#6e6e73]">{label}</p>
      <p className="mt-1 text-sm font-medium tabular-nums">{value}</p>
    </div>
  );
}
