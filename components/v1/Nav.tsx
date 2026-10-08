'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { site } from '@/content/site';
import Logo from '@/components/ui/Logo';
import VersionSwitcher from '@/components/ui/VersionSwitcher';

/** Version 1: a floating pill that tightens onto the page as you scroll. */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-6'}`}>
      <div className={`mx-4 flex items-center justify-between gap-4 rounded-full px-5 py-3 transition-all duration-500 sm:mx-8 ${scrolled ? 'border border-line bg-ink/70 backdrop-blur-xl' : ''}`}>
        <a href="#top" aria-label={site.name}>
          <Logo />
        </a>
        <nav className="hidden items-center gap-8 lg:flex">
          {site.nav.map((n) => (
            <a key={n.href} href={n.href} className="group relative text-sm text-muted transition-colors hover:text-white">
              {n.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <VersionSwitcher current={1} className="hidden sm:block" />
          <a href="#contact" className="hidden rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-accent lg:inline-block">
            Start a project
          </a>
          <button aria-label="Menu" onClick={() => setOpen(!open)} className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 lg:hidden">
            <span className={`h-px w-6 bg-white transition ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
            <span className={`h-px w-6 bg-white transition ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="mx-4 mt-2 flex flex-col gap-1 rounded-3xl border border-line bg-ink-2/95 p-4 backdrop-blur-xl lg:hidden"
          >
            {site.nav.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 font-display text-2xl hover:bg-white/5">
                {n.label}
              </a>
            ))}
            <div className="mt-2 border-t border-line px-4 pt-4 sm:hidden">
              <VersionSwitcher current={1} tone="block" align="left" />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
