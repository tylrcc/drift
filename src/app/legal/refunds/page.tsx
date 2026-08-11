export const metadata = { title: "Refund policy | Drift" };

export default function RefundsPage() {
  return (
    <div className="container-page py-16">
      <p className="mb-3 text-sm font-medium text-[#0071e3]">Legal</p>
      <h1 className="display text-5xl">Refund policy</h1>
      <p className="mt-3 text-sm text-[#6e6e73]">Last updated: August 11, 2026</p>
      <div className="mt-8 max-w-3xl space-y-5 text-sm leading-relaxed text-[#6e6e73]">
        <p className="rounded-2xl bg-[#1d1d1f] px-4 py-3 text-white">
          All sales are final. No refunds. No chargebacks for buyer&apos;s remorse or trading
          losses.
        </p>
        <p>
          Drift sells digital software licenses that are delivered immediately after checkout via
          a license key and downloadable package. Once a license is issued, the product has been
          fully delivered.
        </p>
        <h2 className="text-lg font-medium text-[#1d1d1f]">No refunds for</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Trading losses of any amount, including total loss of account equity</li>
          <li>Dissatisfaction with research metrics versus live results</li>
          <li>Change of mind, duplicate purchase, or unused license</li>
          <li>Incompatibility with a broker, prop firm, OS, or third-party tool</li>
          <li>User error, misconfiguration, or failure to read documentation</li>
          <li>Market conditions, slippage, downtime, or exchange outages</li>
        </ul>
        <h2 className="text-lg font-medium text-[#1d1d1f]">Narrow technical exception</h2>
        <p>
          If checkout charged you and our systems never issued a license key and never made a
          package available for download, contact support with your receipt within 7 days. We may
          re-deliver the license or, only if re-delivery is impossible, refund that specific
          failed delivery. This exception does not apply after a license key has been shown,
          emailed, or used.
        </p>
        <h2 className="text-lg font-medium text-[#1d1d1f]">Chargebacks</h2>
        <p>
          Filing a chargeback after receiving a license is a violation of these Terms. We reserve
          the right to revoke licenses, suspend accounts, and contest fraudulent disputes with
          full order logs, acknowledgment checkboxes, and delivery records.
        </p>
        <p>
          By completing checkout and checking the no-refund acknowledgment, you expressly waive
          any cooling-off or withdrawal claim to the fullest extent allowed for digital content
          supplied immediately with your prior consent.
        </p>
      </div>
    </div>
  );
}
