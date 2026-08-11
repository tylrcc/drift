export type BillingInterval = "monthly" | "lifetime";

export type ProductSpec = { label: string; value: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  badge: string | null;
  tagline: string;
  description: string;
  longDescription: string;
  features: string[];
  specs: ProductSpec[];
  included: string[];
  monthlyPriceCents: number;
  lifetimePriceCents: number;
  featured: boolean;
  featuredOrder: number;
  accent: "blue" | "ink" | "mist" | "sand";
  /** Research backtest metrics from algorithms/run_backtests.py (sample data). */
  metrics: {
    winRate: number;
    profitFactor: number;
    sharpe: number;
    maxDrawdownPct: number;
    trades: number;
    avgTradesPerWeek: number;
    rewardToRisk: string;
    periodLabel: string;
  };
  /** Path under /algorithms shipped after purchase */
  packageDir: string;
};

/**
 * Drift catalog. Original strategies (not third-party ports).
 * Metrics come from the included research backtester on synthetic session data.
 * Past research results are not live trading performance.
 */
export const PRODUCTS: Product[] = [
  {
    id: "dawn-orb",
    slug: "dawn-orb",
    name: "Dawn ORB",
    badge: "Session",
    tagline: "Opening range breakout for the London and New York opens.",
    description:
      "Captures the first impulse of the session with a clean opening range, volatility filter, and fixed risk. Built for traders who want one clear window, not all day noise.",
    longDescription: `Dawn ORB is Drift's session algorithm. It builds a short opening range at the London open and again at the New York open, then trades the break only when range width sits inside a volatility band.

Entries are stop based. Stops sit beyond the opposite side of the range. Targets scale with the opening range itself so reward stays proportional to the day's early structure.

The research package includes the full Python strategy, a bar replay engine, parameter notes, and a starter CSV so you can reproduce the metrics on this page. Wire it to your own broker adapter when you are ready to go live.

This is software for research and automation. Futures and leveraged products involve substantial risk of loss.`,
    features: [
      "Dual session windows: London and New York",
      "Volatility band filter on opening range width",
      "Stop entries with range based targets",
      "Flat outside the session windows",
      "Full Python source + research backtester",
      "License key unlocks the download vault",
    ],
    specs: [
      { label: "Style", value: "Opening range breakout" },
      { label: "Sessions", value: "London + New York" },
      { label: "Delivery", value: "Python package" },
      { label: "Risk model", value: "Fixed fractional" },
      { label: "Correlation", value: "Session volatility, not trend bias" },
    ],
    included: [
      "dawn_orb.py strategy",
      "Research backtester",
      "Sample OHLCV session data",
      "Parameter sheet",
      "License key",
    ],
    monthlyPriceCents: 7900,
    lifetimePriceCents: 34900,
    featured: true,
    featuredOrder: 1,
    accent: "blue",
    metrics: {
      winRate: 48.1,
      profitFactor: 1.48,
      sharpe: 3.03,
      maxDrawdownPct: 6.8,
      trades: 77,
      avgTradesPerWeek: 2.4,
      rewardToRisk: "1.6 : 1",
      periodLabel: "Drift sample generator, seed 112",
    },
    packageDir: "dawn_orb",
  },
  {
    id: "steady",
    slug: "steady",
    name: "Steady",
    badge: "Core",
    tagline: "Conservative mean reversion for liquid equity indexes.",
    description:
      "Fades stretched moves back toward a slow mean with tight risk and a hard daily loss stop. The calm entry point into algorithmic trading.",
    longDescription: `Steady is Drift's core mean reversion package. It watches a short z-score versus a slow moving average on liquid index ETFs and futures proxies, then fades extremes only when volume confirms the stretch.

Position size is capped. A daily loss circuit breaker shuts the strategy off for the session after a fixed draw. No overnight holds by default.

You get the full Python module, unit tests for the signal math, and the research runner used to produce the metrics below.`,
    features: [
      "Z-score mean reversion with volume confirm",
      "Daily loss circuit breaker",
      "No overnight by default",
      "Smallest learning curve in the catalog",
      "Full source + tests",
      "License key unlocks the download vault",
    ],
    specs: [
      { label: "Style", value: "Mean reversion" },
      { label: "Universe", value: "Index ETFs / proxies" },
      { label: "Delivery", value: "Python package" },
      { label: "Hold", value: "Intraday" },
      { label: "Risk model", value: "Fixed risk + daily kill" },
    ],
    included: [
      "steady.py strategy",
      "Signal unit tests",
      "Research backtester",
      "Sample bars",
      "License key",
    ],
    monthlyPriceCents: 4900,
    lifetimePriceCents: 19900,
    featured: true,
    featuredOrder: 2,
    accent: "mist",
    metrics: {
      winRate: 50.5,
      profitFactor: 1.17,
      sharpe: 1.25,
      maxDrawdownPct: 15.4,
      trades: 543,
      avgTradesPerWeek: 16.6,
      rewardToRisk: "1.15 : 1",
      periodLabel: "Drift sample generator, seed 16",
    },
    packageDir: "steady",
  },
  {
    id: "lift",
    slug: "lift",
    name: "Lift",
    badge: "Swing",
    tagline: "Trend continuation with asymmetric targets and fewer trades.",
    description:
      "Rides pullbacks inside an established trend. Fewer signals, larger average winners, and less screen time than the scalpers.",
    longDescription: `Lift is the swing package. A slow trend filter defines direction. Entries wait for a pullback into a moving average band, then place a stop entry in the trend direction.

Stops are ATR based. Targets run 2.5R to 3R. The research default holds overnight when the trend filter stays intact.

Ideal if you want automation without a high trade count.`,
    features: [
      "Trend filter + pullback entries",
      "ATR stops, 2.5R to 3R targets",
      "Optional overnight holds",
      "Lower trade frequency",
      "Full Python source + research runner",
      "License key unlocks the download vault",
    ],
    specs: [
      { label: "Style", value: "Trend continuation" },
      { label: "Timeframe", value: "1 hour research default" },
      { label: "Delivery", value: "Python package" },
      { label: "Reward to risk", value: "2.5 to 3 : 1" },
      { label: "Hold", value: "Hours to days" },
    ],
    included: [
      "lift.py strategy",
      "Research backtester",
      "Sample hourly bars",
      "Parameter sheet",
      "License key",
    ],
    monthlyPriceCents: 12900,
    lifetimePriceCents: 59900,
    featured: true,
    featuredOrder: 3,
    accent: "sand",
    metrics: {
      winRate: 36.8,
      profitFactor: 1.63,
      sharpe: 3.44,
      maxDrawdownPct: 9.1,
      trades: 144,
      avgTradesPerWeek: 4.4,
      rewardToRisk: "2.8 : 1",
      periodLabel: "Drift sample generator, seed 39",
    },
    packageDir: "lift",
  },
  {
    id: "apex",
    slug: "apex",
    name: "Apex",
    badge: "Flagship",
    tagline: "Multi factor flagship. Regime filter, breakout, and risk overlay.",
    description:
      "The full Drift stack in one package: regime detection, breakout entries, and a portfolio level risk overlay. Built for operators who want one primary system.",
    longDescription: `Apex is the flagship. It combines a volatility regime filter, a breakout engine, and a risk overlay that cuts size when equity drawdown expands.

In calm regimes it allows trend breakouts. In stressed regimes it reduces size or stands aside. The research package exposes every module so you can audit the logic before you risk capital.

If you only buy one Drift algorithm, start here.`,
    features: [
      "Volatility regime filter",
      "Breakout engine with structure stops",
      "Drawdown aware position sizing",
      "Modular Python package",
      "Research backtester + equity curve export",
      "License key unlocks the download vault",
    ],
    specs: [
      { label: "Style", value: "Multi factor flagship" },
      { label: "Timeframe", value: "1 hour research default" },
      { label: "Delivery", value: "Python package" },
      { label: "Risk overlay", value: "Drawdown aware" },
      { label: "Modules", value: "Regime + breakout + risk" },
    ],
    included: [
      "apex/ package (regime, breakout, risk)",
      "Research backtester",
      "Sample bars",
      "Operator notes",
      "License key",
    ],
    monthlyPriceCents: 19900,
    lifetimePriceCents: 89900,
    featured: true,
    featuredOrder: 4,
    accent: "ink",
    metrics: {
      winRate: 39.9,
      profitFactor: 1.46,
      sharpe: 2.8,
      maxDrawdownPct: 12.1,
      trades: 228,
      avgTradesPerWeek: 7.0,
      rewardToRisk: "2.2 : 1",
      periodLabel: "Drift sample generator, seed 8",
    },
    packageDir: "apex",
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function featuredProducts() {
  return PRODUCTS.filter((p) => p.featured).sort(
    (a, b) => a.featuredOrder - b.featuredOrder,
  );
}

export function priceFor(product: Product, interval: BillingInterval) {
  return interval === "monthly"
    ? product.monthlyPriceCents
    : product.lifetimePriceCents;
}
