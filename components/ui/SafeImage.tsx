'use client';
import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';
import MediaPlaceholder from './MediaPlaceholder';

type Props = Omit<ImageProps, 'onError'> & {
  /** Tint for the placeholder, usually the project's own gradient. */
  gradient?: [string, string];
  /** Caption shown under the mark when the image cannot be displayed. */
  placeholderLabel?: string;
  placeholderClassName?: string;
  placeholderMarkClassName?: string;
};

/**
 * next/image that degrades to the studio mark instead of a broken icon.
 * Covers both cases: no `src` at all (media never fetched) and a `src`
 * that fails at runtime (file deleted, bad deploy, blocked request).
 */
export default function SafeImage({
  gradient,
  placeholderLabel,
  placeholderClassName = '',
  placeholderMarkClassName,
  ...props
}: Props) {
  const [failed, setFailed] = useState(false);

  if (failed || !props.src) {
    return (
      <MediaPlaceholder
        gradient={gradient}
        label={placeholderLabel}
        markClassName={placeholderMarkClassName}
        className={`${props.fill ? 'absolute inset-0' : 'relative'} ${placeholderClassName}`}
      />
    );
  }

  return <Image {...props} onError={() => setFailed(true)} />;
}
