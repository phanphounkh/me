# Audit of the previous portfolio (camdev.site)

Audited 20 November 2026, before the rebuild.

## What was there

| Item          | Finding                                                                                                                                                                                                                                                                                                                                                                |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Live site     | `https://www.camdev.site` — a Vue 3 + TypeScript + Vite single-page app (client-rendered: the HTML is an empty `<div id="app">`).                                                                                                                                                                                                                                      |
| Source        | Most likely `github.com/phanphoun/phanphoun-portfolio` (Vue; the same images, sidebar layout and Gemini chatbot strings as the live bundle). The working folder for this rebuild was empty, so the new site was started fresh.                                                                                                                                         |
| Positioning   | Title and meta description said "Full-Stack Software Developer … Vue, TypeScript, React, Node.js". No mention of AI/ML, computer vision, OCR or SKAI Technology.                                                                                                                                                                                                       |
| SEO           | Canonical, `og:url` and JSON-LD pointed to an old Vercel preview URL (`portfolio-afavapc9o-phanphounpncstudents.vercel.app`), not camdev.site. `og:image` was a relative path. JSON-LD said `worksFor: Freelance`. `/robots.txt` and `/sitemap.xml` return the app's HTML fallback, i.e. they don't exist. Content was client-rendered, so crawlers saw an empty page. |
| Personal info | Public phone number and a placeholder email (`phounphan@example.com`) in site config. Placeholder social links (`twitter.com/phanphoun`, `instagram.com/phanphoun`). Two different LinkedIn URLs (`/in/phanphoun` and `/in/phan-phoun-73baa2352`).                                                                                                                     |
| Education     | Listed "Associate Degree in Web Development, 2025 – Present, GPA 3.8/4.0" and a high school with a GPA — not verified against the brief, so not carried over.                                                                                                                                                                                                          |
| Projects      | Football Field Booking App, Student Management System, Dev Review Dashboard, Portfolio Website, Express MySQL MVC, OOP TypeScript (+ others). Dates such as "January 2024" conflict with the repositories' history. Cover images were hot-linked from third-party sites (dev.to, YouTube, a stock site, Facebook CDN).                                                 |
| Broken links  | `github.com/phanphoun/dev-review-dashboard` → **404**. The Football Booking demo (`finall-vc1.vercel.app`) loads, but its API is offline ("Cannot connect to server").                                                                                                                                                                                                 |
| Testimonials  | `src/config/testimonials.ts` holds quotes from fellow students (currently commented out) — not carried over.                                                                                                                                                                                                                                                           |

## Decisions in the rebuild

- **Kept** (verified repositories): Football Field Booking App, Student Management System, Express MySQL MVC,
  OOP TypeScript, REST API — under "Earlier web projects", with neutral descriptions and no invented dates.
- **Dropped**: Dev Review Dashboard (repository 404), the old portfolio entry (superseded), testimonials,
  GPA claims, phone number, placeholder social links, hot-linked third-party images.
- **Not linked**: the Football Booking live demo until its API is back online.
- **Portrait**: the real photo from the old site (`/images/phounphan.png`) is reused, cropped and optimised
  (2.8 MB PNG → 34 KB AVIF). Nothing generated.
- **Framework**: the old Vue source was not in the working folder, and the brief's current projects are
  SvelteKit-based, so the new site is SvelteKit (static output) — no server needed.
