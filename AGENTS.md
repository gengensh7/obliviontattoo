<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# OblivionTattoo — Project Context

OblivionTattoo is a multilingual website for a tattoo studio and academy in Chișinău.
It covers tattoos, piercings, permanent makeup, courses, a gallery, a blog, and contact information.
The repository is [gengensh7/obliviontattoo](https://github.com/gengensh7/obliviontattoo).
Keep `obliviontattoo` as the package and directory name.
Read `DESING.md` in the repository root before making UI changes.

## Stack and Structure

- Next.js 16.3 App Router, React 19, TypeScript, Tailwind CSS 4, pnpm.
- next-intl, Prisma 7 with PostgreSQL, Supabase Storage for images, and Vercel.
- `src/app/[locale]/` holds pages, with page-specific components in adjacent `ui/` directories.
- `src/components/ui/` holds base UI components, and `src/shared/` holds reusable components and sections.
- `src/widgets/` holds the header and footer. `src/lib/` holds server-side data, SEO, and contact information.
- `messages/{ru,ro,uk,it,en}.json` holds translations, and `src/i18n/` holds routing configuration.
- `prisma/` holds the schema and migrations. `src/generated/prisma/` is generated automatically.
- `public/` holds static assets, and `scripts/` contains setup scripts for MapLibre and IndexNow.

## Change Guidelines

Review the existing code and make the smallest change that satisfies the task. Preserve the design,
routes, and working integrations. Add dependencies and abstractions only when needed.
Use Server Components by default and add `use client` only where necessary.
Read the relevant section of `node_modules/next/dist/docs/` before changing how the project uses Next.js APIs.
Preserve Cache Components and the existing settings when resolving errors.
Leave generated files untouched and keep migrations within the scope of the task.

## Development Rules

### Styling

- Use Tailwind CSS for all component styling.
- Do not use CSS Modules or create `.module.css` files.
- Use standard Tailwind utility classes.
- Use the shared `brand-red` Tailwind color for link and icon accents. It matches the `red-600` fill of `CtaLink`. Keep text white on a red CTA.
- Use the full width of the standard `container` for sections and galleries. Do not add `max-w-*` utilities to narrow their layouts.
- Do not use arbitrary values with square brackets such as `w-[500px]`, `max-w-[49ch]`, or `text-[18px]`.
- Do not use `clamp()` for responsive sizing.
- Do not write explicit `rem`, `em`, or `ch` units.
- Prefer pixel-based design values where explicit units are required.
- Do not use Tailwind margin utilities `mt-*`, `mb-*`, or `my-*`.
- Use `gap-*`, padding utilities, Flexbox, and Grid for spacing.
- Prefer existing Tailwind utilities over custom CSS.
- Append new style blocks to the end of `src/app/globals.css` and place a short comment above each block explaining its purpose.
- Use standard Tailwind responsive breakpoints.
- Do not introduce new styling libraries.

### Components

- Follow the existing project architecture.
- Reuse existing components where appropriate.
- Put new cross-page components such as text animations in `src/shared/`. Keep base UI primitives in `src/components/ui/` and page-specific components in the route's `ui/` directory.
- Preserve existing functionality and SEO.
- Keep components readable and maintainable.

### Third-party UI components

- shadcn/ui is the primary UI component system.
- React Bits, Magic UI, Aceternity UI and other registries may be used as additional sources of components.
- Install only the specific component required for the task.
- Before installation, inspect dependencies, target file paths, and potential conflicts.
- Never overwrite existing shadcn/ui components without explicit approval.
- Keep shadcn/ui registry component files, such as `src/components/ui/button.tsx`, free of project-specific styles, variants, and behavior.
  Apply customizations through `className` at the call site or in a project-owned wrapper so registry updates can replace the component safely.
- Never reinitialize shadcn/ui or replace the existing `components.json`.
- Adapt third-party code to the existing Tailwind configuration and project conventions.
- Avoid unnecessary dependencies and duplicate components.
- After integration, run TypeScript, ESLint and production build checks.

### Animations

- Follow the installed Emil Kowalski animation skills.
- Avoid unnecessary animation libraries.
- Respect `prefers-reduced-motion`.

### Design

- Follow the existing project design context.
- Use Impeccable when improving visual design.
- Maintain consistency with the OblivionTattoo design system.

### Typography & Editorial Layout

Judge the rendered composition as a whole. Text alignment is one design decision within the layout.

- Left-align body copy by default. Choose heading alignment and text placement to suit the composition. Use centering deliberately when it improves balance, hierarchy, or the reading order.
- Give each section a clear focal point and a deliberate hierarchy. Balance the visual weight of text, imagery, and negative space, and give generous open areas a compositional purpose.
- Use asymmetric grids, split layouts, editorial compositions, and unconventional image placement where they support the content and reading order.
- Shape typography with heading scale, column width, line breaks, and visual rhythm. Check real copy and long translations at desktop and mobile widths.
- Vary section structure according to the content. Repeated layouts work best for content with comparable roles and visual weight.
- Recompose split layouts for smaller screens and preserve their hierarchy and focal points as elements reflow.
- When a layout feels weak, address its structure, proportions, and relationship between text and imagery. Alignment, padding, and gap adjustments alone are insufficient.

### Code simplicity

- Prefer the simplest implementation that satisfies the requirements.
- Avoid overengineering and unnecessary abstractions.
- Prefer declarative React APIs.
- Do not introduce additional state, effects, refs, or animation controllers without a clear need.
- Prioritize maintainability and readability over clever solutions.
- Animation complexity must be justified by visible UX improvements.

## Third-party component integration

When integrating components from React Bits, 21st.dev, Magic UI, Aceternity UI or other UI libraries:

- Inspect the original source code, dependencies and demo before implementation.
- Preserve the original visual effects and animation behavior unless explicitly requested otherwise.
- Adapt components to the existing Next.js, TypeScript and Tailwind architecture.
- Follow all project conventions defined in AGENTS.md.
- Never overwrite existing components without checking their usage.
- Install only necessary dependencies.
- Avoid overengineering and unnecessary React state.
- Preserve accessibility, responsive behavior and reduced-motion support.
- Do not modify unrelated sections or components.
- Verify the result in a browser, not just through TypeScript or build checks.
- If the component is incompatible with the project, explain the issue instead of silently replacing it with a simplified imitation.

## Localization and Routing

Russian (`ru`) is the default language and has no URL prefix. Other locales use `/ro`, `/uk`, `/it`, and `/en`.
`src/i18n/routing.ts` holds routing configuration. `src/proxy.ts` handles redirects and localization.
The blog uses shared slugs across locales. Store article translations in the language-specific columns of `BlogPost`. List and index only published posts with content for the requested locale.
Add UI text through the translation files for all five locales.
Use the existing navigation and metadata helpers.

## Data and Secrets

Prisma is server-only and is accessed through `src/lib/prisma.ts` and `src/lib/cachedPrisma.ts`.
The models are `Image` and `BlogPost`. Caching uses `use cache`, `cacheLife`, and `cacheTag`.
The gallery renders the first six images on the server. `src/lib/galleryImages.ts`
also serves `/api/gallery` using the same locale and `(order, id)` cursor ordering.
Preserve Supabase URLs and image paths, and account for `next.config.ts`.
Import `SUPABASE_S3_URL` from `src/lib/config.ts` when constructing public Supabase image URLs. Read `NEXT_PUBLIC_SUPABASE_URL_S3` in that config file.
Keep the contents of `.env*`, passwords, tokens, `DATABASE_URL`, and service-role keys private.
Do not overwrite existing environment variables.
Contact links are stored in `src/lib/contactLinks.ts`. Keep the existing Instagram and Telegram account names regardless of the project name.

## SEO and IndexNow

Use `NEXT_PUBLIC_DOMAIN_URL` as the sole domain variable. Do not introduce `SITE_URL`.
`src/app/sitemap.ts` includes localized pages and blog posts from Prisma.
`src/app/robots.ts` generates `robots.txt`. Git already tracks `public/llms.txt`.
`src/lib/metadata.ts` and `src/lib/jsonld.ts` provide metadata and JSON-LD.
`scripts/indexnow.ts` uses the official API and the existing sitemap.
The `prebuild` step generates the public key file from the `INDEXNOW_KEY` environment variable.
Preserve the safeguards for preview and local environments, public key validation, and safe `postbuild` error handling.
Submitting real URLs during verification requires explicit user permission.
Verify the build with `INDEXNOW_DRY_RUN=true pnpm build`.
After deployment, `pnpm indexnow` is available as a standalone command.
See `scripts/INDEXNOW.md` for details.

## Verification and Completion

Use pnpm. The main commands are `pnpm dev`, `pnpm exec tsc --noEmit`, and `pnpm lint`.
Use a clean browser session for hydration checks. `impeccable shot` changes lazy images to eager when taking screenshots, which can cause a hydration warning if it runs before React hydrates.
Run the build with IndexNow in dry-run mode when changes affect production compilation.
If a built sitemap is available for offline verification, run `pnpm indexnow --dry-run --local`.
Leave unrelated errors out of scope and report which checks you were able to run.
Briefly list the changes, checks, and limitations when finished.
Git ignores new `.md` files. `AGENTS.md` and `DESING.md` provide local project context.
Update these documents when the architecture or design changes significantly.
