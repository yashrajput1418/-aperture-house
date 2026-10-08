'use client';
import { useEffect, useRef, useState } from 'react';
import SafeImage from '@/components/ui/SafeImage';
import { heroPoster, heroVideo } from '@/content/media';
import { useMediaPolicy } from '@/lib/useMediaPolicy';

/**
 * Full-bleed muted showreel behind the hero, with a dark gradient
 * overlay so the headline keeps its contrast.
 *
 * Never autoplays on reduced-motion, Data Saver / 2g-3g, or phone-sized
 * screens: the poster frame (or nothing) is shown there instead.
 */
export default function HeroVideo() {
  const video = heroVideo();
  const poster = heroPoster();
  const policy = useMediaPolicy();
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = policy.allowBackgroundVideo && Boolean(video);

  useEffect(() => {
    const v = ref.current;
    if (!v || !play) return;
    v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    const onVisibility = () => {
      if (document.hidden) v.pause();
      else v.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [play]);

  if (!video && !poster) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {poster && (
        <SafeImage
          src={poster.src}
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          placeholder={poster.blurDataURL ? 'blur' : 'empty'}
          blurDataURL={poster.blurDataURL}
          className="object-cover"
        />
      )}
      {play && video && (
        <video
          ref={ref}
          src={video.src}
          poster={video.poster ?? poster?.src}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          aria-hidden
          tabIndex={-1}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${playing ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
      {/* darken for contrast: vertical fade + vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/70 to-ink" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,transparent,rgb(7_7_11/0.9)_75%)]" />
    </div>
  );
}
