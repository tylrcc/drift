import { PRODUCTS } from "@/lib/products/catalog";
import { ProductCard } from "@/components/shop/ProductCard";

export const metadata = {
  title: "Algorithms | Drift",
  description: "Browse Drift trading algorithms with full source and research metrics.",
};

export default function ProductsPage() {
  return (
    <div className="container-page py-16">
      <p className="mb-3 text-sm font-medium text-[#0071e3]">Catalog</p>
      <h1 className="display text-5xl">Algorithms</h1>
      <p className="mt-4 max-w-2xl text-[#6e6e73]">
        Every package ships with Python source, a research runner, and a license key for the
        download vault.
      </p>
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {PRODUCTS.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </div>
  );
}
