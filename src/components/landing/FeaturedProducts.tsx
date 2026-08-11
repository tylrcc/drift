import Link from "next/link";
import { featuredProducts } from "@/lib/products/catalog";
import { ProductCard } from "@/components/shop/ProductCard";

export function FeaturedProducts() {
  const products = featuredProducts();
  return (
    <section id="products" className="container-page py-10 md:py-16">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-3 text-sm font-medium text-[#0071e3]">Featured products</p>
          <h2 className="display text-4xl md:text-5xl">Four flagship algorithms.</h2>
          <p className="mt-3 max-w-xl text-[#6e6e73]">
            Pick the one that fits your style. Every purchase includes full source.
          </p>
        </div>
        <Link href="/products" className="btn btn-secondary">
          View all products
        </Link>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
