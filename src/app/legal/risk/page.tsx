export const metadata = { title: "Risk disclosure | Drift" };

export default function RiskPage() {
  return (
    <div className="container-page py-16">
      <p className="mb-3 text-sm font-medium text-[#0071e3]">Legal</p>
      <h1 className="display text-5xl">Risk disclosure</h1>
      <p className="mt-3 text-sm text-[#6e6e73]">Last updated: August 11, 2026</p>
      <div className="mt-8 max-w-3xl space-y-5 text-sm leading-relaxed text-[#6e6e73]">
        <p className="rounded-2xl bg-[#fff4f2] px-4 py-3 text-[#b42318]">
          Trading futures, equities, options, crypto, forex, and other leveraged products can
          result in rapid and total loss of capital. Do not trade with money you cannot afford to
          lose.
        </p>
        <p>
          Drift provides software tools and research illustrations. Nothing on this site is
          financial, investment, tax, or legal advice. No officer, employee, or operator of Drift
          is advising you to buy or sell any instrument.
        </p>
        <p>
          Research metrics, equity curves, win rates, profit factors, Sharpe ratios, and hover
          tooltips are based on sample generators, historical research sets, or simulations. They
          are not live brokerage statements. They do not include all fees, latency, rejected
          orders, partial fills, or regime shifts you will face in production.
        </p>
        <p>
          Past research results do not predict future returns. An algorithm that looked strong in
          sample data can fail immediately in live markets. Automated systems can malfunction,
          overtrade, or fail to flatten risk.
        </p>
        <p>
          Prop firm rules, exchange rules, and broker policies can liquidate or restrict you
          independently of the Software. You are solely responsible for compliance with those
          rules.
        </p>
        <p>
          By purchasing or using Drift Software, you confirm you understand these risks and that
          Drift is not responsible for trading losses of any size, including total loss.
        </p>
      </div>
    </div>
  );
}
