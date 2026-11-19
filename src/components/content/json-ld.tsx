import { COMPANY, FOUNDER, SOCIAL } from "@/content/company";
import { LIFETIME, PRO } from "@/content/plans";
import { SITE_URL } from "@/lib/site";

/** Structured data, rendered on the server. `<` is escaped so content can never close the script tag. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export const SITE = SITE_URL;

/** One EndureQR entity: every page refers to this @id, so search engines see a single organisation. */
export const ORG_ID = `${SITE}/#organization`;
export const WEBSITE_ID = `${SITE}/#website`;
export const APP_ID = `${SITE}/#app`;
export const FOUNDER_ID = `${SITE}/about#founder`;

/** The founder, who also writes the guides (Article author). */
export function founderLd() {
  return {
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: FOUNDER.name,
    jobTitle: FOUNDER.role,
    url: `${SITE}/about#founder`,
    description: `Founder of ${COMPANY.name}. Builds the product and writes the guides, checking each fact against its primary source.`,
    knowsAbout: ["QR codes", "Dynamic QR codes", "QR code printing"],
    worksFor: { "@id": ORG_ID },
    homeLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: FOUNDER.city, addressCountry: FOUNDER.countryCode } },
  };
}

export function organizationLd() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: COMPANY.name,
    alternateName: "StayQR",
    url: SITE,
    description: "EndureQR makes QR codes that keep working: free static codes that never expire, and dynamic codes that keep redirecting even after you cancel.",
    logo: { "@type": "ImageObject", "@id": `${SITE}/#logo`, url: `${SITE}/logo-512.png`, width: 512, height: 512, caption: COMPANY.name },
    image: { "@id": `${SITE}/#logo` },
    email: COMPANY.email.hello,
    founder: { "@id": FOUNDER_ID },
    address: { "@type": "PostalAddress", addressLocality: FOUNDER.city, addressCountry: FOUNDER.countryCode },
    sameAs: SOCIAL.map((s) => s.url),
    contactPoint: [
      { "@type": "ContactPoint", contactType: "customer support", email: COMPANY.email.hello, availableLanguage: "en" },
      { "@type": "ContactPoint", contactType: "privacy", email: COMPANY.email.privacy, availableLanguage: "en" },
      { "@type": "ContactPoint", contactType: "abuse reports", email: COMPANY.email.abuse, availableLanguage: "en" },
    ],
  };
}

export function websiteLd() {
  // no SearchAction: the site has no search
  return { "@type": "WebSite", "@id": WEBSITE_ID, url: SITE, name: COMPANY.name, alternateName: "StayQR", publisher: { "@id": ORG_ID }, inLanguage: "en" };
}

/**
 * A page's structured data as one @graph that also carries the WebSite and Organization nodes. Google resolves @id
 * only within a document, so a bare reference to #organization on another page tells it nothing.
 */
export function pageGraph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": [websiteLd(), organizationLd(), ...nodes] };
}

type PageType = "WebPage" | "CollectionPage" | "AboutPage" | "ContactPage";

export function webPageLd(o: { path: string; name: string; description?: string; type?: PageType; about?: string; mainEntity?: string }) {
  const url = `${SITE}${o.path === "/" ? "" : o.path}`;
  return {
    "@type": o.type ?? "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: o.name,
    ...(o.description ? { description: o.description } : {}),
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
    ...(o.about ? { about: { "@id": o.about } } : {}),
    ...(o.mainEntity ? { mainEntity: { "@id": o.mainEntity } } : {}),
  };
}

/** A free browser tool page (generator hub, type pages, QR code with logo): the tool plus the page it lives on. */
export function toolLd(o: { path: string; name: string; description: string }) {
  const url = `${SITE}${o.path}`;
  return [
    {
      "@type": "WebApplication",
      "@id": `${url}#app`,
      name: o.name,
      url,
      description: o.description,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any (runs in the browser)",
      browserRequirements: "Requires JavaScript",
      isAccessibleForFree: true,
      inLanguage: "en",
      publisher: { "@id": ORG_ID },
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock", url },
    },
    webPageLd({ path: o.path, name: o.name, description: o.description, mainEntity: `${url}#app` }),
  ];
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
    description: "QR code generator with free static codes that never expire and dynamic codes you can edit after printing, with unlimited scans and analytics.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    inLanguage: "en",
    featureList: ["Unlimited free static QR codes", "Dynamic QR codes you can edit after printing", "Scan analytics", "Bulk creation from CSV", "Codes keep redirecting after you cancel"],
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
