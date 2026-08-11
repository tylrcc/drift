"use client";

import { useState } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/products/catalog";

type LicenseRow = {
  licenseKey: string;
  productSlug: string;
  interval: string;
  createdAt?: string;
};

export default function VaultPage() {
  const [email, setEmail] = useState("");
  const [license, setLicense] = useState("");
  const [rows, setRows] = useState<LicenseRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function lookup() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, license }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lookup failed");
      setRows(data.licenses || []);
      if (!(data.licenses || []).length) setError("No licenses found for that lookup.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page py-16">
      <p className="mb-3 text-sm font-medium text-[#0071e3]">Vault</p>
      <h1 className="display text-5xl">License vault</h1>
      <p className="mt-4 max-w-xl text-[#6e6e73]">
        Enter the email from checkout, or paste a license key, to download your packages.
      </p>

      <div className="panel mt-10 max-w-xl space-y-4 p-6">
        <label className="block text-sm">
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none ring-[#0071e3] focus:ring-2"
            placeholder="you@email.com"
          />
        </label>
        <label className="block text-sm">
          License key (optional)
          <input
            value={license}
            onChange={(e) => setLicense(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 font-mono text-sm outline-none ring-[#0071e3] focus:ring-2"
            placeholder="DRIFT-...."
          />
        </label>
        {error ? <p className="text-sm text-[#b42318]">{error}</p> : null}
        <button
          type="button"
          onClick={lookup}
          disabled={loading || (!email.includes("@") && !license)}
          className="btn btn-primary disabled:opacity-50"
        >
          {loading ? "Looking up…" : "Unlock downloads"}
        </button>
      </div>

      <div className="mt-10 space-y-4">
        {rows.map((row) => {
          const product = PRODUCTS.find((p) => p.slug === row.productSlug);
          return (
            <div key={row.licenseKey} className="panel flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <p className="font-medium">{product?.name || row.productSlug}</p>
                <p className="mt-1 font-mono text-xs text-[#6e6e73]">{row.licenseKey}</p>
              </div>
              <a
                className="btn btn-secondary"
                href={`/api/download?license=${encodeURIComponent(row.licenseKey)}&product=${encodeURIComponent(row.productSlug)}`}
              >
                Download
              </a>
            </div>
          );
        })}
      </div>

      <p className="mt-10 text-sm text-[#6e6e73]">
        Need an account later? <Link href="/login">Sign in</Link> once Supabase Auth is connected.
      </p>
    </div>
  );
}
