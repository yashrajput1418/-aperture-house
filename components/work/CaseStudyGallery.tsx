'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import SafeImage from '@/components/ui/SafeImage';
import { AnimatePresence, motion } from 'framer-motion';
import type { MediaImage } from '@/content/media';
import { useScrollLock } from '@/lib/scrollLock';

/**
 * Masonry gallery + lightbox.
 * Keyboard: ← → to move, Esc to close. Touch: swipe left / right.
 */
export default function CaseStudyGallery({ images, title }: { images: MediaImage[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);

  const close = useCallback(() => {
    setOpen(null);
    opener.current?.focus();
  }, []);
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + images.length) % images.length)),
    [images.length]
  );

  // freezes Lenis too — body overflow alone does not stop the smooth scroller
  useScrollLock(open !== null);

  useEffect(() => {
    if (open === null) return;
    dialog.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close, step]);

  if (!images.length) return null;
  const current = open === null ? null : images[open];

  return (
    <>
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={(e) => {
              opener.current = e.currentTarget;
              setOpen(i);
            }}
            aria-label={`Open image ${i + 1} of ${images.length}`}
            className="group relative block w-full overflow-hidden rounded-2xl border border-line break-inside-avoid"
          >
            <SafeImage
              src={img.src}
              alt={img.alt ? `${title} — ${img.alt}` : `${title} — image ${i + 1}`}
              width={img.width}
              height={img.height}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              placeholder={img.blurDataURL ? 'blur' : 'empty'}
              blurDataURL={img.blurDataURL}
              className="h-auto w-full transition-transform duration-700 group-hover:scale-105"
              placeholderLabel={title}
              placeholderClassName="aspect-[4/3]"
            />
            <span className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/20" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-label={`${title} gallery`}
            tabIndex={-1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
              touchX.current = null;
            }}
            data-lenis-prevent
            className="fixed inset-0 z-[70] flex items-center justify-center overscroll-contain bg-ink/95 p-4 outline-none backdrop-blur-sm sm:p-10"
          >
            <motion.div
              key={current.src}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-full w-full max-w-5xl"
            >
              <SafeImage
                src={current.src}
                alt={current.alt ? `${title} — ${current.alt}` : title}
                width={current.width}
                height={current.height}
                sizes="100vw"
                placeholder={current.blurDataURL ? 'blur' : 'empty'}
                blurDataURL={current.blurDataURL}
                className="mx-auto h-auto max-h-[80vh] w-auto rounded-xl object-contain"
                placeholderLabel={title}
                placeholderClassName="aspect-[4/3] rounded-xl"
              />
              {current.credit && (
                <p className="mt-3 text-center text-xs text-muted">
                  Photo:{' '}
                  <a href={current.credit.authorUrl} target="_blank" rel="noreferrer noopener" className="underline hover:text-white">
                    {current.credit.author}
                  </a>{' '}
                  / {current.credit.source}
                </p>
              )}
            </motion.div>

            <button type="button" onClick={close} aria-label="Close gallery"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-ink/60 text-xl hover:border-white/40 sm:right-8 sm:top-8">
              ✕
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous image"
              className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-ink/60 text-xl hover:border-white/40 sm:left-6">
              ←
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next image"
              className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-ink/60 text-xl hover:border-white/40 sm:right-6">
              →
            </button>
            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 font-display text-sm text-muted">
              {(open ?? 0) + 1} / {images.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
