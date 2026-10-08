import type { Metadata } from 'next';
import Home from '@/components/v3/Home';
import { site } from '@/content/site';
import { versionMeta } from '@/lib/version';

export const metadata: Metadata = {
  title: `${site.name} — ${versionMeta[3].label}: ${versionMeta[3].name}`,
  description: site.description,
};

export default function Page() {
  return <Home />;
}
