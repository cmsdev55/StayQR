export type Industry = {
  slug: string;
  name: string;
  /** Short line used in the marquee. */
  line: string;
  headline: string;
  intro: string;
  /** Destinations the code points at over time (the URL morph). */
  destinations: string[];
  useCases: { title: string; body: string }[];
  stat: { value: string; label: string };
  /** A worked example: one realistic scenario told as 3–5 short steps (no real business names, no statistics). */
  example: { title: string; steps: string[] };
  faq: { q: string; a: string }[];
};

export const INDUSTRIES: Industry[] = [
  {
    slug: "restaurants",
    name: "Restaurants",
    line: "Menus that change nightly",
    headline: "Print the table tent once. Change the menu every night.",
    intro: "Point one code at today's menu, swap it for the brunch menu on Sunday, and see which tables scan most, without reprinting a thing.",
    destinations: ["menu.osteria.co/dinner", "menu.osteria.co/brunch", "menu.osteria.co/winter-specials"],
    useCases: [
      { title: "Seasonal menus", body: "Switch the destination when the menu changes. The code on every table stays the same." },
      { title: "Order and pay", body: "Send guests straight to your ordering page, then back to the menu after service." },
      { title: "Reviews after the meal", body: "Put a code on the receipt that asks for a review, and change the review site whenever you like." },
    ],
    stat: { value: "1 print", label: "for every menu change this year" },
    example: {
      title: "Example: one code for a whole season of menus",
      steps: [
        "A café owner creates a dynamic code, adds the café logo and points it at the current menu page. They download a print-ready SVG and put it on every table card.",
        "In spring the menu changes. The owner pastes in the link to the new menu, and the next guest who scans sees it. The table cards stay where they are.",
        "On Sunday mornings they switch the destination to the brunch menu from their phone, then switch it back after service.",
        "At the end of the month they open the weekday-by-hour heatmap to see when guests look at the menu, and export the scans as CSV.",
        "When the café closes for a winter break, they pause the code. Anyone who scans sees a short message and the date the café reopens.",
      ],
    },
    faq: [
      { q: "Can each table have its own code?", a: "Yes. Create one code per table from a CSV and see scans by table in analytics." },
      { q: "What if we close for the season?", a: "Pause the code and guests see a friendly page with your reopening date." },
      { q: "Do guests need an app to scan the menu?", a: "No. The camera on a modern iPhone or Android phone opens the link directly." },
      { q: "Can EndureQR take orders or payments at the table?", a: "No. EndureQR sends guests to the page you choose, such as your existing ordering or payment page. It is not an ordering system itself." },
      { q: "Can guests join our Wi-Fi with a code?", a: "Yes. The free Wi-Fi code connects a phone to your network without typing the password, with no sign-up or watermark. The password is stored in the code itself, so make a new code if you change it." },
    ],
  },
  {
    slug: "real-estate",
    name: "Real estate",
    line: "Signs that outlive the listing",
    headline: "One yard sign. Every listing you'll ever have.",
    intro: "Put a code on your sign rider and point it at the current listing. When it sells, point it at the next one, and see which signs bring buyers in.",
    destinations: ["homes.co/42-elm-street", "homes.co/9-harbor-view", "homes.co/agent/maria-lopez"],
    useCases: [
      { title: "Sign riders", body: "Reuse the same sign for every property by changing where the code points." },
      { title: "Open house sign-in", body: "Send visitors to a sign-in form and follow up with the ones who scanned." },
      { title: "Flyers and brochures", body: "Link to a video tour today and the price update tomorrow." },
    ],
    stat: { value: "0 reprints", label: "when a listing goes under offer" },
    example: {
      title: "Example: one sign rider for every listing",
      steps: [
        "An estate agent creates a dynamic code, adds a frame that says \"Scan for details\" and downloads a print-ready SVG for the sign rider.",
        "They point the code at the listing page for the house on sale. Buyers who scan from the pavement see the photos, price and viewing times.",
        "When the house goes under offer, the agent points the code at their page of available properties. The sign can stay up a little longer and still be useful.",
        "For the next instruction, they move the rider to the new property and point the code at its listing.",
        "Each month they check daily scans and the city breakdown for each sign, and export the figures as CSV for their own records.",
      ],
    },
    faq: [
      { q: "Can I see which sign was scanned?", a: "Yes. Give each sign its own code and compare scans by sign, city and time of day." },
      { q: "Does it work on printed brochures?", a: "Yes. Download print-ready SVG and the code stays sharp at any size." },
      { q: "Can buyers save my contact details from a code?", a: "Yes. The free contact card (vCard) code saves your name, number and email to a buyer's phone, and it never expires. Your details are stored in the code, so if they change, either make a new code or use a dynamic code that points at your profile page." },
      { q: "How big should the code be on a sign?", a: "Bigger than on a brochure, because people scan signs from the pavement. Test a printed proof from where a buyer would stand, and leave a clear margin around the code." },
    ],
  },
  {
    slug: "events",
    name: "Events",
    line: "Schedules that move with the day",
    headline: "The schedule changed. Your badges didn't need to.",
    intro: "Codes on badges, posters and lanyards that always open the latest agenda, map or feedback form, even after the event ends.",
    destinations: ["summit.io/agenda", "summit.io/map/hall-b", "summit.io/feedback"],
    useCases: [
      { title: "Live agendas", body: "Room changes and late speakers update instantly behind the same code." },
      { title: "Sponsor booths", body: "Give every sponsor a code and a report of who scanned it." },
      { title: "After the event", body: "Point the code at recordings and next year's early-bird tickets." },
    ],
    stat: { value: "1 code", label: "per badge, from the first session to the recordings" },
    example: {
      title: "Example: one badge code from first morning to recordings",
      steps: [
        "The events team creates a dynamic code, adds the event logo and colours, and sends the print-ready PDF to the badge printer weeks ahead.",
        "On the day, the code opens the live agenda. When a speaker moves rooms, the team updates the agenda page and the printed badges stay correct.",
        "On the last afternoon, one of the team changes the destination to the feedback form from their phone. The next scan of any badge opens the form.",
        "After the event, they point the code at the recordings page, and later at early-bird tickets for next year.",
        "They check the weekday-by-hour heatmap to see when attendees used their badges most, and export the scans as CSV for the post-event review.",
      ],
    },
    faq: [
      { q: "Can I schedule a destination change?", a: "Scheduled switching is on our roadmap. Today you change the destination in a few seconds from your phone, and every printed badge follows straight away." },
      { q: "Is there a scan limit for big events?", a: "No. Every plan has unlimited scans." },
      { q: "Can we create codes for every session or sponsor at once?", a: "Yes. Upload a CSV of up to 500 rows to create the codes in one go, and download a ZIP of print-ready SVGs, one per row." },
      { q: "Can attendees add the event to their calendar?", a: "Yes. The free event code adds the date, time and place to a phone's calendar. The details are stored in the code, so if the date might move, use a dynamic code that points at your event page instead." },
      { q: "What happens to the codes after the event?", a: "They keep working. Point them at recordings or next year's page, or pause them with a message until registration opens." },
    ],
  },
  {
    slug: "retail",
    name: "Retail",
    line: "Packaging that stays current",
    headline: "Packaging lasts for years. Your links should too.",
    intro: "Put codes on products, shelves and windows that open the right page today and the right page next season.",
    destinations: ["shop.nord.com/care-guide", "shop.nord.com/restock", "shop.nord.com/winter-sale"],
    useCases: [
      { title: "On-pack codes", body: "Link to care guides, recipes or warranty pages, and update them without new packaging." },
      { title: "Shelf talkers", body: "Run a promotion this week and a different one next week, same printed card." },
      { title: "Window displays", body: "Let passers-by shop the window after hours." },
    ],
    stat: { value: "5 years", label: "of shelf life, one code" },
    example: {
      title: "Example: on-pack codes that outlast the packaging",
      steps: [
        "A homeware brand creates a dynamic code for a new product line, points it at the care guide and sends the print-ready SVG to the packaging printer with the artwork.",
        "Months later the care guide moves to a new page on their website. They update the destination, and every box already on the shelf opens the new page on the next scan.",
        "For a shelf talker in their own shop, they make a second code with separate iPhone and Android links, so each shopper lands in the right app store for the brand's app.",
        "When the product line is replaced, they point the on-pack code at the new range, so older stock still leads somewhere useful.",
        "They check the device and country breakdown to see where packs are being scanned, and export it as CSV for the next packaging review.",
      ],
    },
    faq: [
      { q: "Can I add our logo?", a: "Yes, on every plan, including free static codes. The code switches to its highest error correction so it still scans with the logo in place." },
      { q: "What if a product is discontinued?", a: "Redirect its code to the replacement product so old packaging still sells." },
      { q: "Will packaging codes still work if we cancel?", a: "Yes. Codes keep redirecting to their last destination after you cancel. Editing and new analytics pause until you resume." },
      { q: "Which file should we send to the packaging printer?", a: "SVG or PDF. Both are vector formats, so the code stays sharp at any size. PNG and JPG suit screens and digital use." },
      { q: "Can iPhone and Android shoppers go to different places?", a: "Yes. Smart redirects let you set a separate iPhone link and Android link, such as the right app store for each." },
    ],
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    line: "Forms and guidance that update",
    headline: "Patient leaflets that never point to an old form.",
    intro: "Codes on leaflets, waiting-room posters and appointment cards that always open the current form, guidance or booking page.",
    destinations: ["clinic.health/check-in", "clinic.health/flu-season", "clinic.health/book"],
    useCases: [
      { title: "Digital check-in", body: "Patients scan at reception and fill in the current intake form." },
      { title: "Up-to-date guidance", body: "Update aftercare instructions without reprinting every leaflet." },
      { title: "Booking", body: "Send people to your booking page, or to a phone number out of hours." },
    ],
    stat: { value: "Always", label: "the current form, from every leaflet already printed" },
    example: {
      title: "Example: one waiting-room poster that always opens the current form",
      steps: [
        "A practice manager creates a dynamic code for the waiting-room poster and points it at the check-in form, which runs on the practice's own system.",
        "When the form is replaced with a new version, they change the destination. The poster on the wall opens the new form on the next scan.",
        "A second code on appointment cards opens the online booking page. While the building is closed for refurbishment, they point it at a page with directions to the temporary site.",
        "In flu season, the code on the patient leaflet opens the vaccination information page. Afterwards, it goes back to the general guidance page.",
        "They check daily scans to see whether patients use the poster. The figures are anonymous counts, and no IP addresses are stored.",
      ],
    },
    faq: [
      { q: "Do you collect patient data?", a: "No. EndureQR only counts anonymous scans: device type, city and time. Forms stay on your own systems." },
      { q: "Can staff edit codes?", a: "Team seats with their own logins are on our roadmap. Today one account manages your codes, and an update from any device takes seconds." },
      { q: "Should we put patient information in a QR code?", a: "No. Use codes only to open public pages, such as booking, opening hours, directions, leaflets or a check-in form hosted on your own system. Keep personal and clinical details out of the code and its link." },
      { q: "Does EndureQR hold a healthcare compliance certification?", a: "No. EndureQR holds no compliance certification, such as HIPAA. It redirects scans to the pages you choose and counts them anonymously, so any form that collects patient details should stay on your own approved systems." },
      { q: "Can patients call the practice by scanning?", a: "Yes. The free phone code opens the dialler with your number filled in. It needs no sign-up and never expires, so it suits posters and appointment cards." },
    ],
  },
  {
    slug: "hotels",
    name: "Hotels",
    line: "Room cards guests actually use",
    headline: "Every room card, always up to date.",
    intro: "Wi-Fi details, breakfast hours, spa bookings and checkout: one code per room that you can change from your phone.",
    destinations: ["stay.harbourhotel.com/room-info", "stay.harbourhotel.com/spa", "stay.harbourhotel.com/checkout"],
    useCases: [
      { title: "Room information", body: "Replace the printed binder with a page you can edit any time." },
      { title: "Upsells", body: "Promote the spa in winter and the rooftop bar in summer from the same card." },
      { title: "Reviews at checkout", body: "Point the code at your review page on the morning of departure." },
    ],
    stat: { value: "1 card", label: "per room, kept current all year" },
    example: {
      title: "Example: one card per room, all year round",
      steps: [
        "The front-office manager uploads a CSV of room numbers and downloads a ZIP of print-ready SVGs, one code per room, for the in-room cards.",
        "Every code opens the guest information page with breakfast hours, Wi-Fi details and checkout times. When breakfast hours change, they edit the page and nothing is reprinted.",
        "A separate code on the lift poster opens the spa booking page in winter. In summer they point it at the rooftop bar instead.",
        "The room codes live in their own folder. When one room needs a different link, such as a guide for an accessible room, the manager searches for the room number and changes that code alone.",
        "They check the weekday-by-hour heatmap to see when guests look for information, and plan front-desk messages around it.",
      ],
    },
    faq: [
      { q: "Can we use one code per room?", a: "Yes. Create them in bulk from a CSV with room numbers." },
      { q: "Do guests need an app?", a: "No. The phone camera opens the link directly." },
      { q: "Can guests join the Wi-Fi by scanning?", a: "Yes. The free Wi-Fi code connects a phone to your network without typing the password. The password is stored in the code itself, so you need a new code when the password changes." },
      { q: "What if part of the hotel is closed?", a: "Pause the codes for that area. Guests who scan see a friendly page with your message and an optional date when the code is back on." },
      { q: "Can a code open our app on both iPhone and Android?", a: "Yes. Smart redirects send iPhone users to one link and Android users to another, such as the right app store for each." },
    ],
  },
  {
    slug: "education",
    name: "Education",
    line: "Handouts that point to this term",
    headline: "Handouts that point to this term, not last year's.",
    intro: "Codes on worksheets, noticeboards and textbooks that open the current reading list, timetable or sign-up form.",
    destinations: ["school.edu/timetable", "school.edu/reading-list", "school.edu/open-day"],
    useCases: [
      { title: "Course materials", body: "Link to this term's resources from printed handouts you reuse every year." },
      { title: "Noticeboards", body: "Club sign-ups, timetables and open days, always current." },
      { title: "Open days", body: "Track which posters and leaflets bring families in." },
    ],
    stat: { value: "Every term", label: "same handout, new link" },
    example: {
      title: "Example: one handout code reused every term",
      steps: [
        "A head of department creates a dynamic code for a course handout and points it at this term's reading list.",
        "The handout is printed once and used again the following year. At the start of each term, they change the destination to the new reading list.",
        "A second code on the noticeboard opens the club sign-up form in September. Later in the year they point it at the exam timetable.",
        "For an open day, the admissions team creates one code per poster and leaflet from a CSV and keeps them together in a folder.",
        "Afterwards, they compare scans across those codes to see which posters and leaflets families used, and export the results as CSV.",
      ],
    },
    faq: [
      { q: "Is there an education discount?", a: "There isn't a separate education plan. Many schools choose Lifetime: $79 once, with no renewals to budget for." },
      { q: "Can students scan without an account?", a: "Yes. Scanning never needs an account or an app." },
      { q: "Do you collect information about the students who scan?", a: "No personal details. Analytics show anonymous counts by day, device, approximate city and country, and time. No IP addresses are stored." },
      { q: "Can we show a code on a slide or screen?", a: "Yes. Download a PNG for slides and screens, or an SVG or PDF for print. Students can scan straight from the projector." },
      { q: "What if a link should stop working after term ends?", a: "Pause the code. Anyone who scans sees a friendly page with your message and an optional date when it is back on." },
    ],
  },
  {
    slug: "agencies",
    name: "Agencies",
    line: "Client codes you can hand over",
    headline: "Run every client's codes from one place.",
    intro: "Create codes for every campaign, organise them by client, and send the analytics. If a client leaves, their codes keep working.",
    destinations: ["campaign.brand.com/launch", "campaign.brand.com/contest", "brand.com/thank-you"],
    useCases: [
      { title: "Folders per client", body: "Keep every client's codes and destinations in their own folder." },
      { title: "Campaign switches", body: "Move a printed campaign from teaser to launch to thank-you page." },
      { title: "Client-safe", body: "Codes never break if you or the client stop paying, so print runs are never at risk." },
    ],
    stat: { value: "Unlimited", label: "codes across every client" },
    example: {
      title: "Example: one print campaign from teaser to thank-you",
      steps: [
        "An agency creates a folder for a client and makes the campaign code inside it, with the client's logo, frame and colours.",
        "Before launch, the code on posters and flyers opens a teaser page. On launch day, someone at the agency switches it to the launch page from their phone.",
        "When the competition closes, they point the code at a thank-you page, so late scans still land somewhere useful.",
        "At the end of each month, they export the code's scans as CSV and add them to the client's report.",
        "If the agency later cancels its plan, the printed code keeps redirecting to its last destination, so the client's print run is never wasted.",
      ],
    },
    faq: [
      { q: "Can I export analytics for clients?", a: "Yes. Export any code's scans as CSV. Shareable read-only report links are on our roadmap." },
      { q: "Can clients edit their own codes?", a: "Not yet. Client access to their own folder, with edit or view-only rights, is on our roadmap." },
      { q: "Can we create a whole campaign's codes at once?", a: "Yes. Upload a CSV of up to 500 rows to create the codes in one go, and download a ZIP of print-ready SVGs." },
      { q: "Can several people at the agency log in?", a: "Not yet. Team seats with their own logins are on our roadmap. Today one account manages every client's codes." },
      { q: "Can we use our own domain for the short links?", a: "Not at the moment. Every dynamic code uses an EndureQR short link, which keeps working whichever destination you choose." },
    ],
  },
];

export const industryBySlug = (slug: string) => INDUSTRIES.find((i) => i.slug === slug);
