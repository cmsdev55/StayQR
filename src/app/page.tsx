import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/sections/hero";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        {/* Remaining sections land in step 3. */}
        <div className="h-[40vh]" aria-hidden />
      </main>
    </>
  );
}
