import { COMPANY, FOUNDER } from "@/content/company";
import { LIFETIME, PRO } from "@/content/plans";
import { SITE_URL } from "@/lib/site";

/** Structured data, rendered on the server. `<` is escaped so content can never close the script tag. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export const SITE = SITE_URL;

/** One EndureQR entity: every page refers to this @id, so search engines see a single organisation. */
export const ORG_ID = `${SITE}/#organization`;
export const APP_ID = `${SITE}/#app`;
export const ORG_REF = { "@type": "Organization", "@id": ORG_ID, name: COMPANY.name, url: SITE };
export const FOUNDER_ID = `${SITE}/about#founder`;

/** The founder, who also writes the guides (Article author). */
export function founderLd() {
  return {
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: FOUNDER.name,
    jobTitle: FOUNDER.role,
    url: `${SITE}/about#founder`,
    worksFor: { "@id": ORG_ID },
    homeLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: FOUNDER.city, addressCountry: FOUNDER.countryCode } },
  };
}

export function organizationLd() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: COMPANY.name,
    url: SITE,
    description: "EndureQR makes QR codes that keep working: free static codes that never expire, and dynamic codes that keep redirecting even after you cancel.",
    logo: { "@type": "ImageObject", "@id": `${SITE}/#logo`, url: `${SITE}/logo-512.png`, width: 512, height: 512, caption: COMPANY.name },
    image: { "@id": `${SITE}/#logo` },
    email: COMPANY.email.hello,
    founder: { "@id": FOUNDER_ID },
    address: { "@type": "PostalAddress", addressLocality: FOUNDER.city, addressCountry: FOUNDER.countryCode },
    contactPoint: [
      { "@type": "ContactPoint", contactType: "customer support", email: COMPANY.email.hello, availableLanguage: "en" },
      { "@type": "ContactPoint", contactType: "privacy", email: COMPANY.email.privacy, availableLanguage: "en" },
    ],
  };
}

/** The product, with per-plan prices (subscriptions carry a billing period). */
export function softwareAppLd() {
  const sub = (name: string, price: number, period: "P1M" | "P1Y") => ({
    "@type": "Offer",
    name,
    price: String(price),
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: `${SITE}/pricing`,
    priceSpecification: { "@type": "UnitPriceSpecification", price: String(price), priceCurrency: "USD", billingDuration: period, referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: period === "P1M" ? "MON" : "ANN" } },
  });
  return {
    "@type": "SoftwareApplication",
    "@id": APP_ID,
    name: COMPANY.name,
    url: SITE,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    publisher: { "@id": ORG_ID },
    offers: [
      { "@type": "Offer", name: "Free", description: "Unlimited static QR codes and one dynamic QR code", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock", url: `${SITE}/qr-code-generator` },
      sub("Pro monthly", PRO.monthly, "P1M"),
      sub("Pro yearly", PRO.yearly, "P1Y"),
      { "@type": "Offer", name: "Lifetime", price: String(LIFETIME), priceCurrency: "USD", availability: "https://schema.org/InStock", url: `${SITE}/pricing` },
    ],
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${SITE}${it.path === "/" ? "/" : it.path}` })),
  };
}
