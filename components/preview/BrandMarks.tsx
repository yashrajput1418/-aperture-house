'use client';
import { usePreview, type LogoMark } from '@/lib/preview';

/** The four built-in marks. All stroke `currentColor`, so they take the accent. */
export function Aperture({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden className={className}>
      <circle cx="32" cy="32" r="25" stroke="currentColor" strokeWidth="3.2" />
      <path d="M 32 21 L 12.99 18.19 M 22.47 26.5 L 10.53 41.56 M 22.47 37.5 L 29.54 55.37 M 32 43 L 51.01 45.81 M 41.53 37.5 L 53.47 22.44 M 41.53 26.5 L 34.46 8.63" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M 32 21 L 22.47 26.5 L 22.47 37.5 L 32 43 L 41.53 37.5 L 41.53 26.5 Z" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round" />
    </svg>
  );
}

export function Lens({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden className={className}>
      <circle cx="32" cy="32" r="25" stroke="currentColor" strokeWidth="3.2" />
      <circle cx="32" cy="32" r="15" stroke="currentColor" strokeWidth="3.2" />
      <circle cx="32" cy="32" r="5.5" fill="currentColor" />
      <circle cx="23" cy="23" r="3" fill="currentColor" opacity="0.55" />
    </svg>
  );
}

export function Frame({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden className={className}>
      <path
        d="M 10 23 V 13 a 3 3 0 0 1 3 -3 h 10 M 41 10 h 10 a 3 3 0 0 1 3 3 v 10 M 54 41 v 10 a 3 3 0 0 1 -3 3 h -10 M 23 54 H 13 a 3 3 0 0 1 -3 -3 V 41"
        stroke="currentColor" strokeWidth="3.4" strokeLinecap="round"
      />
      <circle cx="32" cy="32" r="8" stroke="currentColor" strokeWidth="3.4" />
    </svg>
  );
}

export function Monogram({ className = '', name }: { className?: string; name: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden className={className}>
      <rect x="4" y="4" width="56" height="56" rx="16" stroke="currentColor" strokeWidth="3.2" />
      <text
        x="32" y="33" dominantBaseline="central" textAnchor="middle"
        fill="currentColor" fontSize={initials.length > 1 ? 24 : 30}
        fontFamily="var(--font-display)" fontWeight="700" letterSpacing="-1"
      >
        {initials || 'A'}
      </text>
    </svg>
  );
}

/** Renders whichever mark the visitor has chosen. */
export default function BrandMark({ className = '' }: { className?: string }) {
  const { brand } = usePreview();

  if (brand.mark === 'custom' && brand.logoSrc) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={brand.logoSrc} alt="" aria-hidden className={`object-contain ${className}`} />;
  }

  const marks: Record<Exclude<LogoMark, 'custom'>, React.ReactNode> = {
    aperture: <Aperture className={className} />,
    lens: <Lens className={className} />,
    frame: <Frame className={className} />,
    monogram: <Monogram className={className} name={brand.name} />,
  };
  return <>{marks[(brand.mark === 'custom' ? 'aperture' : brand.mark) as Exclude<LogoMark, 'custom'>]}</>;
}
