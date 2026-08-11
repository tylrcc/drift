export const metadata = { title: "Privacy | Drift" };

export default function PrivacyPage() {
  return (
    <div className="container-page py-16">
      <p className="mb-3 text-sm font-medium text-[#0071e3]">Legal</p>
      <h1 className="display text-5xl">Privacy</h1>
      <p className="mt-3 text-sm text-[#6e6e73]">Last updated: August 11, 2026</p>
      <div className="mt-8 max-w-3xl space-y-5 text-sm leading-relaxed text-[#6e6e73]">
        <p>
          We collect account email, password hashes, checkout email, license records, and basic
          server logs needed to operate Drift. Payment card data is processed by Stripe when Stripe
          mode is enabled; we do not store full card numbers.
        </p>
        <p>
          We use this information to deliver licenses, prevent fraud, enforce the no-refund policy,
          and improve the product. We do not sell personal data.
        </p>
        <p>
          Session cookies authenticate your account. You can sign out to clear the session cookie.
        </p>
        <p>
          To request account deletion, contact the operator with the email on your account. License
          and order records may be retained as needed for fraud prevention, tax, and dispute defense.
        </p>
      </div>
    </div>
  );
}
