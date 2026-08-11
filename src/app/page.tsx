import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FeaturedProducts } from "@/components/landing/FeaturedProducts";
import { TrustStrip } from "@/components/landing/TrustStrip";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <FeaturedProducts />
      <TrustStrip />
    </>
  );
}
