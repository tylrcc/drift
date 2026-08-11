"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { BillingInterval, Product } from "@/lib/products/catalog";
import { priceFor } from "@/lib/products/catalog";
import { formatUsd } from "@/lib/utils";

export function BuyPanel({ product }: { product: Product }) {
  const [interval, setInterval] = useState<BillingInterval>("lifetime");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [riskOk, setRiskOk] = useState(false);
  const [termsOk, setTermsOk] = useState(false);
  const [refundOk, setRefundOk] = useState(false);
  const price = useMemo(() => priceFor(product, interval), [product, interval]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user?.email) setEmail(d.user.email);
      })
      .catch(() => undefined);
  }, []);

  async function buy() {
    setLoading(true);
    setError(null);
    try {
      if (!riskOk || !termsOk || !refundOk) {
        throw new Error("Accept risk, terms, and the no-refund policy before buying.");
      }
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug: product.slug,
          interval,
          email,
          acknowledgements: {
            risk: riskOk,
            terms: termsOk,
            noRefunds: refundOk,
          },
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

  const canBuy = email.includes("@") && riskOk && termsOk && refundOk && !loading;

  return (
    <aside className="panel sticky top-24 h-fit p-6">
      <div className="mb-4 flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.avatar}
          alt=""
          width={48}
          height={48}
          className="rounded-full ring-2 ring-black/5"
        />
        <div>
          <p className="text-sm text-[#6e6e73]">Ready to buy</p>
          <p className="font-medium">{product.name}</p>
        </div>
      </div>
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

      <div className="mt-5 space-y-3 text-xs leading-relaxed text-[#6e6e73]">
        <label className="flex gap-2">
          <input type="checkbox" checked={riskOk} onChange={(e) => setRiskOk(e.target.checked)} />
          <span>
            I read the{" "}
            <Link href="/legal/risk" className="text-[#0071e3]">
              Risk disclosure
            </Link>{" "}
            and accept that I can lose all capital I allocate to trading.
          </span>
        </label>
        <label className="flex gap-2">
          <input type="checkbox" checked={termsOk} onChange={(e) => setTermsOk(e.target.checked)} />
          <span>
            I agree to the{" "}
            <Link href="/legal/terms" className="text-[#0071e3]">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/legal/compliance" className="text-[#0071e3]">
              Compliance
            </Link>{" "}
            pages. This is software, not investment advice.
          </span>
        </label>
        <label className="flex gap-2">
          <input
            type="checkbox"
            checked={refundOk}
            onChange={(e) => setRefundOk(e.target.checked)}
          />
          <span>
            I understand{" "}
            <Link href="/legal/refunds" className="text-[#0071e3]">
              all sales are final with no refunds
            </Link>
            , including if I lose money trading.
          </span>
        </label>
      </div>

      {error ? <p className="mt-3 text-sm text-[#b42318]">{error}</p> : null}
      <button
        type="button"
        disabled={!canBuy}
        onClick={buy}
        className="btn btn-primary mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Starting checkout…" : "Buy now"}
      </button>
      <p className="mt-4 text-xs leading-relaxed text-[#6e6e73]">
        Digital goods deliver instantly. No cooling-off refund after license issuance. Past
        research metrics are not live results.
      </p>
    </aside>
  );
}
