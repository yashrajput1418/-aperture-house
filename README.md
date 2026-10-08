# Aperture House — photography & videography studio template (Next.js 15)

A booking-focused site for a photo/film studio: 3D + showreel hero, pinned horizontal
shoot showcase with hover video previews, shoot types, packages with studio-rental
pricing, a process timeline, the team, client reviews, a WhatsApp booking form, per-shoot
case-study pages with parallax cover, masonry gallery + lightbox, and a media-credits page.

Built for a studio that takes orders: weddings, pre-weddings, maternity, newborn &
family, first birthdays, model portfolios, product/brand work — plus the studio itself
rented by the hour.

> **This is a template.** "Aperture House", its shoots, couples, families, team, prices
> and reviews are **fictional** and written for this repo. Replace them with your own
> before going live. All photography and video is free-licensed stock standing in for
> real client work.

## Stack
- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- React Three Fiber + Drei (Three.js) — 3D hero
- Framer Motion — scroll, hover and text animation
- Lenis — smooth scrolling
- `sharp` (dev only) — WebP compression + blur placeholders during media fetch

## Run it
```bash
npm install
cp .env.example .env.local      # then paste your two free API keys (see below)
npm run fetch:media             # downloads photos + videos into public/media
npm run dev                     # http://localhost:3000
npm run build && npm start      # production
```
Node 18.18+ (20 or 22 recommended). The site builds and runs **before** you fetch any
media — covers fall back to generated gradient artwork and the hero to the 3D scene only.

---

## 1. Get the two API keys (both free)

### Unsplash — photos
Shoot covers, case-study galleries and team portraits.

1. Create an account: <https://unsplash.com/join>
2. Register an application: <https://unsplash.com/oauth/applications/new>
   (accept the API Terms — "Demo" access is plenty for this template)
3. Copy the **Access Key** into `.env.local` as `UNSPLASH_ACCESS_KEY`

Rate limit: **50 requests/hour** on Demo — and the required `download_location` ping
counts against it, so a full refetch of six shoots can exhaust the hour. Responses are
cached in `scripts/.cache/`, failed pings are queued and retried, and existing files are
skipped, so just re-run after the hour rolls over.

### Pixabay — videos (and fallback photos)
The hero showreel and the preview video on each shoot card.

1. Create an account: <https://pixabay.com/accounts/register/>
2. Your key is shown on <https://pixabay.com/api/docs/>
3. Copy it into `.env.local` as `PIXABAY_API_KEY`

Rate limit: **100 requests/minute**.

`.env.local` is git-ignored. Never put keys in `.env.example` — that file is committed.

## 2. `npm run fetch:media`

`scripts/fetch-media.mjs` (plain Node, no runtime dependencies) downloads, for each shoot
in `content/site.ts`:

| File | What |
|---|---|
| `public/media/<slug>/cover.webp` | 1920px landscape cover |
| `public/media/<slug>/gallery-1..4.webp` | 1400px case-study gallery |
| `public/media/<slug>/preview.mp4` | ≤15s, ≤1280px card-hover preview |
| `public/media/<slug>/preview-poster.webp` | poster frame for that video |
| `public/media/hero/hero.mp4` | ≤20s, ≤1920px hero showreel |
| `public/media/hero/hero-poster.webp` | hero poster frame |
| `public/media/team/member-1..6.webp` | 900px studio portraits |
| `content/credits.json` | author + licence for **every** file (imported by `/credits`) |
| `public/media/credits.json` | same list, fetchable directly |
| `content/media.json` | the manifest `content/site.ts` imports |

Behaviour worth knowing:

- **Search terms live in `content/site.ts`** — each shoot has `mediaQuery` (photos) and
  `videoQuery` (video); the hero uses `site.hero.videoQuery`. Change those to change what
  gets downloaded.
- **Photos: Unsplash first.** Pixabay fills in when a query returns nothing, when it
  returns fewer frames than needed, or when too few distinct photographers come back
  (which is what keeps the team grid from being one person's shoot).
- **Unsplash `download_location` is pinged** for every photo downloaded, as the Unsplash
  API Guidelines require. A ping that fails on the rate limit is queued to
  `scripts/.cache/pending-unsplash-pings.json` and retried on the next run.
- **Video size is capped by width, not by Pixabay's rendition names** — `large` is 4K and
  `medium` can be 2560px on newer uploads, so the script picks the widest rendition that
  still fits the cap.
- **No hotlinking.** Pixabay forbids it, so every file is downloaded and served from
  `/public/media`. `next.config.ts` therefore needs no `remotePatterns`.
- **Throttled + cached.** One request at a time with a 300 ms gap; API responses cached in
  `scripts/.cache/` (git-ignored).
- **Re-running is safe.** Existing files are never re-downloaded — delete a file (or a
  whole `public/media/<slug>/` folder) and re-run to refresh just that one.
- **`sharp` is optional.** With it (a devDependency) images become WebP with base64 blur
  placeholders. Without it, the original JPEGs are saved and blur-up is skipped.

## 3. Rename the studio

`site.name` in `content/site.ts` is the **only** place the studio name is written. The nav
logo, page metadata, footer wordmark and the WhatsApp booking message all derive from it.
Change that one string and the whole site renames.

## 4. Edit content — one file

Everything is in **`content/site.ts`**:

- **Shoots** — add an object to `projectSource`. Each one automatically gets a home-page
  card and a page at `/work/<slug>`. Per shoot you write the `challenge` (the brief),
  `solution` (how it was shot), `outcome`, `metrics`, `services` (what was delivered),
  `location` and `tags`.
- **Packages** — `packages` drives the pricing cards. Set `popular: true` on one to mark
  it "Most booked". Prices are **sample values** — replace them.
- **Studio rental** — `site.studio` drives the rental strip under the packages: price,
  minimum, and the facilities list.
- **Booking form** — `site.contact` sets the shoot types, cities and budget bands the form
  offers. The form composes a WhatsApp message and a `mailto:` with shoot type, date,
  city, budget and phone. Set `site.whatsapp` to your number, country code first, no `+`.
- **Shoot types** — `services` drives the "What we shoot" cards.
- **Team** — six fictional people in `teamSource`; portraits are matched by index to
  `public/media/team/member-N`.
- **Reviews** — clearly marked as sample content in a code comment. Every name is
  invented. Replace with real, permissioned reviews before publishing.
- **Stats, venues** — sample values. Replace with your real numbers and venue list.
- **Hero** — `site.hero.mode`:
  - `'collage'` *(default)* — columns of your own shoots drifting behind the headline,
    leaning with the mouse and with scroll. Falls back to the 3D scene when no media has
    been fetched yet.
  - `'3d'` — WebGL scene only · `'video'` — showreel only · `'both'` — showreel + 3D
  - `site.hero.headline` is **one word per entry** — that is what lets the headline wrap
    instead of overflowing on narrow screens. Style words by listing them in
    `headlineAccent` / `headlineOutline`.
  - `site.hero.videoQuery` is the Pixabay search term for the showreel.

### The booking form
Three steps — *what & where*, *when & budget*, *your details* — so the card stays about
600px tall instead of one long scroll. Step 3 validates name + phone before it will send.

**How submission works, and whether you need EmailJS:** by default **no backend and no
EmailJS**. Submitting opens a prefilled WhatsApp chat (`wa.me`) and offers a `mailto:`
fallback, which is what most studios actually want — the enquiry lands in the inbox they
already answer from, and nothing is stored on the site.

If you also want a copy by email without running a server, set the three EmailJS
variables in `.env.local` and `lib/sendEnquiry.ts` posts to their REST API — no npm
package needed. Be aware of the trade-off: EmailJS is browser-side, so
`NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` ships in your JS bundle and anyone can read it. That is
how EmailJS is designed — restrict it by domain and set a monthly quota in their
dashboard. For a key that never reaches the browser, send from a Next.js Server Action to
Resend/Postmark instead and delete `lib/sendEnquiry.ts`.

## 5. Loader & image fallbacks

### Intro loader
`components/ui/SiteLoader.tsx` holds a full-screen panel — rotating aperture mark,
wordmark, progress bar — until the **first screen** is actually ready, then fades and
scales away.

It deliberately does **not** wait on `window.load`. That event blocks on every image in
the document, including a case study's whole gallery far below the fold, which parked the
loader on its hard ceiling for 5.5s on every case-study page. Instead it waits on:

- web fonts (`document.fonts.ready`)
- images whose box is within 1.25 viewports of the top — what you are about to look at
- the first `[autoplay]` background video's first frame, **raced against a 1.2s cap**

That last rule matters: a click-to-play film is `preload="none"`, so it is not fetching
anything and its `loadeddata` would never fire. Only autoplaying videos are waited on, and
even then only briefly. With those fixes every page clears the loader in roughly 1.8s on a
throttled mobile profile instead of timing out.

Configure it in `site.loader`:

```ts
loader: {
  enabled: true,
  minMs: 700,    // stops it flashing on a warm cache
  maxMs: 4500,   // hard ceiling — reveals the site regardless
}
```

Three things it deliberately will not do:
- **Strand anyone.** `maxMs` reveals the site even if an asset never finishes.
- **Fight reduced motion.** Under `prefers-reduced-motion` it skips the animation.
- **Gate the site behind JS.** A `<noscript>` rule in `app/layout.tsx` hides it, so with
  JavaScript off the content is immediately visible rather than hidden forever.

Scroll is locked while it is up and restored on exit.

### Image fallbacks
Every image on the site goes through `components/ui/SafeImage.tsx` instead of `next/image`
directly. It falls back to `components/ui/MediaPlaceholder.tsx` — the aperture mark over the
project's own gradient, with a caption — in both failure cases:

- **no media yet**, before `npm run fetch:media` has been run
- **a `src` that fails at runtime** — deleted file, bad deploy, blocked request

So a fresh clone looks intentional rather than broken, and a missing file in production
degrades to the studio mark instead of a torn-image icon. Covered: shoot cards, case-study
covers, galleries and the lightbox, team portraits, hero collage tiles and video posters.

## 6. The case-study page

`/work/<slug>` is built as an editorial scroll rather than one centred column:

| Section | What it does |
|---|---|
| `CaseHero` | Full-bleed cover at 92svh, parallaxing slower than the page, title set over the bottom and fading out as you scroll |
| Fact strip | Shot for · Where · Year · Coverage, on a bordered band |
| Story | `01 — The brief` / `02 — The approach` beside a **sticky** deliverables rail with the tags and a "Book a shoot like this" CTA |
| Lead frame | The first gallery image, full-bleed at 70svh |
| Numbers | The three metrics, huge, on their own band |
| `03 — The shoot` | The remaining frames in the masonry gallery + lightbox |
| `04 — The film` | The project video, click-to-play |
| `05 — What they got` | The outcome set large and centred, as a closing statement |
| `NextShoot` | Full-bleed teaser of the next case study — greyscale, colouring in on hover |

`ReadingProgress` draws a thin accent bar across the top, and a floating "← All work" chip
stays available the whole way down.

## 7. Logo & favicon

The mark is an aperture iris — six blades around a hexagonal opening — drawn as plain SVG
geometry, so there is no image file to re-export when you change size or colour.

| File | What it is |
|---|---|
| `components/ui/Logo.tsx` | The in-site logo: mark + wordmark. Used in the navbar and footer. |
| `public/mark.svg` | Mark on its own, `currentColor` — drop it anywhere and it takes the surrounding colour. |
| `public/logo.svg` | Mark + wordmark, for decks, email signatures and press. |
| `app/icon.svg` | Browser tab icon, any size. |
| `app/favicon.ico` | 16 / 32 / 48px. The 16px entry uses simplified art — the blades turn to mush that small, so it drops to a ring and an opening. |
| `app/apple-icon.png` | 180×180 home-screen icon. |

Next.js picks up everything in `app/` automatically — there are no `<link rel="icon">` tags
to maintain.

**The wordmark reads from `site.name`**, so renaming the studio renames the logo with it.
`public/logo.svg` is the one exception: the name is baked into a `<text>` element there, and
it needs Space Grotesk to render correctly — outline the text in a vector editor before
sending that file to a printer or a third party.

To recolour, change `--color-accent` in `app/globals.css` for the site; the standalone
`logo.svg` and the icons carry the colour inline, so edit those files directly (they are
small and hand-readable).

## 8. Licence notes (read before you publish)

| Source | Licence | Attribution |
|---|---|---|
| Unsplash | [Unsplash License](https://unsplash.com/license) | Not required. Credited anyway on `/credits`. |
| Pixabay | [Pixabay Content License](https://pixabay.com/service/license-summary/) | Not required. Credited anyway on `/credits`. |

Both licences allow free commercial use. Both **forbid** selling unmodified copies of the
media itself, and neither grants rights to identifiable people, trademarks or logos in a
shot. That matters more for this template than most, because the stock is of people:

- **Do not imply the people in stock photos are your clients.** The case-study text in
  this repo is fictional and the `/credits` page says the imagery is stock. Keep that
  disclosure until you swap in your own work.
- **Children and newborns** appear in the sample galleries. Replace these with your own
  shoots — with written parental consent — before publishing.
- Pixabay additionally forbids hotlinking, which is why everything is downloaded locally.

The `/credits` page is generated from `content/credits.json` and lists the author, profile
link, source link and licence for every file. It is linked from the footer. Keep it.

This template never scrapes media from other studio or portfolio sites — only the two
official APIs above.

## Structure
```
app/
  layout.tsx              fonts, metadata, smooth scroll
  page.tsx                home: all sections in order
  work/[slug]/page.tsx    case study (static, one per shoot)
  credits/page.tsx        media credits, generated from content/credits.json
app/
  icon.svg, favicon.ico, apple-icon.png   generated brand icons
components/
  three/HeroScene.tsx     3D blob, orbiting shapes, sparkles, local lighting
  three/HeroCanvas.tsx    loads 3D only on capable devices, else a CSS orb fallback
  sections/               Navbar, Hero, HeroCollage, HeroVideo, Marquee, Work, Stats,
                          Services, Process, Packages, Team, Reviews, Contact, Footer
  work/                   CaseHero, CaseStudyGallery (lightbox), ProjectFilm,
                          NextShoot, ReadingProgress, ParallaxCover
  ui/                     Reveal, MagneticButton, TiltCard, SmoothScroll,
                          SectionHeading, ProjectVisual (cover + hover video),
                          Logo (aperture mark + wordmark), SiteLoader,
                          SafeImage + MediaPlaceholder (fallback artwork)
content/
  site.ts                 all content — edit this
  media.ts                typed wrapper around the generated manifest
  media.json              generated by npm run fetch:media
  credits.json            generated; rendered at /credits
lib/useMediaPolicy.ts     decides when video may play at all
lib/sendEnquiry.ts        optional EmailJS delivery for booking enquiries
scripts/fetch-media.mjs   the downloader
public/media/             downloaded files + a public copy of credits.json
```

## Performance & accessibility
- **Video never autoplays on mobile data.** `lib/useMediaPolicy.ts` blocks autoplay when
  `prefers-reduced-motion` is set, when `navigator.connection.saveData` is on or the
  effective type is 2g/3g, and on phone-sized viewports. The cover image shows instead.
- Card preview videos use `preload="none"` and are only created once the card is within
  300px of the viewport (IntersectionObserver) **and** the pointer is over it. Hover
  previews require `hover: hover` + `pointer: fine`, so they never load on touch.
- The case-study film fetches nothing until the visitor presses play.
- All images go through `next/image` with explicit `sizes` and base64 blur placeholders.
- 3D is lazy-loaded client-side and skipped without WebGL, on very low-end devices, or
  under *reduce motion* (a static gradient orb is shown).
- The lightbox supports ← → and Esc, swipe on touch, locks body scroll and restores focus.
- The hero collage freezes flat under `prefers-reduced-motion`, drops to 3 columns on
  phones, and only mixes in video tiles where the connection policy allows it.
- No external image hosts and no external 3D assets: everything is local.

## Customise the look
Colours and fonts are theme tokens at the top of `app/globals.css`. The palette is a dark
neutral ground with a champagne accent:

```css
--color-ink:    #0a0a0c;   /* page ground */
--color-ink-2:  #141418;   /* cards, panels */
--color-accent: #e0b589;   /* champagne — buttons, highlights, active chips */
--color-violet: #5a5fd8;   /* indigo — glows only */
```

Change `--color-accent` alone and the whole site retones: buttons, the accented headline
word, active form chips, package highlights, links and the progress bar all read from it. To change the 3D shape, edit `icosahedronGeometry` / `MeshDistortMaterial`
in `components/three/HeroScene.tsx`.

## Ideas to extend
- Post the booking form to a real inbox or CRM with a Server Action
- Add a date-availability check backed by your studio calendar
- Client galleries behind a passcode
- An MDX journal for recent shoots
