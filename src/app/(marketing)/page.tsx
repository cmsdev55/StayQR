import { Compare } from "@/components/sections/compare";
import { Features } from "@/components/sections/features";
import { Generator } from "@/components/sections/generator";
import { Hero } from "@/components/sections/hero";
import { NeverDies } from "@/components/sections/never-dies";
import { Pricing } from "@/components/sections/pricing";

export default function Home() {
  return (
    <main>
      <Hero />
      <NeverDies />
      <Generator />
      <Features />
      <Compare />
      <Pricing />
    </main>
  );
}
