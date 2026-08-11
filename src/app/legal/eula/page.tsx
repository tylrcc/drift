export const metadata = { title: "EULA | Drift" };

export default function EulaPage() {
  return (
    <div className="container-page py-16">
      <p className="mb-3 text-sm font-medium text-[#0071e3]">Legal</p>
      <h1 className="display text-5xl">End User License Agreement</h1>
      <p className="mt-3 text-sm text-[#6e6e73]">Last updated: August 11, 2026</p>
      <div className="mt-8 max-w-3xl space-y-5 text-sm leading-relaxed text-[#6e6e73]">
        <p>
          This End User License Agreement (&quot;EULA&quot;) is a binding agreement between you and
          Drift for the software package you purchase. Installation, download, or use constitutes
          acceptance.
        </p>
        <p>
          One personal license seat per purchase unless a product page expressly states otherwise.
          Sharing license keys in public channels voids the license without refund.
        </p>
        <p>
          Ownership of intellectual property remains with Drift. You receive a license, not a sale
          of IP rights, except for your right to use delivered source as permitted in the Terms.
        </p>
        <p>
          We may terminate the license if you breach the Terms, EULA, or Refund policy. Termination
          does not entitle you to a refund.
        </p>
        <p>
          Export laws may apply. You agree not to export the Software in violation of US or other
          applicable export controls.
        </p>
      </div>
    </div>
  );
}
