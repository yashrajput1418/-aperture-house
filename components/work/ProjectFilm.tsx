'use client';
import { useRef, useState } from 'react';
import SafeImage from '@/components/ui/SafeImage';
import type { MediaVideo } from '@/content/media';

/**
 * The project film. Nothing is fetched until the visitor presses play
 * (preload="none"), so it costs a poster image on every connection.
 */
export default function ProjectFilm({ video, title }: { video: MediaVideo; title: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const start = () => {
    setStarted(true);
    requestAnimationFrame(() => ref.current?.play().catch(() => {}));
  };

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-line bg-ink-2">
      <video
        ref={ref}
        src={video.src}
        poster={video.poster}
        preload="none"
        playsInline
        controls={started}
        muted
        loop
        className="h-full w-full object-cover"
      />
      {!started && (
        <button
          type="button"
          onClick={start}
          aria-label={`Play the ${title} film`}
          className="group absolute inset-0 flex items-center justify-center bg-ink/30 transition hover:bg-ink/15"
        >
          {video.poster && (
            <SafeImage src={video.poster} alt="" aria-hidden fill sizes="(min-width: 1280px) 1152px, 100vw" className="-z-10 object-cover" />
          )}
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-2xl text-ink transition-transform duration-300 group-hover:scale-110">
            ▶
          </span>
        </button>
      )}
    </div>
  );
}
