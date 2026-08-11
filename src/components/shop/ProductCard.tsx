"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Product } from "@/lib/products/catalog";
import { formatPct, formatUsd } from "@/lib/utils";
import { cn } from "@/lib/utils";

const accents: Record<Product["accent"], string> = {
  blue: "from-[#e8f1fc] to-white",
  mist: "from-[#e8eef5] to-white",
  sand: "from-[#f0ebe3] to-white",
  ink: "from-[#ececef] to-white",
};

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay: index * 0.06 }}
      whileHover={reduce ? undefined : { y: -4 }}
      className="panel group overflow-hidden"
    >
      <div className={cn("h-28 bg-gradient-to-br", accents[product.accent])} />
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
        <div className="mt-5 grid grid-cols-3 gap-3 border-t border-black/5 pt-5 text-center">
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
