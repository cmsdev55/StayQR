# EndureQR action plan (27 October 2026)

Ordered by dependency: later items rely on earlier ones. Each item states what it rests on, what it unblocks, how we'd
know it failed, and an early signal to watch.

## Phase 1: before launch (this week)

**1. Register endureqr.com and make it the home of the site, emails and short links.** Critical.
- **Rests on:** brand, contact and printed codes all depend on a domain you control. Today none of them is on one.
- **Unblocks:** 2, 3, 6, 11, 12, AdSense, Resend email and all link building.
- **Failed if:** any page, structured data, llms.txt or a newly created short link still shows `vercel.app` or bounces
  mail.
- **Watch:** a test email to hello@ arrives, and the Search Console Domain property is verified.

**2. Until then, set `NEXT_PUBLIC_CONTACT_EMAIL` to a working inbox.** Critical.
- **Rests on:** privacy and abuse requests must reach a person.
- **Failed if:** the contact page still shows an address that bounces.
- **Watch:** send one test message from the contact page link.

**3. Put short links on the owned domain before the first paid code is created, and publish the shutdown
commitment.** High.
- **Rests on:** "your codes keep working" is only as durable as the host in the printed link.
- **Depends on:** 1.
- **Do:** add an FAQ stating CSV export at any time, domain renewal paid years ahead, and how long redirects run after
  a closure (the Terms already promise 90 days' notice and export).
- **Failed if:** a new dynamic code still encodes `*.vercel.app/r/…`.
- **Watch:** the share of codes created on the owned host (target 100%).

**4. Search Console and Bing for the live host, plus IndexNow.** High.
- **Rests on:** pages can't rank if they aren't discovered, and Bing feeds ChatGPT search and Copilot.
- **Do:** verify the new property, submit the sitemap, import into Bing, add IndexNow.
- **Failed if:** Pages → Indexed stays at 0 after 3 weeks.
- **Watch:** the number of indexed pages in Search Console each week.

## Phase 2: trust and intent (weeks 2–3)

**5. Name the people behind EndureQR.** High.
- **Rests on:** Google's quality guidance weighs who stands behind how-to and safety content.
- **Do:** a founder section on About, a named author and reviewer on guides (switch the Article author to Person), the
  legal entity in Privacy, and an /editorial-policy page.
- **Failed if:** guides still show an organisation author 30 days from now.
- **Watch:** author schema present on 16/16 guides.

**6. One brand entity in the structured data.** Medium.
- **Depends on:** 1 and 5.
- **Do:** reuse `/#organization` everywhere; use a 512 px PNG logo; add `sameAs` once the profiles in item 11 exist.
- **Failed if:** the Rich Results Test shows more than one Organization node without an `@id`.
- **Watch:** a brand query in Search Console starts showing the sitelinks or knowledge panel.

**7. Rebuild `/dynamic-qr-code-generator` tool-first.** High.
- **Rests on:** what ranks for this query lets people make a dynamic code before paying.
- **Do:** put the generator in dynamic mode at the top and ask for a plan at "Save". Consider 1 free dynamic code or a
  trial. Show "14-day money-back" under every "Start Pro".
- **Failed if:** the page still has no input above the fold 2 weeks after the change.
- **Watch:** the sign-up start rate from that page (needs analytics).

**8. Mobile: inputs before the preview on generator pages, and no ads between the inputs and Download.** Medium.
- **Failed if:** the first input sits more than 900 px down on a 390×844 phone.
- **Watch:** mobile downloads per visit.

**9. Retarget `/alternatives/bitly` to "Bitly alternative for QR codes"** (title, H1, intro). Medium.
- **Failed if:** Search Console shows it impressing mainly on link-shortener queries.
- **Watch:** impressions for queries containing "qr".

## Phase 3: content depth (month 2)

**10. Guides: sources, images and question headings.** Medium.
- **Do:** link 2–4 primary sources per guide with a "checked" date; add diagrams to what-is-a-qr-code,
  size-for-printing, design-best-practices and static-vs-dynamic; phrase about half the H2s as questions; split
  sections over 200 words.
- **Failed if:** guide impressions don't grow in the 4 weeks after the update.
- **Watch:** Search Console impressions per guide; any AI citations seen.

**11. Off-site presence.** Medium.
- **Depends on:** 1.
- **Do:** LinkedIn, X, YouTube (how-tos that mirror the top guides), Product Hunt, AlternativeTo and SaaSHub. Add the
  profiles to `sameAs`.
- **Failed if:** there are no referring domains in Search Console or Bing after 60 days.
- **Watch:** referring domains in Bing Webmaster Tools.

**12. Industry and comparison pages:** remove the 7 shared sentences, add one real example and 2 specific FAQs each,
and add BreadcrumbList. Low.

**13. Performance polish:** trim the font preloads (homepage LCP), add a `srcset` to the hero image, add a modern
`browserslist`, and long-cache the hero images. Low.
- **Failed if:** homepage mobile LCP stays above 2.5 s in lab and field data.

**14. llms.txt:** add the feature, industry and comparison pages and a key-facts list (pricing, refund, cancellation
policy). Add `lastmod` from real content dates for every sitemap URL. Low.

## Phase 4: ongoing

- Weekly: Search Console Pages and Queries; Bing referring domains.
- After 4 weeks of data: run `/seo google` for real queries and CrUX, then `/seo cluster` to plan the next 10 pages.
- Re-run `/seo audit` after Phase 2 and compare with this report.
