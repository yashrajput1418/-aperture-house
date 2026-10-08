'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { enabledVersions, homeHref, showSwitcher, versionMeta, type Version } from '@/lib/version';

/**
 * Switches between the four site versions. Every entry is a real link to
 * that version's home page, so the choice is shareable and the browser
 * back button works.
 *
 * It lists only the versions `site.versions.enabled` names, and renders
 * nothing at all when there is one version live or the dropdown is
 * switched off — so a single-layout site needs no edits to its navbars.
 *
 * `tone` only changes the trigger's chrome — each version's navbar has a
 * different ground to sit on.
 */
export default function VersionSwitcher({
  current,
  tone = 'pill',
  align = 'right',
  className = '',
}: {
  current: Version;
  tone?: 'pill' | 'bare' | 'block';
  align?: 'left' | 'right';
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const versions = enabledVersions;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!showSwitcher) return null;

  const trigger =
    tone === 'pill'
      ? 'rounded-full border border-line bg-white/5 px-4 py-2 backdrop-blur hover:border-white/40'
      : tone === 'block'
        ? 'w-full justify-between rounded-xl border border-line px-4 py-3 hover:border-white/40'
        : 'gap-2 border-b border-line pb-1 hover:border-white/50';

  return (
    <div ref={wrap} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`flex items-center gap-2 font-display text-sm transition ${trigger}`}
      >
        <span className="text-muted">Layout</span>
        <span className="font-semibold text-accent">{versionMeta[current].label}</span>
        <span aria-hidden className={`text-xs transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {/* The menu stays mounted so the four versions are real links in the
          HTML — a crawler and a no-JS visitor can still reach them. */}
      <motion.div
        role="menu"
        aria-hidden={!open}
        initial={false}
        animate={open ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className={`absolute top-[calc(100%+0.6rem)] z-50 w-64 overflow-hidden rounded-2xl border border-line bg-ink-2/95 p-1.5 shadow-2xl backdrop-blur-xl ${
          align === 'right' ? 'right-0' : 'left-0'
        } ${open ? '' : 'pointer-events-none'}`}
      >
        {versions.map((v) => {
          const m = versionMeta[v];
          const active = v === current;
          return (
            <Link
              key={v}
              href={homeHref(v)}
              role="menuitem"
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className={`block rounded-xl px-3.5 py-3 transition ${
                active ? 'bg-accent/10' : 'hover:bg-white/5'
              }`}
            >
              <span className="flex items-baseline justify-between gap-3">
                <span className={`font-display text-sm font-semibold ${active ? 'text-accent' : ''}`}>
                  {m.label} — {m.name}
                </span>
                {active && <span className="text-xs text-accent">current</span>}
              </span>
              <span className="mt-1 block text-xs leading-snug text-muted">{m.note}</span>
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
}
