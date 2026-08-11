"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getProduct } from "@/lib/products/catalog";

export default function CheckoutSuccessClient() {
  const params = useSearchParams();
  const license = params.get("license") || "";
  const productSlug = params.get("product") || "";
  const product = useMemo(() => getProduct(productSlug), [productSlug]);

  return (
    <div className="container-page py-20">
      <div className="panel mx-auto max-w-xl p-8 text-center">
        <p className="text-sm font-medium text-[#0071e3]">You are in</p>
        <h1 className="display mt-3 text-4xl">License unlocked</h1>
        <p className="mt-4 text-[#6e6e73]">
          {product
            ? `${product.name} is ready to download.`
            : "Your algorithm package is ready."}
        </p>
        {license ? (
          <div className="mt-8 rounded-2xl bg-black/[0.04] px-4 py-5">
            <p className="text-xs uppercase tracking-wide text-[#6e6e73]">License key</p>
            <p className="mt-2 break-all font-mono text-sm font-medium">{license}</p>
          </div>
        ) : (
          <p className="mt-6 text-sm text-[#6e6e73]">
            If you paid with Stripe, check your email or the vault once the webhook lands.
          </p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {license && productSlug ? (
            <a
              className="btn btn-primary"
              href={`/api/download?license=${encodeURIComponent(license)}&product=${encodeURIComponent(productSlug)}`}
            >
              Download package
            </a>
          ) : null}
          <Link href="/vault" className="btn btn-secondary">
            Open vault
          </Link>
        </div>
      </div>
    </div>
  );
}
