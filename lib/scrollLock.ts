'use client';
import { useEffect } from 'react';
import type Lenis from 'lenis';

/**
 * The page is driven by Lenis, which listens for wheel events on the window
 * and scrolls the document itself. Setting `overflow: hidden` on <body> is
 * therefore NOT enough to freeze the page behind an overlay — Lenis keeps
 * scrolling regardless. Overlays need the instance so they can stop it.
 */
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};
export const getLenis = () => instance;

/**
 * Freezes the page while an overlay is open: stops Lenis, pins <body>, and
 * restores both on close. Safe when Lenis is absent (reduced motion), and
 * safe to nest — the body style it restores is whatever was there before.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const lenis = getLenis();
    lenis?.stop();

    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;

    // compensate for the scrollbar so the page does not jump sideways
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
      lenis?.start();
    };
  }, [active]);
}
