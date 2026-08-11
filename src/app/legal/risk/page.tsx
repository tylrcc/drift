export const metadata = { title: "Risk disclosure | Drift" };

export default function RiskPage() {
  return (
    <div className="container-page py-16">
      <h1 className="display text-5xl">Risk disclosure</h1>
      <div className="mt-8 max-w-2xl space-y-4 text-sm leading-relaxed text-[#6e6e73]">
        <p>
          Trading futures, stocks, options, crypto, and other leveraged products involves
          substantial risk of loss and is not suitable for every investor. You can lose more than
          your initial capital depending on the instrument and account type.
        </p>
        <p>
          Research metrics on this site are produced on Drift&apos;s sample generator or historical
          research sets. They are not live brokerage performance. Past research results do not
          predict future returns. Slippage, fees, latency, and regime change can erase an edge.
        </p>
        <p>
          Drift provides software, not investment advice, and does not manage customer funds.
        </p>
      </div>
    </div>
  );
}
