# Phoun Phan — Portfolio & Digital CV

Personal portfolio and recruiter-ready CV of **Phoun Phan**, AI/ML Engineering Intern at SKAI Technology
(Phnom Penh) — computer vision, Khmer OCR research and Python software engineering.

- **Static site** — SvelteKit 3 (Svelte 5, TypeScript) prerendered to plain HTML; no server or database.
- **Content in one place** — every word on the site and in the CV comes from `src/lib/content/*.ts`.
- **CV generated from the same content** — `/cv/` is a print layout; `npm run cv` prints it to an A4 PDF.

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
```

Requirements: Node 22+, and for CV generation / tests: Google Chrome and `poppler-utils`
(`pdfinfo`, `pdftotext`, `pdftoppm`).

## Commands

| Command            | What it does                                                                                                                |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`      | Development server with hot reload.                                                                                         |
| `npm run build`    | Static production build into `build/` (fails on any broken internal link or missing `#anchor`).                             |
| `npm run preview`  | Serve the production build at http://localhost:4173.                                                                        |
| `npm run check`    | Type-check (svelte-check, strict TypeScript).                                                                               |
| `npm run cv`       | Build, print `/cv/` → `static/files/Phoun-Phan-CV.pdf`, render `static/og.png` and the CV preview, verify the PDF, rebuild. |
| `npm run images`   | Regenerate optimised images (AVIF/WebP/JPEG) from `assets-src/`.                                                            |
| `npm run links`    | Check every internal link, `#anchor`, asset and external URL in `build/`.                                                   |
| `npm run test:e2e` | Playwright tests (desktop + mobile): navigation, menu, theme, filters, tabs, form, CV, overflow, axe accessibility.         |
| `npm run verify`   | `check` → `build` → `links` → `test:e2e`.                                                                                   |
| `npm run format`   | Prettier.                                                                                                                   |

## Editing content

| File                            | Contains                                                             |
| ------------------------------- | -------------------------------------------------------------------- |
| `src/lib/content/profile.ts`    | Name, title, contact, links, hero copy, summary, about, languages    |
| `src/lib/content/experience.ts` | SKAI internship, work areas, timeline, education, journey            |
| `src/lib/content/projects.ts`   | Projects, case studies, more AI work, earlier web projects           |
| `src/lib/content/skills.ts`     | Skill groups, hero constellation, currently learning, CV skill lines |
| `src/lib/content/research.ts`   | OCR pipeline stages, Khmer challenges, principles                    |

Rules the content follows: status labels are conservative (nothing is called production-ready), implemented
and planned features are always listed separately, and SKAI Technology internal code, data, architecture and
metrics are never shown. Unverified facts are marked `TODO(confirm)` — see **[docs/CONFIRM.md](docs/CONFIRM.md)**.
Setting a link to `null` hides it everywhere (no dead buttons).

After editing content, run `npm run cv` so the PDF, its preview and the social card stay in sync.

### Hero skill constellation

The hero’s interactive skill nodes live in `heroSkills` (`src/lib/content/skills.ts`). Each entry controls the
brand icon, description, orbit position and tooltip direction. Nodes support pointer hover, keyboard focus,
Escape to dismiss and touch/click selection; the animation has a pause control and respects reduced motion.

The constellation uses `static/images/portrait-square-*`, generated from
`assets-src/portrait/phoun-phan-original.png` (`SQUARE_CROP` in `scripts/prepare-images.mjs`). After changing
that portrait, run `npm run images && npm run cv` to refresh the hero, CV and social card.

## Project structure

```
src/
  app.css                    design tokens (dark/light), base styles, components, reveal motion
  app.html                   no-flash theme script
  lib/
    content/                 ← all site and CV text
    components/
      home/                  Hero, SkillOrbit, Portrait, About, Journey, Experience, Projects, Skills, Research, Resume, Contact
      project/               ProjectCard, CompactCard, ProjectCover, CoverArt (SVG illustrations)
      research/              PipelineExplorer, LineFigure
      layout/                Navbar, Footer, Logo, ThemeToggle, BackToTop
      ui/                    SectionHeading, StatusBadge, Picture, BrandIcon
      Seo.svelte             title, description, canonical, Open Graph, Twitter, JSON-LD
    actions/reveal.ts        scroll reveal (never hides content that is already on screen)
    state/theme.svelte.ts    theme toggle state
    config/nav.ts            navigation items
  routes/
    (site)/+page.svelte      home (9 sections)
    (site)/projects/[slug]/  case studies (prerendered for each project)
    cv/                      printable A4 CV
    og/                      1200×630 social card (rendered to og.png; noindex)
    sitemap.xml/, robots.txt/
scripts/                     prepare-images, generate-cv, check-links
tests/site.spec.ts           Playwright end-to-end + accessibility tests
static/                      images, CV PDF, og.png, favicon, manifest, _headers
assets-src/                  original images (portrait, project screenshots)
docs/                        AUDIT.md (old site audit), CONFIRM.md (facts to confirm)
```

## Deployment

The build output (`build/`) is plain static files.

**Vercel** (the previous site's host): import the repository; `vercel.json` sets the build command, output
directory, trailing slashes and long-term caching for hashed assets. Then point the `camdev.site` domain at
the new project (Project → Settings → Domains). Update `SITE_URL` in `profile.ts` first if the domain changes.

**Netlify / Cloudflare Pages**: build command `npm run build`, publish directory `build`. `static/_headers`
provides the same caching and security headers.

**Any static host / GitHub Pages**: upload the contents of `build/`. `404.html` is generated for unknown URLs.

## Accessibility & motion

Semantic landmarks, skip link, visible focus rings, keyboard-operable tabs and menu (Escape closes,
focus returns), `aria-live` status for the contact form, WCAG AA contrast in both themes (checked with axe in
the test suite). All animations respect `prefers-reduced-motion`; content is never hidden when JavaScript is
off, when motion is reduced, or when printing.
