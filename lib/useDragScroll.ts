'use client';
import { useCallback, useRef, useState } from 'react';

/**
 * Grab-and-drag for a horizontal scroll container.
 *
 * Touch devices already drag natively, so this only binds mouse and pen —
 * it gives a desktop visitor the same gesture instead of forcing them onto
 * the arrows or a shift-wheel.
 *
 * While dragging, snapping is switched off so the strip follows the pointer
 * freely; it is restored on release, which settles the strip on the nearest
 * slide and keeps the counter honest. A drag that travels more than a few
 * pixels swallows the click that follows it, so dragging across a card
 * never opens the link under the cursor.
 *
 *   const drag = useDragScroll<HTMLDivElement>();
 *   <div ref={drag.ref} {...drag.handlers} className={drag.className}>
 */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [dragging, setDragging] = useState(false);
  const start = useRef({ x: 0, scroll: 0, moved: 0 });
  const snap = useRef<string>('');

  const onPointerDown = useCallback((e: React.PointerEvent<T>) => {
    // leave touch alone: the browser's own momentum scrolling is better
    if (e.pointerType === 'touch') return;
    const el = ref.current;
    if (!el) return;
    // ignore drags begun on a control, so buttons and links still work
    if ((e.target as HTMLElement).closest('button')) return;

    start.current = { x: e.clientX, scroll: el.scrollLeft, moved: 0 };
    snap.current = el.style.scrollSnapType;
    el.style.scrollSnapType = 'none';
    el.setPointerCapture(e.pointerId);
    setDragging(true);
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<T>) => {
      if (!dragging) return;
      const el = ref.current;
      if (!el) return;
      const dx = e.clientX - start.current.x;
      start.current.moved = Math.max(start.current.moved, Math.abs(dx));
      el.scrollLeft = start.current.scroll - dx;
    },
    [dragging]
  );

  const end = useCallback(
    (e: React.PointerEvent<T>) => {
      if (!dragging) return;
      const el = ref.current;
      setDragging(false);
      if (!el) return;
      el.releasePointerCapture?.(e.pointerId);
      // next frame, so the restored snapping settles from the dragged position
      requestAnimationFrame(() => {
        el.style.scrollSnapType = snap.current;
      });
    },
    [dragging]
  );

  const onClickCapture = useCallback((e: React.MouseEvent<T>) => {
    if (start.current.moved > 6) {
      e.preventDefault();
      e.stopPropagation();
      start.current.moved = 0;
    }
  }, []);

  return {
    ref,
    dragging,
    /** `cursor-grab` / `cursor-grabbing`, plus no text selection mid-drag. */
    className: dragging ? 'cursor-grabbing select-none' : 'cursor-grab',
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: end,
      onPointerCancel: end,
      onClickCapture,
      onDragStart: (e: React.DragEvent<T>) => e.preventDefault(),
    },
  };
}
