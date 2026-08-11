export const metadata = { title: "Compliance | Drift" };

export default function CompliancePage() {
  return (
    <div className="container-page py-16">
      <p className="mb-3 text-sm font-medium text-[#0071e3]">Legal</p>
      <h1 className="display text-5xl">Compliance</h1>
      <p className="mt-3 text-sm text-[#6e6e73]">Last updated: August 11, 2026</p>
      <div className="mt-8 max-w-3xl space-y-5 text-sm leading-relaxed text-[#6e6e73]">
        <p>
          Drift is a software vendor. We are not a broker-dealer, commodity trading advisor (CTA),
          commodity pool operator (CPO), investment adviser, bank, or money transmitter. Nothing on
          this site should be interpreted as an offer to buy or sell securities or as personalized
          investment advice.
        </p>
        <h2 className="text-lg font-medium text-[#1d1d1f]">Marketing and performance claims</h2>
        <p>
          Performance figures on Drift pages are labeled as research or illustrative. Hover
          tooltips, equity ribbons, and percentage callouts are educational UI for research curves,
          not guarantees. Hypothetical or simulated results have inherent limitations.
        </p>
        <h2 className="text-lg font-medium text-[#1d1d1f]">Customer acknowledgments</h2>
        <p>
          Checkout requires affirmative acknowledgments of the Risk disclosure, Terms of Service,
          and no-refund policy. Account signup requires age and risk acceptance. Those records are
          part of the purchase contract.
        </p>
        <h2 className="text-lg font-medium text-[#1d1d1f]">Sanctions and abuse</h2>
        <p>
          You may not use Drift if you are located in a comprehensively sanctioned jurisdiction or
          are on a denied-party list. You may not use the Software for market manipulation, spoofing,
          or other unlawful trading practices.
        </p>
        <h2 className="text-lg font-medium text-[#1d1d1f]">Taxes</h2>
        <p>
          You are responsible for any taxes associated with your purchases and trading activity.
        </p>
        <h2 className="text-lg font-medium text-[#1d1d1f]">Contact</h2>
        <p>
          Compliance questions: use the email on your purchase receipt or the operator contact on
          the GitHub repository README.
        </p>
      </div>
    </div>
  );
}
