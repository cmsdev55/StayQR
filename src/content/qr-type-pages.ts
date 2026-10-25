import type { QrTypeSlug } from "@/lib/qr-types";

/**
 * SEO landing-page copy for each free generator type (/qr-code-generator/[slug] style pages).
 * Facts here must match src/lib/qr-types.ts (what each type encodes) and the plans (free static,
 * paid dynamic). No statistics, no customer names, no competitor names.
 */


export type QrTypePage = {
  slug: QrTypeSlug;
  /** <title>, max 60 chars, include the primary keyword, e.g. "WiFi QR Code Generator: Free, No Sign-Up" */
  title: string;
  /** meta description, 140–158 chars */
  description: string;
  h1: string;
  /** 2–3 sentences under the H1 */
  intro: string;
  /** 3–4 steps for "How to create a … QR code" (used for HowTo schema) */
  steps: { title: string; body: string }[];
  /** exactly 4 */
  useCases: { title: string; body: string }[];
  /** 4–6 practical tips (printing size, contrast, testing, field-specific gotchas) */
  tips: string[];
  /** 5–6 questions people actually search for this type; answers 1–3 sentences, factual */
  faq: { q: string; a: string }[];
  /** 3–4 other slugs from the list below, most related first */
  related: QrTypeSlug[];
};

export const QR_TYPE_PAGES: QrTypePage[] = [
  // ── url ──────────────────────────────────────────────────────────────
  {
    slug: "url",
    title: "URL QR Code Generator: Free, No Sign-Up, No Watermark",
    description:
      "Turn any link into a QR code for free. No sign-up, no watermark, unlimited scans and no expiry. Add your logo and colours, then download PNG, SVG or PDF.",
    h1: "URL QR code generator",
    intro:
      "Turn any website link into a QR code that opens in one scan. It's free, needs no account, and the code never expires or runs out of scans. Style it with your colours and logo, then download it ready for print or screen.",
    steps: [
      { title: "Paste your link", body: "Copy the full address from your browser and paste it into the website field. Open it once to check it lands on the exact page you want, not a login screen or a search result." },
      { title: "Style the code", body: "Pick your colours, dot and corner styles, and add your logo or a \"Scan me\" frame. Keep the dots clearly darker than the background so every phone can read them." },
      { title: "Test the preview", body: "Scan the preview with your phone's camera before you download. If you can, try both an iPhone and an Android phone." },
      { title: "Download", body: "Choose SVG or PDF for print, or PNG or JPEG for websites, slides and documents. Sizes run from 512 to 4096 px." },
    ],
    useCases: [
      { title: "Packaging and labels", body: "Link to setup guides, ingredients or care instructions without crowding the box with small print." },
      { title: "Posters and flyers", body: "Send people to a ticket page, sign-up form or menu instead of asking them to type an address from a wall." },
      { title: "Business cards", body: "Point to your portfolio or booking page so new contacts land on your work, not just your name." },
      { title: "Slides and handouts", body: "Put a code on your last slide so the audience can open the resources page while you're still talking." },
    ],
    tips: [
      "Shorter links make simpler codes. A long address full of tracking parameters creates a denser pattern that has to be printed larger to scan well.",
      "Print the code at least 2 cm (0.8 in) wide on a card or label. For posters, allow roughly 1 cm of code for every 10 cm of scanning distance.",
      "Use a dark colour on a light background. Light codes on dark backgrounds fail on some phone cameras.",
      "Leave a clear margin around the code. Text or artwork pressed against its edges makes it harder to scan.",
      "Link to a page you control and expect to keep. A free static code can't be pointed somewhere new once it's printed.",
      "Check the page works well on a phone. The scan is only as good as the page it opens.",
    ],
    faq: [
      { q: "Do free URL QR codes expire?", a: "No. A static code stores the link inside the pattern itself, so there's nothing to switch off. It works for as long as the website it points to is online." },
      { q: "Is there a scan limit?", a: "No. Static codes from the free generator have unlimited scans." },
      { q: "Can I change the link after printing?", a: "Not on a static code, because the link is part of the pattern. If you need to change it later, a dynamic code (Pro, $29 a year) lets you edit the destination after printing and keeps working even if you cancel." },
      { q: "Can I see how many people scanned my code?", a: "Static codes open the link directly, so they can't count scans. Dynamic codes include scan analytics by city, device and time." },
      { q: "Which file format should I download?", a: "SVG or PDF for print, because they stay sharp at any size. PNG or JPEG work well on websites, in emails and in documents." },
      { q: "Will adding a logo stop the code from scanning?", a: "Not if the logo is kept small and centred. QR codes have built-in error correction, but always scan the final design before you print it." },
    ],
    related: ["text", "youtube", "instagram", "paypal"],
  },

  // ── text ─────────────────────────────────────────────────────────────
  {
    slug: "text",
    title: "Text QR Code Generator: Free Plain-Text QR Codes",
    description:
      "Put a short message inside a QR code. It shows on screen when scanned and works with no internet. Free, no sign-up, no watermark, up to 300 characters.",
    h1: "Text QR code generator",
    intro:
      "Put a short message inside a QR code and it appears on screen when someone scans it. Nothing opens and no connection is needed, because the words are stored in the code itself. Free, with no sign-up and no watermark.",
    steps: [
      { title: "Write your message", body: "Type up to 300 characters into the text field. Words, numbers and line breaks all work." },
      { title: "Style it", body: "Add your colours, logo or a \"Scan me\" frame. Simple styling helps, because longer messages already make a busier pattern." },
      { title: "Scan and proofread", body: "Scan the preview and read the message on your phone. Fix typos now, because the text can't be edited once the code is printed." },
      { title: "Download", body: "Save it as PNG, JPEG, SVG or PDF, at any size from 512 to 4096 px." },
    ],
    useCases: [
      { title: "Equipment and asset labels", body: "Store a serial number, a short set of instructions or an internal extension on a sticker that never needs a network." },
      { title: "Treasure hunts and games", body: "Hide clues in codes around a classroom, office or garden. Each scan reveals the next hint, with no website to build." },
      { title: "Notes beside objects", body: "Add a short description next to an exhibit, plant or product for people who want more than the label shows." },
      { title: "Places with no signal", body: "Basements, boats and remote sites: a text code still shows its message where there's no mobile data." },
    ],
    tips: [
      "Keep it short. Every extra character adds dots, so a 300-character message needs printing larger than a 30-character one, ideally at least 3 cm (1.2 in) wide.",
      "If you want a link to open, use a URL code instead. A link pasted into a text code may show as plain text rather than a tappable link.",
      "Don't store anything private. Anyone who scans the code can read the whole message.",
      "Put the most important words first. Some phones show the text in a small preview before the full message.",
      "Emoji and accented letters may display differently on older phones. If you use them, scan on more than one device.",
    ],
    faq: [
      { q: "How much text can a QR code hold?", a: "StayQR's text codes take up to 300 characters. QR codes can technically hold more, but long messages produce dense patterns that are hard to scan from print." },
      { q: "Does a text QR code need internet to work?", a: "No. The message is stored in the pattern, so the phone can show it with no signal or WiFi." },
      { q: "What happens when someone scans a text QR code?", a: "The phone shows the message on screen. It doesn't open a website or an app." },
      { q: "Can I edit the text after printing?", a: "No. The text is part of the pattern, so changing it means making a new code. For content you'll want to update, point a URL code at a page you control instead." },
      { q: "Do text QR codes expire?", a: "No. They work for as long as the printed code is readable, with no scan limit." },
    ],
    related: ["url", "wifi", "vcard", "email"],
  },

  // ── wifi ─────────────────────────────────────────────────────────────
  {
    slug: "wifi",
    title: "WiFi QR Code Generator: Free, No Sign-Up",
    description:
      "Make a WiFi QR code so guests join your network in one scan, with no password to type. Works on iPhone and Android. Free, no sign-up, and it never expires.",
    h1: "WiFi QR code generator",
    intro:
      "Let guests join your WiFi by pointing their camera at a code, with no password to read out or type. The network name and password are stored in the code, so it works offline and never expires. Free, with no sign-up.",
    steps: [
      { title: "Enter the network name", body: "Type the network name (SSID) exactly as it appears in your phone's WiFi list. Capital letters and spaces count." },
      { title: "Add the password and security type", body: "Enter the password and choose WPA/WPA2/WPA3, WEP, or none for an open network. Turn on hidden network if your router doesn't broadcast its name." },
      { title: "Style and test", body: "Add your colours, logo or a \"Scan me\" frame, then scan the preview and check that your phone offers to join." },
      { title: "Download and print", body: "Download PDF or PNG and print it for the wall, the table or the welcome folder." },
    ],
    useCases: [
      { title: "Holiday rentals and guesthouses", body: "Frame the code by the door or in the welcome book so guests are online before they've unpacked." },
      { title: "Cafés and restaurants", body: "Put it on table cards or the counter instead of writing the password on a chalkboard and repeating it all day." },
      { title: "Offices and meeting rooms", body: "Give visitors guest network access at reception without anyone walking them through the settings." },
      { title: "At home", body: "Stick it on the fridge or inside a cupboard door for friends, family and babysitters." },
    ],
    tips: [
      "Use a guest network. Anyone with the code can join, and a QR reader app can display the password, so treat the printed code like the password itself.",
      "Change the password, change the code. The password is stored inside the code, so reprint whenever you update your router.",
      "Match the security type to your router. If the code says WEP and the router uses WPA2, phones won't connect.",
      "StayQR escapes symbols such as ; : , and \" in passwords, but phones vary, so test the printed code on both an iPhone and an Android phone.",
      "Print it at least 3 cm (1.2 in) wide on a table card, and larger on a wall sign that people scan from across the room.",
      "Write the network name in plain text under the code so people know which network they're joining.",
    ],
    faq: [
      { q: "How do I scan a WiFi QR code on iPhone?", a: "Open the Camera app, point it at the code and tap the banner that appears. The iPhone asks to join the network and connects without anyone typing the password." },
      { q: "Does it work on Android?", a: "Yes. Most Android phones read WiFi codes from the camera. On some models you scan from the WiFi settings screen or with Google Lens instead." },
      { q: "Does it work with WPA3 or hidden networks?", a: "Yes. StayQR supports WPA, WPA2 and WPA3 personal networks, WEP, open networks and hidden networks. It doesn't support WPA-Enterprise networks that need a username." },
      { q: "Is a WiFi QR code secure?", a: "It's as secure as sharing the password, because the password is inside the code. Use a guest network and display the code only where guests can see it." },
      { q: "What happens if I change my WiFi password?", a: "The old code stops working, because it holds the old password. Make a new code with the new password and reprint it." },
      { q: "Do I need internet to scan it?", a: "No. The details are stored in the code, so a phone can read it and join the network without mobile data." },
    ],
    related: ["text", "vcard", "location"],
  },

  // ── vcard ────────────────────────────────────────────────────────────
  {
    slug: "vcard",
    title: "vCard QR Code Generator: Free Contact QR Codes",
    description:
      "Create a vCard QR code that saves your name, phone, email and company to contacts in one scan. Free, no sign-up, no watermark, and the code never expires.",
    h1: "vCard QR code generator",
    intro:
      "Share your contact details in one scan. A vCard QR code holds your name, phone, email, company and more, and the phone offers to save them straight to contacts. Free, with no sign-up, and the code never expires.",
    steps: [
      { title: "Fill in your details", body: "Enter your name, phone, email, company, job title, website and address. Leave out anything you don't want strangers to have." },
      { title: "Check the formats", body: "Write your phone number with the + and country code so it works for contacts abroad, and double-check the spelling of your email address." },
      { title: "Style it to match your card", body: "Use your brand colours and logo. A \"Scan me\" frame helps when the code sits beside other text." },
      { title: "Test and download", body: "Scan the preview, tap Add to contacts and check every field lands in the right place. Download SVG or PDF for your printer." },
    ],
    useCases: [
      { title: "Business cards", body: "Put the code on the back so new contacts save you in seconds instead of typing from the card later, or never." },
      { title: "Conference badges and stands", body: "Let people at a busy stand save your details while the conversation is still going." },
      { title: "Email signatures and slides", body: "Add the code as an image so people on a video call can scan it straight from their screen." },
      { title: "Reception and service desks", body: "Display a code with the main office number and email so visitors leave with the right details." },
    ],
    tips: [
      "Fewer fields make a simpler code. If you fill in everything, print it larger: at least 2.5 cm (1 in) on a business card.",
      "Always use the + country code. Without it, the number may not dial correctly from another country.",
      "Scan with both an iPhone and an Android phone. Contacts apps lay out fields slightly differently, and it's worth seeing both.",
      "Print your name in text next to the code, so people know whose card it is before they scan.",
      "Brand colours are fine as long as the dots stay clearly darker than the background.",
    ],
    faq: [
      { q: "What is a vCard QR code?", a: "It's a QR code that contains a contact card in the vCard format. When scanned, the phone shows the details and offers to add them to contacts." },
      { q: "Which fields can I include?", a: "First and last name, phone, email, company, job title, website, and a street address with city, postcode and country. Fill in only what you want to share." },
      { q: "Does it work on iPhone and Android?", a: "Yes. The built-in camera on both reads vCard codes and offers to save the contact. StayQR uses vCard 3.0, which contacts apps widely support." },
      { q: "Can I update my details after printing?", a: "Not in a vCard code, because the details are stored in the pattern. Make a new code when your details change, or use a URL code that points to an online profile you can edit." },
      { q: "Does the person scanning need internet?", a: "No. The details are inside the code, so they can be saved with no connection." },
      { q: "Why does my vCard code look so dense?", a: "Each field adds characters, and more characters mean more dots. Remove fields you don't need or print the code larger." },
    ],
    related: ["phone", "email", "linkedin", "whatsapp"],
  },

  // ── email ────────────────────────────────────────────────────────────
  {
    slug: "email",
    title: "Email QR Code Generator: Prefill Subject and Body",
    description:
      "Make an email QR code that opens a new message with your address, subject and text already filled in. Free, no account needed, no watermark and no expiry.",
    h1: "Email QR code generator",
    intro:
      "Make a QR code that opens a new email with the address, subject and message already filled in. People scan it, check the draft and press send. Free, with no account and no expiry.",
    steps: [
      { title: "Enter the recipient", body: "Type the address that should receive the emails. Check the spelling carefully, because it can't be corrected after printing." },
      { title: "Add a subject and message", body: "Both are optional. A clear subject helps you sort replies, and the message can be up to 400 characters." },
      { title: "Style and test", body: "Add your colours, logo or a \"Scan me\" frame, then scan the preview and watch the draft open in your mail app." },
      { title: "Download", body: "Choose PNG, JPEG, SVG or PDF, from 512 to 4096 px." },
    ],
    useCases: [
      { title: "Feedback", body: "Put a code on receipts or the counter with the subject \"Feedback\" so messages arrive already labelled." },
      { title: "Support requests", body: "Add one to a product manual with the model name in the subject, so your team knows what's being asked about." },
      { title: "Enquiries and waiting lists", body: "Let people ask for a brochure or join a list by sending a prefilled email from their own phone." },
      { title: "Lost property", body: "Label equipment with a code that opens an email to its owner with \"Found your item\" as the subject." },
    ],
    tips: [
      "Make the subject filterable. A unique subject such as \"Shop window enquiry\" tells you which code each email came from.",
      "Keep the prefilled message short. Long text makes the code denser, and people often delete it anyway.",
      "The email sends from the scanner's own account, so they need a mail app set up. Print the address as text too, for anyone who doesn't.",
      "Print the code at least 2 cm (0.8 in) wide and keep a clear border around it.",
      "Use an address you'll keep for years. A static code can't be changed once printed.",
    ],
    faq: [
      { q: "What happens when someone scans an email QR code?", a: "Their phone opens the default mail app with a new message addressed to you, including your subject and message. Nothing is sent until they press send." },
      { q: "Can I prefill the subject and body?", a: "Yes. Both are optional, and the person scanning can edit them before sending." },
      { q: "What if the person has no mail app set up?", a: "Their phone may not be able to open the draft. Print your address under the code so they can still reach you." },
      { q: "Can I see who scanned it?", a: "A static email code can't count scans. You'll see who wrote to you in your inbox, and a unique subject line shows which code they used." },
      { q: "Do email QR codes expire?", a: "No. They work forever, with unlimited scans." },
    ],
    related: ["sms", "vcard", "phone", "whatsapp"],
  },

  // ── sms ──────────────────────────────────────────────────────────────
  {
    slug: "sms",
    title: "SMS QR Code Generator: Free Prefilled Text Messages",
    description:
      "Create an SMS QR code that opens a text message with your number and message ready to send. Works on iPhone and Android. Free, no sign-up, no watermark.",
    h1: "SMS QR code generator",
    intro:
      "Create a QR code that opens a text message with your number and message ready to go. One scan, one tap on send. Free, with no sign-up and no watermark.",
    steps: [
      { title: "Enter the number", body: "Type the mobile number that should receive the texts, with the + and country code, for example +44." },
      { title: "Write the message", body: "Add up to 300 characters to prefill, such as a keyword, a booking request or \"Please call me back\". Short is better." },
      { title: "Style and test", body: "Choose your colours and frame, then scan the preview and check the messaging app opens with both the number and the message filled in." },
      { title: "Download", body: "Save it in PNG, JPEG, SVG or PDF, from 512 to 4096 px." },
    ],
    useCases: [
      { title: "Text-to-join lists", body: "Prefill a keyword like JOIN so people sign up for updates with a single tap." },
      { title: "Callback requests", body: "Put a code on a shop door or van that sends \"Please call me back\" to your mobile." },
      { title: "Reporting problems", body: "Label vending machines, washrooms or hire equipment with a code that texts the site ID to your maintenance number." },
      { title: "Votes and entries", body: "Prefill an entry code or vote so people can't mistype it." },
    ],
    tips: [
      "Include the location or product in the prefilled message, so you know where each text came from.",
      "Tell people what will happen. A short line like \"Scan to text us\" beside the code sets expectations.",
      "Use a number that can receive texts. Many landlines can't.",
      "Make sure someone reads the replies. A code that texts an unanswered number does more harm than good.",
      "Print it at least 2 cm (0.8 in) wide, and larger on signs people scan from a few steps away.",
    ],
    faq: [
      { q: "What does an SMS QR code do?", a: "It opens the phone's messaging app with your number and message already filled in. The person can edit the message and taps send themselves." },
      { q: "Does the text send automatically?", a: "No. A QR code can't send a text on its own. The person always has to tap send." },
      { q: "Does it work on iPhone and Android?", a: "Yes. Both read SMS codes with the built-in camera and open the default messaging app." },
      { q: "Who pays for the text?", a: "The person sending it, at their usual messaging rates." },
      { q: "Can I change the number or message later?", a: "Not on a static code, because both are stored in the pattern. Make a new code if either changes." },
      { q: "How long can the prefilled message be?", a: "Up to 300 characters. Shorter messages make simpler codes that scan more easily, and people are less likely to trim them before sending." },
    ],
    related: ["whatsapp", "phone", "email"],
  },

  // ── phone ────────────────────────────────────────────────────────────
  {
    slug: "phone",
    title: "Phone Number QR Code Generator: Tap to Call, Free",
    description:
      "Make a phone number QR code that offers to call you as soon as it's scanned. No typing and no misdialled digits. Free, no sign-up, and it never expires.",
    h1: "Phone number QR code generator",
    intro:
      "Make a QR code that offers to call your number as soon as it's scanned. No typing and no misdialled digits. Free, with no sign-up, and it never expires.",
    steps: [
      { title: "Enter the number", body: "Type the full number with the + and country code, such as +1 for the US or +44 for the UK. That way it dials correctly from any phone." },
      { title: "Style the code", body: "Add your colours, logo or a \"Scan me\" frame to match your sign, card or advert." },
      { title: "Test it", body: "Scan the preview. Your phone should show the number and ask whether you want to call it." },
      { title: "Download", body: "Pick PNG, JPEG, SVG or PDF, from 512 to 4096 px." },
    ],
    useCases: [
      { title: "Vans and site boards", body: "Put a code on vehicles and building-site signs so people can call without memorising the number." },
      { title: "Support and out-of-hours lines", body: "Label equipment with the number for the helpline or the emergency contact." },
      { title: "Print adverts", body: "Add a call code to flyers and local press ads for people who'd rather talk than fill in a form." },
      { title: "Pet tags and luggage", body: "A small code with your mobile number helps whoever finds them reach you quickly." },
    ],
    tips: [
      "Always include the country code. A number in local format may not dial from a foreign SIM.",
      "Show the number as text beside the code for anyone who can't scan.",
      "Phone codes hold very little data, so they scan well even when small. Still keep them at least 2 cm (0.8 in) wide on print.",
      "On vehicles and signs, make the code big enough to scan from where people will actually stand, and test it from that spot before printing.",
      "Point the code at a line that gets answered, with voicemail set up for outside opening hours.",
    ],
    faq: [
      { q: "Does a phone QR code call automatically?", a: "No. The phone shows the number and asks the person to confirm before calling." },
      { q: "Does it work on iPhone and Android?", a: "Yes. The built-in camera on both reads phone codes and offers to call the number." },
      { q: "Can I use a landline or freephone number?", a: "Yes. Any number you can dial works. Freephone numbers may not be reachable from abroad, so add a standard number for international audiences." },
      { q: "Do I need the country code?", a: "It's strongly recommended. With the + and country code, the number dials correctly from any phone, including visitors on foreign SIMs." },
      { q: "What if my number changes?", a: "The number is stored in the code, so you'll need to make a new one and reprint it." },
    ],
    related: ["sms", "whatsapp", "vcard", "email"],
  },

  // ── whatsapp ─────────────────────────────────────────────────────────
  {
    slug: "whatsapp",
    title: "WhatsApp QR Code Generator: Free Chat Link QR Codes",
    description:
      "Make a WhatsApp QR code that opens a chat with you and a message already typed. Customers scan, tap send and you're talking. Free, no sign-up, no watermark.",
    h1: "WhatsApp QR code generator",
    intro:
      "Make a QR code that opens a WhatsApp chat with you, with a message already typed. Customers scan, tap send and the conversation starts. Free, with no sign-up and no watermark.",
    steps: [
      { title: "Enter your WhatsApp number", body: "Type the number registered to WhatsApp, including the country code, for example +44 7700 900123. StayQR removes spaces and the + for you." },
      { title: "Write an opening message", body: "Add up to 300 characters, such as \"Hi, I'd like to book a table\". It's optional, and people can edit it before sending." },
      { title: "Style and test", body: "Add your colours, logo or a \"Scan me\" frame, then scan the preview and check WhatsApp opens a chat with the right number." },
      { title: "Download", body: "Save as PNG, JPEG, SVG or PDF, from 512 to 4096 px." },
    ],
    useCases: [
      { title: "Shop windows and flyers", body: "Let customers message you without saving your number first." },
      { title: "Bookings and orders", body: "Prefill \"I'd like to order\" or \"Booking for\" so chats arrive with the context you need." },
      { title: "Customer support", body: "Add a code to product inserts so buyers can ask for help in an app they already use." },
      { title: "Event organisers", body: "Let attendees message you for directions or questions on the day." },
    ],
    tips: [
      "Write the opening message as the customer would say it, for example \"Hi, I saw your poster at the station\".",
      "Use a different message for each location, such as \"Hi, from the market stall\", so you can tell where each chat started.",
      "Make sure someone is watching the number before the code goes up. People expect a fast reply on WhatsApp.",
      "A long prefilled message makes the code denser. Keep it to a sentence and print the code at least 2.5 cm (1 in) wide.",
      "Need to change the message or number later? A dynamic code lets you edit where the code points after printing.",
    ],
    faq: [
      { q: "How does a WhatsApp QR code work?", a: "It holds a wa.me link with your number and an optional message. Scanning it opens WhatsApp with a chat to you and the message ready to send." },
      { q: "Does the person need to save my number first?", a: "No. The chat opens directly, without adding you as a contact." },
      { q: "What if they don't have WhatsApp installed?", a: "The link opens in their browser instead, on a WhatsApp page that offers ways to continue. Show your number in text too, for people who'd rather call." },
      { q: "Does it work with WhatsApp Business?", a: "Yes. A wa.me link works with any WhatsApp number, personal or business." },
      { q: "Can I change the message after printing?", a: "Not on a free static code, because the link is stored in the pattern. A dynamic code (Pro from $3.99 a month) lets you change the destination after printing." },
    ],
    related: ["sms", "phone", "facebook", "instagram"],
  },

  // ── location ─────────────────────────────────────────────────────────
  {
    slug: "location",
    title: "Location QR Code Generator: Free Map Pin QR Codes",
    description:
      "Make a location QR code that opens a map at your address or exact coordinates, ready for directions. Free, no sign-up, no watermark, and it never expires.",
    h1: "Location QR code generator",
    intro:
      "Make a QR code that opens a map at the place you choose, ready for directions. Use an address, or exact coordinates for spots that don't have one. Free, with no sign-up, and it never expires.",
    steps: [
      { title: "Choose the spot", body: "Decide where people should arrive. For large venues, that's usually the entrance or car park, not the middle of the building." },
      { title: "Enter an address or coordinates", body: "Type an address or place name, or leave that empty and enter the latitude and longitude for a precise pin." },
      { title: "Style and test", body: "Add your colours and a frame, then scan the preview and check the pin lands exactly where you expect." },
      { title: "Download", body: "Choose PNG, JPEG, SVG or PDF, from 512 to 4096 px." },
    ],
    useCases: [
      { title: "Invitations", body: "Print a code on wedding and party invites so guests don't end up at a venue with a similar name." },
      { title: "Hard-to-find entrances", body: "Point to the side door, loading bay or staff car park rather than the street address." },
      { title: "Outdoor meeting points", body: "Mark a trailhead, campsite or start line that has no street address at all." },
      { title: "Welcome packs", body: "Show rental guests the property, the nearest shop or where to park." },
    ],
    tips: [
      "Coordinates beat addresses for precision. Press and hold on a map to drop a pin, then copy the two numbers it shows.",
      "Latitude comes first, longitude second. Swap them and the pin lands somewhere else entirely.",
      "Place names can match more than one result. If yours is common, add the town or use coordinates.",
      "Print the address in text near the code for people who'd rather type it.",
      "Print at least 2 cm (0.8 in) wide on cards, and larger on signs that people scan from a car park or across a field.",
    ],
    faq: [
      { q: "What does a location QR code open?", a: "A map link centred on your address or coordinates, where the person can get directions. It opens in the maps app or browser, depending on the phone." },
      { q: "Should I use an address or coordinates?", a: "An address is quick and fine for most buildings. Coordinates are better for exact entrances, outdoor spots and places with no address." },
      { q: "How do I find my coordinates?", a: "In most maps apps, press and hold on the spot to drop a pin, then copy the numbers shown. The first number is latitude, the second is longitude." },
      { q: "Does it work without internet?", a: "The phone can read the code offline, but showing the map and directions usually needs a data connection." },
      { q: "Can I change the location after printing?", a: "Not on a static code. If the venue might change, a dynamic code lets you edit the destination after printing." },
    ],
    related: ["event", "url", "wifi"],
  },

  // ── event ────────────────────────────────────────────────────────────
  {
    slug: "event",
    title: "Event QR Code Generator: Add to Calendar, Free",
    description:
      "Create an event QR code that adds your event to a phone's calendar with the title, time, place and details filled in. Free, no sign-up and no watermark.",
    h1: "Event QR code generator",
    intro:
      "Make a QR code that adds your event to someone's calendar, with the title, time, place and details filled in. Nobody forgets the date or copies the time down wrong. Free, with no sign-up.",
    steps: [
      { title: "Enter the event details", body: "Add a title, start time, end time, location and up to 300 characters of details. Only the title and start time are required." },
      { title: "Check the date and times", body: "These are the details people rely on most. Read them back twice, including am and pm." },
      { title: "Style and test", body: "Scan the preview and add the event to your own calendar to check every field." },
      { title: "Download", body: "Save it as PNG, JPEG, SVG or PDF, from 512 to 4096 px." },
    ],
    useCases: [
      { title: "Invitations", body: "Add a code to printed invites so guests save the date the moment they open the envelope." },
      { title: "Conferences and talks", body: "Put a code on each session poster so attendees can add it to their own schedule." },
      { title: "Appointments and courses", body: "Give clients a card with a code for their next appointment or the first class of a course." },
      { title: "Community notices", body: "Pin a code to the noticeboard for the next meeting, fair or open day." },
    ],
    tips: [
      "Test on an iPhone and an Android phone. The iPhone camera adds events directly, while some Android cameras need Google Lens to read calendar codes.",
      "Times are saved without a time zone, so the event shows the same clock time wherever the phone is. For online events with an international audience, write the time zone in the details.",
      "Keep the details short. A long description makes a dense code, so link to a full page with a separate URL code if you need more.",
      "Print the date and time in text beside the code, for anyone who can't scan it.",
      "Print at least 2.5 cm (1 in) wide, because event codes hold more data than a simple link.",
    ],
    faq: [
      { q: "What happens when someone scans an event QR code?", a: "Their phone reads the event and offers to add it to their calendar, with the title, times, location and details filled in." },
      { q: "Does it work on Android?", a: "Support varies. Many Android phones read calendar codes through Google Lens, while some built-in camera apps only show the raw text. The iPhone Camera app handles them directly." },
      { q: "What format does the code use?", a: "It uses the iCalendar VEVENT format, the standard that calendar apps understand." },
      { q: "Can I change the event time after printing?", a: "No. The details are stored in the code, so a new time means a new code. If plans might change, a dynamic code pointing to an event page you can edit is the safer choice." },
      { q: "Does it need internet to work?", a: "No. The phone can read the event and save it to the calendar without a connection." },
    ],
    related: ["location", "url", "email"],
  },

  // ── instagram ────────────────────────────────────────────────────────
  {
    slug: "instagram",
    title: "Instagram QR Code Generator: Free, No Sign-Up",
    description:
      "Make an Instagram QR code that opens your profile, post or reel in one scan. Add your logo and colours. Free, no sign-up, no watermark, never expires.",
    h1: "Instagram QR code generator",
    intro:
      "Turn your Instagram username into a QR code that opens your profile in one scan. Put it on packaging, menus and posters so people in the room can follow you on the spot. Free, with no sign-up and no watermark.",
    steps: [
      { title: "Enter your username", body: "Type your Instagram username, with or without the @, or paste a link to your profile, a post or a reel." },
      { title: "Check the account is public", body: "If the account is private, people who scan will only see a follow request screen, not your posts." },
      { title: "Style it", body: "Use your brand colours, add your logo, and add a \"Scan me\" frame so people know what the code is for." },
      { title: "Test and download", body: "Scan the preview to confirm it opens the right account, then download PNG, JPEG, SVG or PDF." },
    ],
    useCases: [
      { title: "Product packaging", body: "Invite buyers to follow for styling ideas, recipes or new releases." },
      { title: "Cafés, salons and shops", body: "Put a code by the till or the mirror for customers who'd follow you if it took one tap." },
      { title: "Markets and pop-ups", body: "Let browsers follow your stall so they can find you again after the weekend." },
      { title: "Creator merch and cards", body: "Add your profile code to stickers, prints and business cards." },
    ],
    tips: [
      "If you change your username, the old code stops reaching you, and someone else could claim the old name. Need to change it later? A dynamic code lets you update the link after printing.",
      "Give a reason to scan. \"Follow for weekly recipes\" beside the code says more than a logo on its own.",
      "Link to a single post or reel when one piece of content matters most, such as a how-to for the product in the box.",
      "On packaging, keep the code at least 2 cm (0.8 in) wide and test it on the real glossy or curved surface.",
      "Choose contrast over brand colour. A pale pink code on white may look good and scan badly.",
    ],
    faq: [
      { q: "Does scanning open the Instagram app?", a: "If the app is installed, the phone usually opens your profile in it. Otherwise it opens in the browser." },
      { q: "Can people without an Instagram account see my profile?", a: "They can usually see a public profile in the browser, though Instagram may ask them to log in to see more." },
      { q: "Can I link to a specific post or reel?", a: "Yes. Paste the post or reel link instead of your username." },
      { q: "What happens if I change my username?", a: "A static code keeps pointing at the old username. Make a new code, or use a dynamic code so you can change the destination without reprinting." },
      { q: "How is this different from the code inside the Instagram app?", a: "StayQR lets you use your own colours, logo, dot styles and frame, and download print files in PNG, SVG, JPEG or PDF up to 4096 px." },
      { q: "Do Instagram QR codes expire?", a: "No. Static codes from StayQR never expire and have unlimited scans." },
    ],
    related: ["tiktok", "facebook", "youtube", "url"],
  },

  // ── facebook ─────────────────────────────────────────────────────────
  {
    slug: "facebook",
    title: "Facebook QR Code Generator: Free Page and Profile QR",
    description:
      "Create a Facebook QR code that opens your page, profile, group or event in one scan. Free, no sign-up and no watermark. Download PNG, SVG, JPEG or PDF.",
    h1: "Facebook QR code generator",
    intro:
      "Make a QR code that opens your Facebook page, profile, group or event. It's a simple way to turn people who know you offline into followers, members and guests. Free, with no sign-up, and it never expires.",
    steps: [
      { title: "Copy your link", body: "Type your page username, or open the page, group or event on Facebook and copy its address." },
      { title: "Check what visitors see", body: "Open the link in a private browser window. If you can't see it while logged out, some people who scan won't either." },
      { title: "Style it", body: "Add your colours, logo or a \"Scan me\" frame so the code fits your printed materials." },
      { title: "Test and download", body: "Scan the preview with your phone, then download in PNG, JPEG, SVG or PDF." },
    ],
    useCases: [
      { title: "Local businesses", body: "Put a code on receipts and counters so regulars can follow your page for opening hours and offers." },
      { title: "Community groups", body: "Help new members find the group from a noticeboard, newsletter or village hall poster." },
      { title: "Events", body: "Link to a Facebook event so people can say they're going and get updates." },
      { title: "Clubs and societies", body: "Print the code on membership cards and fixture lists so members find your page for news." },
    ],
    tips: [
      "Set a page username first. A short facebook.com/yourname link makes a cleaner code than a long number-based address.",
      "Pick the right destination: a page for followers, a group for members, an event for RSVPs.",
      "Private groups show a join request rather than posts. Say so near the code if that's what people will see.",
      "Print at least 2 cm (0.8 in) wide on a receipt, and much larger on a window poster read from the street.",
      "Rename your page and the old link may stop working. A dynamic code lets you update the destination without reprinting.",
    ],
    faq: [
      { q: "What can a Facebook QR code link to?", a: "Any Facebook address: a page, profile, group, event or post. Type the page username or paste the link." },
      { q: "Does it open the Facebook app?", a: "If the app is installed, the phone usually opens the link in it. If not, it opens in the browser." },
      { q: "Can people see my page without a Facebook account?", a: "Public pages can usually be viewed in the browser, though Facebook may prompt visitors to log in. Groups and private profiles need an account." },
      { q: "Can I track how many people scan it?", a: "Static codes can't count scans. A dynamic code adds scan analytics by city, device and time." },
      { q: "Are Facebook QR codes free?", a: "Yes. The free generator makes static codes with no sign-up, no watermark, unlimited scans and no expiry." },
    ],
    related: ["instagram", "whatsapp", "event", "url"],
  },

  // ── youtube ──────────────────────────────────────────────────────────
  {
    slug: "youtube",
    title: "YouTube QR Code Generator: Free Channel and Video QR",
    description:
      "Make a YouTube QR code that opens your channel or a specific video. Put how-to videos on packaging and trailers on posters. Free, no sign-up, no watermark.",
    h1: "YouTube QR code generator",
    intro:
      "Make a QR code that opens your YouTube channel or one particular video. Put a how-to on the box, a trailer on the poster or your channel on your merch. Free, with no sign-up and no watermark.",
    steps: [
      { title: "Choose a channel or a video", body: "Type your channel handle, such as @yourchannel, or paste a video link to send people straight to one video." },
      { title: "Check the video is viewable", body: "Unlisted videos play for anyone with the link. Private videos won't play for the people who scan." },
      { title: "Style it", body: "Add your colours, logo or a \"Scan me\" frame." },
      { title: "Test and download", body: "Scan the preview to check it opens the right video, then download PNG, JPEG, SVG or PDF." },
    ],
    useCases: [
      { title: "Assembly and setup guides", body: "Print a code on the packaging that opens the setup video, so customers watch instead of puzzling over a leaflet." },
      { title: "Recipes and lessons", body: "Link each printed recipe card or worksheet to the video that shows how it's done." },
      { title: "Posters and trailers", body: "Let people watch the trailer for your film, gig or launch straight from the poster." },
      { title: "Channel growth", body: "Put your channel code on merch, stickers and the end of printed handouts." },
    ],
    tips: [
      "Use a video link for a specific job and the channel for discovery. One code per purpose works better than one code for everything.",
      "To start a video at a certain moment, use YouTube's share option with the start time ticked, then paste that link.",
      "Unlisted suits customer-only content such as setup guides: anyone with the code can watch, but the video won't appear in search.",
      "If you might replace the video with a newer version, a dynamic code lets you change the link after printing.",
      "Print at least 2 cm (0.8 in) wide and test the scan in the real lighting, such as a shop shelf or a dim venue.",
    ],
    faq: [
      { q: "Can I link to a specific video instead of my channel?", a: "Yes. Paste the video link. Enter your channel handle to open your channel instead." },
      { q: "Does it open the YouTube app?", a: "On most phones with the app installed, the link opens in it. Otherwise the video plays in the browser." },
      { q: "Can I link to a playlist or a Short?", a: "Yes. Paste the full link, and check the preview opens it on your phone." },
      { q: "What happens if I delete the video?", a: "The code still scans, but it opens a video that's no longer available. Keep the video live, or use a dynamic code so you can point it at a replacement." },
      { q: "Can I see how many people scanned it?", a: "Static codes can't count scans. Dynamic codes add scan analytics by city, device and time." },
    ],
    related: ["tiktok", "instagram", "url"],
  },

  // ── linkedin ─────────────────────────────────────────────────────────
  {
    slug: "linkedin",
    title: "LinkedIn QR Code Generator: Free Profile QR Codes",
    description:
      "Create a LinkedIn QR code for your profile or company page, so people you meet can connect in one scan. Free, no sign-up, no watermark, never expires.",
    h1: "LinkedIn QR code generator",
    intro:
      "Make a QR code that opens your LinkedIn profile or company page. People you meet can connect before the conversation ends. Free, with no sign-up and no watermark.",
    steps: [
      { title: "Choose profile or company page", body: "Pick personal profile or company page, then type your username, the part after linkedin.com/in/ or linkedin.com/company/. You can also paste the full link." },
      { title: "Tidy your URL first", body: "If your profile address ends in a string of numbers, set a custom public URL in LinkedIn before you make the code. It's cleaner and makes a simpler pattern." },
      { title: "Style it", body: "Professional settings suit a plain, high-contrast code. Add your logo if it appears on your other materials." },
      { title: "Test and download", body: "Scan the preview to check it opens the right profile, then download SVG or PDF for print." },
    ],
    useCases: [
      { title: "Business cards", body: "Add your LinkedIn code next to your details so new contacts connect in one step." },
      { title: "Conference badges and stands", body: "Make it easy for people to find you without spelling your name into a search box." },
      { title: "Printed CVs and portfolios", body: "Put a small code on your CV that opens your full profile, recommendations included." },
      { title: "Recruitment materials", body: "Link job ads, brochures and office signage to your company page so candidates can follow it." },
    ],
    tips: [
      "Set your custom URL before printing. Changing it later breaks a static code.",
      "Check your public profile settings so people who aren't logged in can still see your name and headline.",
      "On a CV, keep the code at least 2 cm (0.8 in) wide and write your profile address next to it.",
      "On a stand, print the code large enough to scan from a step back, with your name above it.",
      "One code per card is clearest. If people also need your phone and email, a vCard code with your LinkedIn link in the website field covers both.",
    ],
    faq: [
      { q: "How do I find my LinkedIn profile URL?", a: "Open your profile and check Contact info or the address bar. It looks like linkedin.com/in/your-name." },
      { q: "Can I link to a company page?", a: "Yes. Choose company page and enter the name from its address, linkedin.com/company/name, or paste the full link." },
      { q: "Does it open the LinkedIn app?", a: "If the app is installed, the phone usually opens the profile in it. Otherwise it opens in the browser." },
      { q: "Can people see my profile without logging in?", a: "They see what your public profile settings allow. LinkedIn may ask them to sign in to see more or to connect." },
      { q: "What if I change my custom URL?", a: "The static code will keep pointing at the old address. Make a new code, or use a dynamic code so you can change the link after printing." },
    ],
    related: ["vcard", "x", "email", "url"],
  },

  // ── x ────────────────────────────────────────────────────────────────
  {
    slug: "x",
    title: "X (Twitter) QR Code Generator: Free Profile QR",
    description:
      "Make an X (Twitter) QR code that opens your profile or a single post in one scan. Add your logo and colours. Free, no sign-up, no watermark, no expiry.",
    h1: "X (Twitter) QR code generator",
    intro:
      "Make a QR code that opens your X profile, or one post you want people to read. Scan, open, follow. Free, with no sign-up and no watermark.",
    steps: [
      { title: "Enter your handle", body: "Type your username, with or without the @, or paste a link to your profile or a post." },
      { title: "Check what visitors see", body: "Open the link in a private browser window. Protected accounts only show posts to approved followers." },
      { title: "Style it", body: "Add your colours, logo or a \"Scan me\" frame." },
      { title: "Test and download", body: "Scan the preview, then download in PNG, JPEG, SVG or PDF, from 512 to 4096 px." },
    ],
    useCases: [
      { title: "Speakers and panels", body: "Put your handle code on the closing slide so the audience can follow and tag you during the session." },
      { title: "Live updates", body: "Point a code at the account that posts live news from a conference, match or launch." },
      { title: "Announcements", body: "Link to one post with the full details of an offer, release or statement." },
      { title: "Press kits", body: "Add your profile code to printed press materials and name cards." },
    ],
    tips: [
      "Link to a profile for follows and to a post for one specific message. A post link stays on that post however much you post afterwards.",
      "Handles change more often than people expect. If you might rename the account, a dynamic code lets you update the link after printing.",
      "On slides, make the code large. People scan from their seats, often several rows back.",
      "Write your handle in text under the code so people can search for you if the scan fails.",
      "Keep the code dark on a light background, even if your slides use a dark theme.",
    ],
    faq: [
      { q: "Do old twitter.com links still work?", a: "twitter.com links currently redirect to x.com. StayQR builds x.com links when you type a username." },
      { q: "Does it open the X app?", a: "If the app is installed, the phone usually opens the profile in it. Otherwise it opens in the browser." },
      { q: "Can I link to a single post?", a: "Yes. Copy the post's link from the share menu and paste it in place of your username." },
      { q: "Can people see my profile without an account?", a: "X may ask visitors to log in before showing much. Open the link in a private browser window to see what they'll get." },
      { q: "Do X QR codes expire?", a: "No. Static codes never expire and have unlimited scans, as long as the profile or post still exists." },
      { q: "Is the X QR code generator free?", a: "Yes. There's no sign-up and no watermark, and you can add your logo, colours and a \"Scan me\" frame before downloading PNG, SVG, JPEG or PDF." },
    ],
    related: ["linkedin", "instagram", "tiktok", "url"],
  },

  // ── tiktok ───────────────────────────────────────────────────────────
  {
    slug: "tiktok",
    title: "TikTok QR Code Generator: Free, No Watermark",
    description:
      "Create a TikTok QR code that opens your profile or a video in one scan. Use it on products, packaging and merch. Free, no sign-up, no watermark, no expiry.",
    h1: "TikTok QR code generator",
    intro:
      "Make a QR code that opens your TikTok profile or a specific video. Put it on products, packaging and shop counters to bring people from the real world to your videos. Free, with no sign-up and no watermark.",
    steps: [
      { title: "Enter your username or a video link", body: "Type your username, with or without the @, and StayQR builds the tiktok.com/@username link. To open one video, paste its link instead." },
      { title: "Check the account is public", body: "Private accounts only show videos to approved followers, so people who scan may see very little." },
      { title: "Style it", body: "Bold colours are fine, but keep the dots dark on a light background so the code scans reliably." },
      { title: "Test and download", body: "Scan the preview, then download PNG, JPEG, SVG or PDF for your print job." },
    ],
    useCases: [
      { title: "Product inserts", body: "Link to a video showing the product in use, or to your profile for more ideas." },
      { title: "Shop counters and windows", body: "Turn people browsing in person into followers who'll see your next drop." },
      { title: "Events and pop-ups", body: "Show a code on a banner so visitors can follow you and find videos from the day." },
      { title: "Creator merch", body: "Add your profile code to stickers, tote bags and phone cases." },
    ],
    tips: [
      "Printing on fabric or curved items? Make the code bigger than you would on paper and test the finished product, because stretch and folds distort the pattern.",
      "Point to a single video when it explains the product, and to the profile when you want follows.",
      "When linking a video, copy the link from the share menu and check it opens that clip, not your feed.",
      "Write your @username next to the code so people can search for you if they can't scan.",
      "Keep codes at least 2 cm (0.8 in) wide on small labels and test them under shop lighting.",
    ],
    faq: [
      { q: "Does a TikTok QR code open the app?", a: "If TikTok is installed, the link usually opens in the app. Otherwise it opens in the browser, where TikTok may prompt the viewer to log in or get the app." },
      { q: "Can I link to one video?", a: "Yes. Paste the video link instead of your username." },
      { q: "How is this different from the code in the TikTok app?", a: "StayQR gives you a code in your own colours with your logo and frame, downloaded in PNG, SVG, JPEG or PDF up to 4096 px for print." },
      { q: "Can I swap the video later?", a: "Not on a static code. If you want to switch to a newer video, a dynamic code lets you change the destination after printing." },
      { q: "Do free TikTok QR codes have a watermark?", a: "No. StayQR's free codes have no watermark, never expire and have unlimited scans." },
    ],
    related: ["instagram", "youtube", "x", "facebook"],
  },

  // ── paypal ───────────────────────────────────────────────────────────
  {
    slug: "paypal",
    title: "PayPal QR Code Generator: Free PayPal.Me QR Codes",
    description:
      "Make a PayPal QR code that opens your PayPal.Me link, with or without a set amount. Great for stalls, tips and invoices. Free, no sign-up, no watermark.",
    h1: "PayPal QR code generator",
    intro:
      "Make a QR code that opens your PayPal.Me link so people can pay you in a few taps. Add an amount for a fixed price, or leave it blank for tips and donations. Free, with no sign-up and no watermark.",
    steps: [
      { title: "Find your PayPal.Me username", body: "Check you have a PayPal.Me link set up in your PayPal account. Your username is the part after paypal.me/." },
      { title: "Add an amount and currency", body: "Enter an amount and pick USD, EUR, GBP, AUD or CAD for a fixed price. Leave the amount empty to let people choose." },
      { title: "Style and test", body: "Add your colours and a \"Scan me\" frame, then scan the preview and check it opens your PayPal page with the right name and amount. You don't need to complete a payment to test it." },
      { title: "Download", body: "Save as PDF or SVG for signs, or PNG for invoices and emails." },
    ],
    useCases: [
      { title: "Market stalls and craft fairs", body: "Take payments from people who don't carry cash, with a code on the table." },
      { title: "Tips and donations", body: "Leave the amount blank on a tip jar, busking sign or charity poster." },
      { title: "Invoices", body: "Add a code with the exact amount to a printed invoice so clients can pay without typing details." },
      { title: "Shared costs", body: "Collect money for a group gift, club fees or a shared dinner with one code." },
    ],
    tips: [
      "Use one code per price. A set amount suits a fixed price, and for anything that varies, leave the amount out.",
      "Print your PayPal name and the amount in text next to the code, so payers can confirm they're paying the right person.",
      "On public displays, check regularly that nobody has stuck a different code over yours.",
      "Laminate signs for outdoor stalls and print at least 3 cm (1.2 in) wide so people can scan from across the table.",
      "Keep your PayPal.Me username stable. If you change it, codes with the old name stop reaching you.",
    ],
    faq: [
      { q: "What is a PayPal QR code?", a: "It's a QR code that holds your PayPal.Me link, optionally with an amount and currency. Scanning it opens your PayPal payment page on the person's phone." },
      { q: "Can I set a fixed amount?", a: "Yes. Add an amount and currency and they're included in the link. Leave the amount blank and the payer enters their own." },
      { q: "Does StayQR process the payment?", a: "No. The code only opens your PayPal.Me link. The payment happens in PayPal, and StayQR never sees it or takes a cut." },
      { q: "Does the payer need the PayPal app?", a: "No. The link opens in the PayPal app if it's installed, or in the browser if not." },
      { q: "Are PayPal QR codes free to make?", a: "Yes. The code is free, never expires and has unlimited scans. Any PayPal fees are set by PayPal." },
    ],
    related: ["url", "whatsapp", "sms"],
  },
];

export const qrTypePage = (slug: string) => QR_TYPE_PAGES.find((p) => p.slug === slug);
