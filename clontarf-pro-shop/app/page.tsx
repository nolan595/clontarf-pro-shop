import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { Cta } from "@/components/home/Cta";
import { Contact } from "@/components/home/Contact";
export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Cta />
      <Features />
      <Contact/>
    </div>
  );
}
