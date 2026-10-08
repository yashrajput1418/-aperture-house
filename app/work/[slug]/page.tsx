import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { projects, site } from '@/content/site';
import { parseVersion } from '@/lib/version';
import { caseFor } from '@/components/layouts/versionHomes';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return { title: site.name };
  return {
    title: `${p.title} — ${site.name}`,
    description: p.summary,
    openGraph: {
      title: `${p.title} — ${site.name}`,
      description: p.summary,
      images: p.cover ? [{ url: p.cover.src }] : undefined,
    },
  };
}

/**
 * One case study, drawn in the layout of whichever version the visitor is
 * browsing: `?v=2`, `?v=3`, `?v=4`, with the default version on the bare
 * URL. A `?v=` naming a version that `site.versions` has switched off
 * falls back to the default rather than 404ing — the shoot still exists.
 */
export default async function CaseStudy({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ v?: string | string[] }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const idx = projects.findIndex((x) => x.slug === slug);
  if (idx < 0) notFound();

  const { default: Case } = await caseFor[parseVersion(query.v)]();

  return <Case p={projects[idx]} next={projects[(idx + 1) % projects.length]} />;
}
