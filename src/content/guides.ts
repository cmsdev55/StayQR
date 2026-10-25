/** Inline text supports **bold** and [link text](/path) only. */
export type GuideBlock =
  | { type: "p"; text: string }
  | { type: "h2"; id: string; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "tip"; text: string };

export type Guide = {
  slug: string;
  /** <title>, max 60 chars */
  title: string;
  /** H1 (can be longer/more natural than title) */
  h1: string;
  /** meta description 140–158 chars */
  description: string;
  category: "Basics" | "Printing" | "Design" | "Use cases";
  /** ISO date */
  published: "2026-10-26";
  updated: "2026-10-26";
  readMinutes: number;
  /** 1–2 sentence standfirst under the H1 */
  summary: string;
  body: GuideBlock[];
  faq: { q: string; a: string }[];
  /** 2–3 slugs of free tools from the list above, e.g. ["wifi"] */
  relatedTools: string[];
};

export const GUIDES: Guide[] = [
  // ── 1. Do QR codes expire? ──────────────────────────────────────────
  {
    slug: "do-qr-codes-expire",
    title: "Do QR codes expire? Why codes stop working",
    h1: "Do QR codes expire? What really makes a code stop working",
    description:
      "Static QR codes never expire. Dynamic codes can stop working when a trial, subscription or account ends. Learn how to check your codes and avoid dead ones.",
    category: "Basics",
    published: "2026-10-26",
    updated: "2026-10-26",
    readMinutes: 5,
    summary:
      "A QR code has no built-in expiry date. When a code stops working, the cause is almost always the service behind it, not the code itself.",
    body: [
      {
        type: "p",
        text: "No, a QR code itself never expires. A **static** QR code stores your link or text directly in the pattern, so it scans for as long as the print survives. A **dynamic** QR code is different: it points to a short link run by a service, and it stops working if that service switches the link off. When people say a QR code has expired, it is almost always a dynamic code whose trial, subscription or account has ended.",
      },
      { type: "h2", id: "how-qr-codes-store-information", text: "How a QR code stores information" },
      {
        type: "p",
        text: "A QR code is a grid of dark and light squares called modules. The pattern follows an international standard, ISO/IEC 18004, and any phone camera can decode it without an internet connection. The data sits inside the pattern itself. Nothing in the standard includes an expiry date, a licence check or a way to switch a code off.",
      },
      {
        type: "p",
        text: "What the code contains decides whether it can break. There are two kinds.",
      },
      {
        type: "ul",
        items: [
          "**Static codes** hold the final content: a full web address, a WiFi password, a phone number or plain text. Scan one and the phone acts on that content directly.",
          "**Dynamic codes** hold a short redirect link owned by a QR service. Scan one and the phone visits the service first, which then forwards it to the real destination.",
        ],
      },
      {
        type: "p",
        text: "A static code has no middleman, so there is nothing to switch off. A dynamic code depends on the service staying online and choosing to keep forwarding your scans.",
      },
      { type: "h2", id: "why-dynamic-codes-stop-working", text: "Why dynamic QR codes stop working" },
      {
        type: "p",
        text: "Dynamic codes are useful. You can change where they point after printing and see how often they are scanned. But the redirect lives on someone else's server, and that creates several ways for a printed code to go dead.",
      },
      {
        type: "ul",
        items: [
          "**The subscription ends.** Some services deactivate codes when a trial or subscription ends. The printed code still scans, but it lands on an error page, a sales page or an upgrade prompt.",
          "**A free trial runs out.** Some generators look free, but the codes they make are dynamic and only work during a trial period. Many people find this out weeks later, after the print run.",
          "**The account is closed.** If you or a former colleague deletes the account, the short links usually go with it.",
          "**The service shuts down.** If the company behind the short domain stops operating, every code using that domain stops forwarding.",
          "**A custom domain lapses.** If your dynamic codes use your own short domain and the registration is not renewed, scans stop resolving.",
          "**The destination breaks.** Even a static code fails in practice if it points to a web page that has been moved or deleted. The code works. The page does not.",
        ],
      },
      {
        type: "p",
        text: "In each case the ink on the poster is fine. The problem is the link behind it.",
      },
      { type: "h2", id: "how-to-check-a-qr-code", text: "How to check if a QR code will stop working" },
      {
        type: "p",
        text: "You can usually tell what kind of code you have in under a minute.",
      },
      {
        type: "ol",
        items: [
          "Scan the code with your phone camera and read the preview before you tap. If it shows your own website address, the code is probably static.",
          "If the preview shows a short link on a domain you do not recognise, the code is dynamic and depends on that service.",
          "Log in to the service that made it and check your plan. Look for words like trial, renewal date or code limit.",
          "Read the provider's terms for what happens to codes when you cancel or stop paying. If the terms do not say, ask before you print in volume.",
          "Scan a sample of your printed codes every few months, especially ones on long-lived materials like signs, packaging and menus.",
        ],
      },
      {
        type: "tip",
        text: "If a code has already stopped working and you cannot revive it, the quickest fix is a sticker. Print a new code at the same size or larger and place it squarely over the old one, so phones only see one code.",
      },
      { type: "h2", id: "how-to-avoid-expiring-codes", text: "How to avoid QR codes that stop working" },
      {
        type: "p",
        text: "Match the type of code to how long the print needs to last and whether the destination will change.",
      },
      {
        type: "ul",
        items: [
          "**Use a static code when the content will not change.** A home [WiFi network](/qr-code-generator/wifi), a contact card or the address of your main website are good candidates. Our [free QR code generator](/qr-code-generator) makes static codes with no sign-up and no watermark, and they never expire.",
          "**Use a dynamic code when the destination will change.** Menus, event pages and property listings change often. A dynamic code lets you update the link without reprinting.",
          "**Check the cancellation policy before you print.** This matters more than the monthly price. A cheap plan that switches off your codes when you cancel can cost you a full reprint.",
          "**Point static codes at pages you control.** Link to a stable page on your own domain, and set up a redirect yourself if the content moves.",
          "**Keep a record of every code you print.** Note where it is, what it points to and which account owns it, so a staff change does not leave it stranded.",
        ],
      },
      { type: "h2", id: "what-happens-to-stayqr-codes", text: "What happens to StayQR codes if you cancel" },
      {
        type: "p",
        text: "StayQR was built around this problem. Free codes from the generator are static and never expire. Paid dynamic codes add the things people choose dynamic codes for: editing the destination after printing, scan analytics by city, device and time of day, smart redirects for iPhone and Android, and the option to pause a code with a friendly page.",
      },
      {
        type: "p",
        text: "If you cancel a paid plan, your dynamic codes keep working. Scans continue to reach the last destination you set. Editing and new analytics pause until you resume a plan, but nobody holding your menu or flyer hits a dead end. Pro costs $29 a year or $3.99 a month, and Lifetime is $79 once. See [pricing](/pricing) for the details.",
      },
    ],
    faq: [
      {
        q: "Do free QR codes expire?",
        a: "It depends on the generator. A true static code never expires. Some free tools make dynamic codes that stop working when a trial ends. Codes from the StayQR free generator are static, so they keep working.",
      },
      {
        q: "Can I fix a QR code that has stopped working?",
        a: "If it is a dynamic code and you still have the account, renewing the plan often restores it. If not, you need a new code. A sticker over the old one is the fastest fix for printed material.",
      },
      {
        q: "Does a QR code stop working after a certain number of scans?",
        a: "A static code has no scan limit, because nothing counts the scans. Dynamic codes can have limits depending on the provider and plan, so check before you print.",
      },
      {
        q: "Will my StayQR dynamic codes stop working if I cancel?",
        a: "No. They keep redirecting to the last destination you set. You can no longer edit the destination or see new analytics until you resume a plan.",
      },
    ],
    relatedTools: ["url", "wifi", "vcard"],
  },

  // ── 2. Static vs dynamic ────────────────────────────────────────────
  {
    slug: "static-vs-dynamic-qr-codes",
    title: "Static vs dynamic QR codes: differences and uses",
    h1: "Static vs dynamic QR codes: which one should you use?",
    description:
      "Static QR codes are free and never expire but cannot change. Dynamic codes can be edited and tracked. Compare both side by side and pick the right one.",
    category: "Basics",
    published: "2026-10-26",
    updated: "2026-10-26",
    readMinutes: 6,
    summary:
      "Static codes are fixed and free. Dynamic codes can be edited and measured. Here is how they differ and when each one makes sense.",
    body: [
      {
        type: "p",
        text: "A **static** QR code stores its content, such as a web address or WiFi password, directly in the pattern. It is free, works without a service behind it and never expires, but it cannot be changed after printing. A **dynamic** QR code stores a short redirect link, so you can change the destination at any time and track scans, but it relies on a provider to keep the redirect running. Use static for content that will not change and dynamic for anything you may need to update.",
      },
      { type: "h2", id: "what-is-a-static-qr-code", text: "What is a static QR code?" },
      {
        type: "p",
        text: "A static code is the original kind of QR code. The content is encoded straight into the pattern of modules, following the ISO/IEC 18004 standard. When a phone scans it, the phone reads the content and acts on it. Nothing else is involved.",
      },
      {
        type: "p",
        text: "That simplicity has real benefits. A static code cannot be switched off by anyone, has no scan limits and costs nothing to make. It can also hold more than web links: plain text, WiFi login details, contact cards, email drafts, text messages, phone numbers and map locations all work.",
      },
      {
        type: "p",
        text: "The trade-off is that the content is permanent. If the web address changes, the code is wrong forever. Long content also makes the pattern denser. QR codes come in versions 1 to 40, from 21 by 21 modules up to 177 by 177. More characters push the code to a higher version with smaller modules, which needs a larger print size to scan reliably.",
      },
      { type: "h2", id: "what-is-a-dynamic-qr-code", text: "What is a dynamic QR code?" },
      {
        type: "p",
        text: "A dynamic code encodes a short link owned by a QR service. When someone scans it, the phone opens that short link, and the service forwards the visitor to whatever destination you have set. Because the destination is stored on the service and not in the pattern, you can change it whenever you like.",
      },
      {
        type: "p",
        text: "Sitting in the middle also lets the service do more. Typical features include scan counts, rough location and device data, sending iPhone and Android users to different app stores, and pausing a code. The short link keeps the pattern simple, so dynamic codes stay easy to scan even when the final destination is a very long address.",
      },
      {
        type: "p",
        text: "The cost is dependence. The code only works while the provider keeps the redirect live, and some services deactivate codes when a trial or subscription ends.",
      },
      { type: "h2", id: "comparison-table", text: "Static vs dynamic at a glance" },
      {
        type: "table",
        head: ["", "Static QR code", "Dynamic QR code"],
        rows: [
          ["What the code holds", "The final content itself", "A short redirect link"],
          ["Change destination after printing", "No", "Yes"],
          ["Scan analytics", "No", "Yes, detail varies by provider"],
          ["Works if the provider disappears", "Yes", "No"],
          ["Expires", "Never", "Only if the provider switches it off"],
          ["Pattern density", "Grows with content length", "Stays low, because the link is short"],
          ["Content types", "URL, text, WiFi, contact card, email, SMS and more", "Mainly web links"],
          ["Internet needed to scan", "Only if the content is a web link", "Yes, for the redirect"],
          ["Typical cost", "Free", "Paid plan"],
        ],
      },
      {
        type: "p",
        text: "Two rows in that table matter most in practice. The first is changing the destination after printing. If there is any chance the link will move, a static code becomes a reprint. The second is dependence on the provider. A static code is yours outright. A dynamic code is only as durable as the provider's policy on cancelled accounts, which is why that policy deserves more attention than the feature list.",
      },
      { type: "h2", id: "when-to-use-static", text: "When a static code is the right choice" },
      {
        type: "p",
        text: "Choose static whenever the content is stable and you do not need numbers on who scans.",
      },
      {
        type: "ul",
        items: [
          "**WiFi access.** Network details have to be in the pattern for the phone to join, so WiFi codes are always static. Make one with the [WiFi QR code generator](/qr-code-generator/wifi).",
          "**Business cards.** A [vCard QR code](/qr-code-generator/vcard) saves your name, number and email straight into the scanner's contacts.",
          "**Permanent pages.** Your homepage, a support page or a review page that will not move.",
          "**Plain information.** Serial numbers, short instructions or labels that do not need a website at all.",
        ],
      },
      { type: "h2", id: "when-to-use-dynamic", text: "When a dynamic code is worth paying for" },
      {
        type: "p",
        text: "Choose dynamic when the print will outlive the destination, or when you want to know whether the code is being used.",
      },
      {
        type: "ul",
        items: [
          "**Menus.** Prices and dishes change, and a dynamic code on every table means one print for all of them. See how this works for [restaurants](/industries/restaurants).",
          "**Property signs.** Point the same sign at a new listing when the last one sells.",
          "**Events.** Send early scans to the ticket page, then switch to the schedule on the day.",
          "**Packaging and long print runs.** Anything expensive to reprint benefits from a destination you can change.",
          "**Campaigns you want to measure.** Scan analytics show where and when people engage.",
        ],
      },
      {
        type: "p",
        text: "Many businesses use both. A café might print a static WiFi code next to a dynamic menu code: the WiFi details rarely change, but the menu does.",
      },
      {
        type: "tip",
        text: "Reprinting signs or packaging is often the most expensive part of a QR project. Decide between static and dynamic before you send anything to print, not after.",
      },
      { type: "h2", id: "choosing-a-dynamic-provider", text: "What to check before choosing a dynamic provider" },
      {
        type: "p",
        text: "Dynamic codes from different services look the same on paper. The differences are in the terms.",
      },
      {
        type: "ol",
        items: [
          "What happens to your codes if you cancel or stop paying.",
          "Whether there are limits on codes, edits or scans.",
          "What the analytics show, and whether you can see them per code.",
          "Whether you can pause a code without deleting it.",
          "The full yearly price, not only the first month.",
        ],
      },
      {
        type: "p",
        text: "StayQR's free generator makes static codes with no sign-up and no watermark. Paid dynamic codes add editing after printing, scan analytics by city, device and time of day, iPhone and Android smart redirects, and pausing with a friendly page. Pro is $29 a year or $3.99 a month, Lifetime is $79 once, and your codes keep working even if you cancel. Compare plans on the [pricing page](/pricing).",
      },
    ],
    faq: [
      {
        q: "Can I turn a static QR code into a dynamic one?",
        a: "No. The content of a static code is fixed in the printed pattern. To get editing and analytics, create a new dynamic code and replace the old one on your materials.",
      },
      {
        q: "Do dynamic QR codes scan more slowly?",
        a: "The phone has to open the short link before reaching the destination, which adds a brief redirect. In normal use most people will not notice it.",
      },
      {
        q: "Are static QR codes less secure than dynamic ones?",
        a: "Neither type is secure or insecure by itself. A static code shows exactly what it contains. A dynamic code is only as trustworthy as the account that controls it, so protect that login.",
      },
      {
        q: "Is a dynamic code worth it for a single flyer?",
        a: "Often not. If the link will not change and you do not need scan data, a free static code is enough.",
      },
    ],
    relatedTools: ["url", "vcard", "wifi"],
  },

  // ── 3. Size for printing ────────────────────────────────────────────
  {
    slug: "qr-code-size-for-printing",
    title: "QR code size for printing: minimum size and DPI",
    h1: "QR code size for printing: minimum sizes, distance and resolution",
    description:
      "The minimum printed QR code size is about 2 cm (0.8 in). Use the 10:1 distance rule, the right DPI and vector files so your code scans every time.",
    category: "Printing",
    published: "2026-10-26",
    updated: "2026-10-26",
    readMinutes: 6,
    summary:
      "How big a QR code needs to be depends on how far away people stand and how much data it holds. Here are the numbers, plus the file and print settings that matter.",
    body: [
      {
        type: "p",
        text: "The minimum practical size for a printed QR code is about **2 x 2 cm (0.8 x 0.8 in)**, for something scanned from close up, like a business card. For anything scanned from further away, use the **10:1 rule**: the code should be at least one tenth as wide as the scanning distance. A poster read from 2 metres needs a code about 20 cm wide.",
      },
      { type: "h2", id: "the-10-to-1-rule", text: "The 10:1 rule for scan distance" },
      {
        type: "p",
        text: "Phone cameras need each module of the code to cover enough pixels to tell dark from light. The further away the phone, the bigger the modules need to be. A widely used rule of thumb is a ratio of about 10 to 1 between distance and code width. Use the table below as a starting point.",
      },
      {
        type: "table",
        head: ["Scan distance", "Minimum code width", "Typical use"],
        rows: [
          ["20 cm (8 in)", "2 cm (0.8 in)", "Business cards, product labels"],
          ["30 cm (12 in)", "3 cm (1.2 in)", "Flyers, brochures, packaging"],
          ["50 cm (20 in)", "5 cm (2 in)", "Table tents, menus, counter cards"],
          ["1 m (3.3 ft)", "10 cm (4 in)", "Posters at eye level, shop windows"],
          ["2 m (6.6 ft)", "20 cm (8 in)", "Large posters, trade show stands"],
          ["5 m (16 ft)", "50 cm (20 in)", "Banners, signs seen from a path"],
          ["10 m (33 ft)", "1 m (3.3 ft)", "Billboards, building signage"],
        ],
      },
      {
        type: "p",
        text: "Treat these as minimums. Go bigger when the lighting is poor, when people will scan at an angle, or when the code holds a lot of data. The width here is the code itself, not including the margin around it.",
      },
      {
        type: "p",
        text: "Base the distance on where people will really stand, not where you hope they will. A poster across a train platform is read from further away than one beside a ticket machine, even if both are the same size.",
      },
      { type: "h2", id: "content-length-and-density", text: "Why content length changes the size you need" },
      {
        type: "p",
        text: "QR codes come in 40 versions. Version 1 is a grid of 21 by 21 modules, and each version adds 4 modules per side, up to 177 by 177 for version 40. The more characters you encode, the higher the version and the smaller each module becomes at the same print size.",
      },
      {
        type: "ul",
        items: [
          "**Long web addresses make dense codes.** A link with tracking parameters can double the module count compared with a short one.",
          "**Error correction adds modules.** Levels L, M, Q and H can recover roughly 7%, 15%, 25% and 30% of damaged data. Higher levels are more robust but make the pattern denser.",
          "**Short links keep codes simple.** A dynamic code encodes a short redirect link, so the pattern stays light even when the destination is long. This is one reason dynamic codes on [paid plans](/pricing) often scan better at small sizes.",
        ],
      },
      {
        type: "p",
        text: "If a code has to be small, shorten the content first. Use a clean URL without tracking parameters, or move text onto a web page and link to it.",
      },
      { type: "h2", id: "quiet-zone", text: "Leave a quiet zone around the code" },
      {
        type: "p",
        text: "The standard calls for a **quiet zone** of 4 modules on every side: a plain, light margin with no text, lines or images. Scanners use it to find where the code starts. On a 2 cm code with 25 modules per side, each module is 0.8 mm, so the quiet zone should be about 3.2 mm.",
      },
      {
        type: "p",
        text: "Designers often trim this margin to fit a layout. It is one of the most common reasons a well-sized code fails to scan. Keep borders, crop marks and frame edges outside it. If the code sits inside a coloured design, the quiet zone must still be light. A white box behind the code is the simplest way to guarantee it.",
      },
      { type: "h2", id: "resolution-and-file-formats", text: "Resolution, DPI and file formats" },
      {
        type: "p",
        text: "Blurry edges confuse scanners just as much as a code that is too small. The file you send to print matters.",
      },
      {
        type: "ul",
        items: [
          "**SVG and PDF are best for print.** They are vector formats, so they stay perfectly sharp at any size, from a sticker to a banner. Most print shops prefer them.",
          "**PNG is the best raster option.** It keeps hard edges with no compression blur. Export at **300 DPI at the final print size**: multiply the width in inches by 300. A 2 inch code needs at least 600 by 600 pixels.",
          "**JPEG works, but check it.** JPEG compression can soften edges and add faint noise around modules. Use a high quality setting and inspect a test print.",
          "**Never stretch a small image.** Enlarging a low resolution PNG makes fuzzy modules. Download again at the right size or use a vector file.",
        ],
      },
      {
        type: "p",
        text: "Colour changes at print time too. Printers convert screen colours to ink, and a dark brand colour on screen can come out lighter on uncoated paper. Dark modules on a white or very light background give you the most room for error.",
      },
      {
        type: "p",
        text: "The [StayQR free generator](/qr-code-generator) downloads PNG, SVG, JPEG and PDF with no watermark, so you can hand your printer a vector file straight away. For a web link, start with the [URL QR code generator](/qr-code-generator/url).",
      },
      { type: "h2", id: "printing-checklist", text: "A quick checklist before you print" },
      {
        type: "ol",
        items: [
          "Size the code with the 10:1 rule for the real scanning distance.",
          "Keep the content short so the pattern stays simple.",
          "Use dark modules on a light background with strong contrast.",
          "Keep a quiet zone of at least 4 modules on every side.",
          "Send a vector file, or a PNG at 300 DPI at final size.",
          "Avoid folds, seams and tight curves. On bottles and cans, keep the code small relative to the curve so it stays close to flat.",
          "Choose a matte finish where you can. Gloss and lamination can throw glare into the camera.",
          "Print a proof and scan it with more than one iPhone and Android phone.",
        ],
      },
      {
        type: "tip",
        text: "Print one proof at the final size and tape it where it will actually go. Scan it from the spot where people will stand, in the real lighting. This catches most problems before the full run.",
      },
    ],
    faq: [
      {
        q: "What is the smallest QR code that will scan?",
        a: "Around 2 cm (0.8 in) wide is a practical minimum for short content scanned up close. Smaller codes can work with very short data and sharp printing, but test them carefully.",
      },
      {
        q: "How big should a QR code be on a business card?",
        a: "About 2 to 2.5 cm (0.8 to 1 in) wide, with a clear margin around it. Keep the content short, such as a simple link or a compact contact card.",
      },
      {
        q: "Does a bigger QR code always scan better?",
        a: "Up to a point. Very large codes viewed from very close can be hard to fit in the camera frame. Size the code for where people will actually stand.",
      },
      {
        q: "What DPI should a QR code be for print?",
        a: "300 DPI at the final printed size for raster files like PNG. A vector SVG or PDF avoids the question entirely, because it scales without losing sharpness.",
      },
    ],
    relatedTools: ["url", "vcard", "text"],
  },

  // ── 4. Restaurant menu ──────────────────────────────────────────────
  {
    slug: "qr-code-for-restaurant-menu",
    title: "How to make a QR code menu for your restaurant",
    h1: "How to make a QR code for a restaurant menu",
    description:
      "Put your menu online, link it to a QR code, and print it on table tents at 5 cm or larger. Steps, placement tips and why dynamic codes suit changing menus.",
    category: "Use cases",
    published: "2026-10-26",
    updated: "2026-10-26",
    readMinutes: 6,
    summary:
      "A menu QR code takes a few minutes to set up. Getting the page, the placement and the printed fallback right is what makes guests actually use it.",
    body: [
      {
        type: "p",
        text: "To make a QR code for a restaurant menu, put your menu online as a web page or PDF, paste its link into a QR code generator, download the code in a print-ready format, and print it on table tents or menus at about **5 cm (2 in) wide or larger**. If your menu changes, use a dynamic code so you can update the link without reprinting. Always keep printed menus for guests who prefer them.",
      },
      { type: "h2", id: "step-by-step", text: "How to make a menu QR code, step by step" },
      {
        type: "ol",
        items: [
          "**Put the menu online.** A page on your website or ordering system works best. A PDF is fine, but host it somewhere you control and keep the file name stable.",
          "**Decide static or dynamic.** A static code is free and points at one fixed link. A dynamic code lets you change that link later and see when tables scan. More on this below.",
          "**Create the code.** Paste your menu link into the [URL QR code generator](/qr-code-generator/url). Add your logo, set your brand colours and choose a frame with a short call to action like \"Scan for menu\".",
          "**Download a print file.** Send your printer an SVG or PDF. For printing in house, use a high resolution PNG.",
          "**Test before you print in bulk.** Print one table tent, put it on a table and scan it from a seat with a few different phones.",
          "**Place and maintain.** Put codes where guests sit, and check them every few weeks for damage, stains and peeling.",
        ],
      },
      {
        type: "p",
        text: "If you choose a static code, link to a page whose address will never change, such as a /menu page on your own website, and update the content on that page instead of changing the link. This gives you some of the flexibility of a dynamic code, as long as the page stays in place.",
      },
      { type: "h2", id: "why-dynamic-suits-menus", text: "Why a dynamic code suits a changing menu" },
      {
        type: "p",
        text: "Menus are one of the clearest cases for a dynamic code. Prices move, dishes rotate with the seasons, and many places run separate lunch, dinner and brunch menus. With a static code, every change of address means new table tents. A common trap is uploading a new PDF with a new file name, which quietly breaks every static code pointing at the old one.",
      },
      {
        type: "p",
        text: "With a dynamic code you print once and change the destination whenever you like. You could point it at brunch on Sunday morning and dinner in the evening. Scan analytics show the time of day guests scan and which devices they use, which helps when you decide how much effort to put into the mobile menu. If you close for the season, you can pause the code so guests see a friendly page instead of an outdated menu.",
      },
      {
        type: "p",
        text: "StayQR dynamic codes cost $29 a year or $3.99 a month on Pro, or $79 once on Lifetime, and they keep working even if you cancel. See [pricing](/pricing), or read more about [QR codes for restaurants](/industries/restaurants).",
      },
      { type: "h2", id: "table-tent-tips", text: "Table tent and placement tips" },
      {
        type: "ul",
        items: [
          "**Size for the table.** Guests scan from roughly 30 to 50 cm away, so a code 5 cm wide or larger is a safe choice.",
          "**Say what the code does.** A frame with \"Scan for menu\" or \"Scan to order\" removes doubt. A bare code gets fewer scans because people are not sure what it is.",
          "**Print a short link as text.** Put a short web address under the code for guests whose camera will not cooperate.",
          "**Fight glare.** Overhead lights reflect off glossy laminate. A matte finish or a slightly angled tent keeps the code readable.",
          "**Keep it wipeable.** Codes on tables get splashed and cleaned constantly. Lamination or a hard acrylic holder protects the print.",
          "**One code per surface.** If a tent also carries a WiFi code, label both clearly so guests scan the right one.",
          "**Mind the light.** Candlelit and dim rooms make scanning harder. Go larger, and use very dark modules on a white background.",
          "**Use the front window.** A code in the window lets passers-by read the menu before they come in. Size it for the distance from the pavement, roughly one tenth of how far away people stand.",
        ],
      },
      {
        type: "tip",
        text: "Put the code on the side of the table tent that faces the seat, at the height of a phone held at the table. Codes facing the aisle or pressed flat under a glass top are harder to scan.",
      },
      { type: "h2", id: "make-the-menu-page-work", text: "Make the menu page easy to read on a phone" },
      {
        type: "p",
        text: "The code only gets guests to the page. The page decides whether they enjoy using it.",
      },
      {
        type: "ul",
        items: [
          "Make it load quickly on mobile data. Large photos and heavy PDFs slow everything down.",
          "Use large, readable text. A PDF designed for an A4 page often needs pinching and zooming on a phone.",
          "Show prices and allergen information clearly.",
          "Do not ask guests to download an app or sign up to see the menu.",
          "Offer other languages if many of your guests need them.",
          "Keep the menu current. An online menu that lists sold-out dishes frustrates guests more than a paper one.",
        ],
      },
      {
        type: "p",
        text: "Test the page on an older phone over mobile data, not only on your own WiFi. That is how many guests will see it.",
      },
      { type: "h2", id: "keep-printed-menus-available", text: "Accessibility: keep printed menus available" },
      {
        type: "p",
        text: "A QR menu should be an option, not the only way to order. Some guests do not carry a smartphone, have a flat battery or no mobile data, or find small screens hard to read. Others simply prefer paper. Keep a stock of printed menus, including a large print version if you can, and make sure staff offer one without making anyone feel awkward. Staff should also be ready to read out the specials and answer questions about ingredients, just as they would with a printed menu.",
      },
      {
        type: "p",
        text: "Guest WiFi helps too. A [WiFi QR code](/qr-code-generator/wifi) lets guests without mobile data join your network and then open the menu. Keep it on a guest network, separate from your till and back office.",
      },
    ],
    faq: [
      {
        q: "Can I use a PDF for my QR code menu?",
        a: "Yes. Host the PDF somewhere you control and keep its address the same when you update it, or use a dynamic code so you can point it at a new file. A mobile-friendly web page is usually easier for guests to read.",
      },
      {
        q: "Do guests need an app to scan a menu QR code?",
        a: "No. The built-in camera on most modern iPhones and Android phones reads QR codes and opens the link directly.",
      },
      {
        q: "How do I update my menu without reprinting the codes?",
        a: "Use a dynamic QR code. You change the destination in your account and every printed code sends guests to the new menu straight away.",
      },
      {
        q: "Should each table have its own QR code?",
        a: "It is not required. One code for all tables is simplest. Separate codes only make sense if the destination differs by table, such as an ordering page that needs a table number.",
      },
    ],
    relatedTools: ["url", "wifi"],
  },

  // ── 5. WiFi QR code ─────────────────────────────────────────────────
  {
    slug: "wifi-qr-code",
    title: "How to make a WiFi QR code (free, no app needed)",
    h1: "How to make a WiFi QR code guests can scan to connect",
    description:
      "Make a WiFi QR code by entering your network name, password and security type. Learn the WIFI: format, hidden networks and safe guest network setup.",
    category: "Use cases",
    published: "2026-10-26",
    updated: "2026-10-26",
    readMinutes: 6,
    summary:
      "A WiFi QR code lets guests join your network without typing a password. Here is how it works, which settings to choose and how to share it safely.",
    body: [
      {
        type: "p",
        text: "To make a WiFi QR code, enter your network name (SSID), password and security type into a WiFi QR code generator, then download and print the code. The code stores those details in a standard text format, **WIFI:T:WPA;S:NetworkName;P:password;;**, and recent iPhone and Android cameras offer to join the network when they scan it. Nobody has to type the password.",
      },
      { type: "h2", id: "how-wifi-qr-codes-work", text: "How a WiFi QR code works" },
      {
        type: "p",
        text: "A WiFi code is plain text in a format phones recognise. It starts with WIFI: and lists each setting as a letter, a colon and a value, with a semicolon after each one and a double semicolon at the end.",
      },
      {
        type: "ul",
        items: [
          "**T** is the security type: WPA, WEP or nopass.",
          "**S** is the network name, exactly as it appears in the WiFi list, including capitals and spaces.",
          "**P** is the password. Leave it out for an open network.",
          "**H** is optional. Set it to true for a hidden network.",
        ],
      },
      {
        type: "p",
        text: "A full example for a café looks like this: WIFI:T:WPA;S:Corner Cafe Guest;P:flatwhite42;;",
      },
      {
        type: "p",
        text: "If your network name or password contains a backslash, semicolon, comma, colon or double quote, each one must be escaped with a backslash in front of it. A good generator does this for you. If you build the text by hand, a missing backslash is the most common reason a code scans but fails to connect.",
      },
      {
        type: "p",
        text: "WiFi codes are always **static**. The phone needs the real password to join, so the details live in the pattern itself and the code works without any internet connection. It also means a WiFi code never expires, and there is no reason to pay for one. You can make it with the free [WiFi QR code generator](/qr-code-generator/wifi), with no sign-up and no watermark.",
      },
      { type: "h2", id: "choosing-a-security-type", text: "Choosing the right security type" },
      {
        type: "p",
        text: "The security type in the code must match your router, or the phone will fail to join. You can find it in your router's admin page or on the label of many routers.",
      },
      {
        type: "ul",
        items: [
          "**WPA** covers WPA and WPA2 personal networks with a single shared password. This is the right choice for most homes, cafés and small offices.",
          "**WPA3.** Support for joining WPA3-only networks from a code varies between phones. Many routers offer a mixed WPA2/WPA3 mode, which tends to work well with a WPA code. Test with several phones.",
          "**WEP** is an old standard that is easy to break. If your router still uses it, switch to WPA2 or newer before you share the network.",
          "**nopass** is for open networks with no password at all.",
        ],
      },
      {
        type: "p",
        text: "Networks that ask each person for their own username and password, common in larger offices and universities, are not a good fit for this format.",
      },
      { type: "h2", id: "hidden-networks", text: "Hidden networks" },
      {
        type: "p",
        text: "A hidden network does not broadcast its name, so phones will not see it in the list. The format supports this with H:true, which tells the phone to look for the network even though it is not advertised. The [StayQR WiFi generator](/qr-code-generator/wifi) has a hidden-network switch that adds it for you. Phones still handle hidden networks with varying success, so test on the devices your guests use.",
      },
      {
        type: "p",
        text: "Hiding a network adds very little security, because the name is still visible to anyone with the right tools. For a guest network, the simplest and most reliable choice is to broadcast the name and protect it with a strong password.",
      },
      { type: "h2", id: "use-a-guest-network", text: "Use a separate guest network" },
      {
        type: "p",
        text: "A WiFi code puts your password in front of everyone who can see it. Anyone can photograph it, and some phones let a connected user share the network on. Plan for that.",
      },
      {
        type: "ul",
        items: [
          "**Create a guest network.** Most modern routers can run one alongside your main network. Share only the guest details.",
          "**Keep it separate.** Turn on client or guest isolation if your router has it, so guest devices cannot see your computers, printers or payment systems.",
          "**Use a strong password anyway.** Long and random is fine, because nobody needs to type it.",
          "**Change it from time to time.** Changing the password means printing a new code, so pick a schedule you will keep, such as every few months or after a busy season.",
          "**Never print your main network.** Keep the code for your private network off walls, menus and listings.",
        ],
      },
      {
        type: "tip",
        text: "When you change the guest password, make and print the new code first. Then change the router setting and swap the cards straight away, so guests are never stuck between the old code and the new password.",
      },
      { type: "h2", id: "printing-for-cafes-and-rentals", text: "Printing WiFi codes for cafés, rentals and offices" },
      {
        type: "ul",
        items: [
          "**Add a clear label.** A frame with \"Scan to join WiFi\" tells people what the code does before they scan.",
          "**Print the details as text too.** Show the network name and password under the code for laptops and older phones that cannot scan.",
          "**Pick a sensible size.** A card on a counter or table needs a code about 3 to 5 cm wide. A sign on the wall needs more, roughly one tenth of the distance people stand from it.",
          "**Put it where people need it.** In a café, the counter, the menu or the table. In a holiday rental, the welcome book, near the router or by the front door. In an office, the reception desk and meeting rooms.",
          "**Protect the print.** Laminate cards that get handled, and choose a matte finish to avoid glare.",
          "**Match your brand.** Add your logo and colours, keeping dark modules on a light background so it still scans easily.",
        ],
      },
      {
        type: "p",
        text: "If you run a café or restaurant, the WiFi card often sits next to a menu code. See how other businesses use QR codes on our page for [restaurants](/industries/restaurants), or browse all free code types in the [QR code generator](/qr-code-generator).",
      },
    ],
    faq: [
      {
        q: "Do I need an app to scan a WiFi QR code?",
        a: "Usually not. Recent iPhones and most recent Android phones can read WiFi codes with the built-in camera or from the WiFi settings screen. Older phones may need a scanner app.",
      },
      {
        q: "Will the WiFi QR code still work if I change my password?",
        a: "No. The password is stored inside the code, so a new password needs a new code. Print the new one before you change the router setting.",
      },
      {
        q: "Is it safe to share WiFi with a QR code?",
        a: "It is as safe as sharing the password itself. Use a separate guest network with device isolation, and never print the details of your main network.",
      },
      {
        q: "Can a WiFi QR code work for a laptop?",
        a: "Most laptops cannot scan codes directly, so print the network name and password in text next to the code for laptop users.",
      },
    ],
    relatedTools: ["wifi", "url", "text"],
  },

  // ── 6. Design best practices ────────────────────────────────────────
  {
    slug: "qr-code-design-best-practices",
    title: "QR code design best practices: logos, colours, frames",
    h1: "QR code design best practices: custom codes that still scan",
    description:
      "Design a custom QR code with a logo that still scans: strong contrast, a light background, a logo under 25% of the area, clear frames and real phone tests.",
    category: "Design",
    published: "2026-10-26",
    updated: "2026-10-26",
    readMinutes: 6,
    summary:
      "A branded QR code can look good and scan first time. The trick is knowing which design choices are safe and which ones quietly break the code.",
    body: [
      {
        type: "p",
        text: "A custom QR code scans reliably when it has **strong contrast**, uses **dark modules on a light background**, keeps a **clear margin** around the edge, and limits any logo to roughly **20 to 25% of the code's area** with high error correction. Add a frame with a short call to action, then test on several phones before you print.",
      },
      { type: "h2", id: "contrast-and-colour", text: "Contrast and colour" },
      {
        type: "p",
        text: "Scanners convert the image to light and dark. They care about brightness, not hue. A deep navy, forest green or wine red on white scans as well as black on white. A pale yellow or light grey does not, however good it looks.",
      },
      {
        type: "ul",
        items: [
          "**Keep the modules dark and the background light.** Light modules on a dark background, often called an inverted code, fail on some older phones and scanner apps.",
          "**Aim for strong contrast.** If you squint and the code starts to blend into the background, it is too faint.",
          "**Use a plain background.** White or a very light tint works best. Avoid placing the code directly over a photo, pattern or texture.",
          "**Be careful with gradients.** A gradient from dark to mid tone can leave part of the code too light. Check the lightest point, not the average.",
          "**Watch the finder patterns.** The three large squares in the corners must be as dark and clear as the rest of the code.",
        ],
      },
      {
        type: "p",
        text: "Your brand colour does not have to disappear. Use it for the frame, the call to action and the logo, and keep the modules a darker shade. The code still reads as yours.",
      },
      { type: "h2", id: "adding-a-logo", text: "Adding a logo without breaking the code" },
      {
        type: "p",
        text: "A logo in the centre covers modules, so part of the data is missing. Error correction is what lets the code survive this. QR codes have four levels, L, M, Q and H, which can recover roughly 7%, 15%, 25% and 30% of the data.",
      },
      {
        type: "p",
        text: "That recovery budget also has to cover scratches, dirt, glare and print defects. So do not spend all of it on the logo. Keep the logo to around 20 to 25% of the code's area at most, and smaller is safer. Use a high error correction level when you add one. The [StayQR generator](/qr-code-generator/url) switches to level H automatically as soon as you upload a logo.",
      },
      {
        type: "ul",
        items: [
          "Place the logo in the centre, never over the three corner finder patterns.",
          "Give the logo a small light border so its edge does not merge with nearby modules.",
          "Use a simple mark or icon. A full wordmark becomes unreadable at the size a code allows.",
          "Keep the content short. A denser code has smaller modules, so the same logo hides more of them.",
        ],
      },
      {
        type: "p",
        text: "The [free StayQR generator](/qr-code-generator) lets you upload a logo, pick colours and add a frame, then download PNG, SVG, JPEG or PDF with no watermark.",
      },
      { type: "h2", id: "dot-and-corner-styles", text: "Dot styles and corner shapes" },
      {
        type: "p",
        text: "Many generators let you change the shape of the modules and the corner squares. Rounded modules and soft corners are a quick way to make a code feel less technical, and they usually scan fine.",
      },
      {
        type: "ul",
        items: [
          "**Rounded squares are a safe choice.** They keep almost all of the dark area of a square module.",
          "**Small circles need testing.** Tiny dots leave more white space between modules, which lowers contrast at small sizes.",
          "**Keep the corner eyes recognisable.** Scanners look for a dark outer ring, a light ring and a dark centre. Rounded versions work. Unusual shapes can confuse older scanners.",
          "**Do not distort the grid.** Never stretch a code into a rectangle, skew it or move parts of it for effect.",
        ],
      },
      {
        type: "p",
        text: "Whatever style you choose, apply it evenly to every module. Mixing shapes inside one code makes the pattern harder to read.",
      },
      { type: "h2", id: "frames-and-calls-to-action", text: "Frames and calls to action" },
      {
        type: "p",
        text: "A code on its own does not tell anyone what will happen. A short instruction gets more scans and builds trust, because people know what to expect.",
      },
      {
        type: "ul",
        items: [
          "Use a verb and a benefit: \"Scan for the menu\", \"Scan to join WiFi\", \"Scan to book a viewing\".",
          "Keep it to a few words and set it in a frame or label next to the code.",
          "Keep the frame outside the quiet zone, the clear margin of 4 modules around the code.",
          "Print a short web address too, for anyone who cannot or prefers not to scan.",
        ],
      },
      {
        type: "p",
        text: "Match the call to action to the destination. If the frame says menu and the code opens your homepage, people trust the next code they see a little less.",
      },
      { type: "h2", id: "size-and-placement", text: "Size and placement" },
      {
        type: "p",
        text: "Good design fails if the code is too small. A printed code should be at least about 2 cm (0.8 in) wide for close scanning. For longer distances, use the 10:1 rule: the code should be about one tenth as wide as the distance people scan from. Place it on a flat surface at a comfortable height, away from folds, edges and glossy glare.",
      },
      {
        type: "p",
        text: "If the destination might change after printing, consider a dynamic code. Its short link keeps the pattern simple, which leaves more room for a logo, and you can update the link without reprinting. See [pricing](/pricing) for dynamic plans.",
      },
      { type: "h2", id: "test-before-you-print", text: "Test on several phones before you print" },
      {
        type: "p",
        text: "Phones differ in camera quality, focus speed and the software that reads codes, so one successful scan proves very little.",
      },
      {
        type: "ol",
        items: [
          "Scan with the camera on an iPhone and on at least one Android phone, ideally from different brands.",
          "Include an older phone if you can. Older cameras are less forgiving of low contrast and busy designs.",
          "Test a printed proof, not just the screen. Ink spreads, paper colour shifts and finishes add glare.",
          "Scan from the real distance and in the real lighting where the code will live.",
          "Check that the link opens the right page and that the page works on a phone.",
          "Test again after every design change, however small.",
        ],
      },
      {
        type: "tip",
        text: "Change one design setting at a time and scan after each change. If the code stops working, you will know exactly which choice caused it. You can try styles quickly in the [generator on the home page](/#generator).",
      },
    ],
    faq: [
      {
        q: "Can a QR code be any colour?",
        a: "Yes, as long as the modules are much darker than the background. Dark brand colours on white or a pale tint work well. Light colours and inverted codes are risky.",
      },
      {
        q: "How big can the logo in a QR code be?",
        a: "Keep it to roughly 20 to 25% of the code's area at most, with high error correction, and keep it away from the three corner squares. Smaller logos are more reliable.",
      },
      {
        q: "Does adding a logo make a QR code harder to scan?",
        a: "A small, well-placed logo usually does not. Problems start when the logo is too large, covers the corner squares or blends into the modules around it.",
      },
      {
        q: "Should a QR code have a white border?",
        a: "Yes. A clear, light margin of 4 modules on every side helps phones find the code. Trimming it is a common cause of codes that will not scan.",
      },
    ],
    relatedTools: ["url", "vcard", "instagram"],
  },
];

export const guideBySlug = (slug: string) => GUIDES.find((g) => g.slug === slug);
