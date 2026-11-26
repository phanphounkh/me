# Phoun Phan — Portfolio & Digital CV

Personal portfolio and recruiter-ready CV of **Phoun Phan**, AI/ML Engineering Intern at SKAI Technology
(Phnom Penh) — computer vision, Khmer OCR research and Python software engineering.

- **Prerendered site** — SvelteKit 3 (Svelte 5, TypeScript); every page is static HTML. The only server code is
  the chat assistant's `/api/chat` endpoint (a Vercel Function). No database.
- **Content in one place** — every word on the site, in the CV and in the chat assistant's knowledge comes from
  `src/lib/content/*.ts`.
- **Chat assistant** — floating widget with three options: **Ask AI** (Google Gemini + RAG over the portfolio
  content), **Email** (ready-to-send draft) and **Call** (tap-to-call / copy number).
- **CV generated from the same content** — `/cv/` is a print layout; `npm run cv` prints it to an A4 PDF.

## Quick start

```bash
npm install
cp .env.example .env # then paste your Gemini API key into .env (optional — see below)
npm run dev          # http://localhost:5173
```

Requirements: Node 22+, and for CV generation / tests: Google Chrome and `poppler-utils`
(`pdfinfo`, `pdftotext`, `pdftoppm`).

## Commands

| Command              | What it does                                                                                                                |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`        | Development server with hot reload.                                                                                         |
| `npm run build`      | Production build into `.vercel/output/` (fails on any broken internal link or missing `#anchor`).                           |
| `npm run preview`    | Serve the production build at http://localhost:4173.                                                                        |
| `npm run check`      | Type-check (svelte-check, strict TypeScript).                                                                               |
| `npm run embeddings` | Precompute the chat assistant's passage vectors (needs `GEMINI_API_KEY`); run after editing content.                        |
| `npm run cv`         | Build, print `/cv/` → `static/files/Phoun-Phan-CV.pdf`, render `static/og.png` and the CV preview, verify the PDF, rebuild. |
| `npm run images`     | Regenerate optimised images (AVIF/WebP/JPEG) from `assets-src/`.                                                            |
| `npm run links`      | Check every internal link, `#anchor`, asset and external URL in the build output.                                           |
| `npm run test:e2e`   | Playwright tests (desktop + mobile): navigation, menu, theme, filters, tabs, forms, chat, CV, overflow, axe accessibility.  |
| `npm run verify`     | `check` → `build` → `links` → `test:e2e`.                                                                                   |
| `npm run format`     | Prettier.                                                                                                                   |

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

## Chat assistant

The floating button (bottom-right on every page except `/cv/`) opens a panel with three tabs:

| Tab        | What it does                                                                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Ask AI** | Answers questions about Phoun from the portfolio content, with links to the sections it used. Streams the answer; Enter sends, Esc closes. |
| **Email**  | Short form that opens a ready-to-send draft in the visitor's mail app (`mailto:`) or in Gmail, or copies the address. Nothing is stored.   |
| **Call**   | `tel:` link to `profile.phone`, a copy button for desktop visitors, and the current time in Phnom Penh.                                    |

**How the AI works (RAG).** `src/lib/server/chat/knowledge.ts` turns the content files into ~50 small topic
chunks (profile, contact, each project and case study, skills, research…). For each question the server embeds
the question with Gemini embeddings, compares it with the precomputed passage vectors, picks the best
matches (blended with keyword search, so names like "TrOCR" match exactly), and asks the Gemini model to answer
**only** from those passages.

The passage vectors are precomputed into `src/lib/server/chat/embeddings.json` by `npm run embeddings`, so the
live site embeds only each question (one request). After editing `src/lib/content/*.ts`, run
`npm run embeddings` and commit the file. If you forget, nothing breaks: changed passages are embedded at
runtime, once per server instance.

**Configuration** — server-only environment variables, declared in `src/env.ts`:

| Variable                 | Default                 | Notes                                                                                   |
| ------------------------ | ----------------------- | --------------------------------------------------------------------------------------- |
| `GEMINI_API_KEY`         | —                       | From [Google AI Studio](https://aistudio.google.com/apikey). Never sent to the browser. |
| `GEMINI_MODEL`           | `gemini-3.5-flash`      | Model that writes answers.                                                              |
| `GEMINI_BACKUP_MODEL`    | `gemini-3.5-flash-lite` | Tried when the main model is overloaded, rate-limited or retired.                       |
| `GEMINI_EMBEDDING_MODEL` | `gemini-embedding-001`  | Model used for retrieval.                                                               |

Locally put them in `.env` (git-ignored). On Vercel add `GEMINI_API_KEY` under Project → Settings →
Environment Variables (or `vercel env add GEMINI_API_KEY`), then redeploy.

**Without a key, or if Gemini fails** (quota, outage), the assistant still answers: it replies from the best
matching portfolio passages and contact details, and the header shows "Offline mode".

**Abuse limits:** questions are capped at 600 characters and 10 messages of history, cross-origin requests are
refused, and each visitor IP gets 20 questions per 10 minutes (per server instance). Set a quota or budget on
the API key in Google AI Studio as a hard ceiling.

## Project structure

```
src/
  app.css                    design tokens (dark/light), base styles, components, reveal motion
  app.html                   no-flash theme script
  env.ts                     server-only environment variables (Gemini)
  lib/
    content/                 ← all site and CV text
    components/
      home/                  Hero, SkillOrbit, Portrait, About, Journey, Experience, Projects, Skills, Research, Resume, Contact
      chat/                  ChatWidget (launcher + panel), AiChat, QuickEmail, QuickCall, safe Markdown formatter
      project/               ProjectCard, CompactCard, ProjectCover, CoverArt (SVG illustrations)
      research/              PipelineExplorer, LineFigure
      layout/                Navbar, Footer, Logo, ThemeToggle, BackToTop
      ui/                    SectionHeading, StatusBadge, Picture, BrandIcon
      Seo.svelte             title, description, canonical, Open Graph, Twitter, JSON-LD
    server/chat/             assistant knowledge (chunks from content), retrieval (embeddings + BM25), Gemini prompt
    actions/reveal.ts        scroll reveal (never hides content that is already on screen)
    state/theme.svelte.ts    theme toggle state
    config/nav.ts            navigation items
  routes/
    (site)/+page.svelte      home (9 sections)
    (site)/projects/[slug]/  case studies (prerendered for each project)
    cv/                      printable A4 CV
    og/                      1200×630 social card (rendered to og.png; noindex)
    api/chat/                POST endpoint for the assistant (the only non-prerendered route)
    sitemap.xml/, robots.txt/
scripts/                     prepare-images, generate-cv, check-links
tests/site.spec.ts           Playwright end-to-end + accessibility tests
static/                      images, CV PDF, og.png, favicon, manifest, _headers
assets-src/                  original images (portrait, project screenshots)
docs/                        AUDIT.md (old site audit), CONFIRM.md (facts to confirm)
```

## Deployment

The site builds with `@sveltejs/adapter-vercel`: pages and assets are prerendered static files, and
`/api/chat` (plus 404 handling) runs as a Vercel Function.

**Vercel** (the previous site's host): import the repository, add the `GEMINI_API_KEY` environment variable,
and deploy. `vercel.json` adds long-term caching for hashed assets and security headers. Then point the
`camdev.site` domain at the project (Project → Settings → Domains). Update `SITE_URL` in `profile.ts` first if
the domain changes.

**Other hosts**: swap the adapter in `vite.config.ts` — `@sveltejs/adapter-netlify` or
`@sveltejs/adapter-cloudflare` keep the chat working (`static/_headers` provides the same headers there).
A purely static host (GitHub Pages) can't run the chat endpoint; use `@sveltejs/adapter-static` and remove the
`ChatWidget` from `src/routes/(site)/+layout.svelte`.

## Accessibility & motion

Semantic landmarks, skip link, visible focus rings, keyboard-operable tabs and menu (Escape closes,
focus returns), `aria-live` status for the contact form, WCAG AA contrast in both themes (checked with axe in
the test suite). All animations respect `prefers-reduced-motion`; content is never hidden when JavaScript is
off, when motion is reduced, or when printing.
