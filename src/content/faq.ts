export type Faq = { q: string; a: string };

export const FAQ: Faq[] = [
  {
    q: "What happens to my QR codes if I cancel?",
    a: "They keep working. Every dynamic code keeps redirecting to its last destination, forever, with no service page and no ads. You only lose the ability to edit destinations and see new analytics until you come back.",
  },
  {
    q: "What's the difference between static and dynamic codes?",
    a: "A static code stores the link inside the pattern, so it can never change. A dynamic code points to a short StayQR link, so you can change where it goes after it's printed and see who scans it.",
  },
  {
    q: "Are there any scan limits?",
    a: "No. Free static codes and paid dynamic codes both have unlimited scans. We never cap, throttle or pause a code because it got popular.",
  },
  {
    q: "Is the free generator really free?",
    a: "Yes. Make as many static codes as you like, style them, and download SVG or PNG without signing up. There's no watermark and they never expire.",
  },
  {
    q: "How does the lifetime plan work?",
    a: "Pay $79 once and keep every Pro feature for the life of the product, including features we ship later. No renewals, no surprise invoices.",
  },
  {
    q: "Can I move my codes from another QR provider?",
    a: "You can't move a code that points at someone else's short link, but you can reprint with StayQR once and never have to reprint again. Import a CSV of destinations to create them all at once.",
  },
  {
    q: "Will my codes work on every phone?",
    a: "Yes. The built-in camera on iPhone and Android reads them directly, no app needed. Smart redirects can also send iPhone and Android users to different links.",
  },
];
