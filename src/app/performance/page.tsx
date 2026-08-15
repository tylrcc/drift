"use client";

import { HeroPerformanceChart } from "@/components/motion/HeroPerformanceChart";

export default function PerformancePage() {
  return (
    <div className="container-page py-16">
      <p className="mb-3 text-sm font-medium text-[#0071e3]">Performance</p>
      <h1 className="display text-5xl">Research metrics</h1>
      <p className="mt-4 max-w-2xl text-[#6e6e73]">
        Scrub the curve to read return, account value, and drawdown at every week. These are
        research illustrations on Drift&apos;s sample path, not live brokerage results.
      </p>
      <div className="mt-10">
        <HeroPerformanceChart />
      </div>
    </div>
  );
}
