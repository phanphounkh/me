# Information to confirm before publishing

Everything below is either hidden or written conservatively until you confirm it. Each item points to
the exact place to edit. Search the code for `TODO(confirm)` to find them all.

| #   | What                                                                                                    | Current state                                                      | Where to change                                                             |
| --- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| 1   | **Public email** — `phanphoun855@gmail.com` (used on the old site) vs `phounphan855@gmail.com` (old CV) | Uses `phanphoun855@gmail.com`                                      | `src/lib/content/profile.ts` → `email`                                      |
| 2   | **LinkedIn URL** — `/in/phanphoun` or `/in/phan-phoun-73baa2352`?                                       | **Hidden** everywhere (hero, footer, contact, CV, structured data) | `profile.ts` → `links.linkedin`                                             |
| 3   | **Availability line** — "Open to junior AI/ML, computer vision and Python roles from December 2026"     | Shown in the hero                                                  | `profile.ts` → `availability`                                               |
| 4   | **Production domain** — is the new site replacing `www.camdev.site`?                                    | Canonical URLs, sitemap and OG tags use `https://www.camdev.site`  | `profile.ts` → `SITE_URL`                                                   |
| 5   | **PNC program, degree and dates** ("Web Programming, third-year student")                               | Shown without dates                                                | `src/lib/content/experience.ts` → `education[0]`                            |
| 6   | **EDM Center** program and dates                                                                        | Shown as institution + location only                               | `experience.ts` → `education[1]`, `journey[0]`                              |
| 7   | **Internship milestone dates** (Aug / Sep–Oct / Nov / Dec 2026 narrative)                               | Shown as approximate milestones                                    | `experience.ts` → `internshipTimeline`                                      |
| 8   | **Hands-on vs researching** split in the internship work areas                                          | My best reading of the brief                                       | `experience.ts` → `workAreas[*].items[*].mode`                              |
| 9   | **SKAI permission** to name "SORYA-AI" and describe the annotation studio's features publicly           | Described at a high level; no code, data, metrics or architecture  | `src/lib/content/projects.ts`                                               |
| 10  | **DataHub** — your role, and whether `github.com/SORYA-DATAHUB/DataHub` (public) may be linked          | Labelled "Team project", **not linked**                            | `projects.ts` → `datahub` (`context`, add `repo`)                           |
| 11  | **TaskFlow API** — publish the repository to add a code link                                            | No link (local only, no commits)                                   | `projects.ts` → `taskflow-api.repo`                                         |
| 12  | **Student Performance Analytics** — which steps are actually completed, and a repository link           | Shows learning goals only, no claims of results                    | `projects.ts` → `student-performance-analytics` (`implemented`, `repo`)     |
| 13  | **Annotation studio "planned" items** (pilot at scale; pre-fill with trained recognisers)               | Listed as planned                                                  | `projects.ts` → `khmer-annotation-studio.planned`                           |
| 14  | **Football Booking live demo** — API offline                                                            | Not linked                                                         | `projects.ts` → `earlierWork[0].live` once the API is back                  |
| 15  | **Portrait** — the only real photo available has sunglasses and a busy street background                | Used, cropped to upper body (hero) and head-and-shoulders (CV)     | Replace `assets-src/portrait/phoun-phan-original.png`, run `npm run images` |
| 16  | **YouTube** channel (brief: "if relevant")                                                              | Hidden                                                             | `profile.ts` → `links.youtube`                                              |

After changing content, regenerate the CV and social card: `npm run cv`.

A plain-background, front-facing headshot would noticeably improve both the hero and the CV — see item 15.
