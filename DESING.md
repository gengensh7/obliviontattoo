# OblivionTattoo — Design and Interface

This file describes the site's existing design. The spelling of `DESING.md` is intentional.
Before making UI changes, check the current components and `src/app/globals.css`
for exact colors, dimensions, and behavior.

## Site Character

The site represents a tattoo studio and academy in Chișinău. Its main content covers
the studio's work, services, training, and bookings. The design emphasizes large
photographs, high-contrast typography, and clear calls to action. Preserve the studio's
visual identity, logo, imagery, and existing page structure.

## Colors and Typography

- The base palette combines black, white, and neutral grays, with red as the accent.
- CSS tokens such as `primary`, `background`, `foreground`, and `radius` are defined in `globals.css`.
- Headings use Montserrat. Body text, links, and captions use Roboto.
- The locale layout loads the fonts through `next/font/google` with the Latin and Cyrillic subsets.
- The hero uses large text, grayscale photographs, and a dark overlay.
- Introduce new palettes, fonts, or a global theme only as part of an explicit task.

## Layout

The home page runs in this order.

HeroSlider → Services → About the studio → Tattoo designs → Studio advantages → Portfolio → Contacts → Map

`src/app/[locale]/page.tsx` defines the order. The header is fixed at the top.
At the top of the page, React Bits Glass Surface sits behind the desktop Gooey Nav
and the language switcher. The language options open in a frosted dropdown.
After scrolling, the glass covers the full header. It refracts the page behind it,
with a frosted fallback. Gooey Nav uses white text on a red-600 active pill. Navigation, the
language switcher, and the mobile menu are in `src/widgets/header/`.

Use the existing container, section spacing, and responsive Tailwind classes.
Service cards shift from a single column on phones to multiple columns on wider
screens. Match new sections to neighboring sections in spacing and scale.

The `/permanent` hero pairs a Montserrat heading with a large photo of the studio's
work and a list of links to three services. The palette uses zinc tones with a rose
accent. On phones, the photo sits between the introductory text and the list.
Hovering over a link or focusing it with the keyboard changes the photo. Each link
leads to the corresponding service description and price.
React Bits Fade Content brings the hero into focus as a single block. Below the
fold, the main sections come into focus once as they enter the viewport. The hero
photo switches immediately on pointer hover or keyboard focus once the new image is loaded.

## Components and Interactivity

Reuse components from `src/components/ui/`, shared sections, and existing galleries.
Use `next/image` with appropriate `alt` text, `sizes`, and image dimensions.
Preserve the quality of the portfolio photos and use authentic studio photography.
Booking and contact buttons use centralized links from `contactLinks.ts`.
Preserve `data-gtm` attributes when editing existing actions.
Keep the current social media account names regardless of the website name.

## Responsive Design, Accessibility, and Performance

Check for horizontal overflow, readable long translations, accessible menus and
buttons, and correct image proportions on phones, tablets, and desktops.
Account for the fixed header when laying out the hero.
Preserve visible keyboard focus, ARIA labels, contrast, and semantic markup.
Add motion only when useful and respect `prefers-reduced-motion`.
Preserve existing hero transitions and fallback components.
Keep limited interactivity in focused Client Components to preserve server rendering
for the rest of the page.

## Copy and Scope

The interface is translated into `ru`, `ro`, `uk`, `it`, and `en` through `messages/*.json`.
Russian is the default language and has no URL prefix. Update interface copy through `next-intl`.
Use verified information for prices, contact details, reviews, medical claims, and studio services.
Limit edits to the relevant section unless the request specifies a broader scope.
After visual changes, check any affected loading, hover, and focus states, as well as
the mobile menu if affected. Documentation-only changes require no new build.
