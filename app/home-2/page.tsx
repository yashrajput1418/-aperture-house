import type { Metadata } from 'next';
import Home from '@/components/v2/Home';
import { site } from '@/content/site';
import { versionMeta } from '@/lib/version';

export const metadata: Metadata = {
  title: `${site.name} — ${versionMeta[2].label}: ${versionMeta[2].name}`,
  description: site.description,
};

export default function Page() {
  return <Home />;
}
