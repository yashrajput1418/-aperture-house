import { ApertureMark } from './Logo';

/**
 * Shown wherever an image is missing or fails to load — before
 * `npm run fetch:media` has run, or when a file 404s in production.
 * Never an empty grey box: it always carries the studio mark.
 */
export default function MediaPlaceholder({
  gradient,
  label,
  className = '',
  markClassName = 'h-10 w-10',
}: {
  gradient?: [string, string];
  label?: string;
  className?: string;
  markClassName?: string;
}) {
  const [a, b] = gradient ?? ['#1b1b22', '#0a0a0c'];
  return (
    <div
      role="img"
      aria-label={label ? `${label} — image unavailable` : 'Image unavailable'}
      className={`flex h-full w-full items-center justify-center bg-ink-2 ${className}`}
    >
      {/* the project's own gradient, dimmed so it reads as a placeholder */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-25"
        style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}
      />
      <div className="relative flex flex-col items-center gap-3 text-center">
        <ApertureMark className={`${markClassName} text-accent/50`} />
        {label && (
          <span className="max-w-[80%] font-display text-[0.65rem] uppercase tracking-[0.2em] text-white/35">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
