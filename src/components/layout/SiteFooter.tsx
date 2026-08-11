import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-black/5 bg-white/50">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="mb-3 flex items-center gap-2 font-medium">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1d1d1f] text-[11px] font-semibold text-white">
              D
            </span>
            Drift
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[#6e6e73]">
            Calm algorithmic systems with full source. Research metrics are illustrative.
            Trading involves substantial risk of loss.
          </p>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-medium">Product</p>
          <div className="flex flex-col gap-2 text-[#6e6e73]">
            <Link href="/products">Algorithms</Link>
            <Link href="/performance">Performance</Link>
            <Link href="/docs">Docs</Link>
            <Link href="/vault">License vault</Link>
          </div>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-medium">Legal</p>
          <div className="flex flex-col gap-2 text-[#6e6e73]">
            <Link href="/legal/terms">Terms</Link>
            <Link href="/legal/privacy">Privacy</Link>
            <Link href="/legal/risk">Risk disclosure</Link>
          </div>
        </div>
      </div>
      <div className="container-page border-t border-black/5 py-6 text-xs text-[#6e6e73]">
        © {new Date().getFullYear()} Drift. Built for tylrcc.
      </div>
    </footer>
  );
}
