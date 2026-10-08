import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { projects, site } from '@/content/site';
import { parseVersion } from '@/lib/version';
import Case1 from '@/components/v1/Case';
import Case2 from '@/components/v2/Case';
import Case3 from '@/components/v3/Case';
import Case4 from '@/components/v4/Case';

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
 * browsing: `?v=2`, `?v=3`, `?v=4`, with version 1 as the bare URL.
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

  const p = projects[idx];
  const next = projects[(idx + 1) % projects.length];

  switch (parseVersion(query.v)) {
    case 2:
      return <Case2 p={p} next={next} />;
    case 3:
      return <Case3 p={p} next={next} />;
    case 4:
      return <Case4 p={p} next={next} />;
    default:
      return <Case1 p={p} next={next} />;
  }
}
