import type { Guide } from "@/content/guides";

export const GUIDES_BASICS: Guide[] = [
  // ── 1. What is a QR code? ───────────────────────────────────────────
  {
    slug: "what-is-a-qr-code",
    title: "What is a QR code? How it works, explained simply",
    h1: "What is a QR code? How the pattern works and what it can hold",
    description:
      "A QR code is a square barcode that stores links, text or data in a grid of modules. Learn how it works, its parts, its versions and error correction levels.",
    category: "Basics",
    published: "2026-10-26",
    updated: "2026-10-26",
    readMinutes: 7,
    summary:
      "QR codes look like random noise, but every square has a job. Here is how the pattern stores data, how a phone reads it and why a damaged code can still scan.",
    body: [
      {
        type: "p",
        text: "A **QR code** (short for Quick Response code) is a two-dimensional barcode that stores information in a square grid of dark and light squares called **modules**. A phone camera reads the pattern and turns it back into text, such as a web address, a WiFi login, a contact card or a short message. QR codes were invented in 1994 by Denso Wave, a Japanese company, to track car parts through factories. Today the built-in camera on most smartphones can read them.",
      },
      { type: "h2", id: "how-a-qr-code-works", text: "How a QR code works" },
      {
        type: "p",
        text: "A traditional barcode stores data in one direction only, as a row of lines of different widths. A QR code stores data in both directions, across and down, so it holds far more in the same space. A product barcode carries a short number. A QR code can carry thousands of characters.",
      },
      {
        type: "p",
        text: "When you make a code, the generator turns your content into a stream of bits, adds extra error correction data, and lays the result out in a grid that follows the international standard ISO/IEC 18004. It then applies one of eight mask patterns, which shuffles light and dark modules so the code avoids large blank areas or shapes that could confuse a scanner.",
      },
      {
        type: "p",
        text: "Reading a code reverses the process:",
      },
      {
        type: "ol",
        items: [
          "The camera captures an image and the software looks for the three large squares in the corners.",
          "From their positions it works out the size, angle and orientation of the code. This is why a QR code scans upside down or at a slant.",
          "It reads the format information to learn which error correction level and mask were used.",
          "It samples every module as dark or light and removes the mask.",
          "It uses the error correction data to repair anything missing or misread, then decodes the content.",
        ],
      },
      {
        type: "p",
        text: "All of this happens on the phone, without an internet connection. You only need to be online if the content is a web address and you choose to open it.",
      },
      { type: "h2", id: "parts-of-a-qr-code", text: "The parts of a QR code" },
      {
        type: "p",
        text: "Every QR code contains the same set of functional patterns. They do not hold your data. They help the scanner find and read the parts that do.",
      },
      {
        type: "table",
        head: ["Part", "What it looks like", "What it does"],
        rows: [
          ["Modules", "The small dark and light squares", "Each one stores a single bit"],
          ["Finder patterns", "Three large squares in the top-left, top-right and bottom-left corners", "Let the scanner locate the code and tell which way up it is"],
          ["Separators", "A thin light band around each finder pattern", "Keep the finder patterns distinct from the data"],
          ["Timing patterns", "A row and a column of alternating dark and light modules between the finder patterns", "Show the scanner how large each module is and where the grid lines fall"],
          ["Alignment patterns", "Smaller squares with a dot in the centre, from version 2 upwards", "Correct for distortion when the code is tilted or on a slightly curved surface"],
          ["Format information", "Strips of modules beside the finder patterns", "Record the error correction level and mask pattern"],
          ["Version information", "Small blocks near two corners, from version 7 upwards", "Record the version number of larger codes"],
          ["Quiet zone", "A plain light margin 4 modules wide", "Separates the code from anything printed around it"],
        ],
      },
      {
        type: "p",
        text: "Everything else in the grid is your data and its error correction codewords. The empty fourth corner is deliberate: it is how the scanner knows which way round the code is.",
      },
      {
        type: "p",
        text: "In practice, the finder patterns and the quiet zone are the parts that custom designs most often damage. Shapes that disguise the corner squares, or a layout that crops the margin, are common reasons a code looks fine but will not scan. Our guide to [QR code design best practices](/guides/qr-code-design-best-practices) covers what is safe to change.",
      },
      { type: "h2", id: "versions-and-capacity", text: "QR code versions and how much they hold" },
      {
        type: "p",
        text: "QR codes come in **40 versions**. The version describes the size of the grid, not a newer edition of the format. Version 1 is 21 by 21 modules, and each version adds 4 modules per side, up to 177 by 177 for version 40.",
      },
      {
        type: "p",
        text: "How much a code can hold depends on its version, its error correction level and the kind of characters you store. The standard has four main encoding modes: numeric (digits only), alphanumeric (digits, capital letters and a few symbols), byte (any text, including lower case and accented characters) and kanji. The limits for the largest code at the lowest error correction level are:",
      },
      {
        type: "table",
        head: ["Content", "Maximum in a version 40 code at level L"],
        rows: [
          ["Digits only", "7,089 characters"],
          ["Alphanumeric", "4,296 characters"],
          ["Byte (general text)", "2,953 bytes"],
          ["Kanji", "1,817 characters"],
        ],
      },
      {
        type: "p",
        text: "Real codes rarely come close to these limits. A generator picks the smallest version that fits your content. More content means more modules, which means smaller modules at the same print size. That is why a long web address needs a larger print than a short one. See [QR code size for printing](/guides/qr-code-size-for-printing) for the numbers.",
      },
      { type: "h2", id: "error-correction", text: "Error correction: why damaged codes still scan" },
      {
        type: "p",
        text: "QR codes use Reed-Solomon error correction, a well-established method also used in CDs and other digital storage. The generator adds extra codewords calculated from your data. If part of the code is scratched, dirty or covered, the scanner uses those codewords to rebuild what is missing. There are four levels.",
      },
      {
        type: "table",
        head: ["Level", "Data that can be restored", "Typical use"],
        rows: [
          ["L (low)", "About 7%", "Clean screens and codes that must hold a lot of data"],
          ["M (medium)", "About 15%", "General use and a common default"],
          ["Q (quartile)", "About 25%", "Labels and signs that may get dirty or worn"],
          ["H (high)", "About 30%", "Codes with a logo, or harsh conditions"],
        ],
      },
      {
        type: "p",
        text: "Higher levels are more robust, but the extra codewords take up space, so the same content produces a denser pattern. A centre logo works only because error correction fills in the modules it covers. The StayQR [free QR code generator](/qr-code-generator) switches to level H automatically as soon as you upload a logo.",
      },
      {
        type: "tip",
        text: "Error correction has to cover real-world damage as well as design choices. If a logo uses up most of the recovery budget, a scratch or a reflection can be enough to stop the code scanning. Keep logos small and leave some headroom.",
      },
      { type: "h2", id: "history-of-the-qr-code", text: "A short history of the QR code" },
      {
        type: "p",
        text: "The QR code was developed in 1994 by Denso Wave, then part of the Japanese automotive parts maker Denso, by a team led by engineer Masahiro Hara. Factories tracked car parts with ordinary barcodes, which held little data and often had to be scanned several times per box. The team wanted a code that could hold more and be read quickly from any angle, which is where the name Quick Response comes from.",
      },
      {
        type: "p",
        text: "Denso Wave holds a patent on the format but chose not to enforce it for standard codes, so anyone could create and read them without a licence fee. \"QR Code\" itself is a registered trademark of Denso Wave. The format was later published as the international standard ISO/IEC 18004, which is why codes from any generator work with any scanner.",
      },
      {
        type: "p",
        text: "From factories, QR codes spread to tickets, packaging, advertising and payments. They became an everyday tool once phone cameras could read them directly, without a separate scanning app.",
      },
      { type: "h2", id: "static-and-dynamic-qr-codes", text: "Static and dynamic QR codes" },
      {
        type: "p",
        text: "Every QR code is read in the same way. What differs is the content stored inside.",
      },
      {
        type: "ul",
        items: [
          "**A static code** holds the final content itself: a full web address, a WiFi password, a phone number or plain text. It works without any service behind it, has no scan limit and never expires. It also cannot be changed after printing.",
          "**A dynamic code** holds a short redirect link run by a QR service. The service forwards each scan to a destination you can change at any time, and it can count scans. It works only while the service keeps the redirect running.",
        ],
      },
      {
        type: "p",
        text: "Static codes suit content that will not change. Dynamic codes suit menus, campaigns and anything you may need to update after printing. Read [static vs dynamic QR codes](/guides/static-vs-dynamic-qr-codes) for a full comparison, or follow our guide on [how to make a QR code](/guides/how-to-make-a-qr-code) to create your first one.",
      },
    ],
    faq: [
      {
        q: "What does QR stand for?",
        a: "QR stands for Quick Response. The name reflects the original goal of a code that a scanner could read quickly and from any angle.",
      },
      {
        q: "Do you need the internet to read a QR code?",
        a: "No. The phone decodes the pattern on its own. You only need a connection to open a web address stored in the code.",
      },
      {
        q: "Is the QR code format free to use?",
        a: "Yes. Denso Wave, which invented it, chose not to enforce its patent on standard QR codes, so anyone can make and print them without paying a licence fee.",
      },
      {
        q: "How much information can a QR code hold?",
        a: "The largest version can hold up to 7,089 digits or 2,953 bytes of general text at the lowest error correction level. Practical codes hold far less, because smaller codes scan more easily.",
      },
      {
        q: "Can a QR code be read upside down?",
        a: "Yes. The three corner squares tell the scanner the code's orientation, so it can be read at any rotation.",
      },
    ],
    relatedTools: ["url", "text", "wifi"],
  },

  // ── 2. How to scan a QR code ────────────────────────────────────────
  {
    slug: "how-to-scan-a-qr-code",
    title: "How to scan a QR code on iPhone, Android or laptop",
    h1: "How to scan a QR code on any phone, tablet or computer",
    description:
      "To scan a QR code, open your phone's camera, point it at the code and tap the link that appears. Steps for iPhone, Android, screenshots and laptops.",
    category: "Basics",
    published: "2026-10-26",
    updated: "2026-10-26",
    readMinutes: 6,
    summary:
      "Most phones can scan a QR code with the built-in camera. Here is how to do it on iPhone and Android, how to read a code that is already on your screen, and what to do on a laptop.",
    body: [
      {
        type: "p",
        text: "To scan a QR code, open the **Camera** app on your phone, point it at the code so the whole square is on screen, and hold still for a moment. A link or button appears. Read what it says, then tap it. Recent iPhones and most recent Android phones do this with the built-in camera, so you do not need a separate app. To scan a code that is already on your screen, such as a screenshot, use Photos on an iPhone or Google Lens on Android.",
      },
      { type: "h2", id: "scan-on-iphone", text: "How to scan a QR code on an iPhone" },
      {
        type: "ol",
        items: [
          "Open the **Camera** app from the Home Screen, the Lock Screen or Control Centre.",
          "Use the rear camera in Photo mode and point it at the code. You do not need to press the shutter button.",
          "Hold the phone steady until a QR code button or banner with the address appears.",
          "Read the address, then tap the button to open it.",
        ],
      },
      {
        type: "p",
        text: "If the camera does not react, open **Settings**, go to **Camera**, and check that the option to scan QR codes is switched on. Then try again from a little further away, so the code and its white border both fit in the frame.",
      },
      { type: "h3", text: "Use the Code Scanner in Control Centre" },
      {
        type: "p",
        text: "Recent versions of iOS also include a dedicated **Code Scanner**. It opens a full-screen scanner with a torch button for dim rooms, which is handy for small or awkwardly placed codes. To find it, open Control Centre and look for the Code Scanner icon. If it is not there, add it from the Control Centre editing screen, or from **Settings > Control Centre** on older versions. You can also find it by searching for \"Code Scanner\" in Spotlight.",
      },
      {
        type: "p",
        text: "The same steps work on an iPad. Its camera reads codes in the same way, and the Code Scanner is available in Control Centre on recent versions.",
      },
      { type: "h2", id: "scan-on-android", text: "How to scan a QR code on Android" },
      {
        type: "p",
        text: "Android phones vary by maker and software version, so menu names differ. Most recent phones offer at least one of the options below.",
      },
      {
        type: "ul",
        items: [
          "**The Camera app.** Open the camera, point it at the code and tap the link that appears. If nothing happens, open the camera settings and look for an option to scan QR codes or barcodes.",
          "**Google Lens.** Open the Google app and tap the Lens icon in the search bar, or use the Lens button that some camera apps include. Point it at the code and tap the result.",
          "**Quick Settings.** Many recent Android versions include a **Scan QR code** tile. Swipe down from the top of the screen to open Quick Settings. If the tile is missing, tap the edit (pencil) icon and drag it into place.",
          "**Circle to Search.** On phones that support it, press and hold the home button or the navigation handle, then circle or tap the code on screen. This reads codes inside apps, videos and web pages without a screenshot.",
        ],
      },
      {
        type: "p",
        text: "Older Android phones may need a scanner app. Choose a well-known one from the official app store, and avoid apps that ask for permissions a scanner should not need, such as access to your contacts.",
      },
      { type: "h2", id: "scan-from-a-screenshot", text: "How to scan a QR code from a screenshot or photo" },
      {
        type: "p",
        text: "A phone cannot point its camera at its own screen. This matters when someone sends you a code in a chat or email, or when a ticket or boarding pass arrives as an image.",
      },
      {
        type: "ul",
        items: [
          "**On an iPhone:** open the image in the Photos app. In recent versions the phone detects the code automatically. Press and hold the code, or tap the Live Text button in the corner of the photo, then tap the link that appears.",
          "**On Android:** open the image in Google Photos and tap **Lens**. Or open Google Lens and choose the image from your gallery.",
          "**With Circle to Search:** where available, circle the code wherever it appears on screen.",
          "**With a second device:** show the image full screen on one device and scan it with another phone.",
        ],
      },
      { type: "h2", id: "scan-on-a-laptop", text: "How to scan a QR code on a laptop or desktop" },
      {
        type: "p",
        text: "Laptops are not built for scanning. Webcams face the user and often struggle to focus on something held close. These options work best.",
      },
      {
        type: "ul",
        items: [
          "**Use your phone.** For a code on your laptop screen, scanning it with your phone is the quickest route. Raise the screen brightness if the camera hesitates.",
          "**Google Lens in Chrome.** Right-click an image on a web page and choose to search it with Google Lens. Lens reads any QR code in the image and shows the link.",
          "**The Windows Camera app.** Recent versions of the Camera app on Windows 11 include a barcode or QR scanning option. Hold the code steady in front of the webcam, close enough to fill much of the frame.",
          "**On a Mac,** the simplest choices are your phone or Google Lens in Chrome.",
        ],
      },
      { type: "h2", id: "what-happens-after-you-scan", text: "What happens after you scan" },
      {
        type: "p",
        text: "The phone looks at the type of content in the code and offers a matching action. It always waits for you to tap before doing anything.",
      },
      {
        type: "table",
        head: ["What the code contains", "What your phone offers to do"],
        rows: [
          ["Web address", "Open the page in your browser"],
          ["WiFi details", "Join the network"],
          ["Contact card", "Add a new contact"],
          ["Phone number", "Show the number ready to call"],
          ["Text message or email", "Open a pre-filled draft for you to send"],
          ["Location", "Open the place in a maps app"],
          ["Calendar event", "Add the event to your calendar"],
          ["Plain text", "Show the text so you can read or copy it"],
        ],
      },
      {
        type: "p",
        text: "That pause before you tap is your chance to check where a code leads. Read the address in the preview and make sure it matches the business or organisation you expect. Our guide [are QR codes safe?](/guides/are-qr-codes-safe) explains what to look for.",
      },
      {
        type: "p",
        text: "On many recent Android phones you can also scan a WiFi code from the WiFi settings screen. Look for a small QR icon next to the option to add a network. Android can also show a code for the network you are connected to, under the network's share option, so a friend can scan it from your screen.",
      },
      {
        type: "p",
        text: "WiFi codes are a good example of how much typing a scan saves. Learn how they work in our [WiFi QR code guide](/guides/wifi-qr-code), or make one with the free [WiFi QR code generator](/qr-code-generator/wifi).",
      },
      { type: "h2", id: "tips-for-scanning", text: "Tips for a quick, reliable scan" },
      {
        type: "ul",
        items: [
          "**Frame the whole code.** Include the white border around it. If you are too close, step back.",
          "**Hold still.** Give the camera a second or two to focus.",
          "**Find better light.** Move out of your own shadow, or turn on the torch.",
          "**Avoid glare.** Tilt the phone slightly if light reflects off glossy paper, glass or a screen.",
          "**Clean the lens.** A smudged lens blurs small codes.",
          "**Try another method.** If the camera fails, try the Code Scanner, Google Lens or a second phone.",
        ],
      },
      {
        type: "p",
        text: "If a code still will not scan, the problem may be the code rather than your phone. Work through our [QR code not scanning checklist](/guides/qr-code-not-scanning) to find out why.",
      },
      {
        type: "tip",
        text: "If a code is on a sticker in a public place, look closely before you scan. Check that it has not been stuck over another code, and that the address in the preview belongs to the organisation named on the sign.",
      },
    ],
    faq: [
      {
        q: "Do I need an app to scan a QR code?",
        a: "Usually not. Recent iPhones and most recent Android phones scan codes with the built-in camera. Older phones may need a scanner app from the official app store.",
      },
      {
        q: "Why won't my iPhone camera scan a QR code?",
        a: "Check that QR scanning is switched on under Settings > Camera, clean the lens and step back so the whole code fits on screen. If it still fails, try the Code Scanner in Control Centre.",
      },
      {
        q: "Can I scan a QR code without an internet connection?",
        a: "Yes. The phone reads the code offline, and content such as WiFi details, contact cards and plain text works without a connection. You need to be online to open a web address.",
      },
      {
        q: "How do I scan a QR code someone sent me?",
        a: "Save the image, then open it in Photos on an iPhone or in Google Photos with Lens on Android. The phone reads the code from the image and shows the link.",
      },
      {
        q: "Is it safe to scan any QR code?",
        a: "Scanning only reads the content. The risk comes from opening a link you do not trust, so always check the address in the preview before you tap.",
      },
    ],
    relatedTools: ["url", "wifi", "vcard"],
  },

  // ── 3. How to make a QR code ────────────────────────────────────────
  {
    slug: "how-to-make-a-qr-code",
    title: "How to make a QR code: free step-by-step guide",
    h1: "How to make a QR code: a step-by-step guide",
    description:
      "Make a QR code in minutes: pick a type, enter your link or details, style it, add a logo, test it and download PNG, SVG or PDF. Free, with no sign-up needed.",
    category: "Basics",
    published: "2026-10-26",
    updated: "2026-10-26",
    readMinutes: 7,
    summary:
      "Making a QR code takes a few minutes. Making one that scans first time, looks right and prints sharply takes a few extra checks. Here is the whole process.",
    body: [
      {
        type: "p",
        text: "To make a QR code, open a QR code generator, choose what the code should do (open a link, join WiFi, save a contact), enter your content and download the image. Before you print, add a short call to action, scan it with a couple of phones, and pick a file format that suits where it will appear. With a free generator the whole process takes a few minutes, and a static code made this way never expires.",
      },
      { type: "h2", id: "steps-at-a-glance", text: "The steps at a glance" },
      {
        type: "ol",
        items: [
          "Decide what should happen when someone scans, and whether the content will change.",
          "Open the [free QR code generator](/qr-code-generator) and choose a code type.",
          "Enter your link, text or details.",
          "Set the colours, dot style and corner style.",
          "Add a logo if you want one.",
          "Add a frame with a short call to action.",
          "Test the code with more than one phone.",
          "Download the right format and size, then check a printed proof.",
        ],
      },
      { type: "h2", id: "decide-what-the-code-should-do", text: "Step 1: decide what the code should do" },
      {
        type: "p",
        text: "Start with the person scanning. What should happen on their phone? Opening a web page, joining a WiFi network and saving a contact all need different code types. Then decide whether the code should be static or dynamic.",
      },
      {
        type: "ul",
        items: [
          "**Will the destination change?** Menus, event pages and listings often do. A static code cannot be edited after printing.",
          "**Do you need to know how often it is scanned?** Static codes cannot count scans.",
          "**How long will the print last?** Signs and packaging can stay in use for years.",
        ],
      },
      {
        type: "p",
        text: "If you answered no to the first two questions, a free static code is all you need. If not, a dynamic code lets you change the destination after printing and see scan analytics. StayQR offers dynamic codes on [paid plans](/pricing), and they keep redirecting even if you cancel. Our comparison of [static vs dynamic QR codes](/guides/static-vs-dynamic-qr-codes) goes into more detail.",
      },
      { type: "h2", id: "choose-a-type-and-enter-content", text: "Steps 2 and 3: choose a type and enter your content" },
      {
        type: "p",
        text: "The StayQR generator has 17 code types. The type decides how your content is formatted inside the code, and so what the phone offers to do with it.",
      },
      {
        type: "table",
        head: ["What you want", "Type to choose"],
        rows: [
          ["Open a website, online menu or hosted PDF", "URL"],
          ["Let guests join your WiFi", "WiFi"],
          ["Share your contact details", "vCard"],
          ["Start a message or call", "SMS, Email, WhatsApp or Phone"],
          ["Show a place on a map", "Location"],
          ["Add an event to a calendar", "Event"],
          ["Grow a social profile", "Instagram, Facebook, YouTube, LinkedIn, X or TikTok"],
          ["Receive a payment", "PayPal"],
          ["Show a short note or serial number", "Text"],
        ],
      },
      {
        type: "p",
        text: "Then enter your content carefully. A static code cannot be corrected later.",
      },
      {
        type: "ul",
        items: [
          "**For a link,** paste the full address, including https://, into the [URL QR code generator](/qr-code-generator/url). Remove tracking parameters you do not need. Shorter content makes a simpler pattern that scans more easily.",
          "**For WiFi,** type the network name exactly as it appears, including capitals and spaces, and choose the right security type.",
          "**For a contact card,** fill in only the fields people need. Every extra field makes the code denser.",
          "**Check before moving on.** Open the link in a browser to confirm it works and is the page you meant.",
        ],
      },
      {
        type: "p",
        text: "Everything in the StayQR generator is processed in your browser, and nothing you type is sent to a server. That matters when the content is a WiFi password or personal contact details.",
      },
      { type: "h2", id: "style-logo-and-frame", text: "Steps 4 to 6: style it, add a logo and a frame" },
      {
        type: "h3",
        text: "Colours, dots and corners",
      },
      {
        type: "p",
        text: "Scanners read brightness, not colour. Keep the modules dark and the background light, with strong contrast between them. A deep navy or dark green on white works as well as black. Avoid light modules on a dark background, which some scanners cannot read. Rounded dots and softened corner squares usually scan well, but keep the three corner squares easy to recognise.",
      },
      {
        type: "h3",
        text: "Logo",
      },
      {
        type: "p",
        text: "A logo in the centre covers some modules, and error correction fills in the gaps. When you upload a logo, the generator switches to error correction level H, which can restore about 30% of the data. Do not spend all of that on the logo. Keep it small, use a simple mark instead of a long wordmark, and never place it over the corner squares.",
      },
      {
        type: "h3",
        text: "Frame and call to action",
      },
      {
        type: "p",
        text: "A frame with a short label tells people what they will get. \"Scan me\" is a start, but a specific label like \"Scan for the menu\" or \"Scan to join WiFi\" works better. Keep the frame outside the plain margin around the code. Our guide to [QR code design best practices](/guides/qr-code-design-best-practices) has more on safe styling.",
      },
      { type: "h2", id: "test-and-download", text: "Steps 7 and 8: test it, then download" },
      {
        type: "p",
        text: "Test before you download the final file, and again after every design change.",
      },
      {
        type: "ol",
        items: [
          "Scan the code from your screen with an iPhone and an Android phone.",
          "Check that it opens the right page or action, not just that it scans.",
          "Open the destination on a phone over mobile data and check that it loads quickly and reads well.",
          "If any phone hesitates, reduce the logo, raise the contrast or shorten the content.",
        ],
      },
      {
        type: "p",
        text: "Then choose a format and size. The generator exports four formats at sizes from 512 to 4096 pixels.",
      },
      {
        type: "table",
        head: ["Format", "Best for", "Notes"],
        rows: [
          ["SVG", "Professional print, signs, packaging", "Vector, so it stays sharp at any size"],
          ["PDF", "Sending to a print shop", "Exported at 300 dpi and easy to place in layouts"],
          ["PNG", "Websites, documents, office printing", "Keeps hard edges with no compression blur"],
          ["JPEG", "Systems that only accept JPEG", "Compression can soften edges, so check it"],
        ],
      },
      {
        type: "p",
        text: "For print in PNG, allow 300 pixels per inch of final width. A 2048 pixel PNG prints at about 17 cm (6.8 in) wide at that resolution, and a 1024 pixel PNG at about 8.7 cm (3.4 in). For screens and email, 512 to 1024 pixels is plenty.",
      },
      { type: "h2", id: "common-mistakes", text: "Common mistakes to avoid" },
      {
        type: "ul",
        items: [
          "**Linking to a page that will move.** A static code is only as good as its destination. Link to a stable address on a site you control.",
          "**Using a code that depends on a trial.** Some free tools make dynamic codes that stop working when a trial ends. Check what kind of code you are getting before you print.",
          "**Testing only on a screen.** Ink, paper and lighting change how a code reads. Always test a printed proof.",
          "**Trimming the margin.** Cropping the plain border to fit a layout is one of the most common reasons a code fails.",
          "**Stretching a small image.** Enlarging a small PNG blurs the edges. Download a larger size or a vector file instead.",
          "**Leaving out the call to action.** A bare code gives people no reason to scan it.",
        ],
      },
      { type: "h2", id: "print-checks", text: "Final checks before you print" },
      {
        type: "ul",
        items: [
          "**Size it for the distance.** A code should be at least about one tenth as wide as the distance people scan from, and around 2 cm (0.8 in) at minimum. See [QR code size for printing](/guides/qr-code-size-for-printing).",
          "**Keep the quiet zone.** Leave a plain light margin of 4 modules on every side.",
          "**Choose a matte finish.** Gloss and lamination can reflect light into the camera.",
          "**Keep it flat.** Avoid folds, seams and tight curves.",
          "**Print a proof.** Put it where the code will live and scan it from where people will stand.",
          "**Add a fallback.** Print a short web address under the code for anyone who prefers to type.",
        ],
      },
      {
        type: "tip",
        text: "Keep a simple record of every code you print: what it points to, where it is displayed and the file you used. Save the SVG with a clear file name. When something changes later, you will know exactly which codes to update or replace.",
      },
    ],
    faq: [
      {
        q: "Is it free to make a QR code?",
        a: "Yes. Static codes are free to make and never expire. The StayQR generator needs no sign-up and adds no watermark.",
      },
      {
        q: "Can I change a QR code after printing it?",
        a: "Not a static code, because its content is fixed in the pattern. A dynamic code lets you change the destination at any time without reprinting.",
      },
      {
        q: "What size should I download my QR code?",
        a: "For screens, 512 to 1024 pixels is enough. For print, use SVG or PDF, or a PNG with about 300 pixels per inch of final printed width.",
      },
      {
        q: "How do I make a QR code for a PDF?",
        a: "Upload the PDF to a website or file host you control, copy its link and create a URL code. Keep the file's address the same when you update it, or the code will break.",
      },
      {
        q: "Do I need a logo on my QR code?",
        a: "No. A logo can make a code look more trustworthy and on brand, but a plain code scans just as well. If you add one, keep it small.",
      },
    ],
    relatedTools: ["url", "vcard", "event"],
  },

  // ── 4. QR code not scanning ─────────────────────────────────────────
  {
    slug: "qr-code-not-scanning",
    title: "QR code not scanning? A checklist of common fixes",
    h1: "QR code not working or not scanning? A troubleshooting checklist",
    description:
      "QR code not scanning? Work through this checklist: contrast, size, quiet zone, data density, logo size, glare, curves, blur, broken links and expired codes.",
    category: "Printing",
    published: "2026-10-26",
    updated: "2026-10-26",
    readMinutes: 6,
    summary:
      "Most scanning problems come down to a handful of causes. Work through this checklist in order to find yours, from the phone to the print to the link behind the code.",
    body: [
      {
        type: "p",
        text: "When a QR code will not scan, the cause is usually one of a few things: **too little contrast**, a code that is **too small for the distance**, a **missing white margin**, too much data or a logo that covers too much. If the code scans but nothing useful opens, the problem is the **destination**: a broken link, or a dynamic code whose subscription has ended. Work through the checklist below in order, starting with the quick checks.",
      },
      { type: "h2", id: "quick-checks", text: "Start here: quick checks on the phone" },
      {
        type: "p",
        text: "Rule out the phone first. These checks take a minute and solve many problems.",
      },
      {
        type: "ol",
        items: [
          "**Clean the camera lens.** A fingerprint is enough to blur a small code.",
          "**Move back.** The whole code and its white border must fit in the frame. Many people hold the phone too close.",
          "**Hold still for a second or two.** The camera needs time to focus.",
          "**Improve the light.** Step out of your own shadow, or turn on the torch.",
          "**Check the scanning setting.** On some phones QR scanning can be switched off in the camera settings. Try the iPhone Code Scanner or Google Lens instead. Our guide on [how to scan a QR code](/guides/how-to-scan-a-qr-code) lists every method.",
          "**Try a second phone.** If one phone reads the code and another does not, the code is marginal and worth fixing, because many of your visitors will have the phone that struggles.",
        ],
      },
      { type: "h2", id: "check-the-design", text: "Check the design: contrast, colours and margin" },
      {
        type: "p",
        text: "If several phones fail, look at the code itself. Design problems are the most common cause.",
      },
      {
        type: "ul",
        items: [
          "**Low contrast.** Scanners see brightness, not colour. Pale modules, a tinted background or a gradient that fades out can make the code unreadable. Fix: make the modules darker or the background lighter. If the code blends in when you squint, it is too faint.",
          "**Inverted colours.** Light modules on a dark background fail on some phones and scanner apps. Fix: use dark modules on a light background.",
          "**A busy background.** A code printed over a photo or pattern confuses the scanner. Fix: place the code on a plain white or very light box.",
          "**A missing quiet zone.** The standard calls for a plain margin 4 modules wide on every side. Text, borders or a crop too close to the code remove it. Fix: restore the margin and keep everything else outside it.",
          "**A logo that is too big.** A logo covers modules and uses up error correction. Fix: shrink it to no more than about 20 to 25% of the code's area, keep it off the corner squares and use level H error correction. The StayQR generator sets level H automatically when you add a logo.",
          "**Unusual shapes.** Tiny dots, gaps between modules or corner squares redrawn as other shapes can defeat older scanners. Fix: return to square or rounded modules and standard corners.",
        ],
      },
      {
        type: "p",
        text: "Our guide to [QR code design best practices](/guides/qr-code-design-best-practices) explains which styling choices are safe.",
      },
      { type: "h2", id: "check-size-and-data", text: "Check the size and the amount of data" },
      {
        type: "ul",
        items: [
          "**Too small for the distance.** A code should be about one tenth as wide as the distance people scan from. A code read from 1 metre needs to be about 10 cm wide, and nothing should be much smaller than 2 cm. Fix: print it larger, or put it where people can get closer. See [QR code size for printing](/guides/qr-code-size-for-printing).",
          "**Too much data.** Long web addresses with tracking parameters, contact cards with every field filled and long passages of text all push the code to a higher version with more, smaller modules. Fix: shorten the link, trim the fields or move the text onto a web page. A dynamic code also helps, because it stores only a short redirect link.",
          "**A low-resolution file.** A small PNG stretched to a large size prints with fuzzy edges. Fix: use an SVG or PDF, or a PNG with about 300 pixels per inch of final width.",
        ],
      },
      { type: "h2", id: "check-the-print-and-surface", text: "Check the print and the surface" },
      {
        type: "ul",
        items: [
          "**Glare and lamination.** Gloss paper, laminate, plastic sleeves and glass reflect lights straight into the camera. Fix: choose a matte finish, angle the sign or move the light.",
          "**Curved surfaces.** Bottles, cups and pillars bend the grid. Fix: make the code small relative to the curve, place it on the flattest area, or move it to a flat label or tag.",
          "**Blur and ink spread.** Absorbent paper and low-quality printing let ink spread, so small modules merge. Fix: print larger, use a better printer or paper, and check a proof up close.",
          "**Wear and damage.** Scratches, sun fading, dirt, creases and peeling stickers all remove modules. Fix: reprint and protect the code, or move it out of harm's way.",
          "**Codes on screens.** A dim screen, reflections or a code shown too small can all fail. Fix: raise the brightness and show the code larger.",
        ],
      },
      { type: "h2", id: "check-the-destination", text: "The code scans, but the page does not work" },
      {
        type: "p",
        text: "If the phone reads the code and shows a link, the pattern is fine. The problem lies with where it points.",
      },
      {
        type: "ul",
        items: [
          "**A broken link.** The page was moved or deleted, the address had a typing error, or a PDF was replaced with a file of a different name. Fix: restore the page at its old address or set up a redirect from it. A static code cannot be edited.",
          "**An expired dynamic code.** Some services switch codes off when a trial or subscription ends, so scans land on an error or upgrade page. Fix: renew the plan, or cover the code with a new one. Our guide [do QR codes expire?](/guides/do-qr-codes-expire) explains how to check. StayQR dynamic codes keep redirecting even if you cancel.",
          "**WiFi that will not connect.** The code scans but the phone cannot join. The security type may be wrong, the password may have changed, or a special character may not have been escaped. Fix: make a new code with the current details.",
          "**A page that will not load.** The page needs a login, is blocked on some networks, or is too heavy for mobile data. Fix: test it on a phone over mobile data and simplify it.",
        ],
      },
      { type: "h2", id: "symptoms-at-a-glance", text: "Symptoms and likely causes at a glance" },
      {
        type: "table",
        head: ["Symptom", "Likely cause", "First thing to try"],
        rows: [
          ["The camera does not react at all", "Low contrast, missing margin, glare or too small", "Step back, then check contrast and margin"],
          ["Works on some phones but not others", "A marginal code: dense data, big logo or low contrast", "Simplify the design and test again"],
          ["Scans on screen but not when printed", "Print size, ink spread, paper colour or gloss", "Print a larger matte proof"],
          ["Scans close up but not from where people stand", "Too small for the distance", "Apply the 10:1 rule and reprint"],
          ["Scans, then shows an error page", "Broken link or expired dynamic code", "Open the link in a browser and check the account"],
          ["Scans, but WiFi will not join", "Wrong security type, old password or special characters", "Make a new code with current details"],
        ],
      },
      {
        type: "tip",
        text: "Change one thing at a time. Make a plain black and white version of the same content with no logo in the [free QR code generator](/qr-code-generator). If the plain version scans and your styled one does not, the design is the problem. If neither scans, look at the size, the data and the print.",
      },
    ],
    faq: [
      {
        q: "Why does my QR code scan on screen but not when printed?",
        a: "Printing adds problems a screen does not have: ink spread, paper colour, glossy finishes and a smaller physical size. Print a proof at the final size on matte paper and test it where it will be used.",
      },
      {
        q: "Why does a QR code work on one phone but not another?",
        a: "Phones use different cameras and scanning software, and some are less forgiving than others. A code that only works on some phones is marginal, so improve the contrast, size or density.",
      },
      {
        q: "Can a QR code stop working on its own?",
        a: "A static code does not change, but the print can wear out and the page it links to can disappear. A dynamic code can also stop if the provider switches it off.",
      },
      {
        q: "Can I fix a printed QR code without reprinting everything?",
        a: "Yes. Print a new code at the same size or larger and stick it squarely over the old one. If it is a dynamic code that still works, you can simply change its destination.",
      },
      {
        q: "Will removing the logo help a code scan?",
        a: "Often, yes. A large logo is a common cause of failed scans. Shrinking it, or testing a version without it, quickly shows whether it is the problem.",
      },
    ],
    relatedTools: ["url", "wifi", "text"],
  },

  // ── 5. Are QR codes safe? ───────────────────────────────────────────
  {
    slug: "are-qr-codes-safe",
    title: "Are QR codes safe? How to spot QR code scams",
    h1: "Are QR codes safe? How to spot and avoid QR code scams",
    description:
      "QR codes are safe to scan, but the link can be risky. Learn how quishing and fake parking codes work, what to check before you tap and how to protect codes.",
    category: "Basics",
    published: "2026-10-26",
    updated: "2026-10-26",
    readMinutes: 6,
    summary:
      "A QR code is just a way of storing text. The risk is where that text sends you. Here is how QR code scams work, what to check before you tap, and how businesses can protect their codes.",
    body: [
      {
        type: "p",
        text: "Scanning a QR code is generally safe in itself. A QR code only stores text, usually a web address, and your phone shows you what it contains before anything happens. The risk is where the code sends you. Scammers use fake codes, often stickers placed over real ones, to send people to look-alike websites that steal passwords or card details. This is called **quishing**. Check the address in the preview before you tap, and take extra care with any code that asks you to pay or log in.",
      },
      { type: "h2", id: "what-a-qr-code-can-do", text: "What a QR code can and cannot do" },
      {
        type: "p",
        text: "A QR code is data, not software. When you scan one, the phone decodes the text and offers an action based on it. If you want to know how the pattern stores that text, see [what is a QR code?](/guides/what-is-a-qr-code)",
      },
      {
        type: "p",
        text: "**A QR code can:**",
      },
      {
        type: "ul",
        items: [
          "Offer to open a web address in your browser.",
          "Offer to join a WiFi network.",
          "Offer to save a contact or a calendar event.",
          "Open a pre-filled text message, email or phone number, ready for you to send or call.",
          "Show a piece of plain text.",
        ],
      },
      {
        type: "p",
        text: "**A QR code cannot:**",
      },
      {
        type: "ul",
        items: [
          "Install an app by itself.",
          "Run a program on your phone.",
          "Take money from your account by itself.",
          "Send a message or place a call without you tapping send or call.",
        ],
      },
      {
        type: "p",
        text: "The danger starts after you tap. The page you land on may ask you to log in, pay, download a file or app, or allow notifications. Treat it as you would a link in an unexpected email. Keep your phone and browser updated, because a malicious page can occasionally take advantage of flaws in old software. Be careful with WiFi codes in public places too, since a code could connect you to a network run by someone you do not know.",
      },
      { type: "h2", id: "what-is-quishing", text: "What is quishing?" },
      {
        type: "p",
        text: "Quishing is phishing with a QR code. Instead of a suspicious written link, the victim gets a code that leads to a fake page made to look like a real login, delivery or payment page. It works for a few reasons. People cannot read a QR code by eye. Phone screens show less of a web address than a computer does. And a link hidden inside an image can be harder for some email filters to inspect than a written one.",
      },
      {
        type: "p",
        text: "Common forms include:",
      },
      {
        type: "ul",
        items: [
          "**Emails and letters** claiming there is a problem with your account, a parcel or a payment, and asking you to scan a code to sort it out.",
          "**Fake codes on parking meters and pay stations** that lead to copycat payment pages.",
          "**Stickers over genuine codes** on menus, posters and flyers.",
          "**Messages offering prizes, refunds or discounts** if you scan and enter your details.",
        ],
      },
      {
        type: "p",
        text: "The common thread is urgency. A real organisation rarely needs you to act within minutes through a code you did not expect.",
      },
      { type: "h2", id: "stickers-over-real-codes", text: "Stickers placed over real codes" },
      {
        type: "p",
        text: "The simplest trick needs nothing more than a printer and a sheet of stickers. A scammer prints a code that points to their own site and sticks it over the real one on a sign, a menu or a machine. To anyone passing by, it looks like part of the design.",
      },
      {
        type: "ul",
        items: [
          "Look for raised or peeling edges, a code that sits slightly crooked, or a finish that differs from the rest of the sign.",
          "Watch for a code that looks newer or brighter than the material around it.",
          "Be suspicious of two codes where you would expect one.",
          "After scanning, check that the address matches the organisation named on the sign.",
        ],
      },
      { type: "h2", id: "parking-and-payment-scams", text: "Parking meters and payment scams" },
      {
        type: "p",
        text: "Payments are where fake codes do the most harm. Councils, police and consumer bodies in several countries have warned about fake codes on parking meters and pay stations. The victim pays on a copycat site, the card details are stolen, and the parking is not actually paid, so a fine can follow.",
      },
      {
        type: "ol",
        items: [
          "Use the parking operator's official app from your phone's app store, or type its website address yourself.",
          "If the sign prints a web address, compare it with the one in the scan preview.",
          "Be wary of a page that asks for card details straight away or looks generic.",
          "If in doubt, pay at the machine, by phone, or with another method shown on the sign.",
          "If you think you have paid a fake site, contact your bank straight away.",
        ],
      },
      {
        type: "tip",
        text: "If a QR code takes you to a login page, close it. Open the official app or type the website address yourself and log in from there. A genuine request will still be waiting for you.",
      },
      { type: "h2", id: "check-before-you-tap", text: "How to check a QR code before you open it" },
      {
        type: "ol",
        items: [
          "**Read the preview.** Recent iPhone and Android cameras show the address before opening it. Our guide on [how to scan a QR code](/guides/how-to-scan-a-qr-code) shows where to look.",
          "**Check the domain name.** This is the part just before the first single slash. Look for misspellings, extra words, swapped letters or a name that has nothing to do with the organisation.",
          "**Be careful with unfamiliar short links.** A short link hides the final destination. Many businesses use them honestly, but they deserve more care when the code is in a public place.",
          "**Look at what the page asks for.** A menu should not need a password. A poster should not need your card details.",
          "**Install apps only from the official store.** If a page tells you to download an app, search for it in the store yourself.",
          "**When unsure, do not scan.** Type the organisation's address into your browser instead.",
        ],
      },
      { type: "h2", id: "advice-for-businesses", text: "How businesses can protect their QR codes" },
      {
        type: "p",
        text: "If customers scan your codes, you can make fake ones much easier to spot.",
      },
      {
        type: "ul",
        items: [
          "**Make tampering obvious.** Print codes directly onto signs, menus and packaging, not on loose stickers. Put codes in public places behind glass or acrylic, or use tamper-evident labels that show when they have been peeled.",
          "**Use a short, branded domain.** When the scan preview shows your own name, customers can check it. Print the same address as text under the code.",
          "**Check printed codes regularly.** Ask staff to scan each code on a schedule and look for stickers that should not be there. With dynamic codes on a [paid plan](/pricing), a sudden drop in scans at one location can be a sign that a code has been covered.",
          "**Tell customers what to expect.** A line such as \"Our codes only lead to our own website\" helps people spot fakes. Never ask for passwords through a code.",
          "**Protect the account behind dynamic codes.** Whoever controls that login controls where every printed code points. Use a strong, unique password.",
          "**Choose a generator you can trust.** A static code shows exactly what it contains and depends on no outside service. The [StayQR free generator](/qr-code-generator) creates codes in your browser, and nothing you type is sent to a server.",
        ],
      },
      {
        type: "p",
        text: "If you are deciding which kind of code to use, our guide to [static vs dynamic QR codes](/guides/static-vs-dynamic-qr-codes) covers the trade-offs.",
      },
    ],
    faq: [
      {
        q: "Can scanning a QR code hack my phone?",
        a: "Scanning only reads the text in the code, and a code cannot install anything by itself. The risk is the page or action you choose to open, so check the preview and keep your phone updated.",
      },
      {
        q: "How can I tell if a QR code is fake?",
        a: "Check the address in the scan preview against the organisation you expect. In public places, look for stickers placed over the original code and be wary of any page that asks you to log in or pay straight away.",
      },
      {
        q: "Is it safe to pay with a QR code?",
        a: "It can be, when you scan inside a trusted banking or payment app or at a counter you trust. For street payments such as parking, the operator's official app or a website you type yourself is safer.",
      },
      {
        q: "What should I do if I entered my details on a fake site?",
        a: "Contact your bank straight away if you entered card details. Change any password you typed, switch on two-factor sign-in where you can, and report the fake code to the organisation it imitated.",
      },
    ],
    relatedTools: ["url", "paypal", "wifi"],
  },
];
