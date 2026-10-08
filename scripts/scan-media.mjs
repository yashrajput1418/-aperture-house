#!/usr/bin/env node
/**
 * scan-media.mjs — build content/media.json from files you put in
 * public/media yourself. No API keys, no network, no accounts.
 *
 *   npm run scan:media
 *
 * This is the manual counterpart to `npm run fetch:media`: instead of
 * downloading free-licensed stock from Unsplash / Pixabay, it reads whatever
 * is already on disk and writes the manifest the site imports.
 *
 * Expected layout (every file optional — missing ones fall back to the
 * generated gradient artwork):
 *
 *   public/media/<project-slug>/cover.(webp|jpg|jpeg|png|avif)
 *   public/media/<project-slug>/gallery-1..N.(webp|jpg|…)      N is open-ended
 *   public/media/<project-slug>/preview.mp4                    hover + case film
 *   public/media/<project-slug>/preview-poster.(webp|jpg|…)
 *   public/media/hero/hero.mp4                                 showreel
 *   public/media/hero/hero-poster.(webp|jpg|…)
 *   public/media/team/member-1..N.(webp|jpg|…)                 in `team` order
 *
 * `<project-slug>` must match a slug in content/site.ts.
 *
 * Alt text: put a sibling .txt next to an image (cover.txt, gallery-3.txt)
 * and its contents become that image's alt text. Otherwise the project
 * title or a frame number is used at render time.
 *
 * `sharp` (already a devDependency) is used to read real pixel dimensions
 * and to generate blur placeholders. Without it the manifest is still
 * written, but galleries need width/height — so install it if a gallery
 * image fails to render.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MEDIA_DIR = path.join(ROOT, 'public', 'media');
const MANIFEST = path.join(ROOT, 'content', 'media.json');
const SITE_TS = path.join(ROOT, 'content', 'site.ts');

const IMAGE_EXT = ['.webp', '.avif', '.jpg', '.jpeg', '.png'];
const log = (...a) => console.log(...a);
const warn = (...a) => console.warn('  !', ...a);

let sharp = null;
try {
  sharp = (await import('sharp')).default;
} catch {
  warn('sharp not installed — no dimensions or blur placeholders.');
  warn('  npm i -D sharp   (then re-run) so gallery images can render.');
}

/** Slugs come from content/site.ts, so the manifest can never drift from it. */
async function readSlugs() {
  const src = await fs.readFile(SITE_TS, 'utf8');
  return [...src.matchAll(/^\s{4}slug:\s*'([^']+)'/gm)].map((m) => m[1]);
}

const exists = async (p) => {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
};

/** First file matching `<dir>/<base>.<ext>` for any supported image type. */
async function findImage(dir, base) {
  for (const ext of IMAGE_EXT) {
    const file = path.join(dir, base + ext);
    if (await exists(file)) return file;
  }
  return null;
}

/** Sibling `<base>.txt` is used as alt text when present. */
async function readAlt(file) {
  try {
    const txt = await fs.readFile(file.replace(/\.[^.]+$/, '.txt'), 'utf8');
    const alt = txt.trim();
    return alt || undefined;
  } catch {
    return undefined;
  }
}

/** `/media/...` is how the site references a file under public/. */
const toSrc = (file) => '/' + path.relative(path.join(ROOT, 'public'), file).split(path.sep).join('/');

async function describeImage(file) {
  if (!file) return undefined;
  const out = { src: toSrc(file) };
  const alt = await readAlt(file);
  if (alt) out.alt = alt;

  if (!sharp) return out;
  try {
    const img = sharp(file);
    const meta = await img.metadata();
    out.width = meta.width;
    out.height = meta.height;
    // 20px wide WebP, inlined — next/image shows it while the real file loads
    const blur = await sharp(file).resize(20).webp({ quality: 45 }).toBuffer();
    out.blurDataURL = `data:image/webp;base64,${blur.toString('base64')}`;
  } catch (e) {
    warn(`could not read ${path.basename(file)}: ${e.message}`);
  }
  return out;
}

/** gallery-1, gallery-2, … in numeric order, stopping at the first gap. */
async function describeGallery(dir) {
  const out = [];
  for (let i = 1; ; i++) {
    const file = await findImage(dir, `gallery-${i}`);
    if (!file) break;
    out.push(await describeImage(file));
  }
  return out;
}

async function describeVideo(dir, base) {
  const file = path.join(dir, `${base}.mp4`);
  if (!(await exists(file))) return undefined;
  const poster = await findImage(dir, `${base}-poster`);
  const out = { src: toSrc(file) };
  if (poster) out.poster = toSrc(poster);
  return out;
}

async function main() {
  if (!(await exists(MEDIA_DIR))) {
    console.error(`No ${path.relative(ROOT, MEDIA_DIR)} directory — create it and add your images first.`);
    process.exit(1);
  }

  const slugs = await readSlugs();
  log(`Scanning public/media for ${slugs.length} shoots…\n`);

  const projects = {};
  let found = 0;

  for (const slug of slugs) {
    const dir = path.join(MEDIA_DIR, slug);
    if (!(await exists(dir))) {
      log(`  ·  ${slug} — no folder, will use gradient artwork`);
      continue;
    }
    const cover = await describeImage(await findImage(dir, 'cover'));
    const gallery = await describeGallery(dir);
    const video = await describeVideo(dir, 'preview');

    const entry = {};
    if (cover) entry.cover = cover;
    if (gallery.length) entry.gallery = gallery;
    if (video) entry.video = video;

    if (Object.keys(entry).length) {
      projects[slug] = entry;
      found++;
      log(`  ✓  ${slug} — ${cover ? 'cover' : 'no cover'}, ${gallery.length} frames${video ? ', film' : ''}`);
    } else {
      log(`  ·  ${slug} — folder is empty`);
    }
  }

  // hero showreel + its still
  const heroDir = path.join(MEDIA_DIR, 'hero');
  const hero = { video: null, poster: null };
  if (await exists(heroDir)) {
    hero.video = (await describeVideo(heroDir, 'hero')) ?? null;
    hero.poster = (await describeImage(await findImage(heroDir, 'hero-poster'))) ?? null;
    log(`\n  ${hero.video || hero.poster ? '✓' : '·'}  hero — ${hero.video ? 'showreel' : 'no showreel'}${hero.poster ? ' + still' : ''}`);
  }

  // studio portraits, in the order `team` is written in site.ts
  const teamDir = path.join(MEDIA_DIR, 'team');
  const team = [];
  if (await exists(teamDir)) {
    for (let i = 1; ; i++) {
      const file = await findImage(teamDir, `member-${i}`);
      if (!file) break;
      team.push(await describeImage(file));
    }
    log(`  ${team.length ? '✓' : '·'}  team — ${team.length} portraits`);
  }

  const manifest = { generatedAt: new Date().toISOString(), hero, projects, team };
  await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');

  log(`\nWrote ${path.relative(ROOT, MANIFEST)} — ${found} shoots, ${team.length} portraits.`);
  if (!sharp) warn('No dimensions were written: install sharp and re-run before deploying.');
  log('Your own files need no credits page entry — content/credits.json only lists stock downloads.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
