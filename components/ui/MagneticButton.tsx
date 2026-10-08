'use client';
import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function MagneticButton({
  children, href, variant = 'solid', className = '',
}: { children: React.ReactNode; href: string; variant?: 'solid' | 'ghost'; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.3);
    y.set((e.clientY - r.top - r.height / 2) * 0.3);
  };
  const reset = () => { x.set(0); y.set(0); };

  const styles = variant === 'solid'
    ? 'bg-accent text-ink hover:shadow-[0_0_40px_-6px_var(--color-accent)]'
    : 'border border-line text-white hover:border-white/40';

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={`inline-flex items-center gap-2 rounded-full px-7 py-4 font-display text-base font-semibold transition-shadow ${styles} ${className}`}
    >
      {children}
    </motion.a>
  );
}
