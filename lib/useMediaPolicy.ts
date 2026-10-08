'use client';
import { useEffect, useState } from 'react';

export type MediaPolicy = {
  /** true once the policy has been evaluated in the browser */
  ready: boolean;
  /** user asked for less motion */
  reducedMotion: boolean;
  /** pointer:fine — hover previews only make sense here */
  hoverCapable: boolean;
  /** metered / slow connection, or Data Saver is on */
  saveData: boolean;
  /** viewport is phone-sized */
  smallScreen: boolean;
  /** safe to autoplay decorative background video */
  allowBackgroundVideo: boolean;
  /** safe to play a preview video on hover */
  allowHoverVideo: boolean;
};

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (t: string, cb: () => void) => void;
  removeEventListener?: (t: string, cb: () => void) => void;
};

const initial: MediaPolicy = {
  ready: false,
  reducedMotion: false,
  hoverCapable: false,
  saveData: false,
  smallScreen: false,
  allowBackgroundVideo: false,
  allowHoverVideo: false,
};

/**
 * Decides whether video may play at all. Videos never autoplay on
 * reduced-motion, on Data Saver / 2g-3g connections, or on phone-sized
 * screens — the cover image is shown there instead.
 */
export function useMediaPolicy(): MediaPolicy {
  const [policy, setPolicy] = useState<MediaPolicy>(initial);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
    const small = window.matchMedia('(max-width: 767px)');
    const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection;

    const evaluate = () => {
      const reducedMotion = motion.matches;
      const hoverCapable = hover.matches;
      const smallScreen = small.matches;
      const saveData =
        Boolean(conn?.saveData) || ['slow-2g', '2g', '3g'].includes(conn?.effectiveType ?? '');

      setPolicy({
        ready: true,
        reducedMotion,
        hoverCapable,
        saveData,
        smallScreen,
        allowBackgroundVideo: !reducedMotion && !saveData && !smallScreen,
        allowHoverVideo: !reducedMotion && !saveData && hoverCapable,
      });
    };

    evaluate();
    const targets = [motion, hover, small];
    targets.forEach((t) => t.addEventListener('change', evaluate));
    conn?.addEventListener?.('change', evaluate);
    return () => {
      targets.forEach((t) => t.removeEventListener('change', evaluate));
      conn?.removeEventListener?.('change', evaluate);
    };
  }, []);

  return policy;
}
