import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { projects, site } from '@/content/site';
import CaseRouter from '@/components/layouts/CaseRouter';

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

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const idx = projects.findIndex((x) => x.slug === slug);
  if (idx < 0) notFound();

  return <CaseRouter p={projects[idx]} next={projects[(idx + 1) % projects.length]} />;
}
