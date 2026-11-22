# OblivionTattoo — Product Context

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary audience is clients of the OblivionTattoo studio in Chișinău.
They browse the studio's work, choose a service and an artist, and get in touch
for a consultation or appointment. Training is the second major focus.
Prospective students compare programs and contact the studio to discuss training.

## Product Purpose

Showcase the studio's expertise through its portfolio and information about its artists
and services. The primary conversion is a client inquiry about a consultation or
appointment. Training inquiries are important, with studio clients' needs taking
priority. Numerical targets and performance metrics have yet to be set.

## Positioning

OblivionTattoo is a tattoo studio and academy in Chișinău. The website covers
tattooing, piercing, permanent makeup, and training in these services.
The studio's advantages over other studios have yet to be verified. Avoid
unsubstantiated claims of uniqueness, superiority, awards, or guaranteed results.

## Operating Context

Visitors browse examples of the studio's work and read about its services, terms,
and the studio itself, then get in touch through the available messaging apps or by phone.
They use these contact channels to consult with the studio, agree on procedure details,
and book an appointment. Prospective students choose a program and discuss dates
with the studio. The website includes a home page, service and course pages, a gallery,
a blog, and a contact page with a map.

## Capabilities and Constraints

- Russian is the default language and has no URL prefix. Other locales use `/ro`, `/uk`, `/it`, and `/en`.
  UI text is stored in `messages/{ru,ro,uk,it,en}.json`.
- The blog is available in all five site languages. Switching languages keeps the reader on the same article.
- Use the existing contact links from `src/lib/contactLinks.ts`.
  Keep the current Instagram and Telegram account names regardless of the website name.
- Preserve routes, integrations, `data-gtm` analytics attributes, authentic photographs,
  Supabase URLs, and image paths. Use actual photos of the studio's work.
- Get current prices, programs, and terms from the project source and translations.
  Keep pricing in those sources.
- Use verified information for services, artist details, reviews, qualifications,
  medical claims, and other factual statements.
- Use the existing stack of Next.js App Router, React, TypeScript, Tailwind CSS,
  next-intl, Prisma with PostgreSQL, and Supabase Storage. Use pnpm for project commands.
  Add dependencies only when needed and use Server Components by default.
- Choose motion that helps users understand the interface or interact with it.
  Consider transitions beyond the standard fade-in.
- Protect secrets and preserve environment variables during design work.
  Follow the SEO and IndexNow constraints in `AGENTS.md`.

## Brand Commitments

- The project and package name is `obliviontattoo`, and the brand is OblivionTattoo.
  Preserve the existing spelling Oblivion Tattoo in content unless explicitly asked to change it.
- Preserve the studio's logo and original materials.
- The user set a quality benchmark of original interfaces on par with the work of
  contemporary creative digital agencies, with expressive typography, unconventional
  layouts, and considered animation. Apply this preference within the requested scope.
- Preserve the existing visual style where it works well and propose improvements where
  warranted. `DESING.md` describes the current design. The filename spelling is intentional.
  Check the code and `src/app/globals.css` for exact values and behavior.
- A distinct tone of voice has yet to be agreed on. Base new copy on verified facts
  and the existing translations.

## Evidence on Hand

- The existing logos are `public/logo.svg` and `public/logo.png`.
- `public/images/` contains images for services, the studio, training, and the home page.
- The gallery uses existing images from Supabase. Server-side data and blog posts are
  available through Prisma (`src/lib/cachedPrisma.ts` and `prisma/`).
- `messages/*.json` contains current service descriptions, FAQs, programs, terms, and
  contact details. `src/lib/courses.ts` holds the settings for training programs.
- `src/lib/contactLinks.ts` centralizes contact and location links.
- Treat existing marketing copy as a source of claims that need independent verification.
  Substantiate new claims about advantages, certifications, safety, and results.

## Product Principles

1. Help clients assess the studio's work and services, then get in touch for a consultation or appointment.
2. Build trust with authentic materials and verifiable information.
3. Develop training as the second major focus while keeping studio clients the priority.
4. Maintain access across languages, working routes, and familiar ways to get in touch.
5. Use composition and motion to help visitors understand and use the site.

## Accessibility & Inclusion

Keep the site accessible on phones, tablets, and desktops. Ensure long translations
remain readable, and preserve semantic markup, keyboard navigation, visible focus,
ARIA labels, and contrast. Respect `prefers-reduced-motion`. Specific audience needs
and a target accessibility conformance level have yet to be established.
