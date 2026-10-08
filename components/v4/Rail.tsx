'use client';
import { site } from '@/content/site';
import Logo from '@/components/ui/Logo';
import VersionSwitcher from '@/components/ui/VersionSwitcher';

/**
 * Version 4 has no top bar at all: navigation lives in a rail pinned to
 * the left of the archive, and collapses to a single scrollable row of
 * links on phones.
 */
export default function Rail() {
  return (
    <aside className="z-30 border-b border-line bg-ink/90 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-6 px-5 py-4 lg:h-full lg:flex-col lg:items-stretch lg:justify-start lg:px-7 lg:py-8">
        <a href="#top" className="shrink-0">
          <Logo markClassName="h-6 w-6 text-accent" />
        </a>

        <nav className="hidden lg:mt-14 lg:block">
          <p className="font-display text-[0.6rem] uppercase tracking-[0.25em] text-muted">Index</p>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {site.nav.map((n, i) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  className="group flex items-baseline gap-3 py-2.5 font-display text-sm transition-colors hover:text-accent"
                >
                  <span className="text-[0.6rem] text-muted">{String(i + 1).padStart(2, '0')}</span>
                  {n.label}
                  <span className="ml-auto text-accent opacity-0 transition-opacity group-hover:opacity-100">→</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden lg:mt-auto lg:block">
          <VersionSwitcher current={4} tone="block" align="left" />
          <div className="mt-6 space-y-1 text-xs leading-relaxed text-muted">
            <a href={`mailto:${site.email}`} className="block hover:text-accent">{site.email}</a>
            <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="block hover:text-accent">{site.phone}</a>
            <p>{site.location}</p>
          </div>
          <a
            href="#contact"
            className="mt-5 block border border-accent px-4 py-2.5 text-center font-display text-sm font-semibold text-accent transition hover:bg-accent hover:text-ink"
          >
            Check your date
          </a>
        </div>

        {/* phones: the index becomes a scrollable row */}
        <nav className="-mx-5 flex gap-5 overflow-x-auto px-5 lg:hidden [scrollbar-width:none]">
          {site.nav.map((n) => (
            <a key={n.href} href={n.href} className="whitespace-nowrap text-sm text-muted hover:text-white">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="shrink-0 lg:hidden">
          <VersionSwitcher current={4} />
        </div>
      </div>
    </aside>
  );
}
