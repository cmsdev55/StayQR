import type { Guide } from "@/content/guides";

/**
 * Original research. Every fact about another company comes from our own test (evidence kept outside the repo:
 * screenshots, downloaded codes, decoded payloads, saved policy pages) or from that company's own pages, linked.
 * Re-test before changing the numbers; sites change often.
 */
export const GUIDES_RESEARCH: Guide[] = [
  // ── 1. 20 free generators tested ────────────────────────────────────
  {
    slug: "free-qr-code-generators-tested",
    title: "We tested 20 free QR code generators: which codes last?",
    h1: "We made a free QR code on 20 generators. Here's what you really get",
    description:
      "We made a QR code on 20 popular free generators with no account and decoded each one. Only 6 gave a direct code; 2 others stop after 7 days or 100 scans.",
    category: "Research",
    published: "2026-11-21",
    updated: "2026-11-23",
    readMinutes: 9,
    summary:
      "“Free QR code” can mean a code that works forever, a code that stops after a week, or a sign-up form. We tested 20 popular generators to see which is which, and read what each company says happens when a trial or plan ends.",
    body: [
      {
        type: "p",
        text: "On 21 November 2026 we made a QR code for a website link on 20 popular free QR code generators, without creating an account, and decoded every code to see what it really contains. **Only 6 gave a free code that points straight to the link**, so it keeps working whatever happens to the company. **3 gave a code that runs through the company's own short link**, and 2 of those come with a limit: 7 days, or 100 scans. **The other 11 asked for an account or an email address before the download.**",
      },
      {
        type: "table",
        head: ["At a glance (21 November 2026)", "Result"],
        rows: [
          ["Free generators tested", "20"],
          ["Gave a direct code with no account", "6 of 20"],
          ["Gave a code through their own short link", "3 of 20 (limits: 7 days, 100 scans, ads after 10 scans)"],
          ["Needed an account or email first", "11 of 20"],
          ["Dynamic-code services that say some codes stop, pause or change when a trial or plan ends", "10 of 17"],
        ],
      },
      { type: "h2", id: "key-findings", text: "Key findings" },
      {
        type: "ul",
        items: [
          "**6 of 20** gave a direct code with no account: QRCode Monkey, Scanova, goQR.me, Hovercode, The QR Code Generator (with a small watermark) and QRCodeChimp (through right-click “Save as”, which its FAQ describes; its download buttons ask you to sign up).",
          "**3 of 20** gave a code that runs through their own short link, with no account: QRStuff (works for 7 days), Unitag (stops after 100 scans) and ME-QR (visitors may see an ad after the first 10 scans).",
          "**11 of 20** needed an account or an email address before we could download anything.",
          "**10 of the 17** services that offer editable (dynamic) codes say on their own pages that some of those codes stop, pause or change, with ads or a scan cap, when a trial or plan ends.",
          "**Headlines and fine print don't always match.** Unitag's page header says “Lifetime validity”; its download box says “Your QR Code will be active for a maximum of 100 scans.”",
        ],
      },
      { type: "h2", id: "why-it-matters", text: "Why it matters: direct codes vs short links" },
      {
        type: "p",
        text: "A QR code can hold your link itself, or a short link that belongs to the company that made it. A code that holds your link is a **static** code: phones read the address straight from the pattern, so it works as long as your page exists. A code that holds the company's short link is a **dynamic** code: every scan goes through that company's server first, which is what lets you edit the destination and count scans. It also means the code stops working if the company switches the short link off, for example when a trial ends. Neither is wrong, but you need to know which one you printed. Our guide to [static vs dynamic QR codes](/guides/static-vs-dynamic-qr-codes) explains the difference in more detail.",
      },
      { type: "h2", id: "results", text: "What each generator gave us" },
      {
        type: "p",
        text: "Each generator was tested with its default settings and the URL https://example.com/study-[name]. “Direct” means the downloaded image decoded to exactly that URL.",
      },
      {
        type: "table",
        head: ["Generator", "Account or email needed?", "What the code contained"],
        rows: [
          ["QRCode Monkey", "No", "Direct"],
          ["Scanova", "No", "Direct (editing and tracking are off by default)"],
          ["goQR.me", "No", "Direct"],
          ["Hovercode", "No", "Direct (“Editable & trackable” is off by default)"],
          ["The QR Code Generator", "No", "Direct, with a small “TQRCG” watermark"],
          ["QRCodeChimp", "For its download buttons, yes; not for “Save as”", "Direct, saved with right-click “Save as”"],
          ["QRStuff", "No", "Short link (qrs.ly): the dynamic option is on by default and works for 7 days"],
          ["Unitag", "No", "Short link (opn.to), active for a maximum of 100 scans"],
          ["ME-QR", "No", "Short link (q.me-qr.com); ads may show after the first 10 scans"],
          ["QR Code Generator (QRCG)", "Yes, with its default “Scan tracking” on", "Not downloaded. With tracking switched off, the download needed no account and was direct"],
          ["QRFY", "Yes (Google or email)", "Not downloaded"],
          ["QR TIGER", "The Download button led to its pricing page in our test browser", "Not downloaded; the preview carried a “QR TIGER” watermark"],
          ["Uniqode", "Yes", "Not downloaded"],
          ["Flowcode", "Yes", "Not downloaded; its page says “All of the codes are dynamic”"],
          ["Bitly", "Yes", "Not downloaded"],
          ["Canva", "Yes", "Not downloaded"],
          ["Adobe Express", "Yes", "Not downloaded"],
          ["QR.io", "Yes", "Not downloaded"],
          ["Online QR Generator", "Yes", "Not downloaded"],
          ["Shopify QR code generator", "Yes: the code is sent by email", "Not tested (we didn't enter an email)"],
        ],
      },
      {
        type: "p",
        text: "Several sign-up sites show a code on the page before you register. We decoded those previews too, but a preview isn't proof of the file a registered user gets, so we don't count them as direct.",
      },
      { type: "h2", id: "short-link-codes", text: "The three free codes that run through a short link" },
      {
        type: "ul",
        items: [
          "**QRStuff** turns on its editable “dynamic” option by default. The notice next to the Download button says: “This is a dynamic code. It works for 7 days, or 30 days with a free account. Choose Static for a code that never expires.” To be fair, the warning is clear, and switching to Static gives a permanent code.",
          "**Unitag**'s free download box says: “Your QR Code will be active for a maximum of 100 scans.” Its [generator page](https://www.unitag.io/qrcode) adds that free codes “will stop working after being scanned a hundred times”, while the page header advertises “Lifetime validity”.",
          "**ME-QR** gave a short-link code with no time limit, but its [pricing page](https://me-qr.com/pricing) says free codes come “with ads”, and its homepage says: “The first 10 scans are ad-free. After that, visitors may see a short advertisement before accessing your content”.",
        ],
      },
      {
        type: "p",
        text: "All three short links redirected to our test pages when we checked them on the day. The limits are what decide how long they keep doing so.",
      },
      { type: "h2", id: "after-trial", text: "What happens to dynamic codes when a trial or plan ends?" },
      {
        type: "p",
        text: "For the 17 services that offer dynamic codes, we read their own pricing, FAQ and help pages. Here's what each says, in their words where possible.",
      },
      {
        type: "table",
        head: ["Service", "What its own pages say", "Source"],
        rows: [
          ["QR Code Generator (QRCG)", "After the 14-day trial, dynamic codes “point to a service page rather than the original destination”", "[Help centre](https://support.qr-code-generator.com/hc/en-us/articles/7665046137613-What-happens-to-my-account-and-QR-Codes-when-the-trial-expires)"],
          ["QRFY", "After the 7-day trial, dynamic codes “will simply stop redirecting to their destination”", "[Homepage FAQ](https://qrfy.com/)"],
          ["Uniqode", "After the 14-day trial, “your dynamic QR Codes become inactive unless you upgrade”", "[Pricing](https://www.uniqode.com/pricing)"],
          ["Scanova", "“Your Dynamic QR Code will stop working once the free trial ends”", "[Pricing](https://scanova.io/pricing/)"],
          ["QR TIGER", "For paid dynamic codes: “If your plan expires, it will stop working”", "[FAQ](https://www.qrcode-tiger.com/faq)"],
          ["QRStuff", "Dynamic codes work for 7 days, or 30 days with a free account; after that “you need a paid plan”", "[Homepage](https://www.qrstuff.com/)"],
          ["Unitag", "Free codes stop after 100 scans", "[Generator page](https://www.unitag.io/qrcode)"],
          ["QRCodeChimp", "If a paid plan lapses, “the dynamic codes other than the last 10 will be paused”", "[Pricing](https://www.qrcodechimp.com/pricing)"],
          ["Hovercode", "The first 3 codes never expire; extra codes “will expire if your subscription is cancelled”", "[Pricing](https://hovercode.com/pricing/)"],
          ["The QR Code Generator", "After the trial, “two dynamic QR Codes will remain active but they will display ads”", "[Pricing](https://www.the-qrcode-generator.com/pricing)"],
          ["Flowcode", "After downgrading to free, “your Flowcodes will continue to scan”", "[Help centre](https://support.flowcode.com/will-my-codes/pages-expire-go-to-flowcode)"],
          ["Bitly", "“Bitly QR Codes don't expire on their own”", "[QR codes page](https://bitly.com/pages/products/qr-codes)"],
          ["Canva", "Codes are “valid forever”, but may be deactivated if the content breaks Canva's guidelines", "[Generator page](https://www.canva.com/qr-code-generator/)"],
          ["ME-QR", "Codes stay valid after unsubscribing, but ads return without Premium", "[Pricing](https://me-qr.com/pricing)"],
          ["Shopify", "“Every QR code is assigned a Quick Link that stays active unless you delete it”", "[Generator page](https://www.shopify.com/tools/qr-code-generator)"],
          ["QR.io", "Only static codes are promised to keep working after the 7-day trial", "[FAQ](https://qr.io/faq)"],
          ["Online QR Generator", "After the trial, codes “won't go anywhere” but can't be accessed without a paid plan; it doesn't say whether they keep redirecting", "[FAQ](https://online-qr-generator.com/faq)"],
        ],
      },
      {
        type: "p",
        text: "QRCode Monkey and goQR.me only make static codes, so nothing on their side can switch them off. Adobe Express blocked our test browser, so we haven't included its policy.",
      },
      { type: "h2", id: "check-your-code", text: "How to check your own QR code in 30 seconds" },
      {
        type: "ol",
        items: [
          "Open your phone's camera and point it at the code, but don't tap the link yet.",
          "Read the address the phone shows. If it's your own website, the code is direct and nothing can switch it off.",
          "If it's a short address from another company, such as qrs.ly or opn.to, the code is dynamic. Log in to that service and check your plan, trial end date and scan limit.",
          "If you're about to print, read the company's cancellation policy first. It matters more than the monthly price.",
        ],
      },
      {
        type: "p",
        text: "Our guide [do QR codes expire?](/guides/do-qr-codes-expire) covers what to do if a printed code has already stopped working.",
      },
      { type: "h2", id: "method", text: "How we tested" },
      {
        type: "ul",
        items: [
          "**Date and setup:** 21 November 2026, one run per site, in a fresh desktop Chromium browser with no cookies and no login (Playwright 1.64.1).",
          "**Steps:** we opened each generator, left every setting at its default, entered https://example.com/study-[name], pressed download and followed the site's own dialog. We never entered an email address, never created an account and never tried to get around a sign-up wall.",
          "**Decoding:** every downloaded image was decoded with the open-source jsQR library, and every short link was checked once to see where it redirected.",
          "**Policies:** each company's own pricing, FAQ, help and terms pages were saved on the same day, and every quote above was checked word for word against the saved text or a screenshot.",
          "**Choice of sites:** 20 well-known generators that offer free QR codes. We didn't measure search rankings, and we left out our own product.",
        ],
      },
      {
        type: "p",
        text: "**Limits:** sites change, and some show different defaults to different visitors, so these results describe what we saw on the day. For sites that need an account, we can't say what a registered user's code contains. If you run one of these services and something has changed, email hello@endureqr.com and we'll re-test and update this page.",
      },
      { type: "h2", id: "who-we-are", text: "Who we are" },
      {
        type: "p",
        text: "EndureQR makes QR codes, so we have an interest in this topic. That's why we've published the method and kept every claim to what we tested or what each company's own pages say. Our [free generator](/qr-code-generator) makes direct, static codes with no account and [no watermark](/qr-code-generator-no-watermark). Our paid [dynamic codes](/dynamic-qr-code-generator) keep redirecting to their last destination even if you cancel.",
      },
      {
        type: "tip",
        text: "You're welcome to quote these results or reuse the data under CC BY 4.0: [download the full results as a CSV file](/research/free-qr-code-generators-2026-11-21.csv). Please link to this page as the source.",
      },
    ],
    faq: [
      {
        q: "Which free QR code generators make codes that never expire?",
        a: "In our test on 21 November 2026, QRCode Monkey, Scanova, goQR.me, Hovercode, The QR Code Generator and QRCodeChimp gave a direct code without an account. A direct code holds your link itself, so it works as long as your page exists. EndureQR's free generator makes direct codes too.",
      },
      {
        q: "Do free QR codes stop working?",
        a: "A free static code doesn't, because it holds your link directly. A free dynamic code can: in our test, QRStuff's default free code works for 7 days and Unitag's stops after 100 scans, and many services switch dynamic codes off when a trial ends.",
      },
      {
        q: "How can I tell if my QR code is dynamic?",
        a: "Scan it with your phone camera and read the address before opening it. If it shows another company's short link instead of your own website, the code is dynamic and depends on that company.",
      },
      {
        q: "Are dynamic QR codes bad?",
        a: "No. They let you change the destination after printing and count scans. Just check what the provider does when a trial or plan ends before you print, because that decides whether your printed codes keep working.",
      },
    ],
    relatedTools: ["url", "wifi", "vcard"],
    dataset: {
      name: "Free QR code generators tested: what the free code contains (November 2026)",
      description:
        "For 20 popular free QR code generators: whether a code could be downloaded without an account, whether the code held the destination URL directly or the vendor's own short link (decoded with jsQR), and what each vendor's own pages say happens to dynamic codes when a trial or plan ends, with sources. Tested 21 November 2026.",
      csv: "/research/free-qr-code-generators-2026-11-21.csv",
      keywords: ["QR code", "QR code generator", "dynamic QR code", "static QR code", "QR code expiry", "free trial"],
      license: "https://creativecommons.org/licenses/by/4.0/",
    },
  },
];
