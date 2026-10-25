import { Features } from "@/components/sections/features";
import { Generator } from "@/components/sections/generator";
import { Hero } from "@/components/sections/hero";
import { NeverDies } from "@/components/sections/never-dies";

export default function Home() {
  return (
    <main>
      <Hero />
      <NeverDies />
      <Generator />
      <Features />
    </main>
  );
}
