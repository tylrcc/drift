"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { PRODUCTS, type EquityPoint, type Product } from "@/lib/products/catalog";
import { formatPct } from "@/lib/utils";
import { cn } from "@/lib/utils";

const W = 1000;
const H = 360;
const PAD_TOP = 36;
const PAD_BOTTOM = 44;

type HoverState = EquityPoint & { x: number; y: number; index: number };

export function HeroPerformanceChart() {
  const reduce = useReducedMotion();
  const [activeSlug, setActiveSlug] = useState(PRODUCTS[3].slug);
  const product = PRODUCTS.find((p) => p.slug === activeSlug) || PRODUCTS[3];
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<HoverState | null>(null);

  const geometry = useMemo(() => buildGeometry(product.equityCurve), [product]);

  const onMove = useCallback(
    (clientX: number, clientY: number) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * W;
      const idx = Math.round((x / W) * (geometry.points.length - 1));
      const clamped = Math.max(0, Math.min(geometry.points.length - 1, idx));
      const p = geometry.points[clamped];
      setHover({ ...p.data, x: p.x, y: p.y, index: clamped });
    },
    [geometry.points],
  );

  const clear = () => setHover(null);

  const returnPct = hover?.returnPct ?? product.metrics.totalReturnPct;
  const drawdownPct = hover?.drawdownPct ?? product.metrics.maxDrawdownPct;
  const whisper = hover
    ? `${hover.date} · illustrative research equity`
    : "On a $10,000 account at 1% risk per trade";

  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, delay: 0.15 }}
      className="panel relative overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,113,227,0.12),_transparent_55%)]" />
      <div className="relative z-10 flex flex-col gap-6 p-5 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#6e6e73]">
              Live research curve
            </p>
            <div className="mt-3 flex flex-wrap items-end gap-8">
              <div>
                <p className="text-xs text-[#6e6e73]">Total return</p>
                <p
                  className={cn(
                    "display text-5xl tabular-nums md:text-6xl",
                    returnPct >= 0 ? "text-[#1f7a4d]" : "text-[#b42318]",
                  )}
                >
                  {returnPct >= 0 ? "+" : "−"}
                  {Math.abs(Math.round(returnPct))}%
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6e6e73]">Max drawdown</p>
                <p className="display text-4xl tabular-nums text-[#1d1d1f] md:text-5xl">
                  −{drawdownPct.toFixed(1)}%
                </p>
              </div>
            </div>
            <p
              className={cn(
                "mt-4 text-sm transition-colors",
                hover ? "text-[#0071e3]" : "text-[#6e6e73]",
              )}
            >
              {whisper}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRODUCTS.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => {
                  setActiveSlug(p.slug);
                  setHover(null);
                }}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition",
                  activeSlug === p.slug
                    ? "border-[#1d1d1f] bg-[#1d1d1f] text-white"
                    : "border-black/10 bg-white/70 text-[#6e6e73] hover:text-[#1d1d1f]",
                )}
              >
                <Image
                  src={p.avatar}
                  alt=""
                  width={22}
                  height={22}
                  className="rounded-full"
                />
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className="h-56 w-full cursor-crosshair touch-none md:h-72"
            role="img"
            aria-label={`${product.name} research equity curve`}
            onPointerMove={(e) => onMove(e.clientX, e.clientY)}
            onPointerLeave={clear}
            onPointerDown={(e) => onMove(e.clientX, e.clientY)}
          >
            <defs>
              <linearGradient id="driftFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(0,113,227,0.35)" />
                <stop offset="100%" stopColor="rgba(0,113,227,0)" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* grid */}
            {[0.25, 0.5, 0.75].map((t) => (
              <line
                key={t}
                x1={0}
                x2={W}
                y1={PAD_TOP + (H - PAD_TOP - PAD_BOTTOM) * t}
                y2={PAD_TOP + (H - PAD_TOP - PAD_BOTTOM) * t}
                stroke="rgba(29,29,31,0.06)"
              />
            ))}

            <motion.path
              key={`${product.slug}-fill`}
              d={geometry.area}
              fill="url(#driftFill)"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            />
            <motion.path
              key={`${product.slug}-line`}
              d={geometry.line}
              fill="none"
              stroke="#0071e3"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.35, ease: "easeInOut" }}
            />

            {hover ? (
              <>
                <line
                  x1={hover.x}
                  x2={hover.x}
                  y1={PAD_TOP}
                  y2={H - PAD_BOTTOM}
                  stroke="rgba(0,113,227,0.35)"
                  strokeDasharray="4 6"
                />
                <circle cx={hover.x} cy={hover.y} r="7" fill="#0071e3" />
                <circle cx={hover.x} cy={hover.y} r="12" fill="rgba(0,113,227,0.18)" />
              </>
            ) : null}
          </svg>

          {hover ? (
            <div
              className="pointer-events-none absolute top-3 z-20 -translate-x-1/2 rounded-full bg-[#1d1d1f] px-3 py-1.5 text-xs font-medium text-white shadow-lg"
              style={{
                left: `${(hover.x / W) * 100}%`,
              }}
            >
              {hover.date}{" "}
              <span className={hover.returnPct >= 0 ? "text-[#8fefb3]" : "text-[#ffb4a9]"}>
                {hover.returnPct >= 0 ? "+" : ""}
                {hover.returnPct.toFixed(0)}%
              </span>
            </div>
          ) : null}
        </div>

        <AlgoMetricStrip product={product} />
      </div>
    </motion.section>
  );
}

function AlgoMetricStrip({ product }: { product: Product }) {
  return (
    <div className="grid grid-cols-2 gap-3 border-t border-black/5 pt-5 md:grid-cols-5">
      <StripStat label="Win rate" value={formatPct(product.metrics.winRate)} />
      <StripStat label="Profit factor" value={product.metrics.profitFactor.toFixed(2)} />
      <StripStat label="Sharpe" value={product.metrics.sharpe.toFixed(2)} />
      <StripStat label="Trades / wk" value={product.metrics.avgTradesPerWeek.toFixed(1)} />
      <StripStat label="R:R" value={product.metrics.rewardToRisk} />
    </div>
  );
}

function StripStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-[#6e6e73]">{label}</p>
      <p className="mt-1 text-sm font-medium tabular-nums">{value}</p>
    </div>
  );
}

function buildGeometry(curve: EquityPoint[]) {
  const equities = curve.map((c) => c.equity);
  const min = Math.min(...equities, 0);
  const max = Math.max(...equities);
  const span = max - min || 1;
  const points = curve.map((data, i) => {
    const x = (i / Math.max(1, curve.length - 1)) * W;
    const y = PAD_TOP + (1 - (data.equity - min) / span) * (H - PAD_TOP - PAD_BOTTOM);
    return { x, y, data };
  });
  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(" ");
  const area = `${line} L${W},${H - PAD_BOTTOM} L0,${H - PAD_BOTTOM} Z`;
  return { points, line, area };
}
