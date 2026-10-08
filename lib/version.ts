/**
 * The template ships as four complete site versions. A version is not a
 * theme — each one has its own home page, its own case-study page and its
 * own copy of every section, written for that layout.
 *
 * The version lives in the URL, so every layout is linkable, crawlable and
 * statically rendered:
 *
 *   /                      Home 1   ·  /work/<slug>        Case 1
 *   /home-2                Home 2   ·  /work/<slug>?v=2    Case 2
 *   /home-3                Home 3   ·  /work/<slug>?v=3    Case 3
 *   /home-4                Home 4   ·  /work/<slug>?v=4    Case 4
 *
 * Components never read the version from context: each version folder
 * passes its own number, so a section can only ever link inside its own
 * version. `components/v2/Work.tsx` links with `workHref(2, slug)`.
 */
export const VERSIONS = [1, 2, 3, 4] as const;
export type Version = (typeof VERSIONS)[number];

export const versionMeta: Record<Version, { label: string; name: string; note: string }> = {
  1: { label: 'Home 1', name: 'Collage', note: 'Contact-sheet hero, pinned work rail' },
  2: { label: 'Home 2', name: 'Editorial', note: 'Big type, work as an index' },
  3: { label: 'Home 3', name: 'Cinematic', note: 'Showreel hero, full-screen panels' },
  4: { label: 'Home 4', name: 'Archive', note: 'Gallery-first, sticky side rail' },
};

/** Home page for a version. Version 1 owns `/`. */
export const homeHref = (v: Version) => (v === 1 ? '/' : `/home-${v}`);

/** An in-page anchor on that version's home page, e.g. `#contact`. */
export const homeAnchor = (v: Version, hash: string) =>
  `${homeHref(v)}${hash.startsWith('#') ? hash : `#${hash}`}`;

/** Case study, kept inside the version the visitor is browsing. */
export const workHref = (v: Version, slug: string) =>
  v === 1 ? `/work/${slug}` : `/work/${slug}?v=${v}`;

/** Reads `?v=` off a case-study URL. Anything unexpected falls back to 1. */
export function parseVersion(raw?: string | string[]): Version {
  const n = Number(Array.isArray(raw) ? raw[0] : raw);
  return (VERSIONS as readonly number[]).includes(n) ? (n as Version) : 1;
}
