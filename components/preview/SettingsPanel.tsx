'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { site } from '@/content/site';
import { usePreview, type CaseLayout, type HomeLayout, type LogoMark } from '@/lib/preview';
import { useScrollLock } from '@/lib/scrollLock';
import { Aperture, Frame, Lens, Monogram } from './BrandMarks';

const HOME_LAYOUTS: { id: HomeLayout; label: string; note: string }[] = [
  { id: 'collage', label: 'Collage', note: 'Drifting contact sheet + pinned work rail' },
  { id: 'editorial', label: 'Editorial', note: 'Big type, work as a list, image follows cursor' },
  { id: 'cinematic', label: 'Cinematic', note: 'Showreel hero, full-screen snap panels' },
  { id: 'grid', label: 'Grid', note: 'Gallery-first archive with a sticky side nav' },
];

const CASE_LAYOUTS: { id: CaseLayout; label: string; note: string }[] = [
  { id: 'editorial', label: 'Editorial', note: 'Full-bleed hero, sticky deliverables rail' },
  { id: 'split', label: 'Split', note: 'Pinned info column, scrolling image stream' },
  { id: 'index', label: 'Index', note: 'Narrow measure broken by full-bleed frames' },
  { id: 'reel', label: 'Reel', note: 'Horizontal spine you drive with the wheel' },
];

const MARKS: { id: LogoMark; label: string }[] = [
  { id: 'aperture', label: 'Aperture' },
  { id: 'lens', label: 'Lens' },
  { id: 'frame', label: 'Frame' },
  { id: 'monogram', label: 'Monogram' },
];

/** 400KB — localStorage caps out around 5MB and a data URL is ~33% bigger than the file. */
const MAX_LOGO_BYTES = 400 * 1024;

export default function SettingsPanel() {
  const { brand, editable, set, reset, shareUrl } = usePreview();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  // freeze the page behind the sheet (stops Lenis, not just body overflow)
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  if (!editable) return null;

  const onLogo = (file?: File) => {
    setLogoError(null);
    if (!file) return;
    if (!/^image\/(png|jpeg|svg\+xml|webp)$/.test(file.type)) {
      setLogoError('PNG, JPG, SVG or WebP only.');
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError(`Too large — keep it under ${Math.round(MAX_LOGO_BYTES / 1024)}KB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => set({ mark: 'custom', logoSrc: String(reader.result) });
    reader.onerror = () => setLogoError('Could not read that file.');
    reader.readAsDataURL(file);
  };

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setLogoError('Clipboard blocked — copy the URL from the address bar.');
    }
  };

  const markPreview = (id: LogoMark) => {
    const cls = 'h-7 w-7';
    if (id === 'aperture') return <Aperture className={cls} />;
    if (id === 'lens') return <Lens className={cls} />;
    if (id === 'frame') return <Frame className={cls} />;
    return <Monogram className={cls} name={brand.name} />;
  };

  const row = 'mb-2.5 font-display text-xs uppercase tracking-[0.2em] text-muted';
  const chip = (active: boolean) =>
    `rounded-xl border px-3 py-2 text-left text-sm transition ${
      active ? 'border-accent bg-accent/10 text-white' : 'border-line text-muted hover:border-white/30 hover:text-white'
    }`;

  return (
    <>
      {/* opens the panel; hidden while it is up so it cannot sit on the footer buttons */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-label="Brand and layout settings"
        className={`fixed bottom-6 right-6 z-[90] flex h-14 w-14 items-center justify-center rounded-full border border-line bg-ink/80 text-xl text-accent shadow-2xl backdrop-blur transition hover:border-accent hover:bg-accent hover:text-ink ${
          open ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
        ⚙
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: '110%' }}
            animate={{ x: 0 }}
            exit={{ x: '110%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 32 }}
            className="fixed bottom-0 right-0 top-0 z-[89] flex w-full max-w-sm flex-col overscroll-contain border-l border-line bg-ink-2/95 backdrop-blur-xl"
            aria-label="Brand settings"
            data-lenis-prevent
          >
            <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
              <div>
                <p className="font-display text-lg font-semibold">Try your brand</p>
                <p className="mt-1 text-sm text-muted">
                  Everything here is local to your browser. Nothing is saved to the site.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close settings"
                className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-sm transition hover:border-white/40"
              >
                ✕
              </button>
            </header>

            {/* data-lenis-prevent keeps the smooth-scroll engine off this
                element; overscroll-contain stops the page scrolling once the
                sheet reaches its ends. */}
            <div
              data-lenis-prevent
              className="flex-1 space-y-8 overflow-y-auto overscroll-contain px-6 py-6"
            >
              <div>
                <p className={row}>Studio name</p>
                <input
                  value={brand.name}
                  onChange={(e) => set({ name: e.target.value })}
                  placeholder="Your studio"
                  className="w-full rounded-xl border border-line bg-ink px-4 py-3 outline-none transition focus:border-accent"
                />
              </div>

              <div>
                <p className={row}>Accent</p>
                <div className="flex flex-wrap gap-2">
                  {site.preview.accents.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => set({ accent: c })}
                      aria-label={`Accent ${c}`}
                      style={{ background: c }}
                      className={`h-9 w-9 rounded-full border-2 transition ${
                        brand.accent.toLowerCase() === c.toLowerCase() ? 'border-white' : 'border-transparent hover:border-white/40'
                      }`}
                    />
                  ))}
                  <label className="flex h-9 cursor-pointer items-center gap-2 rounded-full border border-line px-3 text-xs text-muted transition hover:border-white/40 hover:text-white">
                    Custom
                    <input
                      type="color"
                      value={brand.accent}
                      onChange={(e) => set({ accent: e.target.value })}
                      className="h-5 w-5 cursor-pointer border-0 bg-transparent p-0"
                    />
                  </label>
                </div>
              </div>

              <div>
                <p className={row}>Background</p>
                <div className="grid grid-cols-2 gap-2">
                  {site.preview.grounds.map((g) => (
                    <button
                      key={g.label}
                      type="button"
                      onClick={() => set({ ink: g.ink, ink2: g.ink2 })}
                      className={`${chip(brand.ink === g.ink)} flex items-center gap-3`}
                    >
                      <span className="h-5 w-5 shrink-0 rounded-full border border-white/20" style={{ background: g.ink }} />
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className={row}>Logo</p>
                <div className="grid grid-cols-4 gap-2">
                  {MARKS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => set({ mark: m.id })}
                      aria-label={m.label}
                      className={`flex flex-col items-center gap-2 rounded-xl border px-2 py-3 text-[0.65rem] transition ${
                        brand.mark === m.id ? 'border-accent bg-accent/10 text-accent' : 'border-line text-muted hover:border-white/30'
                      }`}
                    >
                      {markPreview(m.id)}
                      {m.label}
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInput.current?.click()}
                    className={`${chip(brand.mark === 'custom')} flex-1`}
                  >
                    {brand.mark === 'custom' && brand.logoSrc ? 'Replace your logo' : 'Upload your logo'}
                  </button>
                  {brand.mark === 'custom' && brand.logoSrc && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={brand.logoSrc} alt="" className="h-10 w-10 rounded-lg border border-line object-contain p-1" />
                  )}
                </div>
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  onChange={(e) => onLogo(e.target.files?.[0])}
                  className="hidden"
                />
                {logoError && <p className="mt-2 text-xs text-rose-400">{logoError}</p>}
              </div>

              <div>
                <p className={row}>Home layout</p>
                <div className="space-y-2">
                  {HOME_LAYOUTS.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => set({ homeLayout: l.id })}
                      className={`${chip(brand.homeLayout === l.id)} block w-full`}
                    >
                      <span className="font-display font-semibold">{l.label}</span>
                      <span className="mt-0.5 block text-xs text-muted">{l.note}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className={row}>Case-study layout</p>
                <div className="space-y-2">
                  {CASE_LAYOUTS.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => set({ caseLayout: l.id })}
                      className={`${chip(brand.caseLayout === l.id)} block w-full`}
                    >
                      <span className="font-display font-semibold">{l.label}</span>
                      <span className="mt-0.5 block text-xs text-muted">{l.note}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <footer className="flex gap-3 border-t border-line px-6 py-5">
              <button
                type="button"
                onClick={copyShare}
                className="flex-1 rounded-full bg-accent px-5 py-3 font-display text-sm font-semibold text-ink transition"
              >
                {copied ? 'Link copied' : 'Copy share link'}
              </button>
              <button
                type="button"
                onClick={reset}
                className="rounded-full border border-line px-5 py-3 font-display text-sm font-semibold transition hover:border-white/40"
              >
                Reset
              </button>
            </footer>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
