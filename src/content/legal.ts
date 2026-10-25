/**
 * Terms of Service and Privacy Policy. Operator facts and providers come from ./company.ts.
 * Inline text supports **bold** and [text](url). Have a lawyer review before taking payments.
 */
import { COMPANY, LEGAL_EFFECTIVE, PROVIDERS } from "./company";

export type LegalSection = { id: string; title: string; body: string[] };
export type LegalDoc = {
  slug: "terms" | "privacy";
  title: string;
  description: string;
  effective: string;
  updated: string;
  summary: string[];
  sections: LegalSection[];
};

const { email } = COMPANY;

export const TERMS: LegalDoc = {
  slug: "terms",
  title: "Terms of Service",
  description: "The agreement between you and StayQR for using the website, the free QR code generator and paid plans.",
  effective: LEGAL_EFFECTIVE,
  updated: LEGAL_EFFECTIVE,
  summary: [
    "Free static codes are yours to use however you like, with no account and no attribution.",
    "Dynamic codes keep redirecting to their last destination after you cancel, as described in section 6.",
    "Don't point codes at anything illegal, harmful or deceptive. We can pause codes that do.",
    "Paid plans renew until you cancel, and you can ask for a full refund within 14 days of your first payment.",
    `The laws of ${COMPANY.jurisdiction} apply. Questions go to ${email.hello}.`,
  ],
  sections: [
    {
      id: "who",
      title: "Who we are",
      body: [
        `StayQR ("StayQR", "we", "us") runs the website at ${COMPANY.site}, the free QR code generator, the StayQR dashboard and related services (together, the "Service").`,
        "By using the Service you agree to these terms. If you use it for an organisation, you confirm you are allowed to accept them on its behalf.",
      ],
    },
    {
      id: "accounts",
      title: "Your account",
      body: [
        "You don't need an account to use the free generator. You need one to create dynamic codes.",
        "You must be at least 16 years old, or the age of digital consent where you live if that is higher, and give accurate information.",
        `You are responsible for activity under your account and for keeping your login details safe. Tell us at ${email.hello} straight away if you think your account has been compromised.`,
      ],
    },
    {
      id: "codes",
      title: "Static and dynamic codes",
      body: [
        "A **static** code stores its content inside the pattern. Once downloaded it works without StayQR, and we have no way to change, track or disable it. You may use static codes for any lawful purpose, including commercial use, without credit to us.",
        "A **dynamic** code points to a StayQR short link that redirects to a destination you choose. You can change the destination while your plan includes editing.",
        "You keep all rights in the content, logos and designs you add. You give us the limited permission we need to host, display and redirect them for you.",
      ],
    },
    {
      id: "acceptable-use",
      title: "Acceptable use",
      body: [
        "Don't use the Service for anything unlawful, or for phishing, malware, spam, fraud, impersonation, or content that infringes someone else's rights.",
        "Don't try to disrupt the Service, get around its limits, or access other people's accounts or data.",
        `We may pause or remove a dynamic code that breaks these rules, or that we are legally required to act on. Where it is safe and lawful, we will tell you first, explain why, and give you 7 days to respond. Report a harmful code to ${email.abuse}.`,
      ],
    },
    {
      id: "plans",
      title: "Plans, billing and refunds",
      body: [
        "Pro is billed monthly or yearly in advance and renews automatically until you cancel. Lifetime is a single payment for access to Pro features for as long as StayQR operates the Service.",
        "Our order process is run by our online reseller **Lemon Squeezy**, which is the merchant of record for all orders. Lemon Squeezy handles payment, sales tax and VAT, invoices and billing questions. Prices are shown before tax; the tax due is shown at checkout.",
        `**Refunds:** if StayQR isn't right for you, email ${email.hello} within 14 days of your first Pro payment or your Lifetime purchase for a full refund. Renewals can be cancelled at any time and are not refunded for the period already started, unless the law where you live says otherwise.`,
        "We may change prices for future billing periods with at least 30 days' notice by email. A price change never applies to a Lifetime purchase already made.",
      ],
    },
    {
      id: "cancelling",
      title: "Cancelling, and what keeps working",
      body: [
        "You can cancel any time from Billing in your dashboard. Your plan stays active until the end of the period you've paid for.",
        "After that, your dynamic codes keep redirecting to the last destination you set. We don't replace them with a service page, an upgrade prompt or ads. Editing destinations and new analytics pause until you resume a plan.",
        "This commitment lasts for as long as StayQR operates the Service. If StayQR is ever sold or merged, the commitment transfers with it. If we ever have to close the Service, we will give at least 90 days' notice by email and let you export every code's destination, so you can move to another provider.",
        "We may still pause a code under section 4 (acceptable use) or where the law requires it.",
      ],
    },
    {
      id: "service",
      title: "Availability and changes",
      body: [
        "We work hard to keep redirects fast and available, but we can't promise the Service will be uninterrupted or error-free. We don't offer a formal uptime guarantee (SLA).",
        "We may improve or change features. If a change materially reduces what a paid plan includes, we'll tell you at least 30 days in advance, and you can cancel and get a pro-rata refund for the unused part of a yearly plan.",
      ],
    },
    {
      id: "liability",
      title: "Liability",
      body: [
        "Nothing in these terms limits liability that can't be limited by law, such as liability for fraud or for death or personal injury caused by negligence.",
        "Otherwise, we are not liable for indirect or consequential losses, such as lost profits, lost revenue or lost data, or for the cost of reprinting materials.",
        "Our total liability to you for any claim related to the Service is limited to the amount you paid us in the 12 months before the claim, or US$50 if you have not paid us anything.",
        "The free generator is provided as is. Always scan a test print before you print in volume.",
      ],
    },
    {
      id: "law",
      title: "Governing law, changes and contact",
      body: [
        `These terms are governed by the laws of ${COMPANY.jurisdiction}, and disputes go to its courts, unless the consumer law where you live gives you the right to bring a claim there.`,
        "We'll post changes to these terms on this page and update the date above. For significant changes, we'll also email account holders at least 30 days before they take effect.",
        `Questions about these terms: ${email.hello}.`,
      ],
    },
  ],
};

export const PRIVACY: LegalDoc = {
  slug: "privacy",
  title: "Privacy Policy",
  description: "What StayQR collects, why, how long we keep it, who we share it with, and the choices you have.",
  effective: LEGAL_EFFECTIVE,
  updated: LEGAL_EFFECTIVE,
  summary: [
    "The free generator runs in your browser. What you type and the logos you upload never reach our servers.",
    "For scans of dynamic codes we record anonymous facts: time, approximate city, device type. We don't build profiles of the people who scan.",
    "The free generator and guide pages show Google ads. Your codes, scan pages and dashboard never do.",
    "We never sell personal data.",
    `You can export or delete your account data any time by emailing ${email.privacy}.`,
  ],
  sections: [
    {
      id: "controller",
      title: "Who is responsible for your data",
      body: [
        `StayQR is the controller of the personal data described here. Contact us about privacy at ${email.privacy}.`,
        "For scan data about the dynamic codes you create, you decide why the codes are used and we process scan data on your behalf to give you analytics.",
      ],
    },
    {
      id: "collect",
      title: "What we collect",
      body: [
        "**Free generator:** what you type and any logo you upload are processed in your browser to draw the code and build the file. They are not sent to our servers, and we don't store them.",
        "**Account data:** your name, email address, organisation name, settings and, if you use a password, a secure hash of it.",
        "**Billing data:** your plan, order history and the country used for tax. Card and payment details are handled by Lemon Squeezy; we never see your full card number.",
        "**Code data:** the destinations, names, folders and designs of the dynamic codes you create.",
        "**Scan data:** when a dynamic code is scanned, we record the time, the approximate location to city level, device type, operating system and browser. We use the IP address only to work out the approximate location, then discard it; we don't store full IP addresses with scan records.",
        "**Messages:** what you send when you email us.",
      ],
    },
    {
      id: "use",
      title: "How we use it, and why we're allowed to",
      body: [
        "**To provide the Service** (create and redirect codes, show analytics, manage your account and send service emails): necessary to perform our contract with you.",
        "**To keep the Service safe** (detect phishing and abuse, prevent fraud, investigate security issues): our legitimate interest in protecting you, people who scan codes, and us.",
        "**To improve the Service** using aggregated, non-identifying statistics: our legitimate interest.",
        "**To show ads** on the free generator and guide pages: with your consent where the law requires it (see Cookies and advertising).",
        "**To meet legal obligations**, such as keeping order records for tax: legal obligation.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies and advertising",
      body: [
        "**Essential storage:** we store your light or dark theme choice in your browser, and when you log in we set a session cookie so you stay signed in. These are needed for the site to work and don't track you.",
        "**Advertising:** the free generator and guide pages show ads served by Google AdSense. Google and its partners use cookies and similar technologies to serve ads, limit how often you see them and measure their performance. Ads may be personalised based on your visits to this and other sites, but only where you have given consent; otherwise Google shows non-personalised ads.",
        "If you are in the European Economic Area, the UK or Switzerland, you will see a consent message before any advertising cookies are used, and you can change your choice at any time through the privacy settings link at the bottom of those pages.",
        "You can learn how Google uses data from sites that show its ads at [policies.google.com/technologies/partner-sites](https://policies.google.com/technologies/partner-sites), and turn off personalised ads at [adssettings.google.com](https://adssettings.google.com).",
        "We don't use third-party analytics or tracking cookies of our own.",
      ],
    },
    {
      id: "share",
      title: "Who we share it with",
      body: [
        `Service providers that run parts of StayQR for us, only for that purpose: ${PROVIDERS.map((p) => `**${p.name}** (${p.role})`).join(", ")}.`,
        "Authorities, if the law requires it, or to protect people from harm such as phishing.",
        "A buyer or successor, if StayQR is ever sold or merged, under the same commitments as this policy.",
        "We never sell personal data, and we never share account or scan data with advertisers.",
      ],
    },
    {
      id: "transfers",
      title: "International transfers",
      body: [
        "Our providers may process data in the United States, the European Union and other countries. Where data from the EEA, UK or Switzerland is transferred, we rely on the safeguards our providers offer, such as the European Commission's Standard Contractual Clauses.",
      ],
    },
    {
      id: "retention",
      title: "How long we keep it",
      body: [
        "**Account and code data:** while your account is open. When you delete your account, we delete it within 30 days, and it is gone from backups within 90 days, except that a cancelled code's redirect record is kept so the code keeps working (see Terms, section 6).",
        "**Scan analytics:** 12 months on Pro, and for as long as your account exists on Lifetime.",
        "**Order records:** held by Lemon Squeezy and by us for as long as tax law requires, usually up to 7 years.",
        "**Emails with us:** up to 2 years after the conversation ends.",
      ],
    },
    {
      id: "rights",
      title: "Your rights",
      body: [
        `Depending on where you live, you can ask to access, correct, export or delete your personal data, or to object to or restrict some uses. Email ${email.privacy} and we will reply within 30 days.`,
        "Where we rely on consent, such as for personalised ads, you can withdraw it at any time.",
        "If you are unhappy with how we handle your data, please tell us first. You can also complain to the data protection authority where you live.",
        "California residents: we don't sell personal information. Advertising cookies on our free pages may count as \"sharing\" under California law; you can opt out through the privacy settings link on those pages or by turning on Global Privacy Control in your browser.",
      ],
    },
    {
      id: "children",
      title: "Children",
      body: ["StayQR is not meant for children under 16, and we don't knowingly collect their data. If you think a child has given us personal data, contact us and we'll delete it."],
    },
    {
      id: "changes",
      title: "Changes and contact",
      body: [
        "We'll post changes here and update the date above. For significant changes, we'll also email account holders before they take effect.",
        `Questions or requests: ${email.privacy}.`,
      ],
    },
  ],
};

export const LEGAL = { terms: TERMS, privacy: PRIVACY };
