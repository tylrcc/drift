import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, PRODUCTS } from "@/lib/products/catalog";
import { formatPct } from "@/lib/utils";
import { BuyPanel } from "@/components/shop/BuyPanel";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Algorithm | Drift" };
  return {
    title: `${product.name} | Drift`,
    description: product.tagline,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <div className="container-page py-16">
      <Link href="/products" className="text-sm text-[#6e6e73] hover:text-[#1d1d1f]">
        ← All algorithms
      </Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.3fr_0.9fr]">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            {product.badge ? (
              <span className="rounded-full bg-black/[0.04] px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-[#6e6e73]">
                {product.badge}
              </span>
            ) : null}
            <h1 className="display text-5xl">{product.name}</h1>
          </div>
          <p className="mt-4 text-lg text-[#6e6e73]">{product.tagline}</p>
          <p className="mt-6 whitespace-pre-line text-[15px] leading-relaxed text-[#1d1d1f]">
            {product.longDescription}
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            <Stat label="Win rate" value={formatPct(product.metrics.winRate)} />
            <Stat label="Profit factor" value={product.metrics.profitFactor.toFixed(2)} />
            <Stat label="Sharpe" value={product.metrics.sharpe.toFixed(2)} />
            <Stat label="Max DD" value={formatPct(product.metrics.maxDrawdownPct)} />
          </div>
          <p className="mt-3 text-xs text-[#6e6e73]">{product.metrics.periodLabel}</p>

          <h2 className="mt-12 text-xl font-medium">What you get</h2>
          <ul className="mt-4 space-y-2 text-sm text-[#1d1d1f]">
            {product.features.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#0071e3]" />
                {f}
              </li>
            ))}
          </ul>

          <h2 className="mt-10 text-xl font-medium">Specs</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {product.specs.map((s) => (
              <div key={s.label} className="panel px-4 py-3">
                <dt className="text-xs uppercase tracking-wide text-[#6e6e73]">{s.label}</dt>
                <dd className="mt-1 text-sm font-medium">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <BuyPanel product={product} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel px-4 py-4">
      <p className="text-[11px] uppercase tracking-wide text-[#6e6e73]">{label}</p>
      <p className="mt-1 text-xl font-medium tabular-nums">{value}</p>
    </div>
  );
}
