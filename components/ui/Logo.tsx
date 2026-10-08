import { site } from '@/content/site';

/**
 * The studio logo: aperture mark + wordmark.
 *
 * The wordmark is rendered from `site.name`, so renaming the studio in
 * content/site.ts renames the logo too — nothing here is hard-coded.
 * The mark inherits `currentColor`, so it recolours with its container.
 */
export function ApertureMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden className={className}>
      {/* lens barrel */}
      <circle cx="32" cy="32" r="25" stroke="currentColor" strokeWidth="3.2" />
      {/* iris blades */}
      <path d="M 32 21 L 12.99 18.19 M 22.47 26.5 L 10.53 41.56 M 22.47 37.5 L 29.54 55.37 M 32 43 L 51.01 45.81 M 41.53 37.5 L 53.47 22.44 M 41.53 26.5 L 34.46 8.63" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
      {/* aperture opening */}
      <path d="M 32 21 L 22.47 26.5 L 22.47 37.5 L 32 43 L 41.53 37.5 L 41.53 26.5 Z" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round" />
    </svg>
  );
}

export default function Logo({
  className = '',
  markClassName = 'h-7 w-7 text-accent',
  showWordmark = true,
}: {
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
}) {
  const [first, ...rest] = site.name.split(' ');
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <ApertureMark className={markClassName} />
      {showWordmark && (
        <span className="font-display text-lg font-bold tracking-tight">
          {first}
          <span className="text-accent">.</span>
          {rest.join(' ')}
        </span>
      )}
      <span className="sr-only">{site.name}</span>
    </span>
  );
}
