// ─────────────────────────────────────────────────────────────
//  All site content lives here. Edit this file to change text,
//  shoots, packages, team, reviews, stats and booking details.
//  No component code needs to change.
//
//  RENAMING THE STUDIO: change `site.name` below — it is the only
//  place the studio name is written. Everything else (nav logo,
//  metadata, footer wordmark, WhatsApp booking message) derives
//  from it.
//
//  NOTE: this is a TEMPLATE. The studio, its shoots, couples,
//  team members, prices and reviews are all FICTIONAL. Replace
//  them with your real work, real people, real prices and real
//  (permissioned) reviews before going live.
// ─────────────────────────────────────────────────────────────
import { projectMedia, teamPortrait, type MediaImage, type MediaVideo } from './media';

export const site = {
  /** The one place the studio name is defined. */
  name: 'Aperture House',
  tagline: 'Wedding, portrait and film studio.',
  description:
    'Aperture House is a photography and videography studio. Weddings, pre-weddings, maternity, newborn, first birthdays and model portfolios — shot on location or in our daylight studio, delivered as albums and films you will actually watch.',
  /** Production URL — used to resolve Open Graph image paths. */
  url: 'https://aperturehouse.example',
  email: 'book@aperturehouse.example',
  whatsapp: '919999999999', // country code + number, no "+"
  phone: '+91 99999 99999',
  location: 'Studio in Ahmedabad · shooting across India & destination',
  founded: '2014',
  socials: [
    { label: 'Instagram', href: '#' },
    { label: 'YouTube', href: '#' },
    { label: 'Pinterest', href: '#' },
    { label: 'WhatsApp', href: '#' },
  ],
  nav: [
    { label: 'Work', href: '#work' },
    { label: 'Shoots', href: '#services' },
    { label: 'Packages', href: '#packages' },
    { label: 'Studio', href: '#team' },
    { label: 'Book', href: '#contact' },
  ],

  /**
   * Hero presentation:
   *  'collage' — columns of your own shoots drifting behind the
   *              headline, leaning with the mouse and the scroll
   *              (default — needs `npm run fetch:media` or your own
   *              images; falls back to the 3D scene when empty)
   *  '3d'      — WebGL scene only
   *  'video'   — full-bleed showreel only
   *  'both'    — showreel behind the 3D scene
   * Video layers are skipped automatically on reduced-motion and on
   * metered / mobile connections; the collage then runs on stills.
   */
  hero: {
    mode: 'collage' as 'collage' | '3d' | 'video' | 'both',
    /** Pixabay search term for the hero showreel (`npm run fetch:media`). */
    videoQuery: 'wedding couple cinematic',
    badge: 'Booking 2026 & 2027 wedding dates',
    /**
     * One array per line, ONE WORD per entry — single words are what let the
     * line wrap instead of overflowing on narrow screens.
     * Style them by listing the word below.
     */
    headline: [
      ['We', 'photograph'],
      ['the', 'day', 'you', 'remember'],
    ],
    /** Words painted in the accent colour. */
    headlineAccent: ['remember'],
    /** Words drawn as an outline. */
    headlineOutline: ['day', 'you'],
    intro:
      'Weddings and pre-weddings, maternity and newborn, first birthdays and model portfolios. One team on camera, one team on film, and a studio you can book by the hour.',
    ctaPrimary: { label: 'See the work', href: '#work' },
    ctaSecondary: { label: 'Check your date', href: '#contact' },
  },

  /** Booking form options. */
  contact: {
    types: [
      'Wedding',
      'Pre-wedding',
      'Maternity',
      'Newborn & family',
      'Birthday / kids',
      'Model portfolio',
      'Product / brand',
      'Studio rental',
    ],
    budgets: ['Under ₹50k', '₹50k – ₹1.5L', '₹1.5L – ₹3L', '₹3L+', 'Not sure yet'],
    cities: ['Ahmedabad', 'Mumbai', 'Udaipur', 'Goa', 'Elsewhere in India', 'Destination'],
    note:
      'Tell us the date and the kind of shoot. We hold one date at a time and reply within a day — WhatsApp is fastest.',
  },

  /**
   * Intro loader. It waits for `window.load` (stylesheets, fonts, hero
   * images), then reveals the site. `maxMs` is a hard ceiling so a slow
   * asset can never strand a visitor on the loading screen.
   */
  loader: {
    enabled: true,
    /** Keeps it from flashing on a warm cache. */
    minMs: 700,
    /** Reveal the site regardless after this long. */
    maxMs: 4500,
  },

  /** Daylight studio available on its own, without a shoot package. */
  studio: {
    title: 'Book the studio by the hour',
    text:
      '1,400 sq ft of north-light cyclorama, two blackout bays, a hair-and-makeup room and parking. Strobes, modifiers, V-flats and a seamless wall of your colour are included. Bring your own crew or hire ours.',
    price: '₹2,500 / hour',
    note: 'Four-hour minimum on weekends. Equipment hire billed separately.',
    features: ['12 ft white cyclorama', 'Blackout bay + RGB', 'HMU room & steamer', 'Profoto kit on site', 'Street parking for 6', 'Client lounge & wifi'],
  },
};

/** Fictional venues and brands used in the logo marquee. */
export const clients = [
  'The Rann House', 'Vivanta Riverside', 'Sabarmati Lawns', 'Udai Bagh',
  'Marigold Farms', 'Kesari Haveli', 'Studio Nine', 'Bloom & Brass',
  'Terrace 21', 'Anandi Resorts',
];

export type Project = {
  slug: string;
  title: string;
  client: string;
  category: string;
  year: string;
  location: string;
  summary: string;
  tags: string[];
  result: string;
  /** Fallback artwork when no media has been downloaded yet. */
  gradient: [string, string];
  /** Unsplash (with Pixabay fallback) photo search term for `npm run fetch:media`. */
  mediaQuery: string;
  /** Pixabay video search term for `npm run fetch:media`. */
  videoQuery: string;
  /** What the clients actually received. */
  services: string[];
  challenge: string;
  solution: string;
  outcome: string;
  metrics: { value: string; label: string }[];
  /** Filled from content/media.json — see getters below. */
  cover?: MediaImage;
  gallery?: MediaImage[];
  video?: MediaVideo;
};

const projectSource: Omit<Project, 'cover' | 'gallery' | 'video'>[] = [
  {
    slug: 'anika-and-dev-wedding',
    title: 'Anika & Dev',
    client: 'Anika & Dev',
    category: 'Wedding',
    year: '2026',
    location: 'Udaipur',
    summary:
      'Three days, four functions and a lake-facing pheras at first light — shot by four people who never asked anyone to pose.',
    tags: ['Wedding', 'Film', 'Album'],
    result: '3 days · 28-min film',
    gradient: ['#b45309', '#fcd34d'],
    mediaQuery: 'indian wedding ceremony',
    videoQuery: 'wedding ceremony',
    services: ['Two photographers', 'Two cinematographers', '28-min wedding film', '80-page fine-art album'],
    challenge:
      'Four functions across three venues, two of them unlit after sunset, and a family of sixty who all wanted the couple at once. The pheras were set for 5:40am on a lake-facing terrace — one direction of light, no second take, and a mandap that put the priest between us and the couple.',
    solution:
      'We scouted all three venues the day before and built a light plan per function rather than per day: available light for the mehndi, bounced quarter-CTO for the sangeet, two bare heads on stands for the reception. For the pheras we shot from the terrace edge with a long lens to keep the lake behind them and put the second shooter low and opposite, so the ritual reads from both sides without anyone stepping into frame. The film team ran fully separate audio — lapel on the groom, a recorder at the priest — so the vows survived the shehnai.',
    outcome:
      'Fourteen hundred edited photographs and a 28-minute film cut around the actual vows rather than a music track. The family ordered three duplicate albums; two of the couple\'s cousins booked us from the same weekend.',
    metrics: [
      { value: '1,400', label: 'Edited photographs' },
      { value: '28 min', label: 'Wedding film' },
      { value: '4', label: 'Functions covered' },
    ],
  },
  {
    slug: 'coastal-pre-wedding',
    title: 'Ishita & Rohan',
    client: 'Ishita & Rohan',
    category: 'Pre-wedding',
    year: '2026',
    location: 'Goa',
    summary:
      'A pre-wedding for two people who hate pre-wedding shoots: no props, no lip-sync, one long walk at golden hour.',
    tags: ['Pre-wedding', 'Couple', 'Reel'],
    result: '1 day · 4 looks',
    gradient: ['#0e7490', '#fbbf24'],
    mediaQuery: 'couple photoshoot outdoor',
    videoQuery: 'couple walking beach sunset',
    services: ['Half-day couple shoot', 'Four outfit changes', '60 edited images', 'Three vertical reels'],
    challenge:
      'Both of them froze the moment a camera came up, and they had said as much in the enquiry. The brief was effectively "we want the photos, we do not want the shoot". Add a public beach in peak season and forty usable minutes of light.',
    solution:
      'We ran the whole thing as movement instead of posing: walk there, turn when you hear me, keep talking. Nothing was shot from the front for the first hour. We pre-blocked four spots within a two-minute walk of each other so the outfit changes never ate the light, and used a long lens from twenty metres so the camera stopped being a presence. The reels were shot at 60fps in the same passes — no separate video setups.',
    outcome:
      'Sixty images delivered in four days, and the two frames they picked for the invite were both from the first walk, before either of them had noticed we had started.',
    metrics: [
      { value: '60', label: 'Edited images' },
      { value: '4', label: 'Looks in one evening' },
      { value: '4 days', label: 'Delivery' },
    ],
  },
  {
    slug: 'maya-portfolio',
    title: 'Maya — Portfolio',
    client: 'Maya K.',
    category: 'Model Portfolio',
    year: '2025',
    location: 'Studio, Ahmedabad',
    summary:
      'A first portfolio built to get castings, not likes: six looks, clean light, and the frames agencies actually ask for.',
    tags: ['Portfolio', 'Studio', 'Fashion'],
    result: 'Signed within 6 weeks',
    gradient: ['#4c1d95', '#f472b6'],
    mediaQuery: 'fashion model studio portrait',
    videoQuery: 'fashion model studio shoot',
    services: ['Six-look studio day', 'Digitals + editorial set', 'Retouching', 'Agency-ready export set'],
    challenge:
      'Maya came in with a phone gallery of heavily filtered images and no digitals — the plain, unretouched frames every agency asks for first. The portfolio looked busy and told an agent nothing about bone structure, height or range.',
    solution:
      'We shot digitals first and got them out of the way: white cyc, one large source, no makeup, front-side-back, full length and head. Then six looks on a single lighting spine — one beauty dish moved rather than rebuilt — so the set reads as one person in six registers instead of six different shoots. Retouching was deliberately light: skin texture kept, nothing reshaped, because anything an agency cannot see in person works against her in the room.',
    outcome:
      'The agency-ready set went out on a Monday. She was signed within six weeks and the digitals from that morning are still the first thing on her card.',
    metrics: [
      { value: '6', label: 'Looks in one day' },
      { value: '40', label: 'Retouched frames' },
      { value: '6 wks', label: 'To signing' },
    ],
  },
  {
    slug: 'maternity-golden-hour',
    title: 'Priya — Maternity',
    client: 'Priya & Arjun',
    category: 'Maternity',
    year: '2025',
    location: 'Studio & home',
    summary:
      'Thirty-four weeks, two hours, and a session built around how long someone can comfortably stand.',
    tags: ['Maternity', 'Studio', 'Home'],
    result: '2 hrs · 45 images',
    gradient: ['#be185d', '#fda4af'],
    mediaQuery: 'maternity photoshoot',
    videoQuery: 'pregnant woman portrait',
    services: ['Two-hour session', 'Studio + at-home set', 'Gowns provided', '45 edited images'],
    challenge:
      'Priya was thirty-four weeks in, uncomfortable standing for more than a few minutes, and had told us she did not want the floaty-fabric-in-a-field version of a maternity shoot. The nursery at home had one small north window and a wall of boxes.',
    solution:
      'We built the session around rest: twenty minutes up, ten minutes sitting, every setup reachable from a chair. Studio first while energy was highest — one big source, deep shadow, dark gowns so the silhouette does the work — then home for the quieter half, where we cleared the boxes, pushed the chair to the window and shot almost everything at the available light. Arjun was in frame from the start rather than added at the end.',
    outcome:
      'Forty-five images in two hours with no session running over. Fifteen of them are from the chair by the window, which is the set she had been most worried about.',
    metrics: [
      { value: '2 hrs', label: 'Total session' },
      { value: '45', label: 'Edited images' },
      { value: '2', label: 'Locations' },
    ],
  },
  {
    slug: 'newborn-aarav',
    title: 'Aarav — Newborn',
    client: 'The Mehta family',
    category: 'Newborn & Family',
    year: '2025',
    location: 'At home',
    summary:
      'Eleven days old, shot entirely at home on the family\'s own bed, at the baby\'s pace and nobody else\'s.',
    tags: ['Newborn', 'Family', 'At home'],
    result: '11 days old · 50 images',
    gradient: ['#92400e', '#fde68a'],
    mediaQuery: 'newborn baby photography',
    videoQuery: 'newborn baby sleeping',
    services: ['At-home newborn session', 'Parent & sibling portraits', '50 edited images', 'Printed baby book'],
    challenge:
      'First-time parents, eleven days in, running on no sleep, and firmly against the prop-heavy newborn style — no buckets, no headbands, no posed hands under the chin. The flat faced south-west, so the only soft light was a two-hour window in the morning.',
    solution:
      'We booked the session inside that window and shot the whole thing on the parents\' bed, pulled towards the glass, with one reflector and nothing else. Posing was limited to what Aarav did on his own — curled, yawning, gripping a finger — which is both safer and the only thing that looks like an actual eleven-day-old. The sibling portraits were shot first, before a four-year-old\'s patience ran out, and feeds were built into the schedule rather than treated as interruptions.',
    outcome:
      'Fifty images, no studio visit, and a twenty-page baby book the grandparents ordered twice. The session ran ten minutes short of the slot.',
    metrics: [
      { value: '50', label: 'Edited images' },
      { value: '0', label: 'Props used' },
      { value: '2 hrs', label: 'At home' },
    ],
  },
  {
    slug: 'kiara-first-birthday',
    title: 'Kiara Turns One',
    client: 'The Shah family',
    category: 'Birthday & Kids',
    year: '2024',
    location: 'Ahmedabad',
    summary:
      'A first birthday covered like a small wedding: decor before, chaos during, cake smash after.',
    tags: ['Birthday', 'Event', 'Kids'],
    result: '4 hrs · 300 images',
    gradient: ['#065f46', '#a3e635'],
    mediaQuery: 'baby first birthday cake smash',
    videoQuery: 'birthday party kids',
    services: ['Four-hour event coverage', 'Decor & detail set', 'Cake smash in studio', '300 edited images'],
    challenge:
      'Sixty guests in a hall lit by orange tungsten downlights and a balloon arch directly under the worst of it. Eighteen children under six, one of whom was the subject and none of whom were going to hit a mark. The cake smash had been planned for the end of the party, which is the exact point a one-year-old stops cooperating.',
    solution:
      'We shot the decor and detail set in the forty-five minutes before guests arrived, which is the only time that room is ever clean. Through the party we worked off two bounced flashes gelled to match the tungsten, so faces stayed warm without going orange, and stayed at child height for most of it. The cake smash we moved — to our studio, three days earlier, on white, with a spare cake and a bath afterwards. That one call is why those frames exist at all.',
    outcome:
      'Three hundred images covering the room, the family and the cake, delivered in a week. The cake smash set is the one printed on the wall.',
    metrics: [
      { value: '300', label: 'Edited images' },
      { value: '4 hrs', label: 'Event coverage' },
      { value: '60', label: 'Guests covered' },
    ],
  },
];

/** Shoots with their downloaded media merged in. */
export const projects: Project[] = projectSource.map((p) => {
  const m = projectMedia(p.slug);
  return { ...p, cover: m.cover, gallery: m.gallery, video: m.video };
});

export const stats = [
  { value: 240, suffix: '+', label: 'Weddings shot' },
  { value: 900, suffix: '+', label: 'Portrait sessions' },
  { value: 4.9, suffix: '★', label: 'Average client rating', decimals: 1 },
  { value: 12, suffix: 'yrs', label: 'Behind the camera' },
];

export const services = [
  { title: 'Wedding Photography', text: 'Full-day and multi-day coverage, two to four shooters, candid-first. Albums printed, not just delivered.', icon: '◉' },
  { title: 'Wedding Films', text: 'A teaser, a highlight film and the full ceremony with clean vows audio — cut to what was actually said.', icon: '▶' },
  { title: 'Pre-wedding & Couple', text: 'Half or full day, on location or in studio. Four looks, stills and vertical reels in the same session.', icon: '✦' },
  { title: 'Maternity, Newborn & Kids', text: 'Gentle, unhurried sessions at home or in the studio. Gowns and props provided, nothing forced.', icon: '◇' },
  { title: 'Model & Portfolio', text: 'Digitals plus an editorial set, shot and retouched to what agencies ask for. Same-week turnaround.', icon: '▣' },
  { title: 'Product & Brand', text: 'Catalogue, lookbook and social sets for small brands — plus the studio on its own, by the hour.', icon: '↗' },
];

export const process = [
  { step: '01', title: 'Check the date', text: 'Message us the date and the kind of shoot. We hold one date at a time, free, for seven days.' },
  { step: '02', title: 'Plan it', text: 'A call or a studio visit: venues, light, timeline, who matters in the family photos, what you hate.' },
  { step: '03', title: 'Shoot day', text: 'We arrive early, stay out of the way and keep one person on the family while the rest shoot candid.' },
  { step: '04', title: 'Delivery', text: 'Previews in 48 hours, full gallery in two to four weeks, album and film after one round of changes.' },
];

export type Package = {
  name: string;
  price: string;
  unit: string;
  summary: string;
  includes: string[];
  popular?: boolean;
};

// SAMPLE pricing — replace with your real packages before going live.
export const packages: Package[] = [
  {
    name: 'Portrait Session',
    price: '₹18,000',
    unit: 'from · per session',
    summary: 'Maternity, newborn, birthday, portfolio or family. Studio or at your place.',
    includes: [
      'Up to 2 hours, one location',
      'One photographer',
      '40–50 edited images',
      'Studio, gowns & props included',
      'Online gallery for 12 months',
      'Delivery in 7 days',
    ],
  },
  {
    name: 'Wedding Day',
    price: '₹1,45,000',
    unit: 'from · per day',
    summary: 'One full day, two functions, stills and film by one team that has worked together for years.',
    popular: true,
    includes: [
      'Two photographers + one cinematographer',
      'Up to 12 hours of coverage',
      '700+ edited photographs',
      '3-minute teaser + 15-minute film',
      '40-page fine-art album',
      'Previews in 48 hours',
    ],
  },
  {
    name: 'Full Wedding',
    price: '₹3,20,000',
    unit: 'from · 3 days',
    summary: 'Everything from mehndi to vidaai, including travel, with a second team on film.',
    includes: [
      'Four shooters across all functions',
      'Three days, multiple venues',
      '1,200+ edited photographs',
      'Teaser, 25-min film & full ceremony',
      '80-page album + two parent copies',
      'Travel & stay included within India',
    ],
  },
];

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  portrait?: MediaImage;
};

// FICTIONAL team — replace with the real studio before going live.
const teamSource: Omit<TeamMember, 'portrait'>[] = [
  { name: 'Ira Suryavanshi', role: 'Founder · Lead Photographer', bio: 'Shoots every wedding the studio takes. Twelve years, never a second camera body short.' },
  { name: 'Kabir Rathod', role: 'Director of Photography', bio: 'Runs the film team. Believes the vows matter more than the drone shot.' },
  { name: 'Meher Qureshi', role: 'Portrait & Newborn', bio: 'Maternity, newborn and kids. Has never once used a prop bucket.' },
  { name: 'Devan Pillai', role: 'Second Shooter', bio: 'The one at the back of the room getting the reaction you missed.' },
  { name: 'Anoushka Bose', role: 'Retoucher & Album Design', bio: 'Decides what stays in the frame and how the book turns.' },
  { name: 'Faiz Merchant', role: 'Studio Manager', bio: 'Holds your date, runs the studio diary, answers the WhatsApp.' },
];

export const team: TeamMember[] = teamSource.map((m, i) => ({
  ...m,
  portrait: teamPortrait(i),
}));

export type Review = {
  name: string;
  role: string;
  country: string; // flag emoji
  project: string;
  rating: number;
  quote: string;
};

// ─────────────────────────────────────────────────────────────
//  SAMPLE reviews. Every name and detail below is FICTIONAL and
//  written by us for this template. They are not real people and
//  not real endorsements. Replace them with genuine client
//  reviews (with written permission) before publishing.
// ─────────────────────────────────────────────────────────────
export const reviews: Review[] = [
  {
    name: 'Anika & Dev',
    role: 'Married in Udaipur',
    country: '🇮🇳',
    project: 'Anika & Dev',
    rating: 5,
    quote:
      'They were at the venue before us on every single day. The film has my grandmother\'s voice in it, which nobody thought to record — we did not even know she had been mic\'d.',
  },
  {
    name: 'Ishita N.',
    role: 'Pre-wedding, Goa',
    country: '🇮🇳',
    project: 'Ishita & Rohan',
    rating: 5,
    quote:
      'I told them upfront I hate being photographed. We walked and talked for an hour and I genuinely did not notice the shoot had started. Best photos either of us has.',
  },
  {
    name: 'The Mehta family',
    role: 'Newborn session at home',
    country: '🇮🇳',
    project: 'Aarav — Newborn',
    rating: 5,
    quote:
      'Eleven days in and barely sleeping. They worked around his feeds, never once posed him into anything, and were gone before we were tired of them.',
  },
  {
    name: 'Maya K.',
    role: 'Model',
    country: '🇮🇳',
    project: 'Maya — Portfolio',
    rating: 5,
    quote:
      'Three studios had sold me heavy retouching. This was the first one that shot proper digitals and explained why that is what gets you in the room.',
  },
  {
    name: 'Rupal Shah',
    role: 'Kiara\'s mum',
    country: '🇮🇳',
    project: 'Kiara Turns One',
    rating: 4,
    quote:
      'Moving the cake smash to their studio was their idea and it saved the whole thing. Gallery took a week longer than quoted, but the photos were worth it.',
  },
];
