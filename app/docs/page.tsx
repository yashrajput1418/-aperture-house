import Link from 'next/link';
import type { Metadata } from 'next';
import { site } from '@/content/site';
import { VERSIONS, versionMeta, homeHref } from '@/lib/version';
import Logo from '@/components/ui/Logo';
import { C, Code, H3, Note, P, Section, Steps, Table } from '@/components/docs/Doc';

export const metadata: Metadata = {
  title: `Setup & documentation — ${site.name}`,
  description:
    'How to install this template, rename the studio, edit every piece of content, and add your own photographs and films — with or without Unsplash and Pixabay API keys.',
  robots: { index: false },
};

const toc = [
  ['install', '01', 'Install & run'],
  ['rename', '02', 'Rename the studio'],
  ['versions', '03', 'The four versions'],
  ['content', '04', 'Editing the content'],
  ['shoots', '05', 'Adding a shoot'],
  ['media', '06', 'Images & films — three routes'],
  ['media-own', '06a', 'Your own files (no API keys)'],
  ['media-stock', '06b', 'Free stock with API keys'],
  ['media-manual', '06c', 'Hand-writing the manifest'],
  ['hero', '07', 'The hero & the showreel'],
  ['brand', '08', 'Colours, type & the brand panel'],
  ['enquiries', '09', 'Where bookings go'],
  ['deploy', '10', 'Deploy'],
  ['trouble', '11', 'Troubleshooting'],
  ['files', '12', 'File map'],
] as const;

export default function Docs() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-6 px-6 py-4 sm:px-10">
          <Link href="/" aria-label={site.name}>
            <Logo markClassName="h-6 w-6 text-accent" />
          </Link>
          <p className="hidden font-display text-[0.7rem] uppercase tracking-[0.25em] text-muted sm:block">
            Setup &amp; documentation
          </p>
          <Link
            href="/"
            className="font-display text-[0.7rem] uppercase tracking-[0.22em] text-accent underline decoration-accent/40 underline-offset-[6px] hover:decoration-accent"
          >
            Back to site
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[90rem] gap-14 px-6 py-14 sm:px-10 lg:flex">
        {/* contents */}
        <nav aria-label="Contents" className="lg:sticky lg:top-24 lg:h-fit lg:w-64 lg:shrink-0">
          <p className="font-display text-[0.65rem] uppercase tracking-[0.25em] text-muted">Contents</p>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {toc.map(([id, n, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="flex gap-3 py-2.5 text-sm text-white/75 transition hover:text-accent">
                  <span className="w-7 shrink-0 font-display text-[0.65rem] text-muted">{n}</span>
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs leading-relaxed text-muted">
            This page is part of the template. Delete <C>app/docs/</C> before handing the site to a
            client.
          </p>
        </nav>

        <main className="min-w-0 flex-1">
          <div className="pb-16">
            <p className="font-display text-xs uppercase tracking-[0.3em] text-accent">Template documentation</p>
            <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-6xl">
              Set it up, fill it with your own work
            </h1>
            <P>
              A Next.js 15 photography-studio template: four complete site versions, one content
              file, and a media pipeline that works with free stock, with your own photographs, or
              with nothing at all. Everything below is in the repository — no dashboard, no CMS
              account.
            </P>
          </div>

          <div className="space-y-20">
            {/* ── 01 ───────────────────────────────── */}
            <Section id="install" n="01" title="Install & run">
              <P>Node 18.18 or newer (Node 20+ recommended) and npm. Nothing else is required.</P>
              <Code label="terminal">{`npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm start            # serve the build`}</Code>
              <Table
                head={['Script', 'What it does']}
                rows={[
                  [<C key="a">npm run dev</C>, 'Development server with hot reload.'],
                  [<C key="b">npm run build</C>, 'Type-checks and prerenders every page.'],
                  [
                    <C key="c">npm run fetch:media</C>,
                    'Downloads free-licensed stock from Unsplash / Pixabay. Needs API keys.',
                  ],
                  [
                    <C key="d">npm run scan:media</C>,
                    'Builds the media manifest from files you put in public/media yourself. No keys, no network.',
                  ],
                ]}
              />
              <Note>
                A fresh clone builds and deploys with <strong>no media at all</strong> — every image
                slot falls back to generated gradient artwork with the studio mark on it. Add your
                photographs whenever you are ready.
              </Note>
            </Section>

            {/* ── 02 ───────────────────────────────── */}
            <Section id="rename" n="02" title="Rename the studio">
              <P>
                One line. <C>site.name</C> in <C>content/site.ts</C> is the only place the studio is
                named — the logo wordmark, page titles, Open Graph tags, the footer and the
                prefilled WhatsApp message all derive from it.
              </P>
              <Code label="content/site.ts">{`export const site = {
  name: 'Aperture House',
  tagline: 'Wedding, portrait and film studio.',
  description: 'Aperture House is a photography and videography studio…',
  url: 'https://aperturehouse.example',   // used to resolve OG image paths
  email: 'book@aperturehouse.example',
  whatsapp: '919999999999',               // country code + number, no "+"
  phone: '+91 99999 99999',
  location: 'Studio in Ahmedabad · shooting across India & destination',
  founded: '2014',
  …
}`}</Code>
              <P>
                Replace the brand icons too: <C>app/icon.svg</C>, <C>app/favicon.ico</C> and{' '}
                <C>app/apple-icon.png</C>. The in-page logo mark lives in{' '}
                <C>components/preview/BrandMarks.tsx</C> (four marks ship: aperture, lens, frame,
                monogram).
              </P>
            </Section>

            {/* ── 03 ───────────────────────────────── */}
            <Section id="versions" n="03" title="The four versions">
              <P>
                The template is four complete sites, not four themes. Each has its own home page,
                its own case-study page and its own copy of every section, so the layouts differ all
                the way down. The version lives in the URL and is switched from the{' '}
                <strong>Layout</strong> dropdown in the header.
              </P>
              <Table
                head={['URL', 'Version', 'Lives in', 'Case study']}
                rows={VERSIONS.map((v) => [
                  <C key={v}>{homeHref(v)}</C>,
                  <span key={`n${v}`}>
                    {versionMeta[v].label} — {versionMeta[v].name}
                    <span className="mt-1 block text-xs text-muted">{versionMeta[v].note}</span>
                  </span>,
                  <C key={`f${v}`}>components/v{v}/</C>,
                  <C key={`c${v}`}>/work/&lt;slug&gt;{v === 1 ? '' : `?v=${v}`}</C>,
                ])}
              />
              <P>
                Links inside a version stay in that version: Home 3 links at{' '}
                <C>/work/&lt;slug&gt;?v=3</C>. The mapping is owned by <C>lib/version.ts</C> —
                <C>homeHref()</C>, <C>workHref()</C> and <C>parseVersion()</C>.
              </P>

              <H3>Ship only one version — one line, no deleting</H3>
              <P>
                <C>site.versions</C> in <C>content/site.ts</C> decides which versions exist and
                which one answers on <C>/</C>. Nothing is deleted, so you can change your mind — or
                show a client all four, then narrow to the one they picked.
              </P>
              <Code label="content/site.ts">{`versions: {
  enabled: [1, 2, 3, 4],   // which versions are live
  default: 1,              // which one owns "/"
  switcher: true,          // show the "Layout" dropdown
},

// ship Editorial only — "/" is the whole site:
versions: { enabled: [2], default: 2, switcher: true },

// two layouts, visitors can switch between them:
versions: { enabled: [1, 3], default: 1, switcher: true },

// keep all four reachable by URL, but hide the dropdown:
versions: { enabled: [1, 2, 3, 4], default: 1, switcher: false },`}</Code>
              <Table
                head={['What you set', 'What happens']}
                rows={[
                  [
                    <C key="a">enabled</C>,
                    <>
                      A version left out stops existing: its <C>/home-N</C> route 404s,{' '}
                      <C>?v=N</C> on a case study falls back to the default, and it disappears from
                      the dropdown.
                    </>,
                  ],
                  [
                    <C key="b">default</C>,
                    <>
                      That version renders at <C>/</C>, and its case studies lose the{' '}
                      <C>?v=</C> suffix. Its own <C>/home-N</C> URL redirects to <C>/</C>, so one
                      layout never answers on two addresses.
                    </>,
                  ],
                  [
                    <C key="c">switcher</C>,
                    <>
                      Hides the dropdown in every nav and footer without touching a component. It
                      also hides itself automatically whenever only one version is enabled.
                    </>,
                  ],
                ]}
              />
              <Note>
                With <C>enabled: [2]</C> the site behaves like an ordinary single-layout site:{' '}
                <C>/</C> is that layout, <C>/work/&lt;slug&gt;</C> is its case study, no dropdown,
                no stray URLs. That is the whole handover change — one line.
              </Note>
              <P>
                The unused folders still sit in the repository and still cost a little JavaScript in
                the shared bundle. If you want them gone for good, delete the{' '}
                <C>components/vN/</C> folders you are not using, the matching{' '}
                <C>app/home-N/</C> routes, and their entries in{' '}
                <C>components/layouts/versionHomes.ts</C> — optional cleanup, not a requirement.
              </P>
            </Section>

            {/* ── 04 ───────────────────────────────── */}
            <Section id="content" n="04" title="Editing the content">
              <P>
                Everything readable on the site is in <C>content/site.ts</C>. No component needs to
                change to rewrite the site.
              </P>
              <Table
                head={['Export / key', 'Drives']}
                rows={[
                  [<C key="1">site.nav</C>, 'Header and rail links. Hash links to section ids.'],
                  [<C key="2">site.hero</C>, 'Badge, headline words, intro, both call-to-action buttons, hero mode.'],
                  [<C key="3">site.contact</C>, 'Shoot types, budget bands, cities and the note above the form.'],
                  [<C key="4">site.studio</C>, 'The hourly studio-rental block inside Packages.'],
                  [<C key="5">site.loader</C>, 'Intro loader: on/off, minimum and maximum duration.'],
                  [<C key="6">site.preview</C>, 'The brand playground: on/off, accent swatches, background grounds.'],
                  [<C key="7">projects</C>, 'Every shoot: cards, the archive, and its case-study page.'],
                  [<C key="8">stats, services, process</C>, 'Counters, shoot types, the four booking steps.'],
                  [<C key="9">packages</C>, 'Price cards / rate card / price list. `popular: true` flags one.'],
                  [<C key="10">team</C>, 'The studio. Order matters — portraits are matched by index.'],
                  [<C key="11">reviews, faqs, journal, awards, clients</C>, 'Quotes, Q&A, notes, recognition, the venue list.'],
                ]}
              />
              <Note tone="warn">
                The shipped studio, shoots, couples, team, prices and reviews are{' '}
                <strong>fictional</strong>. Replace them with your real work, real people, real
                prices and real (permissioned) reviews before going live.
              </Note>
              <P>
                Headline words are one array per line, <strong>one word per entry</strong> — that is
                what lets a long headline wrap instead of overflowing on a phone. List a word in{' '}
                <C>headlineAccent</C> or <C>headlineOutline</C> to style it.
              </P>
              <Code label="content/site.ts — site.hero">{`headline: [
  ['We', 'photograph'],
  ['the', 'day', 'you', 'remember'],
],
headlineAccent: ['remember'],   // painted in the accent colour
headlineOutline: ['day', 'you'] // drawn as an outline`}</Code>
            </Section>

            {/* ── 05 ───────────────────────────────── */}
            <Section id="shoots" n="05" title="Adding a shoot">
              <P>
                Add one object to <C>projectSource</C> in <C>content/site.ts</C>. It immediately
                gets a card on every version&rsquo;s home page, a static case-study page at{' '}
                <C>/work/&lt;slug&gt;</C>, and a slot in the archive.
              </P>
              <Code label="content/site.ts — projectSource">{`{
  slug: 'anika-and-dev-wedding',      // the URL, and the media folder name
  title: 'Anika & Dev',
  client: 'Anika & Dev',
  category: 'Wedding',                // also becomes an archive filter
  year: '2026',
  location: 'Udaipur',
  summary: 'Three days, four functions and a lake-facing pheras at first light.',
  tags: ['Wedding', 'Film', 'Album'],
  result: '3 days · 28-min film',
  gradient: ['#b45309', '#fcd34d'],   // fallback artwork, used when no image exists
  mediaQuery: 'indian wedding ceremony',  // only for npm run fetch:media
  videoQuery: 'wedding ceremony',         // only for npm run fetch:media
  services: ['Two photographers', '28-min wedding film', '80-page album'],
  challenge: 'What we walked into…',
  solution: 'How we shot it…',
  outcome: 'What they got…',
  metrics: [
    { value: '1,400', label: 'Edited photographs' },
    { value: '28 min', label: 'Wedding film' },
  ],
}`}</Code>
              <Note>
                <C>slug</C> does double duty: it is the case-study URL <em>and</em> the folder name
                under <C>public/media/</C> where that shoot&rsquo;s images live. Keep them
                identical.
              </Note>
            </Section>

            {/* ── 06 ───────────────────────────────── */}
            <Section id="media" n="06" title="Images & films — three routes">
              <P>
                Components never read from <C>public/</C> directly. They read{' '}
                <C>content/media.json</C> — a manifest that maps each shoot slug to its files,
                dimensions and blur placeholders. There are three ways to produce it, and they can
                be mixed.
              </P>
              <Table
                head={['Route', 'Needs', 'Use when']}
                rows={[
                  [
                    <>
                      <strong>A.</strong> <C>npm run scan:media</C>
                    </>,
                    'Your own photographs in public/media',
                    'Real client work. No accounts, no keys, no network.',
                  ],
                  [
                    <>
                      <strong>B.</strong> <C>npm run fetch:media</C>
                    </>,
                    'Unsplash + Pixabay API keys',
                    'Filling a demo or a pitch with free-licensed stock.',
                  ],
                  [
                    <>
                      <strong>C.</strong> edit <C>content/media.json</C>
                    </>,
                    'A text editor',
                    'A handful of files, or images served from a CDN.',
                  ],
                  [
                    <>
                      <strong>D.</strong> do nothing
                    </>,
                    '—',
                    'Gradient artwork stands in everywhere. The site still builds.',
                  ],
                ]}
              />
            </Section>

            {/* ── 06a ──────────────────────────────── */}
            <Section id="media-own" n="06a" title="Route A — your own files, no API keys">
              <P>
                Put your photographs on disk with the names below, run one command, done. This is
                the route to use for a real studio: nothing is downloaded, nothing is credited to a
                stock library, and the files are yours.
              </P>
              <Code label="public/media/ — expected layout">{`public/media/
  anika-and-dev-wedding/        ← folder name = the shoot's slug
    cover.webp                  ← the card + case-study hero
    cover.txt                   ← optional: becomes that image's alt text
    gallery-1.webp
    gallery-2.webp              ← numbered from 1, as many as you like
    gallery-3.webp
    preview.mp4                 ← optional: hover preview + the case-study film
    preview-poster.webp         ← optional: still shown before it plays
  coastal-pre-wedding/
    cover.jpg                   ← .webp .avif .jpg .jpeg .png all work
    gallery-1.jpg
  hero/
    hero.mp4                    ← the showreel behind version 3's hero
    hero-poster.webp
  team/
    member-1.webp               ← matched to \`team\` in site.ts by position
    member-2.webp`}</Code>
              <Code label="terminal">{`npm run scan:media

Scanning public/media for 10 shoots…
  ✓  anika-and-dev-wedding — cover, 8 frames, film
  ✓  coastal-pre-wedding — cover, 3 frames
  ·  rooftop-engagement — no folder, will use gradient artwork
  ✓  hero — showreel + still
  ✓  team — 6 portraits

Wrote content/media.json — 2 shoots, 6 portraits.`}</Code>
              <H3>What the scanner does for you</H3>
              <Steps
                items={[
                  <>
                    Reads real pixel dimensions, so <C>next/image</C> reserves the right space and
                    the page does not jump as frames load.
                  </>,
                  <>
                    Generates a 20px blur placeholder per image, inlined as base64 — the blur-up
                    effect while the full file downloads.
                  </>,
                  <>
                    Picks up alt text from a sibling <C>.txt</C> file (<C>gallery-3.txt</C> next to{' '}
                    <C>gallery-3.webp</C>). Worth doing: it is what screen readers and search
                    engines read.
                  </>,
                  <>
                    Stops at the first gap in a numbered sequence, so{' '}
                    <C>gallery-1, gallery-2, gallery-4</C> yields two frames — renumber to fix.
                  </>,
                ]}
              />
              <Note tone="warn">
                Dimensions and blur come from <C>sharp</C>, already a devDependency. If you see
                &ldquo;sharp not installed&rdquo;, run <C>npm i -D sharp</C> and scan again —
                gallery images need width and height to render.
              </Note>
              <H3>Preparing the files</H3>
              <P>
                Export WebP (or AVIF) at around 2000px on the long edge for covers and gallery
                frames, 1200px for team portraits; quality 75–82 is plenty. Keep films short and
                H.264 <C>.mp4</C>, 1080p or less — they are decoration, and a 40MB hero video is the
                fastest way to ruin a portfolio site. Re-run <C>npm run scan:media</C> after any
                change, and commit the generated <C>content/media.json</C>.
              </P>
            </Section>

            {/* ── 06b ──────────────────────────────── */}
            <Section id="media-stock" n="06b" title="Route B — free stock with API keys">
              <P>
                For demos and pitches. <C>npm run fetch:media</C> downloads free-licensed photos and
                videos from the official Unsplash and Pixabay APIs, using the <C>mediaQuery</C> and{' '}
                <C>videoQuery</C> on each shoot. It never scrapes other studios&rsquo; sites.
              </P>
              <Steps
                items={[
                  <>
                    Get a free Unsplash access key at <C>unsplash.com/developers</C> (create an app
                    — the demo tier allows 50 requests an hour).
                  </>,
                  <>
                    Get a free Pixabay key at <C>pixabay.com/api/docs/</C> (100 requests a minute).
                    Pixabay supplies the videos.
                  </>,
                  <>
                    Copy the annotated <C>.env.example</C> to <C>.env.local</C> (git-ignored),
                    paste both keys in, then run the script.
                  </>,
                ]}
              />
              <Code label=".env.local">{`UNSPLASH_ACCESS_KEY=your_unsplash_access_key
PIXABAY_API_KEY=your_pixabay_key`}</Code>
              <Code label="terminal">{`npm run fetch:media`}</Code>
              <P>
                It writes files into <C>public/media/&lt;slug&gt;/</C>, the manifest at{' '}
                <C>content/media.json</C>, and an attribution list at <C>content/credits.json</C>{' '}
                which the <Link href="/credits" className="text-accent underline underline-offset-4">/credits</Link>{' '}
                page renders. Requests are spaced 300ms apart and every response is cached in{' '}
                <C>scripts/.cache/</C>, so re-running costs nothing and never re-downloads a file
                that already exists.
              </P>
              <Note tone="warn">
                Only one key? The script still runs: with Unsplash alone you get photographs but no
                films; with Pixabay alone it falls back to Pixabay photos. With neither key it exits
                and tells you — use Route A or C instead.
              </Note>
              <Note>
                Keep the credits page while you are showing stock imagery. Both licences allow
                commercial use without attribution, but crediting is the decent default and the page
                is already wired up. Swap in your own work and the page empties itself.
              </Note>
            </Section>

            {/* ── 06c ──────────────────────────────── */}
            <Section id="media-manual" n="06c" title="Route C — hand-writing the manifest">
              <P>
                <C>content/media.json</C> is plain JSON. Write it yourself when you have a couple of
                images, or when the files live on a CDN rather than in <C>public/</C>.
              </P>
              <Code label="content/media.json">{`{
  "generatedAt": "2026-10-08T00:00:00.000Z",
  "hero": {
    "video":  { "src": "/media/hero/hero.mp4", "poster": "/media/hero/hero-poster.webp" },
    "poster": { "src": "/media/hero/hero-poster.webp", "width": 1600, "height": 900 }
  },
  "projects": {
    "anika-and-dev-wedding": {
      "cover": {
        "src": "/media/anika-and-dev-wedding/cover.webp",
        "width": 1920,
        "height": 1280,
        "alt": "The couple under the mandap at first light",
        "blurDataURL": "data:image/webp;base64,…"
      },
      "gallery": [
        { "src": "/media/anika-and-dev-wedding/gallery-1.webp", "width": 1600, "height": 1067 }
      ],
      "video": {
        "src": "/media/anika-and-dev-wedding/preview.mp4",
        "poster": "/media/anika-and-dev-wedding/preview-poster.webp"
      }
    }
  },
  "team": [
    { "src": "/media/team/member-1.webp", "width": 900, "height": 1350, "alt": "Ira Suryavanshi" }
  ]
}`}</Code>
              <Table
                head={['Field', 'Required?', 'Notes']}
                rows={[
                  [<C key="s">src</C>, 'Yes', 'Path from /public, or an absolute URL on an allowed host.'],
                  [
                    <C key="w">width</C>,
                    'For gallery frames',
                    'Covers and hero stills are rendered with `fill` and work without it; gallery and team images need it.',
                  ],
                  [<C key="h">height</C>, 'Same as width', 'Keep the real aspect ratio or images will letterbox.'],
                  [<C key="a">alt</C>, 'No, but do it', 'Falls back to the project title or “frame N”.'],
                  [<C key="b">blurDataURL</C>, 'No', 'Omit and the image simply fades in without a blur-up.'],
                  [<C key="c">credit</C>, 'No', 'Only stock downloads carry it; your own work needs none.'],
                ]}
              />
              <P>
                Keys you leave out just disappear from the site: no <C>video</C> means no hover
                preview and no film section; an empty <C>gallery</C> means the case study runs on its
                cover alone; a missing shoot falls back to its <C>gradient</C>. A{' '}
                <C>projects</C> entry whose slug is not in <C>site.ts</C> is ignored.
              </P>
              <Note>
                Serving images from a CDN? Add the host to <C>images.remotePatterns</C> in{' '}
                <C>next.config.ts</C> — there is a commented example in the file — otherwise{' '}
                <C>next/image</C> refuses the URL.
              </Note>
              <P>
                Every image on the site goes through <C>components/ui/SafeImage.tsx</C>, which
                swaps in gradient artwork with the studio mark if a file 404s at runtime. A typo in
                the manifest degrades to a designed placeholder, not a broken-image icon.
              </P>
            </Section>

            {/* ── 07 ───────────────────────────────── */}
            <Section id="hero" n="07" title="The hero & the showreel">
              <P>
                Version 1&rsquo;s hero has four modes, set by <C>site.hero.mode</C>. Versions 2 and
                4 open on type and need no hero media at all; version 3 always uses the showreel.
              </P>
              <Table
                head={['Mode', 'What renders']}
                rows={[
                  [<C key="1">collage</C>, 'Columns of your own shoot frames drifting behind the headline (the default).'],
                  [<C key="2">video</C>, 'Full-bleed muted showreel from public/media/hero/hero.mp4.'],
                  [<C key="3">3d</C>, 'The WebGL scene only — no photographs needed.'],
                  [<C key="4">both</C>, 'Showreel behind the 3D scene.'],
                ]}
              />
              <P>
                To use your own showreel, drop <C>hero.mp4</C> and <C>hero-poster.webp</C> into{' '}
                <C>public/media/hero/</C> and re-scan. Video never autoplays on reduced-motion, on
                Data Saver, on 2G/3G or on phone-sized screens —{' '}
                <C>lib/useMediaPolicy.ts</C> decides, and the poster frame is shown instead.
              </P>
            </Section>

            {/* ── 08 ───────────────────────────────── */}
            <Section id="brand" n="08" title="Colours, type & the brand panel">
              <P>
                The palette is CSS custom properties in <C>app/globals.css</C>. Change two values to
                retheme the whole site — buttons, headlines, active chips, the logo mark and every
                progress bar read the same token.
              </P>
              <Code label="app/globals.css">{`@theme {
  --color-ink: #0a0a0c;      /* page ground */
  --color-ink-2: #141418;    /* cards, panels */
  --color-line: rgb(255 255 255 / 0.10);
  --color-muted: #9b9ba6;
  --color-accent: #e0b589;   /* ← the brand colour */
  --color-violet: #5a5fd8;   /* ← secondary glow */
  --font-display: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
}`}</Code>
              <P>
                Fonts are loaded in <C>app/layout.tsx</C> from Google Fonts. Swap the stylesheet
                link and the two font variables together.
              </P>
              <H3>The brand playground</H3>
              <P>
                The floating ⚙ panel lets a visitor try their own studio name, accent, background
                and logo (four built-in marks or an upload). State lives in <C>localStorage</C> and
                travels in a <C>?brand=</C> link, so someone can send themselves their mock-up.
                Layouts are <em>not</em> in the panel — they are URLs, switched from the header
                dropdown.
              </P>
              <Code label="content/site.ts">{`preview: { enabled: true }    // demo: panel renders
preview: { enabled: false }   // a real studio's site: no panel, no JS for it`}</Code>
              <Note>
                Turn it off for a client. Server-rendered titles, Open Graph tags and{' '}
                <C>/credits</C> read <C>site.name</C> directly, so a previewed brand name never
                reaches them — which is exactly why the panel is a demo toy, not a theming system.
              </Note>
            </Section>

            {/* ── 09 ───────────────────────────────── */}
            <Section id="enquiries" n="09" title="Where bookings go">
              <P>
                Out of the box the booking form needs no backend: it opens a prefilled WhatsApp chat
                and offers a <C>mailto:</C> fallback, so enquiries land in the inbox a studio already
                answers from. Set <C>site.whatsapp</C> and <C>site.email</C> and you are done.
              </P>
              <P>
                To <em>also</em> receive a copy by email with no server of your own, add three
                EmailJS variables. All four versions&rsquo; forms share{' '}
                <C>lib/useEnquiry.ts</C>, so this is configured once.
              </P>
              <Code label=".env.local">{`NEXT_PUBLIC_EMAILJS_SERVICE_ID=…
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=…
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=…`}</Code>
              <Note tone="warn">
                These are <C>NEXT_PUBLIC_</C> on purpose — EmailJS is a browser-side service, so the
                public key ships in the bundle and anyone can read it. Lock it down in their
                dashboard with domain allow-listing and a monthly quota. If you need a secret that
                never reaches the browser, send the enquiry from a Server Action to Resend or
                Postmark instead and delete <C>lib/sendEnquiry.ts</C>.
              </Note>
            </Section>

            {/* ── 10 ───────────────────────────────── */}
            <Section id="deploy" n="10" title="Deploy">
              <P>
                Every page prerenders, so any Node host or Vercel works with no configuration.
                Case-study pages are generated per shoot at build time; the four home pages are
                static.
              </P>
              <Steps
                items={[
                  <>
                    Set <C>site.url</C> to the real domain — Open Graph image paths resolve against
                    it.
                  </>,
                  <>
                    Run your media route (A, B or C) and <strong>commit</strong>{' '}
                    <C>content/media.json</C> plus the files in <C>public/media/</C>. The build does
                    not fetch anything.
                  </>,
                  <>
                    Add the EmailJS variables to the host&rsquo;s environment if you use them.{' '}
                    <C>UNSPLASH_ACCESS_KEY</C> and <C>PIXABAY_API_KEY</C> are build-time only — the
                    host never needs them.
                  </>,
                  <>
                    <C>npm run build</C>, then deploy. Set <C>preview.enabled: false</C> first if
                    this is a client site.
                  </>,
                  <>
                    Delete <C>app/docs/</C> (this page) before handing over, and keep{' '}
                    <C>/credits</C> if any stock imagery remains.
                  </>,
                ]}
              />
            </Section>

            {/* ── 11 ───────────────────────────────── */}
            <Section id="trouble" n="11" title="Troubleshooting">
              <Table
                head={['Symptom', 'Cause & fix']}
                rows={[
                  [
                    'Gradient artwork with the studio mark where a photo should be',
                    <>
                      No manifest entry, or the file 404s. Check the path in{' '}
                      <C>content/media.json</C> starts at <C>/media/…</C> and the file exists under{' '}
                      <C>public/</C>. Re-run <C>npm run scan:media</C>.
                    </>,
                  ],
                  [
                    'Build error about width and height on an image',
                    <>
                      A gallery or team entry is missing dimensions. Install <C>sharp</C> (
                      <C>npm i -D sharp</C>) and re-scan, or add <C>width</C>/<C>height</C> by hand.
                    </>,
                  ],
                  [
                    'Shoot folder present but frames missing',
                    <>
                      The numbered sequence has a gap, or the extension is unsupported. Use{' '}
                      <C>gallery-1…N</C> with no gaps, in <C>.webp .avif .jpg .jpeg .png</C>.
                    </>,
                  ],
                  [
                    'Showreel never plays',
                    <>
                      Working as intended on reduced-motion, Data Saver, slow connections and small
                      screens — see <C>lib/useMediaPolicy.ts</C>. Test on a desktop with motion
                      enabled.
                    </>,
                  ],
                  [
                    'fetch:media stops early',
                    <>
                      Unsplash&rsquo;s demo tier is 50 requests an hour. Responses are cached in{' '}
                      <C>scripts/.cache/</C>, so simply run it again later — it resumes.
                    </>,
                  ],
                  [
                    'A new shoot has no case-study page',
                    <>
                      Its <C>slug</C> must be unique and added to <C>projectSource</C>; the route
                      list comes from <C>generateStaticParams</C>. Restart <C>npm run dev</C> after
                      editing <C>content/site.ts</C>.
                    </>,
                  ],
                  [
                    'The intro loader feels slow',
                    <>
                      It waits for <C>window.load</C>. Tune or disable it in <C>site.loader</C> —{' '}
                      <C>maxMs</C> is a hard ceiling so a slow asset can never strand a visitor.
                    </>,
                  ],
                ]}
              />
            </Section>

            {/* ── 12 ───────────────────────────────── */}
            <Section id="files" n="12" title="File map">
              <Code label="repository">{`app/
  page.tsx                  Home 1          ·  home-2|3|4/page.tsx   Home 2, 3, 4
  work/[slug]/page.tsx      case study — ?v= picks the version's layout
  credits/page.tsx          media credits, from content/credits.json
  docs/page.tsx             this page (delete before handover)
  globals.css               design tokens, grain, marquee keyframes
components/
  v1/ v2/ v3/ v4/           one folder per version: Home, Case and that
                            version's own Nav, Hero, Work, Services, Packages,
                            Team, Reviews, Faq, Journal, Contact, Footer…
  backdrop/                 HeroCollage, HeroVideo — shared hero backdrops
  work/                     CaseHero, CaseStudyGallery, ProjectFilm, NextShoot
  ui/                       VersionSwitcher, SafeImage, Reveal, Logo, SiteLoader…
  preview/                  SettingsPanel, BrandMarks
  docs/Doc.tsx              the pieces this page is built from
content/
  site.ts                   ← all content lives here
  media.ts                  typed wrapper around the manifest
  media.json                generated by scan:media or fetch:media
  credits.json              generated; rendered at /credits
lib/
  version.ts                the four versions: URLs, labels, workHref
  useEnquiry.ts             booking state + WhatsApp / EmailJS hand-off
  useDragScroll.ts          grab-and-drag for the horizontal sliders
  useMediaPolicy.ts         decides when video may play at all
  preview.tsx               brand state + CSS-variable repainting
scripts/
  scan-media.mjs            builds the manifest from your own files
  fetch-media.mjs           downloads free-licensed stock
public/media/               your files + a public copy of credits.json`}</Code>
            </Section>
          </div>

          <footer className="mt-20 border-t border-line pt-8">
            <p className="text-sm text-muted">
              Still stuck? Every file is commented at the top with what it does and why. Start with{' '}
              <C>content/site.ts</C>, then <C>lib/version.ts</C>.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link href="/" className="text-accent hover:underline">Home 1</Link>
              <Link href="/home-2" className="text-accent hover:underline">Home 2</Link>
              <Link href="/home-3" className="text-accent hover:underline">Home 3</Link>
              <Link href="/home-4" className="text-accent hover:underline">Home 4</Link>
              <Link href="/credits" className="text-muted hover:text-white">Media credits</Link>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
