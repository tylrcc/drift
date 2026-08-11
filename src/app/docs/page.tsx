export const metadata = {
  title: "Docs | Drift",
  description: "How to install, run, and connect Drift algorithms.",
};

export default function DocsPage() {
  return (
    <div className="container-page prose-like py-16">
      <p className="mb-3 text-sm font-medium text-[#0071e3]">Docs</p>
      <h1 className="display text-5xl">Operator notes</h1>
      <div className="mt-8 max-w-2xl space-y-8 text-[15px] leading-relaxed text-[#1d1d1f]">
        <section>
          <h2 className="text-xl font-medium">1. Buy and unlock</h2>
          <p className="mt-3 text-[#6e6e73]">
            Choose monthly or lifetime on a product page, pay, and save your license key. Mock
            checkout issues a signed key instantly. Stripe mode issues keys after webhook
            confirmation.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-medium">2. Download the package</h2>
          <p className="mt-3 text-[#6e6e73]">
            Use the success page or the vault. You receive a zip with the strategy module,
            `drift_engine.py`, and research notes.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-medium">3. Reproduce research</h2>
          <pre className="mt-3 overflow-x-auto rounded-2xl bg-[#1d1d1f] p-4 text-sm text-white">
{`python3 algorithms/run_backtests.py`}
          </pre>
        </section>
        <section>
          <h2 className="text-xl font-medium">4. Go live carefully</h2>
          <p className="mt-3 text-[#6e6e73]">
            Drift ships research code, not a managed broker connection. Wire your own adapter
            (broker API, NinjaTrader export, or whatever you trust). Paper trade first. Size
            small. Read the risk disclosure.
          </p>
        </section>
      </div>
    </div>
  );
}
