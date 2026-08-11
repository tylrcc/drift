import { PRODUCTS } from "@/lib/products/catalog";
import { formatPct } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
  title: "Performance | Drift",
  description: "Research metrics for Drift algorithms on the sample generator.",
};

export default function PerformancePage() {
  return (
    <div className="container-page py-16">
      <p className="mb-3 text-sm font-medium text-[#0071e3]">Performance</p>
      <h1 className="display text-5xl">Research metrics</h1>
      <p className="mt-4 max-w-2xl text-[#6e6e73]">
        Numbers below come from `algorithms/run_backtests.py` on Drift&apos;s structured sample
        generator. Reproduce them locally after purchase. They are not live brokerage results.
      </p>
      <div className="mt-10 overflow-x-auto panel">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-black/5 text-xs uppercase tracking-wide text-[#6e6e73]">
            <tr>
              <th className="px-4 py-3 font-medium">Algo</th>
              <th className="px-4 py-3 font-medium">Win rate</th>
              <th className="px-4 py-3 font-medium">PF</th>
              <th className="px-4 py-3 font-medium">Sharpe</th>
              <th className="px-4 py-3 font-medium">Max DD</th>
              <th className="px-4 py-3 font-medium">Trades</th>
            </tr>
          </thead>
          <tbody>
            {PRODUCTS.map((p) => (
              <tr key={p.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-4 font-medium">
                  <Link href={`/products/${p.slug}`} className="hover:text-[#0071e3]">
                    {p.name}
                  </Link>
                </td>
                <td className="px-4 py-4 tabular-nums">{formatPct(p.metrics.winRate)}</td>
                <td className="px-4 py-4 tabular-nums">{p.metrics.profitFactor.toFixed(2)}</td>
                <td className="px-4 py-4 tabular-nums">{p.metrics.sharpe.toFixed(2)}</td>
                <td className="px-4 py-4 tabular-nums">{formatPct(p.metrics.maxDrawdownPct)}</td>
                <td className="px-4 py-4 tabular-nums">{p.metrics.trades}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
