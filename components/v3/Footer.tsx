'use client';
import Link from 'next/link';
import { site } from '@/content/site';
import { usePreview } from '@/lib/preview';
import Logo from '@/components/ui/Logo';
import VersionSwitcher from '@/components/ui/VersionSwitcher';

/** End credits: centred, quiet, one line of links. */
export default function Footer() {
  const { brand } = usePreview();
  const name = brand.name || site.name;

  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-5xl px-6 py-20 text-center sm:px-10">
        <Logo className="justify-center" markClassName="h-9 w-9 text-accent" showWordmark={false} />
        <p className="mt-8 font-display text-4xl font-bold tracking-tight sm:text-6xl">{name}</p>
        <p className="mx-auto mt-5 max-w-md leading-relaxed text-muted">{site.tagline} {site.location}.</p>

        <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
          {site.nav.map((n) => (
            <a key={n.href} href={n.href} className="text-white/70 hover:text-accent">{n.label}</a>
          ))}
          {site.socials.map((s) => (
            <a key={s.label} href={s.href} className="text-white/70 hover:text-accent">{s.label}</a>
          ))}
          <Link href="/credits" className="text-white/70 hover:text-accent">Media credits</Link>
          <Link href="/docs" className="text-white/70 hover:text-accent">Setup docs</Link>
        </div>

        <div className="mt-10 flex justify-center">
          <VersionSwitcher current={3} />
        </div>

        <p className="mt-12 text-xs text-muted">
          © {new Date().getFullYear()} {name}. All rights reserved. ·{' '}
          <a href="#top" className="hover:text-white">Back to top ↑</a>
        </p>
      </div>
    </footer>
  );
}
