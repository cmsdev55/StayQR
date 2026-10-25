import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Inter, JetBrains_Mono } from "next/font/google";
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

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stayqr.com"),
  title: {
    default: "StayQR: Dynamic QR codes that never stop working",
    template: "%s · StayQR",
  },
  description:
    "Create dynamic QR codes you can edit after printing, with unlimited scans and real analytics. Cancel any time: your codes keep working forever.",
  openGraph: {
    type: "website",
    siteName: "StayQR",
    title: "QR codes that never stop working",
    description: "Edit after printing. Unlimited scans. Your codes keep working even if you cancel.",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07080B" },
    { media: "(prefers-color-scheme: light)", color: "#F5F6F2" },
  ],
  width: "device-width",
  initialScale: 1,
};

/** Set the theme before first paint (no flash). Dark is the default. */
const themeScript = `(function(){try{var t=localStorage.getItem('stayqr-theme');var q=new URLSearchParams(location.search).get('theme');if(q==='light'||q==='dark')t=q;document.documentElement.dataset.theme=t==='light'?'light':'dark'}catch(e){document.documentElement.dataset.theme='dark'}})()`;

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
