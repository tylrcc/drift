"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { PRODUCTS, type EquityPoint, type Product } from "@/lib/products/catalog";
import { formatPct, formatUsd, cn } from "@/lib/utils";

const W = 1000;
const H = 380;
const PAD_TOP = 28;
const PAD_BOTTOM = 36;
const PAD_X = 8;

type HoverState = EquityPoint & { x: number; y: number; index: number };

export function HeroPerformanceChart() {
  const reduce = useReducedMotion();
  const [activeSlug, setActiveSlug] = useState(PRODUCTS[3].slug);
  const product = PRODUCTS.find((p) => p.slug === activeSlug) || PRODUCTS[3];
  const stageRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<HoverState | null>(null);
  const rafRef = useRef<number | null>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);

  const geometry = useMemo(() => buildGeometry(product.equityCurve), [product]);

  const applyPointer = useCallback(() => {
    rafRef.current = null;
    const stage = stageRef.current;
    const pointer = pointerRef.current;
    if (!stage || !pointer || geometry.points.length === 0) return;

    const rect = stage.getBoundingClientRect();
    if (rect.width <= 0) return;
    const ratio = Math.min(1, Math.max(0, (pointer.x - rect.left) / rect.width));
    const idx = Math.round(ratio * (geometry.points.length - 1));
    const p = geometry.points[idx];
    setHover({ ...p.data, x: p.x, y: p.y, index: idx });
  }, [geometry.points]);

  const onPointerMove = useCallback(
    (clientX: number, clientY: number) => {
      pointerRef.current = { x: clientX, y: clientY };
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(applyPointer);
      }
    },
    [applyPointer],
  );

  const clear = useCallback(() => {
    pointerRef.current = null;
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setHover(null);
  }, []);

  useEffect(() => () => clear(), [clear]);

  // Reset hover when switching algos
  useEffect(() => {
    setHover(null);
  }, [activeSlug]);

  const returnPct = hover?.returnPct ?? product.metrics.totalReturnPct;
  const drawdownPct = hover?.drawdownPct ?? product.metrics.maxDrawdownPct;
  const payout = hover?.payout ?? 10_000 + Math.round((product.metrics.totalReturnPct / 100) * 10_000);
  const whisper = hover
    ? `${hover.date} · account mark`
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
              Research equity
            </p>
            <div className="mt-3 flex flex-wrap items-end gap-6 md:gap-10">
              <div>
                <p className="text-xs text-[#6e6e73]">Total return</p>
                <p
                  className={cn(
                    "display text-5xl tabular-nums transition-colors duration-150 md:text-6xl",
                    returnPct >= 0 ? "text-[#1f7a4d]" : "text-[#b42318]",
                  )}
                >
                  {returnPct >= 0 ? "+" : "−"}
                  {Math.abs(Math.round(returnPct))}%
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6e6e73]">Account value</p>
                <p className="display text-4xl tabular-nums text-[#1d1d1f] transition-colors duration-150 md:text-5xl">
                  {formatUsd(payout * 100)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6e6e73]">Drawdown</p>
                <p className="display text-4xl tabular-nums text-[#1d1d1f] transition-colors duration-150 md:text-5xl">
                  −{drawdownPct.toFixed(1)}%
                </p>
              </div>
            </div>
            <p
              className={cn(
                "mt-4 text-sm transition-colors duration-150",
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
                onClick={() => setActiveSlug(p.slug)}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition",
                  activeSlug === p.slug
                    ? "border-[#1d1d1f] bg-[#1d1d1f] text-white"
                    : "border-black/10 bg-white/70 text-[#6e6e73] hover:text-[#1d1d1f]",
                )}
              >
                <Image src={p.avatar} alt="" width={22} height={22} className="rounded-full" />
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={stageRef}
          className="relative select-none touch-none"
          style={{ cursor: "crosshair" }}
          onPointerMove={(e) => {
            // Ignore moves that originate on algo chips above; this stage is chart-only.
            onPointerMove(e.clientX, e.clientY);
          }}
          onPointerEnter={(e) => onPointerMove(e.clientX, e.clientY)}
          onPointerDown={(e) => {
            stageRef.current?.setPointerCapture(e.pointerId);
            onPointerMove(e.clientX, e.clientY);
          }}
          onPointerCancel={() => clear()}
          onPointerLeave={() => clear()}
        >
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="pointer-events-none h-56 w-full md:h-80"
            role="img"
            aria-label={`${product.name} research equity curve`}
          >
            <defs>
              <linearGradient id="driftFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(0,113,227,0.32)" />
                <stop offset="100%" stopColor="rgba(0,113,227,0)" />
              </linearGradient>
            </defs>

            {[0.25, 0.5, 0.75].map((t) => (
              <line
                key={t}
                x1={PAD_X}
                x2={W - PAD_X}
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
              transition={{ duration: 0.7 }}
            />
            <motion.path
              key={`${product.slug}-line`}
              d={geometry.line}
              fill="none"
              stroke="#0071e3"
              strokeWidth="2.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduce ? false : { pathLength: 0, opacity: 0.2 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />

            {hover ? (
              <g>
                <line
                  x1={hover.x}
                  x2={hover.x}
                  y1={PAD_TOP}
                  y2={H - PAD_BOTTOM}
                  stroke="rgba(0,113,227,0.35)"
                  strokeDasharray="4 5"
                />
                <circle cx={hover.x} cy={hover.y} r="11" fill="rgba(0,113,227,0.16)" />
                <circle cx={hover.x} cy={hover.y} r="5.5" fill="#0071e3" />
                <circle cx={hover.x} cy={hover.y} r="2.5" fill="#fff" />
              </g>
            ) : null}
          </svg>

          {/* Invisible hit layer sits above SVG so hover always works */}
          <div className="absolute inset-0 z-10" aria-hidden />

          {hover ? (
            <div
              className="pointer-events-none absolute z-20 -translate-x-1/2 rounded-2xl bg-[#1d1d1f] px-3.5 py-2 text-xs font-medium text-white shadow-[0_12px_30px_rgba(0,0,0,0.25)]"
              style={{
                left: `${(hover.x / W) * 100}%`,
                top: 8,
              }}
            >
              <div className="whitespace-nowrap">
                {hover.date}
                <span className="mx-1.5 text-white/35">·</span>
                <span className={hover.returnPct >= 0 ? "text-[#8fefb3]" : "text-[#ffb4a9]"}>
                  {hover.returnPct >= 0 ? "+" : ""}
                  {hover.returnPct.toFixed(1)}%
                </span>
              </div>
              <div className="mt-0.5 tabular-nums text-white/70">
                {formatUsd(hover.payout * 100)} account · −{hover.drawdownPct.toFixed(1)}% dd
              </div>
            </div>
          ) : (
            <p className="pointer-events-none absolute bottom-2 left-1/2 z-10 -translate-x-1/2 text-[11px] text-[#6e6e73]/70 md:bottom-3">
              Drag or hover across the curve
            </p>
          )}
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
    const x = PAD_X + (i / Math.max(1, curve.length - 1)) * (W - PAD_X * 2);
    const y = PAD_TOP + (1 - (data.equity - min) / span) * (H - PAD_TOP - PAD_BOTTOM);
    return { x, y, data };
  });

  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(" ");
  const area = `${line} L${points[points.length - 1].x},${H - PAD_BOTTOM} L${points[0].x},${H - PAD_BOTTOM} Z`;
  return { points, line, area };
}
