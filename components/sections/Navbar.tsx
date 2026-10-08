'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { site } from '@/content/site';
import Logo from '@/components/ui/Logo';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-6'}`}>
      <div className={`mx-4 flex items-center justify-between rounded-full px-5 py-3 transition-all duration-500 sm:mx-8 ${scrolled ? 'border border-line bg-ink/70 backdrop-blur-xl' : ''}`}>
        <a href="#top" aria-label={site.name}>
          <Logo />
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {site.nav.map((n) => (
            <a key={n.href} href={n.href} className="group relative text-sm text-muted transition-colors hover:text-white">
              {n.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <a href="#contact" className="hidden rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-accent md:inline-block">
          Start a project
        </a>
        <button aria-label="Menu" onClick={() => setOpen(!open)} className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden">
          <span className={`h-px w-6 bg-white transition ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
          <span className={`h-px w-6 bg-white transition ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="mx-4 mt-2 flex flex-col gap-1 rounded-3xl border border-line bg-ink-2/95 p-4 backdrop-blur-xl md:hidden"
          >
            {site.nav.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 font-display text-2xl hover:bg-white/5">
                {n.label}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
