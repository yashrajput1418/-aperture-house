// ─────────────────────────────────────────────────────────────
//  Generated media manifest (do not edit by hand).
//
//  `content/media.json` is written by `npm run fetch:media`
//  (scripts/fetch-media.mjs). It maps every project slug to the
//  free-licensed Unsplash / Pixabay files that were downloaded
//  into `public/media/`.
//
//  The site works with an empty manifest: components fall back to
//  the generated gradient artwork, so you can build and deploy
//  before ever running the fetch script.
// ─────────────────────────────────────────────────────────────
import manifest from './media.json';

export type MediaImage = {
  src: string;
  width: number;
  height: number;
  /** tiny base64 WebP used as a next/image blur placeholder */
  blurDataURL?: string;
  alt?: string;
  credit?: MediaCredit;
};

export type MediaVideo = {
  src: string;
  poster?: string;
  width?: number;
  height?: number;
  duration?: number;
  credit?: MediaCredit;
};

export type MediaCredit = {
  source: 'Unsplash' | 'Pixabay';
  author: string;
  authorUrl: string;
  sourceUrl: string;
  license: string;
};

export type ProjectMedia = {
  cover?: MediaImage;
  gallery?: MediaImage[];
  video?: MediaVideo;
};

export type MediaManifest = {
  generatedAt: string | null;
  hero: { video?: MediaVideo | null; poster?: MediaImage | null };
  projects: Record<string, ProjectMedia | undefined>;
  team: MediaImage[];
};

export const media = manifest as unknown as MediaManifest;

export const projectMedia = (slug: string): ProjectMedia => media.projects?.[slug] ?? {};
export const heroVideo = (): MediaVideo | undefined => media.hero?.video ?? undefined;
export const heroPoster = (): MediaImage | undefined => media.hero?.poster ?? undefined;
export const teamPortrait = (i: number): MediaImage | undefined => media.team?.[i];
export const hasMedia = (): boolean => Boolean(media.generatedAt);
