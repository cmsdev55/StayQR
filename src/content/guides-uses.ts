import type { Guide } from "@/content/guides";

export const GUIDES_USES: Guide[] = [
  // ── 1. Business card ────────────────────────────────────────────────
  {
    slug: "qr-code-business-card",
    title: "QR code on a business card: vCard, size and tips",
    h1: "How to put a QR code on your business card",
    description:
      "Put a QR code on your business card with a vCard that saves your details or a link to a profile. Which fields to add, vCard 3.0, size and how to test it.",
    category: "Use cases",
    published: "2026-10-26",
    updated: "2026-10-26",
    readMinutes: 7,
    summary:
      "A QR code on a business card should save you into someone's phone in one scan. Here is how to choose between a vCard and a link, what to include and how to print it so it works.",
    body: [
      {
        type: "p",
        text: "To put a QR code on a business card, first decide what the scan should do. A **vCard QR code** stores your contact details in the pattern itself, so one scan offers to save you straight into the phone's contacts, with no internet needed. A **link QR code** opens a profile page, such as your website or LinkedIn, which you can update at any time. Print the code about **2.5 cm (1 in) wide** on the back of a standard 85 x 55 mm card, and test a printed proof on an iPhone and an Android phone before you order.",
      },
      { type: "h2", id: "vcard-or-link", text: "vCard or a link to a profile page?" },
      {
        type: "p",
        text: "Both work well. They suit different people and different kinds of card.",
      },
      {
        type: "table",
        head: ["", "vCard QR code", "Link to a profile page"],
        rows: [
          ["What a scan does", "Offers to save a new contact", "Opens a web page"],
          ["Internet needed", "No", "Yes"],
          ["Change details after printing", "No, you reprint the cards", "Yes, edit the page"],
          ["What it can hold", "Contact fields only", "Anything a web page can show"],
          ["Pattern density", "Higher, and grows with each field", "Low with a short address"],
          ["Best for", "Networking and saving you to contacts", "Portfolios, changing roles, rich profiles"],
        ],
      },
      {
        type: "p",
        text: "A vCard is the better default for most people. The point of a business card is to end up in someone's contacts, and a vCard gets there in one step. Nobody has to hunt for a save button on a web page or type your number in by hand.",
      },
      {
        type: "p",
        text: "A link makes more sense when your details change often, or when the page does more to sell you than a contact entry could. A designer might link to a portfolio, a consultant to a booking page. If you take this route, put a clear save-contact option near the top of the page. For a professional profile, the [LinkedIn QR code generator](/qr-code-generator/linkedin) makes a code that opens it directly.",
      },
      { type: "h2", id: "fields-to-include", text: "Which fields to include in a vCard" },
      {
        type: "p",
        text: "Every field you add makes the code denser and the modules smaller. Include what someone needs to contact you again, and leave out the rest.",
      },
      {
        type: "ul",
        items: [
          "**Name.** First name and surname, each in its own box, so the phone files you correctly.",
          "**Job title and company.** These help people remember where they met you and why.",
          "**Mobile number.** Write it in international format, such as +44 7700 900123, so it dials correctly from any country.",
          "**Email address.** One work address is enough.",
          "**Website.** A single short address. Your homepage or a profile page beats a long deep link.",
          "**Address.** Only if people visit you. A full postal address adds a lot of characters for little benefit.",
        ],
      },
      {
        type: "p",
        text: "Leave out photos, long notes and second or third phone numbers. A photo in particular can make the data far too large for a code that fits on a card. Social profiles are better reached through your website than squeezed into the vCard.",
      },
      {
        type: "p",
        text: "To see why this matters, compare sizes. A short web address produces a code around 29 modules wide. A vCard with name, title, company, mobile, email and website runs to roughly 200 characters, which needs a grid of around 57 modules. Printed at 2.5 cm, each of those modules is less than half a millimetre across.",
      },
      { type: "h2", id: "vcard-3-compatibility", text: "Why vCard 3.0 is the safe format" },
      {
        type: "p",
        text: "A vCard is plain text with one field per line. Three versions are in common use: 2.1, 3.0 and 4.0. Version 3.0, defined in RFC 2426, is the one phone scanners handle most consistently. The iPhone camera, Android camera apps and most scanner apps read it. Version 4.0 is newer, but support in phone scanners is less even, and it adds nothing a business card needs. The [vCard QR code generator](/qr-code-generator/vcard) on StayQR writes vCard 3.0 for this reason.",
      },
      {
        type: "p",
        text: "A compact vCard 3.0 for a business card looks like this, one line at a time:",
      },
      {
        type: "ul",
        items: [
          "**BEGIN:VCARD** and **END:VCARD** mark the start and the end.",
          "**VERSION:3.0** tells the phone which format to expect.",
          "**N:Morgan;Alex** is the structured name, surname first, then first name.",
          "**FN:Alex Morgan** is the name as it should be displayed.",
          "**ORG:Example Studio** and **TITLE:Creative Director** add the company and role.",
          "**TEL;TYPE=CELL:+447700900123** is the mobile number.",
          "**EMAIL:alex@example.com** and **URL:https://example.com** add the email address and website.",
        ],
      },
      {
        type: "p",
        text: "A generator writes all of this for you. If you build the text by hand, two details cause most problems. The N field must hold the surname before the first name, or the phone saves you back to front. And accented letters or non-Latin scripts, while fine on recent phones, should be tested, because some older scanner apps mishandle them.",
      },
      { type: "h2", id: "size-and-placement", text: "Size and placement on an 85 x 55 mm card" },
      {
        type: "p",
        text: "The standard UK and European business card is 85 x 55 mm. The common US size is 3.5 x 2 in, about 89 x 51 mm. Either way space is tight, so the right size depends on what the code holds.",
      },
      {
        type: "ul",
        items: [
          "**Short link:** about 2 to 2.5 cm (0.8 to 1 in) wide is enough.",
          "**vCard:** about 2.5 to 3 cm (1 to 1.2 in) wide, because the grid is much finer.",
          "**Quiet zone:** keep a clear, light margin of 4 modules on every side, free of text and lines.",
          "**Safe area:** keep the code and its margin a few millimetres inside the trim line, so the cutting never clips it.",
        ],
      },
      {
        type: "p",
        text: "The back of the card is usually the best place. It leaves the front clean for your name and logo, and the code can sit at a generous size on its own. If it has to go on the front, put it in a corner opposite the logo, at the same size.",
      },
      {
        type: "p",
        text: "Print quality matters as much as size. Use dark modules on white or very light stock, send your printer an SVG or PDF, and keep foil, embossing, spot gloss and heavy texture away from the code. Matte finishes scan more reliably than gloss. The [QR code size guide](/guides/qr-code-size-for-printing) explains the numbers behind these sizes.",
      },
      {
        type: "p",
        text: "A small logo in the centre is fine. Uploading one switches StayQR codes to error correction level H, so the code still reads with the centre covered. On a dense vCard, though, every module counts, so keep the logo small or leave it out. Our guide to [error correction levels](/guides/qr-code-error-correction) explains the trade-off.",
      },
      { type: "h2", id: "test-on-iphone-and-android", text: "Test on iPhone and Android contacts" },
      {
        type: "p",
        text: "Test a printed proof, not the design on your screen. A code that scans from a monitor can fail at 2.5 cm on real card stock.",
      },
      {
        type: "ol",
        items: [
          "Scan with the camera on an iPhone. Tap the banner that appears to open a contact preview, then save it as a new contact.",
          "Scan with the camera on an Android phone, ideally two different brands. Depending on the camera app, you will see an option to add a contact or a card showing the details.",
          "Open the saved contact and check every field: name in the right order, job title, company, phone, email and website.",
          "Tap the phone number and the email address to check they start a call and a new message.",
          "Tap the website and check the page loads properly on a phone.",
          "Scan from the distance people hold a card, about 15 to 25 cm, in ordinary indoor light.",
        ],
      },
      {
        type: "p",
        text: "The wording on screen changes between phone software versions, so do not worry if the buttons look slightly different. What matters is that the contact saves with every field in the right place.",
      },
      {
        type: "tip",
        text: "Print one card at the final size on an office printer, or order a small proof run, before the full order. A mistake in a vCard is repeated on every card, and a wrong digit in a phone number is easy to miss on screen.",
      },
      { type: "h2", id: "add-a-call-to-action", text: "Tell people what the code does" },
      {
        type: "p",
        text: "A bare square on a card can look like decoration. Add a few words beside it, such as \"Scan to save my contact\" or \"Scan for my portfolio\", so people know what will happen. A frame with a short label does this neatly. Keep your name, number and email printed on the card as well. Some people prefer to type details by hand, and a card that relies only on a code fails the moment a phone will not scan.",
      },
      {
        type: "p",
        text: "The [free QR code generator](/qr-code-generator) makes vCard and link codes with frames, colours and logos, and downloads PNG, SVG, JPEG or PDF with no sign-up and no watermark.",
      },
    ],
    faq: [
      {
        q: "Should I use a vCard or a LinkedIn link on my business card?",
        a: "Use a vCard if you want people to save you as a contact in one step. Use a LinkedIn or website link if your role changes often or the profile does more to sell you than a contact entry would.",
      },
      {
        q: "What size should a QR code be on a business card?",
        a: "About 2 to 2.5 cm wide for a short link and 2.5 to 3 cm for a full vCard, plus a clear margin of 4 modules on every side. Test a printed proof before ordering.",
      },
      {
        q: "Does a vCard QR code need the internet?",
        a: "No. The contact details are stored in the code itself, so the phone can save them offline. Only the website field needs a connection, and only when someone taps it.",
      },
      {
        q: "Can I update a vCard QR code after printing?",
        a: "No. The details are fixed in the printed pattern. If you expect them to change, link to a profile page you can edit instead.",
      },
      {
        q: "Why does my vCard save my name in the wrong order?",
        a: "The N field holds the surname first, then the first name. Check that each part of your name is in the correct box in the generator.",
      },
    ],
    relatedTools: ["vcard", "linkedin", "url"],
  },

  // ── 2. Error correction ─────────────────────────────────────────────
  {
    slug: "qr-code-error-correction",
    title: "QR code error correction levels: L, M, Q and H explained",
    h1: "QR code error correction: how the L, M, Q and H levels work",
    description:
      "QR codes have four error correction levels, L, M, Q and H, which recover about 7, 15, 25 and 30% of damage. Learn the density trade-off and when to use each.",
    category: "Basics",
    published: "2026-10-26",
    updated: "2026-10-26",
    readMinutes: 6,
    summary:
      "Error correction is what lets a scratched, smudged or logo-covered QR code still scan. Choosing the right level is a balance between toughness and size.",
    body: [
      {
        type: "p",
        text: "QR codes have four error correction levels. **Level L** can restore about 7% of the data if the code is damaged, **M** about 15%, **Q** about 25% and **H** about 30%. Higher levels make a code more robust but add modules, so the pattern gets denser for the same content. M suits most printed codes, Q suits codes that face rough handling, and H is the right choice when a logo covers part of the code.",
      },
      { type: "h2", id: "how-error-correction-works", text: "How QR code error correction works" },
      {
        type: "p",
        text: "A QR code stores data as a sequence of 8-bit blocks called codewords. Alongside your data, it stores extra codewords calculated with Reed-Solomon coding, the same family of error correction used on CDs and DVDs. If some codewords are missing or misread, a scanner can work out the original from the ones that remain.",
      },
      {
        type: "p",
        text: "The level decides how many of these extra codewords the code carries. More recovery data means more codewords in total, and more codewords mean more modules in the grid. The level is recorded in the code's format information, next to the corner squares, so a scanner always knows which level it is reading. You only choose a level when you make a code, never when you scan one.",
      },
      {
        type: "p",
        text: "Strictly, the percentages describe codewords, not area. In practice it is fair to think of them as the share of the code that can be dirty, scratched or covered and still scan. Two limits are worth knowing:",
      },
      {
        type: "ul",
        items: [
          "**The finder patterns are not protected.** The three large squares in the corners tell the scanner where the code is and which way up it sits. Cover or damage one and the code can fail at any level.",
          "**Where the damage falls matters.** A tear through the format information, or a dense patch of damage, can do more harm than the same amount of small specks spread across the code.",
        ],
      },
      { type: "h2", id: "the-four-levels", text: "The four levels compared" },
      {
        type: "table",
        head: ["Level", "Recovers about", "Density", "Typical use"],
        rows: [
          ["L (Low)", "7%", "Lowest", "Screens, large clean prints, very long content"],
          ["M (Medium)", "15%", "Moderate", "Most printed codes: flyers, menus, business cards"],
          ["Q (Quartile)", "25%", "Higher", "Outdoor signs, packaging, codes handled often"],
          ["H (High)", "30%", "Highest", "Codes with a logo, harsh conditions"],
        ],
      },
      {
        type: "p",
        text: "M is a common default in QR software, and for good reason. It survives everyday wear without making the code much denser than L.",
      },
      { type: "h2", id: "density-trade-off", text: "The trade-off: robustness against density" },
      {
        type: "p",
        text: "QR codes come in 40 versions, each with a fixed grid, from 21 x 21 modules at version 1 to 177 x 177 at version 40. Raising the error correction level gives more of that grid to recovery data and less to your content, so the same content can need a larger version.",
      },
      {
        type: "p",
        text: "Here is what happens to a typical 50-character web address at each level:",
      },
      {
        type: "table",
        head: ["Level", "Version needed", "Grid size"],
        rows: [
          ["L", "3", "29 x 29 modules"],
          ["M", "4", "33 x 33 modules"],
          ["Q", "5", "37 x 37 modules"],
          ["H", "6", "41 x 41 modules"],
        ],
      },
      {
        type: "p",
        text: "Printed at the same 3 cm width, each module at level H is about 30% smaller than at level L. Smaller modules need sharper printing, a steadier hand and a closer scan. So higher error correction is not free. It buys resilience by spending print size.",
      },
      {
        type: "p",
        text: "The capacity limits show the same pattern at the extreme. The largest code, version 40, holds up to 2,953 bytes at level L but only 1,273 at level H. Real codes are nowhere near those limits, but the ratio holds at every size.",
      },
      {
        type: "p",
        text: "If a code needs to be small, the best fix is shorter content, not a lower level. The [print size guide](/guides/qr-code-size-for-printing) covers minimum sizes and scanning distance.",
      },
      { type: "h2", id: "when-to-choose-each-level", text: "When to choose each level" },
      { type: "h3", text: "Level L" },
      {
        type: "p",
        text: "Use L when the code is shown on a screen, printed large somewhere clean, or must hold a lot of data in a fixed space. A code on a slide or a web page rarely gets scratched. L leaves almost no margin for damage, so avoid it for anything handled, outdoors or printed small.",
      },
      { type: "h3", text: "Level M" },
      {
        type: "p",
        text: "Use M for most print: flyers, indoor posters, menus, business cards and labels. It copes with light smudges, small printing faults and a little glare.",
      },
      { type: "h3", text: "Level Q" },
      {
        type: "p",
        text: "Use Q when the code will take a beating: outdoor signs, shipping labels, product packaging, stickers on equipment, or anything likely to get wet, scuffed or partly covered. Accept a slightly larger print in return.",
      },
      { type: "h3", text: "Level H" },
      {
        type: "p",
        text: "Use H when part of the code will be covered on purpose, usually by a logo, or when conditions are harsh and the code can be printed large enough to absorb the extra density.",
      },
      { type: "h2", id: "logos-and-level-h", text: "Logos and why they need level H" },
      {
        type: "p",
        text: "A logo in the middle of a QR code hides real modules. The scanner treats them as damage and rebuilds the missing data from the error correction codewords. That is why logos work at all, and why they need the highest level.",
      },
      {
        type: "p",
        text: "A logo also spends the recovery budget before the code has met any real-world wear. If the logo uses most of what level H can restore, there is little left for a scratch, a reflection or a slightly soft print. Follow a few rules:",
      },
      {
        type: "ul",
        items: [
          "Keep the logo to around 20 to 25% of the code's area at most, and smaller where you can.",
          "Place it in the centre, well away from the three corner squares.",
          "Give it a light border so its edge does not blur into the modules around it.",
          "Keep the content short, so the grid stays coarse even at level H.",
        ],
      },
      {
        type: "p",
        text: "On the [StayQR generator](/qr-code-generator), uploading a logo switches error correction to H automatically, so a logo can never be paired with a low level by mistake. For more on logos, colour and contrast, read our [design best practices guide](/guides/qr-code-design-best-practices).",
      },
      { type: "h2", id: "setting-the-level", text: "Setting the level in practice" },
      {
        type: "p",
        text: "Many generators pick a level for you and never show it. The StayQR generator has an Advanced panel where you can choose L, M, Q or H yourself when there is no logo. The same panel sets the quiet zone, the blank margin around the code, from 2 to 8 modules. The standard recommends 4, which is the safe choice for print.",
      },
      {
        type: "ol",
        items: [
          "Start with M for a plain printed code.",
          "Move to Q if the code will live outdoors or be handled often.",
          "Use H whenever you add a logo. StayQR does this for you.",
          "Drop to L only for screens, or when the content is long and the space is fixed.",
          "If the code becomes too dense at the level you need, shorten the content. A dynamic code holds only a short redirect link, which keeps the grid simple even at H. See [static vs dynamic QR codes](/guides/static-vs-dynamic-qr-codes).",
        ],
      },
      {
        type: "tip",
        text: "If you are unsure, use M without a logo and H with one. Then print a proof at the final size and scan it with several phones. A test print tells you more than any rule of thumb.",
      },
    ],
    faq: [
      {
        q: "What is the best QR code error correction level?",
        a: "For most printed codes, M. Use Q for outdoor or heavily handled codes and H whenever a logo covers part of the code.",
      },
      {
        q: "Does higher error correction make a QR code easier to scan?",
        a: "Not by itself. It makes a code more tolerant of damage, but it also makes the modules smaller at the same print size, which can make a small code harder to read.",
      },
      {
        q: "Can I change the error correction level of a printed code?",
        a: "No. The level is part of the printed pattern. To change it, generate a new code and replace the old one.",
      },
      {
        q: "Why does adding a logo change the error correction level?",
        a: "A logo covers modules, which the scanner treats as damage. Level H restores the most data, so it gives the code the best chance of scanning with its centre covered.",
      },
      {
        q: "Does level H mean I can cover 30% of the code?",
        a: "Not safely. The figure refers to codewords, the corner squares are not protected at all, and some of the budget should be kept for wear and print faults.",
      },
    ],
    relatedTools: ["url", "text", "wifi"],
  },

  // ── 3. Google reviews ───────────────────────────────────────────────
  {
    slug: "qr-code-for-google-reviews",
    title: "QR code for Google reviews: how to make one",
    h1: "How to make a QR code for Google reviews",
    description:
      "Make a QR code for Google reviews from your Business Profile review link. Where to place it, how to test it, and Google's rules on incentives and gating.",
    category: "Use cases",
    published: "2026-10-26",
    updated: "2026-10-26",
    readMinutes: 6,
    summary:
      "A review QR code takes customers straight to your Google review form. Here is how to get the link, where the code works best and which rules you must not break.",
    body: [
      {
        type: "p",
        text: "To make a QR code for Google reviews, open your Google Business Profile, find the option to ask for reviews and copy the review link it gives you. Paste that link into a URL QR code generator, download the code and print it where customers finish their visit, such as receipts, the counter or table tents. Scanning it opens your review form on Google, ready for the customer to rate and write.",
      },
      { type: "h2", id: "get-your-review-link", text: "Get your review link from Google Business Profile" },
      {
        type: "p",
        text: "Google gives each verified Business Profile a short link that opens the review form directly. You need to be an owner or manager of the profile to see it.",
      },
      {
        type: "ol",
        items: [
          "Sign in to the Google account that manages your business.",
          "Search for your business name on Google, or open it in Google Maps, to bring up your profile and its management tools.",
          "Look for an option called something like **Ask for reviews**, **Get more reviews** or **Share review form**. Google changes this wording from time to time, but it usually sits near the reviews section.",
          "Copy the link it shows. It is a short web address made for sharing.",
          "Open the link on your phone to check it brings up the review form for the right business.",
        ],
      },
      {
        type: "p",
        text: "If you cannot find the option, check that the profile is verified and that you are signed in with the right account. Google's Business Profile help pages describe the current steps.",
      },
      {
        type: "p",
        text: "Customers must be signed in to a Google account to post a review. Many Android users already are. Others will be asked to sign in first, which is normal and not a fault in your code.",
      },
      { type: "h2", id: "make-the-code", text: "Turn the review link into a QR code" },
      {
        type: "p",
        text: "A review link is an ordinary web address, so it needs a URL code.",
      },
      {
        type: "ol",
        items: [
          "Open the [URL QR code generator](/qr-code-generator/url) and paste your review link.",
          "Add a frame with a clear label, such as \"Review us on Google\" or \"How did we do?\".",
          "Add your logo and colours if you like, keeping the modules dark on a light background.",
          "Download SVG or PDF for a print shop, or a high resolution PNG for printing in house.",
          "Print one copy and scan it with an iPhone and an Android phone before printing more.",
        ],
      },
      {
        type: "p",
        text: "A static code is fine for this. Your review link should not change, and a static code never expires and has no scan limit. A dynamic code is worth considering if you want to count scans from each placement, or keep the option to point the code somewhere else later. Our guide on [how to track QR code scans](/guides/track-qr-code-scans) explains the options.",
      },
      { type: "h2", id: "test-like-a-customer", text: "Test it the way a customer would" },
      {
        type: "p",
        text: "Before you print in volume, test the whole journey, not just the scan.",
      },
      {
        type: "ol",
        items: [
          "Scan the printed code with a phone that is not signed in to your business account, so you see what a customer sees.",
          "Check the review form opens for the right business, especially if you manage more than one location.",
          "Try it on mobile data as well as on your own WiFi.",
          "Check that the label, the code and the page it opens all describe the same thing.",
        ],
      },
      {
        type: "p",
        text: "If you run several branches, give each one its own code made from that branch's review link. A single shared code sends every review to one profile. Recheck your codes every few months, too. Receipt layouts change, stickers fade, and it is worth confirming the link still opens the right form.",
      },
      { type: "h2", id: "where-to-place-it", text: "Where to place a Google review QR code" },
      {
        type: "p",
        text: "Ask while the experience is fresh and the customer has a spare minute. That is usually at the end of the visit or soon after it.",
      },
      {
        type: "table",
        head: ["Placement", "Why it works", "Suggested code width"],
        rows: [
          ["Receipts", "Every customer gets one at the end of the visit", "2.5 to 3 cm"],
          ["Counter or till card", "Seen while paying or waiting", "4 to 5 cm"],
          ["Table tents", "Read while waiting for the bill", "4 to 5 cm"],
          ["Printed invoices", "Reach customers once a job is finished", "2.5 to 3 cm"],
          ["Packaging and thank-you cards", "Opened at home, with time to spare", "2.5 to 3 cm"],
          ["Door or window sticker", "Seen as customers leave", "10 cm or more"],
        ],
      },
      {
        type: "p",
        text: "Thermal receipt printers give lower contrast than office printers, and the paper fades over time. Print the code as large as the receipt layout allows, and test it on a real receipt, not on screen. The [print size guide](/guides/qr-code-size-for-printing) explains how scanning distance sets the minimum size.",
      },
      {
        type: "p",
        text: "On invoices sent by email, a clickable link works better than a code, because the customer is already on a device. Keep the code for the printed version. Cafés and restaurants can find more placement ideas on our page about [QR codes for restaurants](/industries/restaurants).",
      },
      { type: "h2", id: "google-review-rules", text: "The rules: no incentives and no review gating" },
      {
        type: "p",
        text: "Google's review policies are strict, and breaking them can cost you more than a few reviews. Two rules matter most for any QR code campaign.",
      },
      { type: "h3", text: "Do not offer incentives" },
      {
        type: "p",
        text: "Google's policies prohibit offering anything in return for a review. That includes discounts, free items, prize draw entries, loyalty points and payment. It applies even if you ask for an honest review rather than a good one. A sign that says \"Leave a review, get 10% off\" breaks the rules.",
      },
      { type: "h3", text: "Do not gate or filter reviews" },
      {
        type: "p",
        text: "Review gating means sorting customers before you ask. A common example is a page that asks \"Did you enjoy your visit?\", sends happy customers to Google and sends unhappy ones to a private form. Google's policies prohibit selectively asking only satisfied customers for reviews. Give everyone the same link, the same way.",
      },
      {
        type: "p",
        text: "If you want private feedback as well, offer it alongside the Google link, to everyone, not as a filter in front of it. A few other things are also off limits:",
      },
      {
        type: "ul",
        items: [
          "Writing reviews of your own business, or asking staff, friends or family to.",
          "Posting a review on a customer's behalf, even if they ask you to.",
          "Buying reviews, or using a service that sells them.",
        ],
      },
      {
        type: "p",
        text: "Google can remove reviews and take action against a profile that breaks these rules. Consumer protection law in many countries also treats fake and misleading reviews seriously. The safe approach is simple: ask every customer, in the same way, for an honest review.",
      },
      { type: "h2", id: "getting-more-reviews", text: "Getting more reviews the honest way" },
      {
        type: "ul",
        items: [
          "**Ask in person.** A short spoken request at the till, pointing to the code, works better than a sign on its own.",
          "**Ask everyone.** Train staff to ask every customer, not only regulars or people who seem pleased.",
          "**Keep it quick.** Tell people it takes a minute. Do not suggest a star rating or wording.",
          "**Reply to reviews.** Thank people for good reviews and answer criticism calmly and specifically. Future customers read the replies.",
          "**Keep codes in good shape.** Replace faded, torn or stained codes. A code that will not scan wastes the moment.",
        ],
      },
      {
        type: "tip",
        text: "Give the review code its own card or sticker, away from your menu or WiFi code. One code with one clear label means nobody scans the wrong thing, and staff can point to it without explaining.",
      },
      {
        type: "p",
        text: "You can make the code in a minute with the [free QR code generator](/qr-code-generator), with no sign-up and no watermark.",
      },
    ],
    faq: [
      {
        q: "How do I get a QR code for Google reviews?",
        a: "Copy the review link from your Google Business Profile, paste it into a URL QR code generator and download the code. Test it on a phone before printing.",
      },
      {
        q: "Can I offer a discount in exchange for a Google review?",
        a: "No. Google's policies prohibit offering incentives of any kind in exchange for reviews, including discounts, free items and prize draws.",
      },
      {
        q: "Can I send only happy customers to Google?",
        a: "No. Selectively asking satisfied customers for reviews, often called review gating, is prohibited by Google's policies. Ask every customer the same way.",
      },
      {
        q: "Do customers need a Google account to leave a review?",
        a: "Yes. Anyone can scan the code, but they must be signed in to a Google account to post a review.",
      },
      {
        q: "Will a Google review QR code expire?",
        a: "A static code never expires. It keeps working for as long as the review link stays valid, so scan it every few months to check.",
      },
    ],
    relatedTools: ["url", "location"],
  },

  // ── 4. Track scans ──────────────────────────────────────────────────
  {
    slug: "track-qr-code-scans",
    title: "How to track QR code scans: UTM links and analytics",
    h1: "How to track QR code scans",
    description:
      "Static QR codes cannot count scans. Track them with UTM parameters and web analytics, or dynamic codes that log time, city and device. Privacy tips included.",
    category: "Basics",
    published: "2026-10-26",
    updated: "2026-10-26",
    readMinutes: 6,
    summary:
      "Knowing whether a printed code gets scanned turns a guess into a decision. Here are the two ways to measure scans, what the numbers mean and what they cannot tell you.",
    body: [
      {
        type: "p",
        text: "To track QR code scans, you need something that records each scan, because a standard static code sends phones straight to the destination and nothing in between counts them. There are two practical options: add **UTM parameters** to the link so your web analytics can identify visits from the code, or use a **dynamic QR code**, which passes every scan through a redirect that logs the time, approximate location and device.",
      },
      { type: "h2", id: "why-static-codes-cannot-be-tracked", text: "Why a static QR code cannot track scans" },
      {
        type: "p",
        text: "A static QR code is data in a printed pattern. When a phone scans it, the phone reads the web address and opens it directly. No server sits in between, and nobody is told the scan happened. The code has no memory and no connection.",
      },
      {
        type: "p",
        text: "That is also why static codes never expire and have no scan limit. The property that makes them durable makes them invisible to measurement. Anything you learn about a static code has to come from the place it sends people.",
      },
      {
        type: "p",
        text: "So there are two places to measure: at the destination, once the visitor arrives, or in the middle, with a redirect that sees every scan.",
      },
      { type: "h2", id: "utm-parameters", text: "Option 1: UTM parameters and web analytics" },
      {
        type: "p",
        text: "UTM parameters are tags added to the end of a web address. Analytics tools, including Google Analytics, read them and group visits under the source, medium and campaign you choose. A tagged link for a flyer might look like this: https://example.com/offer?utm_source=flyer&utm_medium=qr&utm_campaign=spring-sale",
      },
      {
        type: "p",
        text: "Five parameters are standard:",
      },
      {
        type: "ul",
        items: [
          "**utm_source**: where the visit came from, such as flyer, poster or packaging.",
          "**utm_medium**: the channel, such as qr or print.",
          "**utm_campaign**: the campaign name, such as spring-sale.",
          "**utm_content**: optional, to tell placements or versions apart, such as window or counter.",
          "**utm_term**: optional, and mainly used for paid search keywords.",
        ],
      },
      {
        type: "p",
        text: "This approach is free and works with a static code. It has real limits, though:",
      },
      {
        type: "ul",
        items: [
          "**It only works on your own website.** The destination must have your analytics installed. It cannot measure scans that lead to a social profile, an app store or a file hosted elsewhere.",
          "**It counts visits, not scans.** If a visitor declines analytics cookies, uses a blocker or leaves before the page loads, the visit may not be recorded.",
          "**It makes the code denser.** A longer link means more modules and smaller ones at the same size. Keep tags short. The [print size guide](/guides/qr-code-size-for-printing) explains why this matters.",
          "**It is fixed.** If you mistype a tag, every printed code carries the mistake.",
        ],
      },
      {
        type: "p",
        text: "Use lower case and keep naming consistent, because analytics tools treat Flyer and flyer as two different sources. Build the tagged link, open it in a browser to check it works, then paste it into the [URL QR code generator](/qr-code-generator/url).",
      },
      { type: "h2", id: "dynamic-qr-codes", text: "Option 2: dynamic QR codes with scan analytics" },
      {
        type: "p",
        text: "A dynamic QR code encodes a short link run by a QR service. Each scan reaches the service first, which records it and then forwards the phone to your destination. Because the measurement happens in the redirect, it counts scans whatever the destination is: your website, a menu PDF, a booking page or a social profile.",
      },
      {
        type: "p",
        text: "Dynamic codes bring other benefits to a campaign. You can change the destination after printing, and the short link keeps the printed pattern simple. The trade-off is that the code depends on the provider keeping the redirect running, so check what happens to your codes if you stop paying. Our guide to [static vs dynamic QR codes](/guides/static-vs-dynamic-qr-codes) covers the difference in detail.",
      },
      {
        type: "p",
        text: "StayQR's paid plans include dynamic codes with scan analytics by device, city and time of day. If you cancel, the codes keep redirecting to the last destination you set, so printed material never goes dead. Pro is $3.99 a month or $29 a year, and Lifetime is $79 once. See [pricing](/pricing) for details.",
      },
      {
        type: "p",
        text: "You can also combine both methods. Point a dynamic code at a UTM-tagged address. The dynamic code counts every scan, the UTM tags show what visitors did on your site, and the printed pattern stays simple because it only holds the short link.",
      },
      { type: "h2", id: "what-scan-analytics-show", text: "What scan analytics can and cannot tell you" },
      {
        type: "table",
        head: ["Data point", "Available?", "Where it comes from"],
        rows: [
          ["Number of scans", "Yes", "Each request to the redirect is logged"],
          ["Date and time", "Yes", "Recorded when the scan reaches the server"],
          ["Approximate city or region", "Yes, roughly", "Estimated from the connection's IP address"],
          ["Device type and operating system", "Yes", "Read from the browser's user agent"],
          ["Name, email or phone number", "No", "A phone does not send these when it scans"],
          ["Exact location", "No", "Not available from a scan alone"],
        ],
      },
      {
        type: "p",
        text: "Location is the figure people misread most often. It is based on the IP address of the phone's connection, and mobile networks often route traffic through a hub in another town. VPNs and privacy relay services move it further still. Treat city data as a pattern across many scans, not a fact about any one person.",
      },
      {
        type: "p",
        text: "Scan counts need context too. Your own test scans are counted. One person may scan twice. A unique scan figure, where a service offers one, is an estimate. And a scan is not a sale. It shows interest, not what happened next, which is where UTM tags and your web analytics fill the gap.",
      },
      {
        type: "p",
        text: "To compare placements, give each one its own code. A poster, a flyer and a receipt sharing one code produce one combined total. Separate codes, or separate utm_content values, show which placement earns its space.",
      },
      { type: "h2", id: "privacy-considerations", text: "Privacy considerations" },
      {
        type: "p",
        text: "Scan analytics does not reveal who someone is, but it can still involve personal data. IP addresses can count as personal data under laws such as the UK and EU GDPR. Treat scan data with the same care as the rest of your analytics.",
      },
      {
        type: "ul",
        items: [
          "**Say what you collect.** Mention QR code analytics in your privacy notice if you use it.",
          "**Respect consent rules.** Analytics cookies on your own website usually need consent in the UK and EU, so UTM-based tracking depends on your cookie banner.",
          "**Do not try to identify people.** Combining scan data with other records to single out individuals goes beyond what visitors expect.",
          "**Collect what you will use.** Counts by day, city and device are enough for most campaigns.",
          "**Choose your provider with care.** Check where scan data is stored and how long it is kept.",
        ],
      },
      {
        type: "tip",
        text: "Before launch, scan each code yourself and check the result appears where you expect: in the dynamic code's dashboard, in your analytics under the right campaign, or both. Note how many test scans you made so you can discount them later.",
      },
      { type: "h2", id: "which-method-to-use", text: "Which method should you use?" },
      {
        type: "ul",
        items: [
          "**A static code with UTM tags** if the destination is your own website, the link will not change and visit numbers are enough. It costs nothing.",
          "**A dynamic code** if the destination is not your own site, if it might change, or if you want scan counts by time, city and device.",
          "**A dynamic code pointing to a UTM-tagged link** for campaigns where you want to follow the whole path from scan to sale.",
        ],
      },
    ],
    faq: [
      {
        q: "Can you track a static QR code?",
        a: "Not directly. Nothing records the scan, so the only option is to measure visits at the destination with UTM parameters and web analytics.",
      },
      {
        q: "Can a QR code show who scanned it?",
        a: "No. A scan does not send a name, email address or phone number. Analytics can show the time, approximate city, device and operating system, but not identity.",
      },
      {
        q: "How accurate is the location in QR code analytics?",
        a: "It is approximate. It comes from the IP address of the connection, which can point to a nearby town or a network hub rather than where the scan happened.",
      },
      {
        q: "Do UTM parameters make a QR code harder to scan?",
        a: "They make the link longer, so the code becomes denser. Keep the tags short, or use a dynamic code so the pattern only holds a short link.",
      },
      {
        q: "Do I need a paid plan to track QR code scans?",
        a: "Not if visit counts on your own website are enough, which UTM tags and free analytics can provide. To count every scan whatever the destination, you need a dynamic code, which is usually a paid feature.",
      },
    ],
    relatedTools: ["url", "instagram", "youtube"],
  },

  // ── 5. Events ───────────────────────────────────────────────────────
  {
    slug: "qr-code-for-events",
    title: "QR codes for events: tickets, agendas, WiFi and more",
    h1: "How to use QR codes at events, from invitations to feedback",
    description:
      "Use QR codes at events for agendas, venue WiFi, directions, calendar invites, badges and feedback forms, plus why dynamic codes suit changing schedules.",
    category: "Use cases",
    published: "2026-10-26",
    updated: "2026-10-26",
    readMinutes: 6,
    summary:
      "From the first invitation to the last feedback form, QR codes save attendees typing and save organisers reprinting. Here is which code to use at each stage.",
    body: [
      {
        type: "p",
        text: "QR codes help at every stage of an event. Use them on posters and invitations to open the event page or add the date to a calendar, at the venue for the agenda, WiFi and directions, and at the end for a feedback form. Tickets are different: each attendee needs a unique code issued by a ticketing system. For anything that may change after printing, such as the schedule, use a dynamic code so you can update the link without reprinting.",
      },
      { type: "h2", id: "tickets-vs-information-codes", text: "Ticket codes and information codes" },
      {
        type: "p",
        text: "Event organisers use two kinds of QR code, and they work in very different ways.",
      },
      {
        type: "ul",
        items: [
          "**Ticket codes** are unique to each attendee. A ticketing or registration system issues them, and staff scan them at the door against a guest list, so each one can only be used once. They belong on personal tickets and confirmation emails, never on a public poster.",
          "**Information codes** are the same for everyone. They point to the event page, the agenda, a venue map or a form. You make them once and print them anywhere.",
        ],
      },
      {
        type: "p",
        text: "A general QR code generator makes information codes. It cannot check entry or stop a screenshot being shared, so use proper ticketing software for admission. The rest of this guide is about information codes.",
      },
      { type: "h2", id: "before-the-event", text: "Before the event: posters, invitations and calendars" },
      {
        type: "p",
        text: "Promotional material has one job: get people from a printed page to a decision. Point the main code at the event page, where people can read the details and book.",
      },
      {
        type: "ul",
        items: [
          "**Posters and flyers.** Link to the event page. Size the code for the distance people walk past, at least one tenth of that distance in width.",
          "**Invitations.** Add an add-to-calendar code. The [event QR code generator](/qr-code-generator/event) creates a calendar event in the standard VEVENT format, with a title, start and end times, location and description. Scanning it lets a phone add the event straight to its calendar.",
          "**Save-the-date cards.** A calendar code works well here too, as long as the date, time and place are settled.",
        ],
      },
      {
        type: "p",
        text: "Test calendar codes on both iPhone and Android. Most recent phones recognise them, but on Android it depends on the camera or scanner app. Check the start time shows correctly, including on a phone set to a different time zone if guests are travelling. Print the date and time in text beside the code as well.",
      },
      { type: "h2", id: "at-the-venue", text: "At the venue: directions, agenda and WiFi" },
      { type: "h3", text: "Directions to the venue" },
      {
        type: "p",
        text: "A [location QR code](/qr-code-generator/location) stores map coordinates and opens the phone's map app at that spot. Use it on tickets, joining instructions and car park signs. Drop the pin on the entrance people should use, not the middle of the building. Large venues, campuses and parks often have several gates, and the right pin saves a lot of walking.",
      },
      { type: "h3", text: "The agenda" },
      {
        type: "p",
        text: "Link one code to an agenda page that works well on a phone: session times, rooms, speakers and a simple map. Put it on entrance signs, badges, seat cards and the screen between sessions. A web page beats a PDF here, because it reads better on a small screen and you can update it without changing the address.",
      },
      { type: "h3", text: "Venue WiFi" },
      {
        type: "p",
        text: "A WiFi code lets attendees join without typing a password. The network name and password are stored in the code, so it is always static, and a new password means a new code. Use a separate guest network for the event, never the venue's main one. Our [WiFi QR code guide](/guides/wifi-qr-code) covers the format and security settings.",
      },
      {
        type: "p",
        text: "Codes on projected slides follow the same rules as print. Size them for the back row, not the front, and leave the slide up long enough for people to get their phones out.",
      },
      { type: "h2", id: "badges", text: "QR codes on name badges" },
      {
        type: "p",
        text: "Badges are a natural home for networking codes. A code on an attendee's badge can open their contact card or professional profile, so a quick scan replaces swapping business cards.",
      },
      {
        type: "ul",
        items: [
          "**Use a vCard or a profile link.** A [vCard code](/qr-code-generator/vcard) saves contact details straight to the phone. A LinkedIn profile link keeps the code simpler and lets attendees control what they share.",
          "**Print on both sides.** Badges on lanyards flip round. A code on each side means one always faces out.",
          "**Keep it big enough.** Around 3 cm wide works for a badge scanned at arm's length. Keep the attendee's name the largest thing on the badge.",
          "**Ask first.** Only print personal contact details on a badge if the attendee has agreed to share them.",
          "**Separate entry codes.** If the badge also carries a ticket code for the doors, label each code clearly so people scan the right one.",
        ],
      },
      { type: "h2", id: "feedback-forms", text: "Feedback forms" },
      {
        type: "p",
        text: "Feedback is easiest to collect while people are still in the room. Put a code linking to a short form on the final slide, on seat cards, at the exit and in the follow-up email.",
      },
      {
        type: "ul",
        items: [
          "Keep the form short. A few questions answered on a phone beat a long survey nobody finishes.",
          "Make it work without signing in, unless you need to know who answered.",
          "Use a form per session if you want feedback on each speaker, with its own code on each room's signs.",
          "Give people time. Show the code before the final questions, not as the lights come up.",
        ],
      },
      { type: "h2", id: "dynamic-codes-for-changing-schedules", text: "Why dynamic codes suit changing schedules" },
      {
        type: "p",
        text: "Event plans change after the print deadline. Speakers drop out, rooms swap and sessions move. A static code that points at a specific PDF breaks the moment you upload a new file with a new name, and signs and badges printed weeks earlier then lead to the wrong agenda.",
      },
      {
        type: "p",
        text: "A dynamic code solves this. The printed code holds a short link, and you change where it points from your account. Before the event, it can open the booking page. On the day, the live agenda. Afterwards, the feedback form or session recordings. The same printed sign does all three jobs.",
      },
      {
        type: "p",
        text: "StayQR's paid plans include dynamic codes you can edit after printing, with scan analytics by device, city and time of day that show which signs people actually used. Codes keep redirecting even if you cancel. See [pricing](/pricing), or read more about [QR codes for events](/industries/events).",
      },
      { type: "h2", id: "event-code-plan", text: "A simple code plan for your event" },
      {
        type: "p",
        text: "List every code before anything goes to print. A plan like this one keeps types, placements and update needs in one place:",
      },
      {
        type: "table",
        head: ["Code", "Type", "Where it goes", "Static or dynamic"],
        rows: [
          ["Event page", "URL", "Posters, flyers, social posts", "Dynamic if the page may move"],
          ["Add to calendar", "Event", "Invitations, save-the-dates", "Static, once details are fixed"],
          ["Directions", "Location", "Tickets, joining emails, car park", "Static"],
          ["Agenda", "URL", "Entrance signs, badges, slides", "Dynamic"],
          ["Venue WiFi", "WiFi", "Registration desk, tables", "Static"],
          ["Networking", "vCard or LinkedIn", "Name badges", "Static"],
          ["Feedback", "URL", "Final slide, seat cards, exit", "Dynamic"],
        ],
      },
      {
        type: "tip",
        text: "On the morning of the event, scan one of each code from the printed material itself, not from the design files. Printing, lamination and lighting can all change how a code behaves, and the morning is the last cheap moment to fix it.",
      },
    ],
    faq: [
      {
        q: "Can I use a free QR code generator for event tickets?",
        a: "Not for admission. Tickets need a unique code for each attendee and a system to check them at the door, which ticketing software provides. A free generator is ideal for information codes such as the agenda, WiFi and directions.",
      },
      {
        q: "How do I make a QR code that adds an event to a calendar?",
        a: "Use an event QR code with the title, start and end time, location and description. Phones that scan it offer to add the event to their calendar.",
      },
      {
        q: "What should an event QR code link to?",
        a: "Before the event, the event or booking page. At the venue, the agenda, WiFi and directions. Afterwards, a feedback form or recordings.",
      },
      {
        q: "What if the schedule changes after the signs are printed?",
        a: "With a dynamic code, point it at the new agenda and every printed code updates at once. With a static code, you need to reprint, unless it links to a page whose address never changes.",
      },
    ],
    relatedTools: ["event", "location", "wifi"],
  },
];
