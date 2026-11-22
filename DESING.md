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

`src/app/[locale]/(home)/page.tsx` defines the order. The header is fixed at the top.
At the top of the page, React Bits Glass Surface sits behind the desktop Gooey Nav
and the language switcher. The language options open in a frosted dropdown.
After scrolling, the glass covers the full header. It refracts the page behind it,
with a frosted fallback. Gooey Nav uses white text on a red-600 active pill. Navigation, the
language switcher, and the mobile menu are in `src/widgets/header/`.
The mobile header opens a graphite Sheet from the left. The panel pairs a compact
wordmark with a scrollable navigation list, a collapsible course group and a
contact area with a consultation CTA, social icons and the shared language
switcher. On short screens, navigation and contacts scroll together.

Use the existing container, section spacing, and responsive Tailwind classes.
Service cards shift from a single column on phones to multiple columns on wider
screens. Match new sections to neighboring sections in spacing and scale.
Home headings use the same Fold Text reveal as `/permanent`. Section content
comes into focus once, with the hero starting on mount and the remaining sections
revealing as they enter the viewport.

The home page tattoo sketches span the standard container, with a centered
portrait and partial views of neighboring photographs. The carousel uses
native scroll snapping. As each photograph moves toward the center, it grows
to full size and regains opacity, saturation, and contrast. The active title
sits under the gallery with its position and controls on the right. Visitors
can pause autoplay and browse in a continuous loop by swipe, drag, arrows, or
keyboard. With reduced motion enabled, the gallery starts paused, controls
advance immediately, and neighboring photographs use static dimming.
Photographs open in the shared lightbox.

The home portfolio uses the React Bits Masonry layout across the standard
container. It shows one column on phones, two from the small breakpoint, and
three from the large breakpoint. Taller photographs enter the layout first so
the shorter ones can balance the column ends. Photographs keep their original
proportions and open in the shared PhotoSwipe lightbox. The gallery link sits
with the section introduction. Reduced motion skips the scroll and reflow
animations.

The gallery opens with a full-height introduction that pairs a Montserrat
headline with the studio description, an anchor to the work and Telegram booking.
Aceternity Dotted Glow fades into the dark gallery surface. The photographs
follow the document scroll in groups of six, arranged in one, two or three columns.
Each group tracks its own scroll progress so new photographs append in place.
On phones the photographs remain still. Reduced motion also freezes the dotted
background and uses immediate anchor navigation. Photos open in PhotoSwipe.
The shared FAQ accordion follows the photo feed, then the studio contact section.
As on `/course`, headings use Fold Text. The introduction comes into focus on
mount and each later section reveals once on scroll. Reduced motion shows them immediately.

The `/tattoo` hero fills at least the viewport height and leads with a large
Montserrat headline, standard red CTA links for booking and the gallery, and
the starting price. The styles card pairs a studio
photograph with a dark glass surface and spans two rows beside the cover-up and
custom-design cards. All three cards stack on phones. A muted burgundy Aceternity
Vortex sits behind the composition at all viewport widths and pauses offscreen.
Visitors with reduced motion see the static burgundy background.
As on `/permanent`, Fade Content brings the hero into focus on mount and reveals
the remaining sections once on scroll. Fold Text opens headings, including the
card titles. Reduced motion shows the content immediately.

The `/tattoo` price section uses a graphite React Bits Magic Bento grid. A table
compares the four prices by size and colour. Cover-up and booking deposit cards
sit beside it on desktop, with both free sketch options grouped below. The main
booking link follows the grid. Below the medium breakpoint, the cards stack and
each size groups its two labelled prices side by side. Red pointer lighting
runs only on devices with a fine pointer and when reduced motion is off.

The `/tattoo` consultation uses Aceternity Sticky Scroll Reveal. Each numbered
step holds its copy in view within its own scroll interval. The right panel
updates its step count, heading and details while the Telegram link stays in its
footer. On narrow or short screens and with reduced motion, the steps and
Telegram link follow in normal reading order.

The `/tattoo` portfolio uses React Bits Circular Gallery with a shallow arc
and optimized previews of the eight portfolio photographs. Visitors can drag,
swipe, use a horizontal wheel gesture, or browse with the arrow controls.
Photographs open at their original proportions in the shared PhotoSwipe lightbox.
When WebGL is unavailable, the photos remain accessible in a native snap-scrolling
row. The sections share a zinc-950 base which gradually returns to zinc-900
toward the FAQ.

The `/piercing` hero pairs a left-aligned headline and red CTA links with three
studio photographs from the Supabase gallery. A nostril piercing leads, with
smaller eyebrow and septum photographs staggered alongside it. Below the
desktop breakpoint, the copy and actions appear above the collage. Aceternity
Background Beams With Collision uses muted red trails and small bursts at all
viewport widths while the hero is visible. The dark burgundy background also works
without motion. The price CTA links to the pricing section using its native
anchor. An Aceternity
Timeline brings the piercing catalog, booking, procedure, and aftercare into six
stages. It pairs sticky headings with compact service lists and copy, stacks
the text alongside the left rail on phones, and shows a static rail for reduced
motion. The catalog reads the localized services and prices from the price list.

The piercing price list uses Aceternity Tabs for five anatomical categories.
The red indicator springs between tabs and the list changes height as one
category fades into the next. On hover, two category previews peek out from
behind the active list. Keyboard navigation and reduced motion switch immediately.
Tabs wrap on phones and support arrow keys. Below the medium breakpoint, each
price row pairs the service name with its price and places the red Telegram
booking link below. From medium widths, all three share a row. Longer lists
use two columns on desktop.

The piercing charts use the Aceternity Apple Cards Carousel across the standard
container. Category titles sit above the uncropped previews. The next card
peeks into view on the right, and the row supports touch, mouse drag, and arrow
buttons. The contact link follows the chart row.

The `/permanent` hero pairs a Montserrat headline, introduction, and the standard
red booking link with an asymmetric composition of the studio's work. The eyebrow
portrait leads, with a narrower lip crop above and a wider eyelid crop overlapping
the portrait at the lower right. Titles and descriptions sit on shaded areas of
the photographs, and each photograph links to its service description and price.
On phones, the headline and booking link lead into a wide eyebrow portrait and
two smaller, staggered crops. The loading state follows the same composition.
Muted rose light and slow rose-purple Morphic Background particles add depth behind
the copy and photography. The particles pause offscreen and in hidden tabs.
The treatment heading retains Gradient Text. Fold Text opens each heading once when it enters
the viewport, including the service cards and FAQ questions.
React Bits Fade Content brings the hero into focus as a single block. Reduced
motion shows the full composition immediately. Below the fold, the main sections
come into focus once as they enter the viewport.

Section headings and descriptions on `/permanent` follow the left edge of the
standard container. The definition pairs a heading on the left with a description
on the right from the tablet breakpoint, then stacks them on phones.

The `/permanent` gallery leads with a large lip photograph alongside four detail
photographs in two rows of alternating widths. The description sits beneath the
heading, and the portfolio CTA aligns to the right on wider screens. On phones,
the CTA follows the description, the lead photograph spans the full width, and
the detail photographs appear in pairs. All five photographs open in the
existing lightbox.

The `/permanent` price cards use graphite surfaces, thin borders and soft black
shadows. A raised photo and its caption sit in front of the card, with the service
copy and price close to the surface. The cards turn slightly on two axes over
10 seconds at different phases. Motion pauses while a booking link has visible
keyboard focus. Reduced motion presents a static layout.

The `/course` hero fills the visible viewport with a left-aligned headline,
Telegram booking, and a link to compare the three courses. The comparison
follows directly below. The tattoo course pairs a graphite panel with a
black-and-white studio photograph. It spans two rows beside the
permanent makeup and piercing courses on desktop. On tablets, the tattoo course
spans both columns. On phones, the three courses stack in reading order. Muted
pink Aceternity Sparkles sit behind the content on a dark burgundy background.
As on `/permanent`, Fade Content brings the hero into focus on mount. The
comparison, diplomas, FAQ, and contacts come into focus once on scroll. Fold Text
opens the page and section headings, course names, and FAQ questions. Reduced
motion keeps the static background and presents the content immediately.

The `/course` diploma section pairs its heading and language details with two
staggered graduation portraits on a zinc-900 surface. The copy moves above the
portraits on tablets, and the portraits stack on phones. The cards tilt gently
in opposite phases and pause their idle motion on hover or visible keyboard
focus. Aceternity 3D Card Effect follows the mouse. Reduced motion keeps the
cards still. The original photos open in the shared PhotoSwipe lightbox.

The three course detail pages pair a compact heading, price, duration, and
Telegram booking link with one photograph of the studio's work. The copy leads
on phones. Course information, programme, FAQ, and the shared contacts follow
on zinc surfaces with graphite dividers and small red accents. Breadcrumbs lead
back to the catalogue. The desktop Courses label also leads to the catalogue,
and its adjacent button opens the course links. On mobile the links expand
inside the existing drawer.

The blog opens with a full-height, two-column masthead over Aceternity Background Lines.
Graphite and burgundy dashes travel along the original paths and fade away.
Reduced motion leaves the dark background still. Both hero actions use CtaLink. The newest post pairs a full-width split cover with its date,
title and excerpt. Embedded article images supply the cover when available.
Otherwise the cover uses a studio photograph and logo. On phones, the cover
sits above the text. With multiple posts, a search field filters titles and
excerpts and the archive follows the cover story in a responsive grid. The reader FAQ
and shared contacts follow the articles. The blog uses the course hero type scale,
Fold Text on headings and Fade Content on each section.

Individual blog posts use a compact editorial header with breadcrumbs, the localized
introduction, publication date, estimated reading time and an embedded cover when
available. The article spans the standard container, with a gutter for Aceternity Tracing Beam.
Its red tip follows the text at 35% of the viewport height and becomes a static graphite
rail with reduced motion. The footer links to the blog, consultation and up to two
other published posts available in the reader's language.

## Components and Interactivity

Reuse components from `src/components/ui/`, shared sections, and existing galleries.
Use `next/image` with appropriate `alt` text, `sizes`, and image dimensions.
Preserve the quality of the portfolio photos and use authentic studio photography.
Booking and contact buttons use centralized links from `contactLinks.ts`.
Use `CtaLink` from `src/components/ui/cta-link.tsx` for button-style links with
a brand-red fill and white text. The Tailwind `brand-red` color matches `red-600`
and also applies to red link and icon accents. Use text labels for site CTAs. All CTA links
share a 48px minimum height. Pass layout classes for width and alignment.
Use localized paths for internal routes and standard URLs for external destinations
and same-page anchors.
Preserve `data-gtm` attributes when editing existing actions.
Keep the current social media account names regardless of the website name.

Cookie settings open a compact graphite panel at the lower left. Both choices have
equal weight. The footer reopens the panel, and the lower right stays available
for the chat launcher. JivoChat loads when the visitor opens chat.

The shared contact section pairs its heading and red Telegram CTA with rows for
the phone, studio address, and opening hours. The two columns stack below the
desktop breakpoint. Social links sit below a thin rule and wrap on narrow
screens. The booking CTA keeps the same red fill on hover. The phone
number takes on the CTA red on hover.

The `/contacts` hero pairs the introduction, Telegram booking, portfolio link,
and three compact benefits with a translucent graphite contact panel. The panel
includes the address and directions, hours, phone, and social links. On smaller
screens it follows the introduction. Muted Aceternity Wavy Background ribbons
run behind both columns. They pause offscreen and in hidden tabs, and remain
still with reduced motion. The map and directions section follows the hero.
As on `/permanent`, Fade Content brings the introduction into focus on mount.
The contact panel and directions come into focus once on scroll. Fold Text
opens the main heading, the panel and directions headings, and the direction
card titles. Reduced motion presents the content immediately.

The directions section on the home and contacts pages aligns its headline, description, three graphite
information cards, and MapLibre map within the standard container. The cards share
one row from the tablet breakpoint and stack on phones. A route link remains
available below the map while the map loads.

## Responsive Design, Accessibility, and Performance

Check for horizontal overflow, readable long translations, accessible menus and
buttons, and correct image proportions on phones, tablets, and desktops.
Account for the fixed header when laying out the hero.
Preserve visible keyboard focus, ARIA labels, contrast, and semantic markup.
Add motion only when useful and respect `prefers-reduced-motion`.
Preserve existing hero transitions and fallback components.
Keep limited interactivity in focused Client Components to preserve server rendering
for the rest of the page.

## Loading states

Each public page reserves its own hero composition with graphite placeholders. The
home and blog index use route groups so their loading screens only apply to the
index. Shared skeleton primitives live in `src/shared/LoadingSkeleton.tsx`.
They use the existing CSS pulse and stay still with reduced motion.

The home sketches and portfolio, tattoo portfolio, permanent makeup gallery,
gallery feed, and featured blog article stream independently. The gallery reserves
six 4:5 frames for its first batch and keeps earlier photos visible during pagination.
The article skeleton follows the editorial header and reading column.

## Copy and Scope

The interface is translated into `ru`, `ro`, `uk`, `it`, and `en` through `messages/*.json`.
Russian is the default language and has no URL prefix. Update interface copy through `next-intl`.
Use verified information for prices, contact details, reviews, medical claims, and studio services.
Limit edits to the relevant section unless the request specifies a broader scope.
After visual changes, check any affected loading, hover, and focus states, as well as
the mobile menu if affected. Documentation-only changes require no new build.
