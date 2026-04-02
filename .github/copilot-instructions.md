# Copilot instructions for `nns-website`

## Working with Copilot

- **Never make git commits without explicit user authorization.** Complete the work, then wait for the user to say something like "go ahead and commit" or "commit that" before running `git commit`. The user will review changes before committing.

## Build, test, and lint commands

Use the `package.json` scripts that already exist:

```bash
npm run dev
npm run build
npm run start
npm run generate-og-images
```

- `npm run build` runs `next build && npm run generate-og-images`. The post-build step fetches Wix data and writes static Open Graph assets into `public/og/shows/*.png` and `public/og/people/*.jpg`.
- `npm run generate-og-images` is the fastest way to refresh those generated OG assets without starting the production server.
- There is currently no committed `npm test`, single-test command, or `npm run lint` script in `package.json`. ESLint is configured in `eslint.config.mjs`.

## High-level architecture

- This is a Next.js 16 App Router site. The main application lives under `src/app`, with route groups separating shells:
  - `src/app/(general)` is the full public site layout with fonts, header/footer, QR code overlay support, and Vercel Speed Insights.
  - `src/app/(standalone)` is a minimal shell for routes that should not render the main site chrome.
- Most pages are server components that query Wix directly. The app does not have a separate internal API layer for CMS data; pages and server actions call the Wix SDK from `src/lib/wixClient.ts`.
- `src/lib/wixClient.ts` defines two clients:
  - `wixClient` uses OAuth for the site-facing Wix modules.
  - `wixApiClient` uses API key auth for media/file access that the OAuth client cannot handle.
- Wix is the source of truth for content and commerce data:
  - `Shows`, `People`, and `Credits` collections drive show pages, seasons, and credits pages.
  - `wixEventsV2` drives the box office and per-event ticket pages.
  - Wix Forms submissions power the contact form flow.
- `src/app/actions/shows.ts` is the main show enrichment layer. `getShowsWithData()` joins show records with cast credits, grouped crew credits, and upcoming events before show pages render.
- Open Graph images are handled in two places:
  - `scripts/generate-og-images.ts` creates static show/person assets in `public/og` during `npm run build`.
  - `src/app/(general)/seasons/[year]/opengraph-image.tsx` generates season lineup images dynamically with `next/og`.
- `next.config.ts` rewrites `/svg/*.svg` to route handlers under `src/app/svg/*`, so generated SVG endpoints should be treated like first-class assets.

## Key conventions

- Use `WixImage` (`src/app/components/WixImage.tsx`) or `getScaledToFitImageUrl()` (`src/app/utils/wix/media.ts`) for Wix-hosted images. This repo intentionally patches Wix image URLs because the SDK helpers produce incorrect fill/fit and dimension parameters for this project.
- Preserve the existing manual-sort behavior for Wix CMS records. `manualSort()` in `src/app/utils/index.ts` and the crew grouping logic in `src/app/actions/shows.ts` both depend on Wix’s generated `_manualSort*` fields instead of a dedicated `order` column.
- Person profile URLs are keyed by both slug and Wix ID (`/credits/[slug]/[id]`). Use `nameSlug()` and the slug parsing helpers in `src/app/utils/index.ts` instead of inventing a new slug format.
- Show, review, and audition copy often comes from Wix as HTML and is rendered with `dangerouslySetInnerHTML`. Metadata generation strips tags for summaries, but page content preserves the CMS HTML.
- The contact form is a three-part flow:
  - `ContactForm.tsx` is the client UI.
  - `ReCaptchaForm.tsx` obtains the token.
  - `submitContactForm()` in `src/app/actions/contact.ts` verifies reCAPTCHA, maps fields to hard-coded Wix field IDs, submits to Wix, then redirects to `/contact/thanks`.
- Several content-heavy pages set `export const revalidate = 60`; keep ISR in mind before switching those pages to fully dynamic behavior.
- Import application code through the `@/*` alias from `tsconfig.json` instead of deep relative paths.
