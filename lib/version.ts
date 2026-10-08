import { site } from '@/content/site';

/**
 * The template ships as four complete site versions. A version is not a
 * theme — each one has its own home page, its own case-study page and its
 * own copy of every section.
 *
 * Which versions are live, and which one owns `/`, is configured in
 * `site.versions` — not by deleting folders:
 *
 *   enabled: [1, 2, 3, 4]   all four, visitors can switch
 *   enabled: [2]            Editorial only; `/home-3` and `?v=3` stop working
 *   default: 3              Cinematic owns `/`; `/home-3` redirects there
 *   switcher: false         all live, but no dropdown in the header
 *
 * With one version enabled the site behaves as an ordinary single-layout
 * site: `/` is that layout, `/work/<slug>` is its case study, and the
 * dropdown hides itself.
 */
export const VERSIONS = [1, 2, 3, 4] as const;
export type Version = (typeof VERSIONS)[number];

export const versionMeta: Record<Version, { label: string; name: string; note: string }> = {
  1: { label: 'Home 1', name: 'Collage', note: 'Contact-sheet hero, pinned work rail' },
  2: { label: 'Home 2', name: 'Editorial', note: 'Big type, work as an index' },
  3: { label: 'Home 3', name: 'Cinematic', note: 'Showreel hero, full-screen panels' },
  4: { label: 'Home 4', name: 'Archive', note: 'Gallery-first, sticky side rail' },
};

/** Versions that are live, in canonical order. Falls back to all four if misconfigured. */
export const enabledVersions: Version[] = (() => {
  const picked = VERSIONS.filter((v) => site.versions.enabled.includes(v));
  return picked.length ? picked : [...VERSIONS];
})();

/** The version that owns `/`. Must be enabled; otherwise the first enabled one wins. */
export const defaultVersion: Version = enabledVersions.includes(site.versions.default)
  ? site.versions.default
  : enabledVersions[0];

export const isEnabled = (v: Version) => enabledVersions.includes(v);

/** The dropdown is pointless with a single version, so it hides itself. */
export const showSwitcher = site.versions.switcher && enabledVersions.length > 1;

/** Home page for a version. The default version owns `/`. */
export const homeHref = (v: Version) => (v === defaultVersion ? '/' : `/home-${v}`);

/** An in-page anchor on that version's home page, e.g. `#contact`. */
export const homeAnchor = (v: Version, hash: string) => {
  const base = homeHref(v);
  const h = hash.startsWith('#') ? hash : `#${hash}`;
  return base === '/' ? `/${h}` : `${base}${h}`;
};

/** Case study, kept inside the version the visitor is browsing. */
export const workHref = (v: Version, slug: string) =>
  v === defaultVersion ? `/work/${slug}` : `/work/${slug}?v=${v}`;

/** Reads `?v=` off a case-study URL. Anything unexpected or disabled falls back. */
export function parseVersion(raw?: string | string[]): Version {
  const n = Number(Array.isArray(raw) ? raw[0] : raw);
  const v = VERSIONS.find((x) => x === n);
  return v && isEnabled(v) ? v : defaultVersion;
}
