#!/usr/bin/env node
/**
 * fetch-media.mjs — download free-licensed photos and videos for this template.
 *
 *   npm run fetch:media
 *
 * Sources (official APIs only, free tiers):
 *   Unsplash https://unsplash.com/developers  → photos (covers, galleries, portraits)
 *   Pixabay  https://pixabay.com/api/docs/    → videos, and photos as a fallback
 *
 * It NEVER scrapes third-party studio, agency or portfolio sites.
 *
 * Reads keys from .env.local (or the real environment):
 *   UNSPLASH_ACCESS_KEY=...
 *   PIXABAY_API_KEY=...
 *
 * Writes:
 *   public/media/<project-slug>/cover.webp, gallery-1..4.webp, preview.mp4, preview-poster.webp
 *   public/media/hero/hero.mp4, hero-poster.webp
 *   public/media/team/member-1..6.webp
 *   content/credits.json        ← author + licence for every file (imported by /credits)
 *   public/media/credits.json   ← same list, fetchable directly
 *   content/media.json          ← manifest the site imports
 *
 * Rate limits are respected: one request at a time with a 300 ms gap
 * (Unsplash demo = 50 req/hour, Pixabay = 100 req/minute), and every API
 * response is cached in scripts/.cache/ so re-runs cost no requests at all.
 *
 * Re-running is safe: files that already exist are never downloaded again.
 * `sharp` is optional — with it, images become compressed WebP with blur
 * placeholders; without it, the original JPEGs are saved as-is.
 *
 * Pixabay forbids hotlinking its CDN, so every video and fallback photo is
 * downloaded and served from /public/media.
 */

import fs from 'node:fs/promises';
import fss from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MEDIA_DIR = path.join(ROOT, 'public', 'media');
const MANIFEST = path.join(ROOT, 'content', 'media.json');
/** Imported by app/credits/page.tsx — kept out of public/ so the page never
 *  imports from the static-asset directory. */
const CREDITS = path.join(ROOT, 'content', 'credits.json');
/** Public copy, so the raw list is fetchable at /media/credits.json too. */
const CREDITS_PUBLIC = path.join(MEDIA_DIR, 'credits.json');
const SITE_TS = path.join(ROOT, 'content', 'site.ts');
const CACHE_DIR = path.join(ROOT, 'scripts', '.cache');
/** download_location pings that failed (rate limit) and must be retried. */
const PENDING_PINGS = path.join(CACHE_DIR, 'pending-unsplash-pings.json');

/** Unsplash API guidelines: identify the app on outbound links. */
const UTM = 'utm_source=nova_studio_template&utm_medium=referral';

/** Minimum gap between any two outbound requests, in ms. */
const REQUEST_GAP = 300;

/** Hero showreel search term, read from site.hero.videoQuery. */
async function readHeroQuery() {
  const src = await fs.readFile(SITE_TS, 'utf8');
  const m = /hero:\s*\{[\s\S]*?videoQuery:\s*'([^']+)'/.exec(src);
  return m ? m[1] : 'abstract dark studio';
}
/** Several queries, so six portraits do not come from one photographer. */
const TEAM_QUERIES = [
  'professional headshot plain background',
  'corporate headshot business portrait',
  'business portrait neutral background',
  'creative professional headshot studio',
];

const LICENSES = {
  Unsplash: {
    name: 'Unsplash License',
    url: 'https://unsplash.com/license',
    note: 'Free to use. Attribution not required, but credited here.',
  },
  Pixabay: {
    name: 'Pixabay Content License',
    url: 'https://pixabay.com/service/license-summary/',
    note: 'Free to use. Attribution not required, but credited here. Files are served locally — Pixabay does not permit hotlinking.',
  },
};

// ── tiny utils ───────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log(...a);
const warn = (...a) => console.warn('  !', ...a);

let sharp = null;
try {
  sharp = (await import('sharp')).default;
} catch {
  warn('sharp not installed — saving original JPEGs, no WebP/blur placeholders.');
  warn('  npm i -D sharp   (then re-run) for smaller files and blur-up loading.');
}

async function loadEnv() {
  const out = { ...process.env };
  for (const file of ['.env.local', '.env']) {
    try {
      const raw = await fs.readFile(path.join(ROOT, file), 'utf8');
      for (const line of raw.split(/\r?\n/)) {
        const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
        if (!m) continue;
        const v = m[2].trim().replace(/^["']|["']$/g, '');
        if (v && out[m[1]] === undefined) out[m[1]] = v;
      }
    } catch {
      /* optional file */
    }
  }
  return out;
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

// ── throttle: one request at a time, >=REQUEST_GAP apart ─────
let lastRequest = 0;
let chain = Promise.resolve();
function throttled(fn) {
  const run = chain.then(async () => {
    const wait = REQUEST_GAP - (Date.now() - lastRequest);
    if (wait > 0) await sleep(wait);
    try {
      return await fn();
    } finally {
      lastRequest = Date.now();
    }
  });
  chain = run.catch(() => {});
  return run;
}

// ── cached JSON API calls ───────────────────────────────────
/** Cache key ignores the API key so rotating keys does not bust the cache. */
function cacheFile(url) {
  const normalised = url.replace(/([?&]key=)[^&]+/, '$1<key>');
  return path.join(CACHE_DIR, crypto.createHash('sha1').update(normalised).digest('hex') + '.json');
}

async function api(url, headers = {}, { cache = true } = {}) {
  const file = cacheFile(url);
  if (cache) {
    const hit = await readJson(file, null);
    if (hit) return hit;
  }
  const json = await throttled(async () => {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`${res.status} ${res.statusText} — ${url.replace(/([?&]key=)[^&]+/, '$1***')}\n  ${body.slice(0, 200)}`);
    }
    return res.json();
  });
  if (cache) {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.writeFile(file, JSON.stringify(json));
  }
  return json;
}

async function fetchBuffer(url, headers = {}) {
  return throttled(async () => {
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
    return Buffer.from(await res.arrayBuffer());
  });
}

/** Does <base>.webp or <base>.jpg already exist? Returns the public path or null. */
function existingImage(absBase) {
  for (const ext of ['.webp', '.jpg']) {
    if (fss.existsSync(absBase + ext)) return publicPath(absBase + ext);
  }
  return null;
}

function publicPath(abs) {
  return '/' + path.relative(path.join(ROOT, 'public'), abs).split(path.sep).join('/');
}

// ── project list, parsed out of content/site.ts ──────────────
async function readProjects() {
  const src = await fs.readFile(SITE_TS, 'utf8');
  const re =
    /slug:\s*'([^']+)'[\s\S]*?title:\s*'([^']+)'[\s\S]*?mediaQuery:\s*'([^']+)'[\s\S]*?videoQuery:\s*'([^']+)'/g;
  const out = [];
  let m;
  while ((m = re.exec(src))) out.push({ slug: m[1], title: m[2], mediaQuery: m[3], videoQuery: m[4] });
  if (!out.length) throw new Error('No projects found in content/site.ts (slug + mediaQuery + videoQuery).');
  return out;
}

// ── image / video writing ───────────────────────────────────
async function saveImage(buf, absBase, { width, alt, credit }) {
  await fs.mkdir(path.dirname(absBase), { recursive: true });

  if (!sharp) {
    const abs = absBase + '.jpg';
    await fs.writeFile(abs, buf);
    return { src: publicPath(abs), width, height: Math.round(width * 0.625), alt, credit };
  }

  const abs = absBase + '.webp';
  const info = await sharp(buf)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 78, effort: 5 })
    .toFile(abs);
  const blur = await sharp(buf).resize({ width: 20 }).webp({ quality: 35 }).toBuffer();

  return {
    src: publicPath(abs),
    width: info.width,
    height: info.height,
    blurDataURL: `data:image/webp;base64,${blur.toString('base64')}`,
    alt,
    credit,
  };
}

async function saveVideo(buf, abs) {
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, buf);
  return publicPath(abs);
}

// ── providers ───────────────────────────────────────────────
function makeUnsplash(key) {
  if (!key) return null;
  const headers = { Authorization: `Client-ID ${key}`, 'Accept-Version': 'v1' };
  return {
    name: 'Unsplash',
    async photos(query, { perPage = 12, orientation = 'landscape', width = 1920 } = {}) {
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=${orientation}&content_filter=high`;
      const json = await api(url, headers);
      return (json.results || []).map((p) => ({
        id: `unsplash-${p.id}`,
        url: `${p.urls.raw}&w=${width}&q=80&fm=jpg&fit=max`,
        downloadHeaders: headers,
        /** Unsplash API guideline: ping download_location whenever the file is used. */
        downloadLocation: p.links?.download_location,
        alt: p.alt_description || p.description || query,
        credit: {
          source: 'Unsplash',
          author: p.user?.name ?? 'Unknown',
          authorUrl: p.user?.links?.html ? `${p.user.links.html}?${UTM}` : `https://unsplash.com/?${UTM}`,
          sourceUrl: p.links?.html ? `${p.links.html}?${UTM}` : `https://unsplash.com/?${UTM}`,
          license: LICENSES.Unsplash.name,
        },
      }));
    },
    /** Single attempt, used by the retry pass so it does not re-queue. */
    async trackDownloadOnce(loc) {
      try {
        await api(loc, headers, { cache: false });
        return true;
      } catch {
        return false;
      }
    },
    /**
     * Required by the Unsplash API Guidelines when a photo is downloaded.
     * A failure (usually the 50/hour Demo limit) is queued and retried on the
     * next run, so the obligation is never silently dropped.
     */
    async trackDownload(loc) {
      if (!loc) return true;
      try {
        // never cached: this is a side-effecting endpoint
        await api(loc, headers, { cache: false });
        return true;
      } catch (e) {
        warn('Unsplash download ping failed (queued for retry):', e.message.split('\n')[0]);
        await queuePing(loc);
        return false;
      }
    },
  };
}

/** Pixabay returns `userURL` on newer responses; fall back to building it. */
function pixabayUserUrl(h) {
  if (h.userURL) return h.userURL;
  if (h.user && h.user_id) return `https://pixabay.com/users/${h.user}-${h.user_id}/`;
  return 'https://pixabay.com/';
}

function makePixabay(key) {
  if (!key) return null;
  const q = (s) => encodeURIComponent(s);
  return {
    name: 'Pixabay',
    /** Fallback photos, used only when Unsplash returns nothing for a query. */
    async photos(query, { perPage = 12, orientation = 'horizontal' } = {}) {
      const url = `https://pixabay.com/api/?key=${key}&q=${q(query)}&image_type=photo&orientation=${orientation}&per_page=${perPage}&safesearch=true`;
      const json = await api(url);
      return (json.hits || []).map((h) => ({
        id: `pixabay-${h.id}`,
        // Pixabay forbids hotlinking — this URL is only ever used to download.
        url: h.fullHDURL || h.largeImageURL || h.webformatURL,
        downloadHeaders: {},
        alt: h.tags || query,
        credit: {
          source: 'Pixabay',
          author: h.user ?? 'Unknown',
          authorUrl: pixabayUserUrl(h),
          sourceUrl: h.pageURL ?? 'https://pixabay.com/',
          license: LICENSES.Pixabay.name,
        },
      }));
    },
    /**
     * Pixabay's named renditions are not fixed sizes — `large` is 4K on newer
     * uploads and `medium` can be 2560px — so pick by actual width instead:
     * the widest rendition that still fits `maxWidth`, else the smallest one.
     */
    async videos(query, { maxDuration = 15, maxWidth = 1280, perPage = 5 } = {}) {
      const url = `https://pixabay.com/api/videos/?key=${key}&q=${q(query)}&per_page=${perPage}&safesearch=true`;
      const json = await api(url);
      for (const h of json.hits || []) {
        if (h.duration && h.duration > maxDuration) continue;
        const all = Object.values(h.videos || {}).filter((v) => v?.url && v?.width);
        const fits = all.filter((v) => v.width <= maxWidth).sort((a, b) => b.width - a.width);
        const rendition = fits[0] ?? all.sort((a, b) => a.width - b.width)[0];
        if (!rendition) continue;
        return {
          id: `pixabay-video-${h.id}`,
          url: rendition.url,
          posterUrl:
            rendition.thumbnail ||
            (h.picture_id ? `https://i.vimeocdn.com/video/${h.picture_id}_1280x720.jpg` : undefined),
          width: rendition.width,
          height: rendition.height,
          duration: h.duration,
          credit: {
            source: 'Pixabay',
            author: h.user ?? 'Unknown',
            authorUrl: pixabayUserUrl(h),
            sourceUrl: h.pageURL ?? 'https://pixabay.com/',
            license: LICENSES.Pixabay.name,
          },
        };
      }
      return null;
    },
  };
}

// ── main ────────────────────────────────────────────────────
const env = await loadEnv();
const unsplash = makeUnsplash(env.UNSPLASH_ACCESS_KEY);
const pixabay = makePixabay(env.PIXABAY_API_KEY);

if (!unsplash && !pixabay) {
  console.error(
    '\nNo API keys found.\n\n' +
      '  1. cp .env.example .env.local\n' +
      '  2. Unsplash access key (photos): https://unsplash.com/oauth/applications/new\n' +
      '  3. Pixabay API key (videos):     https://pixabay.com/api/docs/\n' +
      '  4. Paste both into .env.local and re-run `npm run fetch:media`\n'
  );
  process.exit(1);
}
if (!unsplash) warn('UNSPLASH_ACCESS_KEY missing — all photos will come from Pixabay.');
if (!pixabay) warn('PIXABAY_API_KEY missing — no videos will be downloaded (photos only).');

const prev = await readJson(MANIFEST, { projects: {}, team: [], hero: {} });
const manifest = {
  generatedAt: new Date().toISOString(),
  hero: { video: null, poster: null },
  projects: {},
  team: [],
};
/** public file path → credit entry */
const creditMap = new Map();
const prevCredits = await readJson(CREDITS, { items: [] });
for (const it of prevCredits.items || []) creditMap.set(it.file, it);

function credit(file, type, usedFor, c) {
  if (!c) return;
  const lic = LICENSES[c.source] ?? { name: c.license, url: '', note: '' };
  creditMap.set(file, {
    file,
    type,
    usedFor,
    source: c.source,
    author: c.author,
    authorUrl: c.authorUrl,
    sourceUrl: c.sourceUrl,
    license: lic.name,
    licenseUrl: lic.url,
    licenseNote: lic.note,
  });
}

/** Look up entries from the previous manifest by public path. */
function findPrevImage(src) {
  const pool = [
    prev.hero?.poster,
    ...(prev.team || []),
    ...Object.values(prev.projects || {}).flatMap((p) => [p?.cover, ...(p?.gallery || [])]),
  ];
  return pool.find((e) => e && e.src === src) || null;
}

function findPrevVideo(src) {
  const pool = [prev.hero?.video, ...Object.values(prev.projects || {}).map((p) => p?.video)];
  return pool.find((e) => e && e.src === src) || null;
}

/** Download one photo candidate into absBase, or reuse the file already on disk. */
async function takePhoto(candidate, absBase, { width, usedFor }) {
  const already = existingImage(absBase);
  if (already) {
    log(`    = ${already} (exists)`);
    const reused = findPrevImage(already);
    credit(already, 'image', usedFor, reused?.credit ?? candidate.credit);
    return (
      reused ?? {
        src: already,
        width,
        height: Math.round(width * 0.625),
        alt: candidate.alt,
        credit: candidate.credit,
      }
    );
  }

  const buf = await fetchBuffer(candidate.url, candidate.downloadHeaders);
  const entry = await saveImage(buf, absBase, { width, alt: candidate.alt, credit: candidate.credit });
  if (candidate.downloadLocation && unsplash) await unsplash.trackDownload(candidate.downloadLocation);
  credit(entry.src, 'image', usedFor, candidate.credit);
  log(`    + ${entry.src} — ${candidate.credit.author} / ${candidate.credit.source}`);
  return entry;
}

const authorKey = (c) => `${c.credit.source}:${c.credit.author}`;
const uniqueAuthors = (pool) => new Set(pool.map(authorKey)).size;

/** One frame per photographer first, so a gallery is not five shots by one person. */
function spreadByAuthor(pool) {
  const seen = new Set();
  const first = [];
  const rest = [];
  for (const c of pool) {
    const k = authorKey(c);
    if (seen.has(k)) rest.push(c);
    else {
      seen.add(k);
      first.push(c);
    }
  }
  return [...first, ...rest];
}

/**
 * Photos for a query: Unsplash first. Pixabay is used as a fallback when
 * Unsplash returns nothing, and as a top-up when Unsplash returns fewer than
 * `need` frames (narrow queries like "brand identity mockup" do) or fewer than
 * `needAuthors` distinct photographers (so a team grid is not one person's shoot).
 */
async function photoPool(query, { need = 5, needAuthors = need, ...opts } = {}) {
  let pool = [];
  if (unsplash) {
    try {
      pool = await unsplash.photos(query, opts);
    } catch (e) {
      warn('Unsplash photos failed:', e.message);
    }
  }
  const thin = pool.length < need;
  const narrow = uniqueAuthors(pool) < needAuthors;
  if ((thin || narrow) && pixabay) {
    warn(
      pool.length === 0
        ? `No Unsplash results for "${query}" — falling back to Pixabay photos.`
        : thin
          ? `Only ${pool.length} Unsplash results for "${query}" — topping up from Pixabay.`
          : `Only ${uniqueAuthors(pool)} photographers for "${query}" — topping up from Pixabay.`
    );
    try {
      const extra = await pixabay.photos(query, {
        perPage: opts.perPage,
        orientation: opts.orientation === 'portrait' ? 'vertical' : 'horizontal',
      });
      const have = new Set(pool.map((c) => c.id));
      pool = [...pool, ...extra.filter((c) => !have.has(c.id))];
    } catch (e) {
      warn('Pixabay photos failed:', e.message);
    }
  }
  return spreadByAuthor(pool);
}

/** Merge several queries into one pool, deduped, spread across photographers. */
async function photoPoolMulti(queries, opts = {}) {
  const merged = [];
  const seen = new Set();
  for (const q of queries) {
    for (const c of await photoPool(q, opts)) {
      if (seen.has(c.id)) continue;
      seen.add(c.id);
      merged.push(c);
    }
    if (uniqueAuthors(merged) >= (opts.needAuthors ?? opts.need ?? 6)) break;
  }
  return spreadByAuthor(merged);
}

/** Download a Pixabay video plus its poster frame. */
async function takeVideo(found, videoAbs, posterBase, { usedFor, posterWidth, posterAlt }) {
  const buf = await fetchBuffer(found.url);
  const src = await saveVideo(buf, videoAbs);
  let poster;
  if (found.posterUrl) {
    try {
      poster = await saveImage(await fetchBuffer(found.posterUrl), posterBase, {
        width: posterWidth,
        alt: posterAlt,
        credit: found.credit,
      });
      credit(poster.src, 'image', `${usedFor} — poster frame`, found.credit);
    } catch (e) {
      warn('Poster frame failed:', e.message);
    }
  }
  credit(src, 'video', usedFor, found.credit);
  log(`    + ${src} — ${found.credit.author} / Pixabay (${found.duration}s, ${found.width}px)`);
  return {
    video: { src, poster: poster?.src, width: found.width, height: found.height, duration: found.duration, credit: found.credit },
    poster,
  };
}

// ── 0. retry any Unsplash download pings we owe from a past run ──
async function queuePing(loc) {
  const list = await readJson(PENDING_PINGS, []);
  if (list.includes(loc)) return;
  list.push(loc);
  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.writeFile(PENDING_PINGS, JSON.stringify(list, null, 2));
}

async function flushPendingPings() {
  const list = await readJson(PENDING_PINGS, []);
  if (!list.length || !unsplash) return;
  log(`\n● Retrying ${list.length} queued Unsplash download ping(s)`);
  const left = [];
  for (const loc of list) {
    const ok = await unsplash.trackDownloadOnce(loc);
    if (!ok) left.push(loc);
  }
  await fs.writeFile(PENDING_PINGS, JSON.stringify(left, null, 2));
  log(`    ${list.length - left.length} sent, ${left.length} still queued`);
}
await flushPendingPings();

// ── 1. hero ─────────────────────────────────────────────────
log('\n● Hero');
{
  const HERO_QUERY = await readHeroQuery();
  const dir = path.join(MEDIA_DIR, 'hero');
  const videoAbs = path.join(dir, 'hero.mp4');
  const posterBase = path.join(dir, 'hero-poster');

  if (fss.existsSync(videoAbs)) {
    const src = publicPath(videoAbs);
    log(`    = ${src} (exists)`);
    const reused = findPrevVideo(src);
    manifest.hero.video = reused ?? { src };
    manifest.hero.poster = prev.hero?.poster ?? null;
    if (reused?.credit) credit(src, 'video', 'Hero background', reused.credit);
    if (manifest.hero.poster?.src) credit(manifest.hero.poster.src, 'image', 'Hero background — poster frame', manifest.hero.poster.credit);
  } else if (pixabay) {
    try {
      const found = await pixabay.videos(HERO_QUERY, { maxDuration: 20, maxWidth: 1920, perPage: 10 });
      if (found) {
        const taken = await takeVideo(found, videoAbs, posterBase, {
          usedFor: 'Hero background',
          posterWidth: 1600,
          posterAlt: 'Studio showreel still',
        });
        manifest.hero.video = taken.video;
        manifest.hero.poster = taken.poster ?? null;
      } else {
        warn(`No suitable hero video for "${HERO_QUERY}".`);
      }
    } catch (e) {
      warn('Hero video failed:', e.message);
    }
  }
}

// ── 2. projects ─────────────────────────────────────────────
const projectList = await readProjects();
for (const p of projectList) {
  log(`\n● ${p.title}  (${p.slug})`);
  const dir = path.join(MEDIA_DIR, p.slug);
  const entry = { cover: undefined, gallery: [], video: undefined };

  const coverBase = path.join(dir, 'cover');
  const galleryBases = [1, 2, 3, 4].map((i) => path.join(dir, `gallery-${i}`));
  const videoAbs = path.join(dir, 'preview.mp4');

  const needPhotos =
    !existingImage(coverBase) ||
    galleryBases.some((b) => !existingImage(b)) ||
    !prev.projects?.[p.slug]?.cover;

  const pool = needPhotos ? await photoPool(p.mediaQuery, { perPage: 24, orientation: 'landscape', need: 5 }) : [];
  if (needPhotos && !pool.length) warn(`No photos found for "${p.mediaQuery}".`);

  const placeholder = (credit) => ({ alt: p.title, credit, url: '', downloadHeaders: {} });

  try {
    if (pool[0] || existingImage(coverBase)) {
      entry.cover = await takePhoto(pool[0] ?? placeholder(prev.projects?.[p.slug]?.cover?.credit), coverBase, {
        width: 1920,
        usedFor: `${p.title} — cover`,
      });
    }
    for (let i = 0; i < 4; i++) {
      const base = galleryBases[i];
      const cand = pool[i + 1];
      if (!cand && !existingImage(base)) continue;
      entry.gallery.push(
        await takePhoto(cand ?? placeholder(prev.projects?.[p.slug]?.gallery?.[i]?.credit), base, {
          width: 1400,
          usedFor: `${p.title} — gallery ${i + 1}`,
        })
      );
    }
  } catch (e) {
    warn('Photos failed:', e.message);
  }

  if (fss.existsSync(videoAbs)) {
    const src = publicPath(videoAbs);
    log(`    = ${src} (exists)`);
    const reused = findPrevVideo(src);
    entry.video = reused ?? { src };
    if (reused?.credit) credit(src, 'video', `${p.title} — preview`, reused.credit);
    if (reused?.poster) credit(reused.poster, 'image', `${p.title} — preview poster frame`, reused.credit);
  } else if (pixabay) {
    try {
      const found = await pixabay.videos(p.videoQuery, { maxDuration: 15, maxWidth: 1280, perPage: 5 });
      if (found) {
        entry.video = (
          await takeVideo(found, videoAbs, path.join(dir, 'preview-poster'), {
            usedFor: `${p.title} — preview`,
            posterWidth: 1280,
            posterAlt: `${p.title} preview still`,
          })
        ).video;
      } else {
        warn(`No suitable video for "${p.videoQuery}".`);
      }
    } catch (e) {
      warn('Video failed:', e.message);
    }
  }

  manifest.projects[p.slug] = entry;
}

// ── 3. team portraits ───────────────────────────────────────
log('\n● Team portraits');
{
  const dir = path.join(MEDIA_DIR, 'team');
  const bases = [1, 2, 3, 4, 5, 6].map((i) => path.join(dir, `member-${i}`));
  const need = bases.some((b) => !existingImage(b)) || (prev.team || []).length < 6;
  const pool = need
    ? await photoPoolMulti(TEAM_QUERIES, { perPage: 12, orientation: 'portrait', width: 1000, need: 6, needAuthors: 6 })
    : [];

  for (let i = 0; i < 6; i++) {
    const base = bases[i];
    const cand = pool[i];
    if (!cand && !existingImage(base)) continue;
    try {
      manifest.team.push(
        await takePhoto(cand ?? { alt: 'Studio portrait', credit: prev.team?.[i]?.credit, url: '', downloadHeaders: {} }, base, {
          width: 900,
          usedFor: `Team portrait ${i + 1}`,
        })
      );
    } catch (e) {
      warn(`Portrait ${i + 1} failed:`, e.message);
    }
  }
}

// ── 4. write manifests ──────────────────────────────────────
const items = [...creditMap.values()]
  .filter((it) => fss.existsSync(path.join(ROOT, 'public', it.file.replace(/^\//, ''))))
  .sort((a, b) => a.file.localeCompare(b.file));

await fs.mkdir(MEDIA_DIR, { recursive: true });
const creditsDoc =
  JSON.stringify(
    {
      generatedAt: manifest.generatedAt,
      notice:
        'All media below was downloaded through the official Unsplash and Pixabay APIs and is used under the licences linked per item. Files are hosted locally, never hotlinked. No media was taken from any studio, agency or portfolio website.',
      sources: [
        { name: 'Unsplash', url: 'https://unsplash.com', license: LICENSES.Unsplash.name, licenseUrl: LICENSES.Unsplash.url },
        { name: 'Pixabay', url: 'https://pixabay.com', license: LICENSES.Pixabay.name, licenseUrl: LICENSES.Pixabay.url },
      ],
      items,
    },
    null,
    2
  ) + '\n';
await fs.writeFile(CREDITS, creditsDoc);
await fs.writeFile(CREDITS_PUBLIC, creditsDoc);
await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');

const imgs = items.filter((i) => i.type === 'image').length;
const vids = items.filter((i) => i.type === 'video').length;
log(`\n✓ ${imgs} images, ${vids} videos credited.`);
log('  content/media.json    → imported by content/site.ts');
log('  content/credits.json  → rendered at /credits');
log('  public/media/credits.json → same list, fetchable directly\n');
