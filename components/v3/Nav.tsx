'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { site } from '@/content/site';
import Logo from '@/components/ui/Logo';
import VersionSwitcher from '@/components/ui/VersionSwitcher';

/**
 * Version 3 overlays the film: no bar, no backdrop, just marks sitting on
 * the footage. A ground fades in once the hero has passed so the links stay
 * readable over lighter frames.
 */
export default function Nav() {
  const [past, setPast] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setPast(window.scrollY > window.innerHeight * 0.75);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-700 ${
        past ? 'bg-ink/70 backdrop-blur-xl' : 'bg-gradient-to-b from-ink/70 to-transparent'
      }`}
    >
      <div className="flex items-center justify-between gap-6 px-6 py-5 sm:px-10">
        <a href="#top" aria-label={site.name}>
          <Logo showWordmark={false} markClassName="h-8 w-8 text-accent" />
        </a>

        <nav className="hidden items-center gap-10 md:flex">
          {site.nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="font-display text-xs uppercase tracking-[0.28em] text-white/70 transition-colors hover:text-accent"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <VersionSwitcher current={3} className="hidden sm:block" />
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="font-display text-xs uppercase tracking-[0.28em] md:hidden"
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-ink/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 pb-6 pt-2">
              {site.nav.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="py-3 text-center font-display text-3xl"
                >
                  {n.label}
                </a>
              ))}
              <div className="mt-4 sm:hidden">
                <VersionSwitcher current={3} tone="block" align="left" />
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
