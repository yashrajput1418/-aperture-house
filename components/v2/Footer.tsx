'use client';
import Link from 'next/link';
import { site } from '@/content/site';
import { usePreview } from '@/lib/preview';
import VersionSwitcher from '@/components/ui/VersionSwitcher';

/** A colophon: four ruled columns and a line of small print. */
export default function Footer() {
  const { brand } = usePreview();
  const name = brand.name || site.name;

  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-[90rem] px-6 py-16 sm:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-xl font-bold tracking-tight">
              {name}
              <span className="text-accent">.</span>
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{site.tagline}</p>
          </div>

          <div>
            <p className="font-display text-[0.65rem] uppercase tracking-[0.22em] text-muted">Pages</p>
            <ul className="mt-4 space-y-2 text-sm">
              {site.nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="text-white/80 hover:text-accent">{n.label}</a>
                </li>
              ))}
              <li>
                <Link href="/credits" className="text-white/80 hover:text-accent">Media credits</Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-display text-[0.65rem] uppercase tracking-[0.22em] text-muted">Elsewhere</p>
            <ul className="mt-4 space-y-2 text-sm">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="text-white/80 hover:text-accent">{s.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-display text-[0.65rem] uppercase tracking-[0.22em] text-muted">Studio</p>
            <div className="mt-4 space-y-2 text-sm">
              <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="block text-white/80 hover:text-accent">
                {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="block text-white/80 hover:text-accent">{site.email}</a>
              <p className="leading-relaxed text-muted">{site.location}</p>
            </div>
            <div className="mt-6">
              <VersionSwitcher current={2} tone="bare" align="left" />
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-xs text-muted">
          <p>© {new Date().getFullYear()} {name}. All rights reserved.</p>
          <a href="#top" className="hover:text-white">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
