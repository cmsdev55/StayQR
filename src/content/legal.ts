/**
 * Terms of Service and Privacy Policy.
 * DRAFT STRUCTURE ONLY: replace with the approved text from the Legal board / counsel.
 * Anything in [brackets] is a fact StayQR must supply and renders as a visible placeholder.
 */
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

export const TERMS: LegalDoc = {
  slug: "terms",
  title: "Terms of Service",
  description: "The agreement between you and StayQR for using the website, the free generator and paid plans.",
  effective: "[Effective date]",
  updated: "[Last updated date]",
  summary: [
    "Free static codes are yours to use however you like, with no account.",
    "Dynamic codes keep redirecting to their last destination after you cancel, as described in section 6.",
    "Don't point codes at anything illegal, harmful or deceptive. We can pause codes that do.",
    "Paid plans renew until you cancel. Lifetime is one payment for the life of the product.",
    "[Governing law] applies. Questions go to [legal contact email].",
  ],
  sections: [
    {
      id: "who",
      title: "Who we are",
      body: [
        "StayQR is operated by [Company legal name], a company registered in [country] under number [company number], with its registered office at [registered address] (\"StayQR\", \"we\", \"us\").",
        "These terms apply to stayqr.com, the free QR generator, the StayQR dashboard and any related services (together, the \"Service\").",
      ],
    },
    {
      id: "accounts",
      title: "Your account",
      body: [
        "You need an account to create dynamic codes. You must be at least [minimum age] years old and give accurate information.",
        "You are responsible for activity under your account and for keeping your login details safe. Tell us at [security contact email] if you think your account has been compromised.",
        "If you create an account for an organisation, you confirm you are allowed to accept these terms on its behalf.",
      ],
    },
    {
      id: "codes",
      title: "Static and dynamic codes",
      body: [
        "A static code stores its content inside the pattern. Once downloaded it works without StayQR, and we have no way to change or disable it.",
        "A dynamic code points to a StayQR short link that redirects to a destination you choose. You can change the destination while your plan allows editing.",
        "You keep all rights in the content and designs you add. You give us the limited permission we need to host, display and redirect them.",
      ],
    },
    {
      id: "acceptable-use",
      title: "Acceptable use",
      body: [
        "Don't use the Service for anything unlawful, for phishing, malware, spam, impersonation, or content that infringes someone else's rights.",
        "We may pause or remove a code that breaks these rules or that we're legally required to act on. Where we can, we'll tell you first and explain why. [Confirm notice period and appeals process].",
      ],
    },
    {
      id: "plans",
      title: "Plans, billing and refunds",
      body: [
        "Pro is billed monthly or yearly in advance and renews automatically until you cancel. Lifetime is a single payment for access to Pro features for the life of the product.",
        "Prices are shown before tax. [Tax handling and invoicing details]. Payments are processed by [payment processor]; we don't store full card numbers.",
        "Refunds: [refund policy, e.g. window and conditions, to be confirmed].",
        "We may change prices for future billing periods with at least [notice period] notice. Price changes never apply to a Lifetime purchase already made.",
      ],
    },
    {
      id: "cancelling",
      title: "Cancelling, and what keeps working",
      body: [
        "You can cancel any time from Billing. Your plan stays active until the end of the period you've paid for.",
        "After that, your dynamic codes keep redirecting to the last destination you set. We don't replace them with a service page or ads. Editing destinations and new analytics pause until you resume a plan.",
        "This commitment lasts for as long as StayQR operates the Service. [Confirm what happens to redirects if StayQR is sold, merged or shut down, including any notice period and export or transfer of short links].",
        "We may still pause a code under section 4 (acceptable use) or if required by law.",
      ],
    },
    {
      id: "service",
      title: "Availability and changes",
      body: [
        "We work hard to keep redirects fast and available, but we don't promise the Service will be uninterrupted. [Uptime commitment or SLA, if any].",
        "We may improve or change features. If a change materially reduces what a paid plan includes, we'll tell you at least [notice period] in advance.",
      ],
    },
    {
      id: "liability",
      title: "Liability",
      body: [
        "Nothing in these terms limits liability that can't be limited by law.",
        "[Limitation of liability wording and cap, to be supplied by counsel].",
      ],
    },
    {
      id: "law",
      title: "Governing law and contact",
      body: [
        "These terms are governed by the laws of [jurisdiction], and disputes go to the courts of [venue], unless your local consumer law gives you other rights.",
        "We'll give notice of changes to these terms by [how notice is given]. Questions: [legal contact email].",
      ],
    },
  ],
};

export const PRIVACY: LegalDoc = {
  slug: "privacy",
  title: "Privacy Policy",
  description: "What StayQR collects, why, how long we keep it, and the choices you have.",
  effective: "[Effective date]",
  updated: "[Last updated date]",
  summary: [
    "The free generator runs in your browser. We don't store what you put in a static code.",
    "For scans we count anonymous facts: time, approximate city, device type. We don't build profiles of the people who scan.",
    "We never sell personal data or put ads on your codes.",
    "You can export or delete your account data any time from the dashboard or by emailing [privacy contact email].",
  ],
  sections: [
    {
      id: "controller",
      title: "Who is responsible for your data",
      body: [
        "[Company legal name] ([registered address]) is the controller for account and billing data. For scan data about your codes, [confirm controller / processor roles].",
        "Data protection contact: [DPO or privacy contact name and email].",
      ],
    },
    {
      id: "collect",
      title: "What we collect",
      body: [
        "Account data: your name, email, password hash, organisation name and settings.",
        "Billing data: plan, invoices and the last four digits of your card. Full card details are handled by [payment processor].",
        "Code data: destinations, names, folders and designs you create.",
        "Scan data: when a dynamic code is scanned we record the time, approximate location derived from the IP address (to city level), device type and operating system. [Confirm whether IP addresses are stored, truncated or discarded, and for how long].",
        "Website data: [analytics provider] measures page visits on stayqr.com. [Cookie list or link to cookie notice].",
      ],
    },
    {
      id: "use",
      title: "How we use it",
      body: [
        "To run the Service: create and redirect codes, show analytics, take payments and send service emails.",
        "To keep it safe: detect abuse such as phishing codes, and investigate security issues.",
        "To improve it: aggregated, non-identifying usage statistics.",
        "Legal bases: [contract, legitimate interests, consent, legal obligation: map each purpose].",
      ],
    },
    {
      id: "share",
      title: "Who we share it with",
      body: [
        "Service providers that host and run StayQR on our behalf: [hosting provider], [email provider], [payment processor], [analytics provider].",
        "Authorities, where required by law.",
        "We never sell personal data.",
      ],
    },
    {
      id: "transfers",
      title: "International transfers",
      body: ["[Where data is stored and the safeguards used for transfers outside the UK/EEA, if any]."],
    },
    {
      id: "retention",
      title: "How long we keep it",
      body: [
        "Account data: while your account is open, then [retention period].",
        "Scan analytics: [retention period, e.g. per plan].",
        "Billing records: [period required by tax law].",
        "Redirect records for dynamic codes are kept so cancelled codes keep working (see Terms, section 6).",
      ],
    },
    {
      id: "rights",
      title: "Your rights",
      body: [
        "Depending on where you live, you can ask to access, correct, export or delete your data, or object to some uses. Email [privacy contact email]; we reply within [response time].",
        "You can also complain to [supervisory authority].",
      ],
    },
    {
      id: "changes",
      title: "Changes and contact",
      body: ["We'll post changes here and, for significant ones, email account holders. Questions: [privacy contact email]."],
    },
  ],
};

export const LEGAL = { terms: TERMS, privacy: PRIVACY };
