import type { Metadata } from 'next';
import Home from '@/components/v4/Home';
import { site } from '@/content/site';
import { versionMeta } from '@/lib/version';

export const metadata: Metadata = {
  title: `${site.name} — ${versionMeta[4].label}: ${versionMeta[4].name}`,
  description: site.description,
};

export default function Page() {
  return <Home />;
}
