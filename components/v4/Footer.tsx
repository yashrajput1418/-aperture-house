'use client';
import Link from 'next/link';
import { site } from '@/content/site';
import { usePreview } from '@/lib/preview';
import VersionSwitcher from '@/components/ui/VersionSwitcher';

/** A single thin bar — the archive does not need a grand ending. */
export default function Footer() {
  const { brand } = usePreview();
  const name = brand.name || site.name;

  return (
    <footer className="border-t border-line px-5 py-6 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 text-xs">
        <p className="text-muted">
          © {new Date().getFullYear()} {name}. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {site.socials.map((s) => (
            <a key={s.label} href={s.href} className="text-muted hover:text-accent">{s.label}</a>
          ))}
          <Link href="/credits" className="text-muted hover:text-accent">Credits</Link>
          <Link href="/docs" className="text-muted hover:text-accent">Docs</Link>
          <a href="#top" className="text-muted hover:text-accent">Top ↑</a>
          <VersionSwitcher current={4} tone="bare" />
        </div>
      </div>
    </footer>
  );
}
