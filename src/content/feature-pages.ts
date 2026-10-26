import type { GuideBlock } from "@/content/guides";
import type { QrTypeSlug } from "@/lib/qr-types";

/**
 * Landing pages for features EndureQR already has (from the SEO audit's content gaps).
 * Facts must match the product: see docs/ROADMAP.md. No statistics, customer names or competitor names.
 */
export type FeatureSlug = "qr-code-with-logo" | "dynamic-qr-code-generator" | "app-download-qr-code" | "bulk-qr-code-generator";

export type FeaturePage = {
  slug: FeatureSlug;
  /** <title>, max 60 characters, includes the primary keyword */
  title: string;
  /** meta description, 140–158 characters */
  description: string;
  eyebrow: string;
  /** H1; wrap words in *asterisks* to set them in the accent colour */
  h1: string;
  /** 2–3 sentences under the H1, answering the search directly */
  intro: string;
  /** true: the free generator is embedded under the hero (only for features the free tool has) */
  tool: boolean;
  cta: { label: string; href: string };
  /** exactly 3 */
  benefits: { title: string; body: string }[];
  /** 3–4 */
  steps: { title: string; body: string }[];
  /** long-form body (650–1,000 words), same block format as guides; ids unique */
  body: GuideBlock[];
  /** 5–6 */
  faq: { q: string; a: string }[];
  relatedTools: QrTypeSlug[];
  /** slugs from src/content/guides*.ts */
  relatedGuides: string[];
};

export const FEATURE_PAGES: FeaturePage[] = [
  // ── 1. QR code with logo ────────────────────────────────────────────
  {
    slug: "qr-code-with-logo",
    title: "QR Code with Logo: Free Custom QR Code Generator",
    description:
      "Make a free QR code with your logo in the centre. Upload PNG, SVG, JPEG or WebP, pick colours and a frame, then download print-ready files. No sign-up.",
    eyebrow: "Free logo QR codes",
    h1: "Make a QR code with *your logo*",
    intro:
      "Upload your logo, choose your colours and download a custom QR code that still scans on any phone. The generator below is free, needs no sign-up and adds no watermark. Error correction switches to level H as soon as you add a logo, so the code keeps plenty of spare data.",
    tool: true,
    cta: { label: "Make a QR code with your logo", href: "#generator" },
    benefits: [
      {
        title: "Your logo stays private",
        body: "The code is built in your browser. Nothing you type or upload, including your logo file, is sent to a server.",
      },
      {
        title: "Built to scan",
        body: "Adding a logo switches error correction to level H automatically, and a contrast warning flags colour pairs that phones may struggle to read.",
      },
      {
        title: "Free and permanent",
        body: "No sign-up, no watermark and unlimited scans. Static codes never expire, so the code you print today keeps working.",
      },
    ],
    steps: [
      {
        title: "Enter your content",
        body: "Choose a type, such as a website link, WiFi network or contact card, and fill in the details.",
      },
      {
        title: "Upload your logo",
        body: "Add a PNG, JPEG, SVG or WebP file up to 1 MB, then set its size between about 15% and 35% of the code width.",
      },
      {
        title: "Style and check",
        body: "Pick colours, dot and corner styles and an optional frame. Watch for the contrast warning, then scan the preview with your phone.",
      },
      {
        title: "Download",
        body: "Save SVG or PDF for print, or PNG or JPEG for screens, at 512, 1024, 2048 or 4096 px.",
      },
    ],
    body: [
      {
        type: "p",
        text: "A QR code with a logo is an ordinary QR code with an image placed in the middle. It still scans because every QR code carries **error correction**: spare data that lets a phone rebuild the content when part of the pattern is hidden or damaged. Keep the logo modest, keep the contrast strong and test the result, and a custom QR code scans as reliably as a plain black-and-white one.",
      },
      { type: "h2", id: "how-a-logo-fits", text: "How a logo fits inside a QR code" },
      {
        type: "p",
        text: "QR codes have four error correction levels. Each one sets how much of the code can be lost before it stops scanning. Higher levels add more spare data, which makes the pattern denser.",
      },
      {
        type: "table",
        head: ["Level", "Recovers roughly", "Typical use"],
        rows: [
          ["L", "7% of the data", "Clean screens and documents, no logo"],
          ["M", "15% of the data", "Everyday print with no logo"],
          ["Q", "25% of the data", "Codes that may get scuffed or dirty"],
          ["H", "30% of the data", "Codes with a logo in the centre"],
        ],
      },
      {
        type: "p",
        text: "When you add a logo, the EndureQR generator switches to **level H** automatically and clears the dots behind the image, so the logo sits on a clean patch instead of on top of half-hidden modules. Without a logo, you can pick any level yourself in the advanced panel. The [error correction guide](/guides/qr-code-error-correction) explains the levels in more detail.",
      },
      { type: "h2", id: "logo-size", text: "How big should the logo be?" },
      {
        type: "p",
        text: "The logo size setting runs from about 15% to 35% of the code's width. Because the logo covers a square patch, even the largest setting hides only around an eighth of the pattern's area, which is within what level H can recover. That margin is still worth protecting, because real prints also suffer from glare, curved surfaces and wear.",
      },
      {
        type: "ul",
        items: [
          "**Start at 20% to 25%.** This reads clearly as a brand mark and leaves plenty of spare data.",
          "**Go larger only after testing.** If you push towards 35%, scan with several phones, including an older one.",
          "**Keep the corners clear.** The three large squares in the corners tell the phone where the code is. The generator keeps the logo in the centre, so never add artwork over the corners afterwards.",
          "**Keep the content short.** A long link makes a denser pattern with smaller modules, which leaves less room for a logo. A short, clean address helps.",
        ],
      },
      { type: "h2", id: "preparing-your-logo-file", text: "Preparing your logo file" },
      {
        type: "p",
        text: "You can upload PNG, JPEG, SVG or WebP files up to 1 MB. The file is read in your browser and placed into the code there, so it never leaves your device.",
      },
      {
        type: "table",
        head: ["Format", "Good for", "Watch out for"],
        rows: [
          ["SVG", "Vector logos that need to stay sharp", "Very detailed artwork can look busy at small sizes"],
          ["PNG", "Logos with a transparent background", "Low-resolution files look soft in large prints"],
          ["WebP", "Small files exported from web tools", "Check that transparency survived the export"],
          ["JPEG", "Simple marks on a plain background", "No transparency, so the background shows as a box"],
        ],
      },
      {
        type: "p",
        text: "A simple mark works better than a full wordmark. A square icon, monogram or symbol stays readable when the code is only a few centimetres wide, while a long company name shrinks into lines nobody can read. Trim empty space from the edges of the file so the logo fills the area you give it.",
      },
      { type: "h2", id: "colours-styles-frames", text: "Colours, styles and frames" },
      {
        type: "p",
        text: "Phones read a QR code by telling dark modules from light ones, so contrast matters more than any other design choice. Use a dark colour for the code and a light background. Brand colours work well for the code if they are deep enough, such as navy, dark green or burgundy. The generator shows a contrast warning when a pair of colours may be hard to scan.",
      },
      {
        type: "ul",
        items: [
          "**Avoid inverted codes.** Light dots on a dark background fail on some phone cameras.",
          "**Pick a dot style that suits your brand.** Square, rounded, soft, dots and classy all scan well when the contrast is strong.",
          "**Match the corners.** Square, rounded or circle corner styles let the code echo the shape of your logo.",
          "**Add a frame.** A label, box or pill frame with your own text, such as \"Scan me\" or \"See the menu\", tells people what to expect.",
        ],
      },
      {
        type: "p",
        text: "For more on layout and placement, read our [QR code design best practices](/guides/qr-code-design-best-practices).",
      },
      { type: "h2", id: "downloading-the-right-file", text: "Downloading the right file" },
      {
        type: "p",
        text: "Choose the format for where the code will appear. **SVG** and **PDF** stay sharp at any size, so use them for print and for sending to a designer. The PDF is set at 300 dpi. **PNG** and **JPEG** suit websites, emails, slides and documents. Each format is available at 512, 1024, 2048 or 4096 px, so pick the largest size you might need.",
      },
      {
        type: "p",
        text: "Leave a clear border around the code, called the quiet zone. The advanced panel lets you set it from 2 to 8 modules wide. Keep text and artwork outside it. The printed code also needs to be large enough for the distance people scan from; see [QR code size for printing](/guides/qr-code-size-for-printing).",
      },
      { type: "h2", id: "test-before-you-print", text: "Test before you print" },
      {
        type: "ol",
        items: [
          "Scan the on-screen preview with your phone's camera and check it opens the right content.",
          "Try at least one iPhone and one Android phone, and an older phone if you have one.",
          "Print a single proof at the real size, on the real material, and scan it in the light where it will be used.",
          "Scan from the distance and angle people will use, not just up close.",
        ],
      },
      {
        type: "p",
        text: "If a code is slow to read, make the logo smaller, raise the contrast or print it larger. Our [checklist for codes that won't scan](/guides/qr-code-not-scanning) covers the other common causes.",
      },
      {
        type: "p",
        text: "Codes from the free generator are static, so the content is fixed once printed and the code never expires. If you need to change the destination later or count scans, a [dynamic QR code](/dynamic-qr-code-generator) is the paid upgrade, with the same logo and frame options.",
      },
    ],
    faq: [
      {
        q: "Will a logo stop my QR code from scanning?",
        a: "Not if the logo is a sensible size and the colours have strong contrast. A code with a logo uses level H error correction, which can recover about 30% of the data. Always scan the final design before printing.",
      },
      {
        q: "What size should my logo be?",
        a: "Around 20% to 25% of the code width is a safe start. The generator allows about 15% to 35%, so test larger sizes on several phones before you print.",
      },
      {
        q: "Which logo file format works best?",
        a: "SVG, or a PNG with a transparent background. JPEG works too, but it has no transparency, so the logo's background shows as a box.",
      },
      {
        q: "Is the custom QR code really free?",
        a: "Yes. There is no sign-up and no watermark, scans are unlimited, and static codes never expire.",
      },
      {
        q: "Is my logo uploaded anywhere?",
        a: "No. The code is generated in your browser, and nothing you type or upload is sent to a server.",
      },
      {
        q: "Can I use my brand colours?",
        a: "Yes, as long as the code stays clearly darker than the background. The generator warns you when a colour pair may be hard to scan.",
      },
    ],
    relatedTools: ["url", "vcard", "wifi", "instagram"],
    relatedGuides: ["qr-code-design-best-practices", "qr-code-error-correction", "qr-code-size-for-printing"],
  },

  // ── 2. Dynamic QR code generator ────────────────────────────────────
  {
    slug: "dynamic-qr-code-generator",
    title: "Dynamic QR Code Generator: Edit Links After Printing",
    description:
      "Create dynamic QR codes you can edit after printing. Unlimited codes and scans, scan analytics and iPhone/Android links. Codes keep working if you cancel.",
    eyebrow: "Dynamic QR codes",
    h1: "Dynamic QR codes you can *edit after printing*",
    intro:
      "A dynamic QR code points to a short link, so you can change where it goes after the code is printed. EndureQR Pro gives you unlimited dynamic codes, unlimited scans and scan analytics for $29 a year. If you ever cancel, your codes keep redirecting to their last destination.",
    tool: false,
    cta: { label: "Start Pro", href: "/signup?plan=pro-yearly" },
    benefits: [
      {
        title: "Change the link any time",
        body: "Edit the destination in your dashboard and the next scan goes to the new page. Nothing needs reprinting.",
      },
      {
        title: "See what gets scanned",
        body: "Daily scans, devices, approximate city and country, and a weekday-by-hour heatmap. No IP addresses are stored.",
      },
      {
        title: "Codes outlive your plan",
        body: "If you cancel, codes keep redirecting to their last destination, with no service page and no ads.",
      },
    ],
    steps: [
      {
        title: "Choose a plan",
        body: "Pro is $3.99 a month or $29 a year. Lifetime is $79, paid once.",
      },
      {
        title: "Create a code",
        body: "Name it and paste the destination. Optionally add separate iPhone/iPad and Android links, then style it with a logo, frame and colours.",
      },
      {
        title: "Download and print",
        body: "Save it as PNG, SVG, JPG or PDF. The code holds a short link, so the pattern stays simple.",
      },
      {
        title: "Edit and track",
        body: "Change the destination whenever you need to, and watch scans arrive in your analytics.",
      },
    ],
    body: [
      {
        type: "p",
        text: "A dynamic QR code stores a short redirect link instead of your final address. When someone scans it, their phone opens the short link and EndureQR forwards them to the destination you have set. Because that destination lives in your account and not in the printed pattern, you can change it whenever you like. A static code cannot do this. Once it is printed, its content is fixed.",
      },
      { type: "h2", id: "how-dynamic-codes-work", text: "How a dynamic QR code works" },
      {
        type: "p",
        text: "Every EndureQR dynamic code holds a short link made of /r/ and a unique code. The printed pattern never changes. What changes is the destination saved against that short link.",
      },
      {
        type: "ol",
        items: [
          "You create a code and set its destination, such as a menu, a booking page or a product page.",
          "You print the code. It contains only the short link, so the pattern stays simple and easy to scan.",
          "Later, you edit the destination in your dashboard.",
          "The next scan goes to the new page. Nobody reprints anything.",
        ],
      },
      {
        type: "p",
        text: "Because each scan passes through EndureQR first, scans can be counted and different phones can be sent to different links. The [static vs dynamic guide](/guides/static-vs-dynamic-qr-codes) covers the trade-offs in depth.",
      },
      { type: "h2", id: "static-vs-dynamic", text: "Static and dynamic codes compared" },
      {
        type: "table",
        head: ["Feature", "Static (free)", "Dynamic (Pro or Lifetime)"],
        rows: [
          ["Change the destination after printing", "No", "Yes, from the next scan"],
          ["Scan analytics", "No", "Daily scans, devices, location, time of day"],
          ["Separate iPhone and Android links", "No", "Yes"],
          ["Pause with a message", "No", "Yes"],
          ["Account needed", "No", "Yes"],
          ["Relies on a redirect service", "No", "Yes, and keeps redirecting if you cancel"],
          ["Cost", "Free", "From $3.99 a month"],
        ],
      },
      {
        type: "p",
        text: "Static codes are the right choice for content that never changes, like a WiFi password or a contact card. You can make those for free in the [QR code generator](/qr-code-generator), with no sign-up and no watermark.",
      },
      { type: "h2", id: "whats-included", text: "What you get with EndureQR dynamic codes" },
      {
        type: "ul",
        items: [
          "**Unlimited codes and scans.** There is no cap on how many codes you create or how often they are scanned, and no throttling.",
          "**Scan analytics.** Daily scans, devices (iPhone and iPad, Android, computers), approximate city and country, and a weekday-by-hour heatmap in your time zone. No IP addresses are stored, and you can export scans as CSV. See [how to track QR code scans](/guides/track-qr-code-scans).",
          "**Smart redirects.** Send iPhone and iPad users to one link and Android users to another. Everyone else gets the main link.",
          "**Pause a code.** Scanners see a friendly page with your message and, if you add one, the date the code will be back.",
          "**Folders and search.** Keep codes for different sites, clients or campaigns apart, and find any code quickly.",
          "**Bulk create.** Upload a CSV of up to 500 rows and download every code at once with the [bulk QR code generator](/bulk-qr-code-generator).",
          "**Full design options.** Logo, frame, colours, dot and corner styles, with PNG, SVG, JPG and PDF downloads.",
        ],
      },
      { type: "h2", id: "when-to-use-dynamic", text: "When a dynamic code is worth it" },
      {
        type: "p",
        text: "Choose dynamic when the thing you print will outlast the page it points to.",
      },
      {
        type: "ul",
        items: [
          "**Menus and price lists.** Swap in a new seasonal menu without touching the table cards. Our page for [restaurants](/industries/restaurants) shows common setups.",
          "**Property signs and brochures.** Point the same sign at a new listing when a home sells.",
          "**Packaging.** Update a manual or support page after the boxes have shipped.",
          "**Posters and events.** Move a code from the ticket page to the photo gallery once the event is over.",
          "**Anything you want to measure.** Static codes cannot count scans, so a dynamic code is the way to see what a print run achieved.",
        ],
      },
      { type: "h2", id: "if-you-cancel", text: "What happens if you cancel" },
      {
        type: "p",
        text: "Some dynamic QR services switch codes off when a plan ends, which is a common reason printed codes stop working. EndureQR does not. **Your codes keep redirecting to their last destination after you cancel**, with no service page and no ads in between. Editing and new analytics pause until you resume your plan. Read more in [do QR codes expire?](/guides/do-qr-codes-expire)",
      },
      { type: "h2", id: "pricing", text: "Pricing" },
      {
        type: "table",
        head: ["Plan", "Price (USD, before tax)", "Billing"],
        rows: [
          ["Pro monthly", "$3.99", "Every month"],
          ["Pro yearly", "$29", "Every year"],
          ["Lifetime", "$79", "Once"],
        ],
      },
      {
        type: "p",
        text: "Pro and Lifetime both include unlimited dynamic codes and unlimited scans. You pay by card through Lemon Squeezy, and you can get a refund within 14 days of your first Pro payment or a Lifetime purchase. Full details are on the [pricing page](/pricing).",
      },
    ],
    faq: [
      {
        q: "What is the difference between a static and a dynamic QR code?",
        a: "A static code stores its content in the pattern, so it cannot change after printing. A dynamic code stores a short link, so you can change the destination at any time and count scans.",
      },
      {
        q: "Do EndureQR dynamic QR codes expire?",
        a: "No. Your codes keep redirecting to their last destination even if you cancel, with no service page and no ads.",
      },
      {
        q: "Is there a limit on codes or scans?",
        a: "No. Pro and Lifetime include unlimited dynamic codes and unlimited scans, with no caps or throttling.",
      },
      {
        q: "How quickly does a change take effect?",
        a: "On the next scan. The printed code stays the same; only the destination behind the short link changes.",
      },
      {
        q: "What do the scan analytics record?",
        a: "Daily scan counts, device type, approximate city and country, and the weekday and hour of each scan. IP addresses are not stored, and you can export scans as CSV.",
      },
      {
        q: "Can I get a refund?",
        a: "Yes, within 14 days of your first Pro payment or a Lifetime purchase.",
      },
    ],
    relatedTools: ["url", "vcard", "event"],
    relatedGuides: ["static-vs-dynamic-qr-codes", "do-qr-codes-expire", "track-qr-code-scans"],
  },

  // ── 3. App download QR code ─────────────────────────────────────────
  {
    slug: "app-download-qr-code",
    title: "App Download QR Code for App Store and Google Play",
    description:
      "Make one app download QR code that sends iPhone users to the App Store and Android users to Google Play. Change the links any time and see scans by device.",
    eyebrow: "App download codes",
    h1: "One QR code for the *App Store and Google Play*",
    intro:
      "An app download QR code sends each person to the right store: iPhone and iPad users to the App Store, Android users to Google Play, and everyone else to a web page you choose. You make it as an EndureQR dynamic code with smart redirects, so one printed code works for every phone. You can change any of the links after printing.",
    tool: false,
    cta: { label: "Create an app download code", href: "/signup?plan=pro-yearly" },
    benefits: [
      {
        title: "One code, the right store",
        body: "Set separate iPhone/iPad and Android links. Computers and other devices go to your main link.",
      },
      {
        title: "Links you can update",
        body: "Change a store link or the fallback page after printing. The change applies on the next scan.",
      },
      {
        title: "Scans by device",
        body: "See how many scans came from iPhone/iPad, Android and computers, by day and by approximate location.",
      },
    ],
    steps: [
      {
        title: "Copy your store links",
        body: "Copy your app's App Store link and Google Play link from the store listings.",
      },
      {
        title: "Create a dynamic code",
        body: "Set the main link to a web page about your app, then paste the iPhone/iPad and Android links.",
      },
      {
        title: "Brand and download",
        body: "Add your app icon as the logo and a frame such as \"Get the app\", then download SVG or PDF for print.",
      },
      {
        title: "Test on each device",
        body: "Scan with an iPhone and an Android phone, and open the short link on a computer, before you print.",
      },
    ],
    body: [
      {
        type: "p",
        text: "An app download QR code is one code that opens the App Store on an iPhone or iPad and Google Play on an Android phone. A standard QR code cannot do this by itself, because it holds a single fixed link. The device has to be checked at the moment of scanning, which is what a dynamic code with smart redirects does.",
      },
      { type: "h2", id: "why-one-static-code-is-not-enough", text: "Why one static code is not enough" },
      {
        type: "p",
        text: "A static QR code contains one address. If you print a code for your App Store link, Android users land on a page they cannot use, and a Google Play link has the same problem in reverse. There are two free workarounds, and both have a cost.",
      },
      {
        type: "ul",
        items: [
          "**Two codes side by side.** Print one code for each store with a clear label. It works, but it takes twice the space and people sometimes scan the wrong one.",
          "**One code to a web page.** Point a static code at a page on your site that shows both store badges. It works on every device, but everyone has to make an extra tap.",
        ],
      },
      {
        type: "p",
        text: "Both are reasonable on a zero budget, and you can make either with the free [URL QR code generator](/qr-code-generator/url). A smart redirect removes the extra step.",
      },
      { type: "h2", id: "how-smart-redirects-work", text: "How smart redirects work" },
      {
        type: "p",
        text: "An EndureQR [dynamic QR code](/dynamic-qr-code-generator) holds a short link. When someone scans it, EndureQR checks what kind of device opened the link and forwards it to the matching address.",
      },
      {
        type: "table",
        head: ["Device that scans", "Where it goes"],
        rows: [
          ["iPhone or iPad", "Your iPhone/iPad link, usually the App Store listing"],
          ["Android phone or tablet", "Your Android link, usually the Google Play listing"],
          ["Computer or any other device", "Your main link"],
        ],
      },
      {
        type: "p",
        text: "The code opens your store listing, not the app itself. If the app is already installed, the store page usually offers to open it. If you leave the iPhone/iPad or Android link empty, those devices get the main link instead.",
      },
      { type: "h2", id: "finding-your-store-links", text: "Finding your store links" },
      {
        type: "p",
        text: "Copy each link from your store listing, either with the share option in the store app or from the address bar when the listing is open in a web browser.",
      },
      {
        type: "ul",
        items: [
          "**App Store** links start with apps.apple.com and include your app's name and its numeric id.",
          "**Google Play** links start with play.google.com/store/apps/details?id= followed by your app's package name, such as com.example.app.",
          "**Check both on a phone.** Open each link before you save it, to make sure it shows the right app in the right store.",
          "**Only on one store?** Leave the other link empty and use the main link for a page that explains when the other version is coming.",
        ],
      },
      { type: "h2", id: "choosing-the-main-link", text: "Choosing the main link" },
      {
        type: "p",
        text: "The main link catches every scan that does not come from an iPhone, iPad or Android device. Make it a page on your website about the app, with a short description and both store badges. Nobody hits a dead end, and someone who opens the link on a laptop can still find the app and install it on their phone.",
      },
      { type: "h2", id: "designing-and-placing-the-code", text: "Designing and placing the code" },
      {
        type: "p",
        text: "Your app icon makes a natural logo, because it is already square and recognisable. Add it in the dashboard editor along with your colours and a frame with a clear call to action, such as \"Get the app\". The same rules as for any [QR code with a logo](/qr-code-with-logo) apply: keep the icon modest in size and the contrast high.",
      },
      {
        type: "ul",
        items: [
          "**Packaging and inserts.** Put the code where the customer first uses the product.",
          "**Shop counters and windows.** A code by the till invites people to install a loyalty or ordering app. Our page for [retail](/industries/retail) has more ideas.",
          "**Posters and event signs.** Make the code large enough to scan from a distance; see [QR code size for printing](/guides/qr-code-size-for-printing).",
          "**Receipts and business cards.** Small codes work if they are printed sharply with a clear margin around them.",
        ],
      },
      { type: "h2", id: "measuring-scans-and-installs", text: "Measuring scans and installs" },
      {
        type: "p",
        text: "EndureQR analytics show how many people scanned the code, split by iPhone and iPad, Android and computers, along with daily totals, approximate location and the busiest times of the week. That tells you which placements create interest. Scans are not installs, though. The stores report downloads in App Store Connect and the Google Play Console, so compare the two to see how many scanners go on to install. Our guide on [how to track QR code scans](/guides/track-qr-code-scans) has more on reading the numbers.",
      },
      {
        type: "p",
        text: "If you withdraw the app for a while, you can pause the code. Scanners then see a friendly page with your message and an optional date when it will be back. Smart redirects are part of Pro, at $3.99 a month or $29 a year, and Lifetime, at $79 once; see [pricing](/pricing) for details.",
      },
    ],
    faq: [
      {
        q: "Can one QR code link to both the App Store and Google Play?",
        a: "Yes, with a dynamic code that checks the device when it is scanned. EndureQR sends iPhone and iPad users to your App Store link, Android users to your Google Play link, and everyone else to your main link.",
      },
      {
        q: "Can I do this with a free static QR code?",
        a: "Not with a single link. The free options are a static code to a web page that shows both store badges, or two separate codes printed side by side.",
      },
      {
        q: "Does the code open my app if it is already installed?",
        a: "The code opens your store listing, not the app itself. If the app is already installed, the store page usually offers to open it.",
      },
      {
        q: "What happens when someone opens the code on a computer?",
        a: "They go to your main link. A web page about your app with both store badges works well here.",
      },
      {
        q: "Can I change the store links after printing?",
        a: "Yes. Edit any of the three links in your dashboard and the change applies on the next scan.",
      },
      {
        q: "Can EndureQR tell me how many people installed the app?",
        a: "EndureQR counts scans, split by iPhone/iPad, Android and computers. Installs are reported by the stores in App Store Connect and the Google Play Console.",
      },
    ],
    relatedTools: ["url", "youtube", "instagram"],
    relatedGuides: ["static-vs-dynamic-qr-codes", "track-qr-code-scans", "qr-code-design-best-practices"],
  },

  // ── 4. Bulk QR code generator ───────────────────────────────────────
  {
    slug: "bulk-qr-code-generator",
    title: "Bulk QR Code Generator: Create QR Codes from CSV",
    description:
      "Upload a CSV and create up to 500 dynamic QR codes at once. Download a ZIP of print-ready SVGs and a CSV of short links. Edit any code after printing.",
    eyebrow: "Bulk creation",
    h1: "Create hundreds of QR codes *from one CSV*",
    intro:
      "Upload a CSV with a name and a destination on each row, and EndureQR creates one dynamic QR code per row, up to 500 per upload. You then download a ZIP of print-ready SVG files and a CSV of the short links. Every code can be edited after printing and has its own scan analytics.",
    tool: false,
    cta: { label: "Start bulk creating", href: "/signup?plan=pro-yearly" },
    benefits: [
      {
        title: "Up to 500 codes per upload",
        body: "A name, a destination and an optional folder on each row. Upload again for more; there is no cap on total codes.",
      },
      {
        title: "Print-ready files",
        body: "A ZIP of SVGs named after each row, plus a CSV that matches every name to its short link.",
      },
      {
        title: "Every code stays editable",
        body: "Each code is dynamic, so you can change its destination, pause it or check its scans later.",
      },
    ],
    steps: [
      {
        title: "Prepare your CSV",
        body: "Add columns for name, destination and, if you like, folder. Put one code on each row.",
      },
      {
        title: "Upload and check",
        body: "Upload the file and review the rows before you create anything.",
      },
      {
        title: "Create the codes",
        body: "EndureQR creates one dynamic code per row and files each one in its folder.",
      },
      {
        title: "Download the ZIP",
        body: "Get a print-ready SVG for every code and a CSV of the short links.",
      },
    ],
    body: [
      {
        type: "p",
        text: "A bulk QR code generator creates many QR codes at once from a list, instead of one at a time. With EndureQR, you upload a CSV file with a name and a destination link on each row, and you get one dynamic QR code per row, up to 500 rows per upload. You then download a ZIP of print-ready SVG files and a CSV of the short links, ready for a printer or a designer.",
      },
      { type: "h2", id: "preparing-your-csv", text: "Preparing your CSV file" },
      {
        type: "p",
        text: "Any spreadsheet app can save a CSV. Put a header row at the top, then one row per code.",
      },
      {
        type: "p",
        text: "In Excel, use Save As and choose CSV UTF-8. In Google Sheets, use File, then Download, then Comma-separated values. In Numbers, use Export To and choose CSV. Saving as UTF-8 keeps accented letters in names intact.",
      },
      {
        type: "table",
        head: ["Column", "Needed", "What it holds"],
        rows: [
          ["name", "Recommended", "A label for the code, such as Table 12 or Room 204. It also names the SVG file."],
          ["destination", "Yes", "The full link the code should open, starting with https://"],
          ["folder", "Optional", "The folder to file the code in. New folders are created for you."],
        ],
      },
      { type: "p", text: "A short example looks like this:" },
      {
        type: "table",
        head: ["name", "destination", "folder"],
        rows: [
          ["Table 01", "https://example.com/menu?table=1", "Restaurant"],
          ["Table 02", "https://example.com/menu?table=2", "Restaurant"],
          ["Room 101", "https://example.com/rooms/101", "Hotel"],
        ],
      },
      {
        type: "ul",
        items: [
          "**Use distinct names.** Each SVG in the ZIP is named after its code, so clear names save sorting later.",
          "**Pad numbers.** Table 01 to Table 40 sorts in order. Table 1 to Table 40 may not.",
          "**Check the links first.** Open a few destinations in a browser before you upload. You can fix a wrong link later, but it is easier before printing.",
          "**Split long lists.** A list of more than 500 rows goes up in several uploads.",
        ],
      },
      { type: "h2", id: "what-you-download", text: "What you download" },
      {
        type: "p",
        text: "Once the codes are created, one click downloads a ZIP file containing:",
      },
      {
        type: "ul",
        items: [
          "**One SVG per code**, named after the name column. SVG is a vector format, so each code stays sharp at any print size.",
          "**A CSV of short links** that matches each name to its short link. Keep it for your records or pass it to whoever handles the print job.",
        ],
      },
      {
        type: "p",
        text: "Codes in the ZIP use a plain dark-on-white design that scans well. To add a logo, frame or brand colours to a particular code, open it in the dashboard editor and download it as PNG, SVG, JPG or PDF. For sizing advice, see [QR code size for printing](/guides/qr-code-size-for-printing).",
      },
      { type: "h2", id: "why-every-bulk-code-is-dynamic", text: "Why every bulk code is dynamic" },
      {
        type: "p",
        text: "Each row gets its own short link, so every code is a full [dynamic QR code](/dynamic-qr-code-generator). That matters more at scale than for a single code. If one destination in a batch of 300 has a typo, you fix that one link in the dashboard instead of reprinting the batch.",
      },
      {
        type: "ul",
        items: [
          "Change any code's destination after printing. The next scan follows the new link.",
          "See scans for each code: daily totals, devices, approximate location and time of day.",
          "Pause a single code with a friendly message, for example while a room is being refurbished.",
          "Codes keep redirecting to their last destination even if you cancel your plan.",
        ],
      },
      { type: "h2", id: "common-uses", text: "Common uses for bulk QR codes" },
      {
        type: "ul",
        items: [
          "**Restaurant tables.** One code per table, each pointing to the menu with the table number in the link. See our page for [restaurants](/industries/restaurants).",
          "**Hotel rooms.** A code per room for guest information, room service or feedback. See our page for [hotels](/industries/hotels).",
          "**Shelf labels and products.** A code per product line, linking to specifications, care guides or reviews.",
          "**Event signs and badges.** A code for each session room, stand or speaker page.",
          "**Client work.** Agencies can create a client's whole campaign in one upload and keep it in its own folder. See our page for [agencies](/industries/agencies).",
        ],
      },
      { type: "h2", id: "organising-large-sets", text: "Organising and tracking large sets" },
      {
        type: "p",
        text: "Hundreds of codes need structure. The folder column files codes as they are created, and search helps you find any code later. Each code has its own analytics, and you can export scans as CSV to combine them in a spreadsheet. Read [how to track QR code scans](/guides/track-qr-code-scans) for ways to compare placements.",
      },
      {
        type: "p",
        text: "Bulk create is part of Pro, at $3.99 a month or $29 a year, and Lifetime, at $79 once. There is no limit on the total number of codes or scans. See the [pricing page](/pricing) for details.",
      },
    ],
    faq: [
      {
        q: "How many QR codes can I create at once?",
        a: "Up to 500 rows per CSV upload. You can upload as many files as you need, and there is no cap on the total number of dynamic codes.",
      },
      {
        q: "What columns does the CSV need?",
        a: "A name and a destination for each row, plus an optional folder. Start the file with a header row that uses those column names.",
      },
      {
        q: "Can I bulk create static QR codes for free?",
        a: "No. Bulk creation makes dynamic codes and is part of Pro and Lifetime. The free generator makes one static code at a time.",
      },
      {
        q: "What file format are the bulk codes?",
        a: "Each code comes as an SVG inside a ZIP, together with a CSV that lists every name and short link. SVG stays sharp at any print size.",
      },
      {
        q: "Can I add my logo to bulk-created codes?",
        a: "Yes, one code at a time. Open a code in the dashboard editor to add a logo, frame and colours, then download it as PNG, SVG, JPG or PDF.",
      },
      {
        q: "Can I change a destination after printing?",
        a: "Yes. Every bulk-created code is dynamic, so you can edit its destination in the dashboard and the next scan follows the new link.",
      },
    ],
    relatedTools: ["url", "vcard", "location"],
    relatedGuides: ["qr-code-size-for-printing", "qr-code-for-restaurant-menu", "track-qr-code-scans"],
  },
];

export const featurePage = (slug: FeatureSlug) => FEATURE_PAGES.find((p) => p.slug === slug)!;
