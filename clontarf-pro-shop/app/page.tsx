import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { Cta } from "@/components/home/Cta";
import { TrustBadges } from "@/components/home/TrustBadges";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Cta />
      <Features />
      <TrustBadges />
    </div>
  );
}
