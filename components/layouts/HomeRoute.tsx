import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { site } from '@/content/site';
import { defaultVersion, isEnabled, versionMeta, type Version } from '@/lib/version';
import { homeFor } from './versionHomes';

/**
 * The `/home-2`, `/home-3` and `/home-4` routes all go through here, so
 * `site.versions` is the single thing that decides what exists:
 *
 *  - version switched off → 404, as if the route were never written
 *  - version is the default → redirect to `/`, which already renders it,
 *    so one layout never answers on two URLs
 */
export async function HomeRoute({ version }: { version: Version }) {
  if (!isEnabled(version)) notFound();
  if (version === defaultVersion) redirect('/');

  const { default: Home } = await homeFor[version]();
  return <Home />;
}

export function homeMetadata(version: Version): Metadata {
  const m = versionMeta[version];
  return {
    title: `${site.name} — ${m.label}: ${m.name}`,
    description: site.description,
  };
}
