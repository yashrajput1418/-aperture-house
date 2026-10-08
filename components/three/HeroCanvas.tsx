'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

function supportsWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { return false; }
}

/** Loads the 3D scene only in capable browsers; otherwise shows a CSS gradient orb. */
export default function HeroCanvas() {
  const [use3D, setUse3D] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowEnd = (navigator.hardwareConcurrency ?? 8) <= 2;
    setUse3D(supportsWebGL() && !reduce && !lowEnd);
  }, []);

  return (
    <div className="absolute inset-0">
      {/* fallback orb for phones without WebGL, low-end devices and reduced motion */}
      {!use3D && <div className="absolute left-1/2 top-1/2 h-[46vmin] w-[46vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_30%_30%,#a48bff,#7c5cff_40%,#21114f_75%)] opacity-70 blur-[2px]" />}
      {use3D && <div className="absolute inset-0"><HeroScene /></div>}
    </div>
  );
}
