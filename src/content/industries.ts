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
    faq: [
      { q: "Can each table have its own code?", a: "Yes. Create one code per table from a CSV and see scans by table in analytics." },
      { q: "What if we close for the season?", a: "Pause the code and guests see a friendly page with your reopening date." },
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
    faq: [
      { q: "Can I see which sign was scanned?", a: "Yes. Give each sign its own code and compare scans by sign, city and time of day." },
      { q: "Does it work on printed brochures?", a: "Yes. Download print-ready SVG and the code stays sharp at any size." },
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
    stat: { value: "3,000+", label: "badges printed once" },
    faq: [
      { q: "Can I schedule a destination change?", a: "Scheduled switching is on our roadmap. Today you change the destination in a few seconds from your phone, and every printed badge follows straight away." },
      { q: "Is there a scan limit for big events?", a: "No. Every plan has unlimited scans." },
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
    faq: [
      { q: "Can I add our logo?", a: "Yes, on every plan, including free static codes. The code switches to its highest error correction so it still scans with the logo in place." },
      { q: "What if a product is discontinued?", a: "Redirect its code to the replacement product so old packaging still sells." },
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
    stat: { value: "100%", label: "of leaflets on the current form" },
    faq: [
      { q: "Do you collect patient data?", a: "No. StayQR only counts anonymous scans: device type, city and time. Forms stay on your own systems." },
      { q: "Can staff edit codes?", a: "Team seats with their own logins are on our roadmap. Today one account manages your codes, and an update from any device takes seconds." },
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
    stat: { value: "240 rooms", label: "updated in one click" },
    faq: [
      { q: "Can we use one code per room?", a: "Yes. Create them in bulk from a CSV with room numbers." },
      { q: "Do guests need an app?", a: "No. The phone camera opens the link directly." },
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
    faq: [
      { q: "Is there an education discount?", a: "Contact us for school and university pricing." },
      { q: "Can students scan without an account?", a: "Yes. Scanning never needs an account or an app." },
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
    faq: [
      { q: "Can I export analytics for clients?", a: "Yes. Export any code's scans as CSV. Shareable read-only report links are on our roadmap." },
      { q: "Can clients edit their own codes?", a: "Not yet. Client access to their own folder, with edit or view-only rights, is on our roadmap." },
    ],
  },
];

export const industryBySlug = (slug: string) => INDUSTRIES.find((i) => i.slug === slug);
