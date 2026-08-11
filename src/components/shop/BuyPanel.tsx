"use client";

import { useMemo, useState } from "react";
import type { BillingInterval, Product } from "@/lib/products/catalog";
import { priceFor } from "@/lib/products/catalog";
import { formatUsd } from "@/lib/utils";

export function BuyPanel({ product }: { product: Product }) {
  const [interval, setInterval] = useState<BillingInterval>("lifetime");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const price = useMemo(() => priceFor(product, interval), [product, interval]);

  async function buy() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug: product.slug,
          interval,
          email,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      window.location.href = `/checkout/success?license=${encodeURIComponent(data.licenseKey)}&product=${product.slug}`;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className="panel sticky top-24 h-fit p-6">
      <p className="text-sm text-[#6e6e73]">Ready to buy</p>
      <p className="display mt-2 text-4xl">{formatUsd(price)}</p>
      <div className="mt-4 grid grid-cols-2 gap-2 rounded-full bg-black/[0.04] p-1">
        {(["monthly", "lifetime"] as const).map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => setInterval(opt)}
            className={`rounded-full px-3 py-2 text-sm capitalize transition ${
              interval === opt ? "bg-white shadow-sm" : "text-[#6e6e73]"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      <label className="mt-5 block text-sm">
        Email for license delivery
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none ring-[#0071e3] focus:ring-2"
        />
      </label>
      {error ? <p className="mt-3 text-sm text-[#b42318]">{error}</p> : null}
      <button
        type="button"
        disabled={loading || !email.includes("@")}
        onClick={buy}
        className="btn btn-primary mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Starting checkout…" : "Buy now"}
      </button>
      <p className="mt-4 text-xs leading-relaxed text-[#6e6e73]">
        Instant license key and download access after payment. Trading involves substantial risk
        of loss. Research metrics are not live results.
      </p>
    </aside>
  );
}
