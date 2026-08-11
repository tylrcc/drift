export const metadata = { title: "Privacy | Drift" };

export default function PrivacyPage() {
  return (
    <div className="container-page py-16">
      <h1 className="display text-5xl">Privacy</h1>
      <div className="mt-8 max-w-2xl space-y-4 text-sm leading-relaxed text-[#6e6e73]">
        <p>
          We collect the email you provide at checkout to deliver license keys and support.
          Payment card data is handled by Stripe when Stripe mode is enabled. We do not sell
          personal data.
        </p>
        <p>
          If Supabase Auth is connected, account emails and profiles are stored in your Drift
          Supabase project. You can request deletion by emailing the operator.
        </p>
      </div>
    </div>
  );
}
