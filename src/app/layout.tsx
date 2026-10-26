import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const display = localFont({
  src: [
    { path: "../fonts/ClashDisplay-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/ClashDisplay-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
});

// Inter and JetBrains Mono (SIL OFL), Latin subset, self-hosted so builds never depend on Google Fonts
const sans = localFont({
  src: "../fonts/Inter-Variable.woff2",
  weight: "100 900",
  variable: "--font-sans",
  display: "swap",
  adjustFontFallback: "Arial",
});
const mono = localFont({
  src: "../fonts/JetBrainsMono-Variable.woff2",
  weight: "100 800",
  variable: "--font-mono",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "EndureQR: Dynamic QR codes that never stop working",
    template: "%s · EndureQR",
  },
  description:
    "Create dynamic QR codes you can edit after printing, with unlimited scans and real analytics. Cancel any time: your codes keep working forever.",
  openGraph: {
    type: "website",
    siteName: "EndureQR",
    title: "QR codes that never stop working",
    description: "Edit after printing. Unlimited scans. Your codes keep working even if you cancel.",
  },
  twitter: { card: "summary_large_image" },
  // Search engine ownership checks (Google Search Console "HTML tag" and Bing Webmaster Tools "Meta tag")
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.split(",").map((s) => s.trim()).filter(Boolean),
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } : undefined,
  },
  // AdSense site verification (the ad script itself only loads next to an ad slot)
  ...(process.env.NEXT_PUBLIC_ADSENSE_CLIENT ? { other: { "google-adsense-account": process.env.NEXT_PUBLIC_ADSENSE_CLIENT } } : {}),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07080B" },
    { media: "(prefers-color-scheme: light)", color: "#F5F6F2" },
  ],
  width: "device-width",
  initialScale: 1,
};

/** Set the theme before first paint (no flash). Dark is the default. Also flags `.js` so reveal styles only hide content when JS can show it again. */
const themeScript = `(function(){try{var t=localStorage.getItem('endureqr-theme');var q=new URLSearchParams(location.search).get('theme');if(q==='light'||q==='dark')t=q;var d=document.documentElement;d.classList.add('js');d.dataset.theme=t==='light'?'light':'dark'}catch(e){document.documentElement.dataset.theme='dark'}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
