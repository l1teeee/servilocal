# ServiLocal Redesign Plan

## Design Read

Redesign preserve for a local-worker marketplace in El Salvador. Keep the blue and white brand system, but make the page feel practical, local, trustworthy, and human instead of like a generic SaaS landing page.

Dial target:

- Design variance: 5/10
- Motion intensity: 3/10
- Visual density: 5/10

## Site Analysis

The current home page has the right business idea and usable data flow, but the visual language is too uniform: centered hero, blue gradients, rounded cards, icon circles, and repeated three-column card layouts. It reads more like a generic template than a marketplace where a client hires a real plumber, teacher, designer, delivery worker, or cleaner.

The brand colors are clear and should be preserved:

- Primary: `#1d4ed8`
- Secondary: `#2563eb`
- Background: `#eff6ff`
- Surface container: `#dbeafe`
- Text: `#172554`
- Outlines: `#93c5fd` and `#bfdbfe`

The main risks are route and data related:

- `/` is its own landing page and is not inside `(marketplace)`.
- `/jobs` and `/jobs/[id]` are the real public marketplace routes.
- `searchParams` and `params` are promises in this Next 16 codebase.
- The header is a Server Component because it calls `auth()` and server translations.
- Home data must keep safe empty states because Prisma can fail or return no open jobs.
- The mobile bottom nav points to dead routes and should be aligned with existing routes.
- Payment and commission logic must not be touched by visual redesign work.

## Redesign Plan

1. Replace the centered gradient hero with an asymmetric marketplace hero: copy and search on one side, human/local work image and job-request details on the other.
2. Keep the same colors, but use white and pale blue with more restraint. Reserve strong blue for primary actions and selected states.
3. Make search feel like a real tool. Avoid a fake location input until the backend supports location filtering.
4. Convert category bubbles into useful category tiles with counts, short hints, and direct links to `/jobs?category=...`.
5. Restore the "how it works" content as a trust flow: publish, compare proposals, pay protected, release when done.
6. Redesign active jobs so one listing is featured and the rest are compact marketplace rows/cards. Surface budget, client, date, and protected payment signals.
7. Fix mobile navigation to route users to existing surfaces: home, jobs, post job, about.
8. Keep Server Components and existing data fetching. Do not introduce heavy client-side animation.

## Implementation Prompt

Improve the current ServiLocal landing page without changing its business logic, routes, payments, or database contracts.

Use Next.js App Router conventions from the local `node_modules/next/dist/docs` because this project uses Next 16. Keep pages and layouts as Server Components unless interactivity requires a client leaf. Do not change `params` or `searchParams` from promises.

Preserve the existing brand palette from `src/app/globals.css`. Use the same primary blue, secondary blue, pale blue backgrounds, navy text, and outline colors. Do not introduce purple gradients, glassmorphism, decorative blobs, or generic centered SaaS hero composition.

Make the home page feel like a trustworthy local-worker marketplace for El Salvador:

- Asymmetric hero with clear copy, one functional search field, two primary actions, trust signals, and a real visual asset.
- Category tiles that link to `/jobs?category=...`, show active counts, and include short local-use hints.
- A practical trust-flow section that explains publish, compare proposals, secure payment, and completion.
- Active job listings with a featured listing plus compact secondary listings, showing budget, client, category, date, and protected-payment context.
- Empty states for no jobs and no categories.
- Mobile-first layouts with explicit one-column fallbacks.

Also update obvious UX debt:

- Fix bottom navigation so it points to existing routes.
- Avoid footer links to pages that do not exist unless those pages are added.
- Keep the header server-rendered and session-aware.

Verification:

- Run `npm run lint`.
- Run `npm run build`.
- Review the page for overflow, contrast, mobile layout, and dead links.
