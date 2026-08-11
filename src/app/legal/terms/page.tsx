export const metadata = { title: "Terms | Drift" };

export default function TermsPage() {
  return (
    <div className="container-page py-16">
      <h1 className="display text-5xl">Terms</h1>
      <div className="mt-8 max-w-2xl space-y-4 text-sm leading-relaxed text-[#6e6e73]">
        <p>
          Drift sells software licenses for research and automation tools. Purchases grant a
          personal license to download and use the included source for your own trading and
          research. You may not resell, redistribute, or publicly rehost the packages.
        </p>
        <p>
          Software is provided as is. We do not guarantee profits, uptime of third party brokers,
          or fitness for a particular trading style. Refunds are handled case by case within 7
          days if the download vault never delivered a package.
        </p>
        <p>By buying you also accept the Risk disclosure.</p>
      </div>
    </div>
  );
}
