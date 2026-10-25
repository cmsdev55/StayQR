import { onLenis } from "@/lib/scroll";

type Gsap = typeof import("gsap").gsap;
type ST = typeof import("gsap/ScrollTrigger").ScrollTrigger;

let loading: Promise<{ gsap: Gsap; ScrollTrigger: ST }> | null = null;

/**
 * GSAP + ScrollTrigger, fetched on demand (never in the initial JS) and registered once.
 * Registers the one easing curve as "stay" and keeps ScrollTrigger in step with Lenis.
 */
export function loadGsap() {
  if (!loading) {
    loading = Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("gsap/CustomEase")]).then(
      ([{ gsap }, { ScrollTrigger }, { CustomEase }]) => {
        gsap.registerPlugin(ScrollTrigger, CustomEase);
        CustomEase.create("stay", "0.22,1,0.36,1");
        gsap.defaults({ ease: "stay" });
        let off: (() => void) | undefined;
        onLenis((lenis) => {
          off?.();
          off = lenis ? lenis.on("scroll", ScrollTrigger.update) : undefined;
        });
        return { gsap, ScrollTrigger };
      },
    );
  }
  return loading;
}
