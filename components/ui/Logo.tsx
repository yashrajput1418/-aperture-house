'use client';
import { site } from '@/content/site';
import BrandMark, { Aperture } from '@/components/preview/BrandMarks';
import { usePreview } from '@/lib/preview';

/**
 * The studio logo: aperture mark + wordmark.
 *
 * The wordmark is rendered from `site.name`, so renaming the studio in
 * content/site.ts renames the logo too — nothing here is hard-coded.
 * The mark inherits `currentColor`, so it recolours with its container.
 */
export function ApertureMark({ className = '' }: { className?: string }) {
  return <Aperture className={className} />;
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
  const { brand } = usePreview();
  const name = brand.name || site.name;
  const [first, ...rest] = name.split(' ');
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <BrandMark className={markClassName} />
      {showWordmark && (
        <span className="font-display text-lg font-bold tracking-tight">
          {first}
          <span className="text-accent">.</span>
          {rest.join(' ')}
        </span>
      )}
      <span className="sr-only">{name}</span>
    </span>
  );
}
