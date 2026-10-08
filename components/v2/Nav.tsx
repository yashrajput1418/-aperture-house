'use client';
import { useState } from 'react';
import { site } from '@/content/site';
import Logo from '@/components/ui/Logo';
import VersionSwitcher from '@/components/ui/VersionSwitcher';

/**
 * Version 2: a masthead. It stays in the flow of the page rather than
 * floating over it, and the only ornament is the rule underneath.
 */
export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-6 px-6 py-4 sm:px-10">
        <a href="#top" aria-label={site.name} className="shrink-0">
          <Logo markClassName="h-6 w-6 text-accent" />
        </a>

        <nav className="hidden flex-1 justify-center gap-10 lg:flex">
          {site.nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="font-display text-[0.7rem] uppercase tracking-[0.22em] text-muted transition-colors hover:text-accent"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-5">
          <VersionSwitcher current={2} tone="bare" className="hidden sm:block" />
          <a
            href="#contact"
            className="hidden font-display text-[0.7rem] uppercase tracking-[0.22em] text-accent underline decoration-accent/40 decoration-1 underline-offset-[6px] hover:decoration-accent sm:inline-block"
          >
            Check a date
          </a>
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="font-display text-[0.7rem] uppercase tracking-[0.22em] lg:hidden"
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line lg:hidden">
          {site.nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="block border-b border-line px-6 py-4 font-display text-xl sm:px-10"
            >
              {n.label}
            </a>
          ))}
          <div className="px-6 py-4 sm:hidden sm:px-10">
            <VersionSwitcher current={2} tone="block" align="left" />
          </div>
        </nav>
      )}
    </header>
  );
}
