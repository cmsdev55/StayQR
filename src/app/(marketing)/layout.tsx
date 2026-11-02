import { RevealObserver } from "@/components/motion/reveal-observer";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* AdSense's site snippet, on public pages only (React hoists it into <head>); a plain tag, as AdSense rejects next/script's data-nscript */}
      {ADSENSE_CLIENT && (
        <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`} crossOrigin="anonymous" />
      )}
      <SiteHeader />
      {children}
      <SiteFooter />
      <SmoothScroll />
      <RevealObserver />
    </>
  );
}
