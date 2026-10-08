'use client';
import Link from 'next/link';
import { site } from '@/content/site';
import { usePreview } from '@/lib/preview';
import Logo from '@/components/ui/Logo';
import VersionSwitcher from '@/components/ui/VersionSwitcher';

export default function Footer() {
  const { brand } = usePreview();
  const name = brand.name || site.name;
  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[80%] -translate-x-1/2 rounded-full bg-violet/30 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-20 sm:px-10">
        <div className="flex flex-wrap items-start justify-between gap-10">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-muted">{site.description}</p>
          </div>
          <div className="flex flex-col items-start gap-6">
            <VersionSwitcher current={1} align="left" />
            <div className="flex flex-wrap gap-6">
              {site.socials.map((s) => (
                <a key={s.label} href={s.href} className="text-sm text-muted transition hover:text-accent">{s.label}</a>
              ))}
              <Link href="/credits" className="text-sm text-muted transition hover:text-accent">Media credits</Link>
            </div>
          </div>
        </div>
        <p className="mt-16 select-none font-display text-[18vw] font-bold leading-none tracking-tighter text-white/[0.06] lg:text-[14rem]">
          {name.split(' ')[0]}
        </p>
        <div className="mt-6 flex flex-wrap justify-between gap-4 text-sm text-muted">
          <p>© {new Date().getFullYear()} {name}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/credits" className="hover:text-white">Credits</Link>
            <Link href="/#top" className="hover:text-white">Back to top ↑</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
