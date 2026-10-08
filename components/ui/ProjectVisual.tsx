'use client';
import { useEffect, useRef, useState } from 'react';
import SafeImage from '@/components/ui/SafeImage';
import type { Project } from '@/content/site';
import MediaPlaceholder from '@/components/ui/MediaPlaceholder';
import { useMediaPolicy } from '@/lib/useMediaPolicy';

/** Shown before `npm run fetch:media` has run, or if the cover 404s. */
function CoverFallback({ p }: { p: Project }) {
  return (
    <div className="relative h-full w-full">
      <MediaPlaceholder gradient={p.gradient} label={p.category} markClassName="h-12 w-12" />
    </div>
  );
}

/**
 * Project cover with an optional muted preview video on hover.
 *
 * - the cover image is the only thing that ever loads on mobile / Data Saver
 * - the <video> is created only after the card is near the viewport
 *   (IntersectionObserver) AND the pointer is over it, with preload="none"
 */
export default function ProjectVisual({
  p,
  sizes = '(min-width: 1024px) 46vw, (min-width: 640px) 60vw, 85vw',
  priority = false,
  className = '',
}: {
  p: Project;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const policy = useMediaPolicy();
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [hover, setHover] = useState(false);
  const [playing, setPlaying] = useState(false);

  const canPreview = Boolean(p.video) && policy.allowHoverVideo;

  useEffect(() => {
    const el = wrap.current;
    if (!el || !canPreview) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setNear(e.isIntersecting)),
      { rootMargin: '300px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [canPreview]);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (hover) {
      v.currentTime = 0;
      v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      v.pause();
      setPlaying(false);
    }
  }, [hover]);

  return (
    <div
      ref={wrap}
      className={`relative h-full w-full overflow-hidden ${className}`}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <div className="h-full w-full transition-transform duration-700 group-hover:scale-105">
        {p.cover ? (
          <SafeImage
            src={p.cover.src}
            alt={p.cover.alt ? `${p.title} — ${p.cover.alt}` : p.title}
            fill
            sizes={sizes}
            priority={priority}
            placeholder={p.cover.blurDataURL ? 'blur' : 'empty'}
            blurDataURL={p.cover.blurDataURL}
            className="object-cover"
            gradient={p.gradient}
            placeholderLabel={p.category}
            placeholderMarkClassName="h-12 w-12"
          />
        ) : (
          <CoverFallback p={p} />
        )}
      </div>

      {canPreview && near && (
        <video
          ref={video}
          src={p.video!.src}
          poster={p.video!.poster}
          muted
          loop
          playsInline
          preload="none"
          tabIndex={-1}
          aria-hidden
          className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${playing ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  );
}
