import Link from 'next/link';
import SafeImage from '@/components/ui/SafeImage';
import type { Project } from '@/content/site';

/** Full-bleed teaser for the next case study. */
export default function NextShoot({ project }: { project: Project }) {
  return (
    <Link href={`/work/${project.slug}`} className="group relative block h-[62svh] min-h-[380px] overflow-hidden">
      {project.cover && (
        <SafeImage
          src={project.cover.src}
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          placeholder={project.cover.blurDataURL ? 'blur' : 'empty'}
          blurDataURL={project.cover.blurDataURL}
          className="object-cover grayscale transition-all duration-[1.2s] group-hover:scale-105 group-hover:grayscale-0"
          gradient={project.gradient}
        />
      )}
      <div className="absolute inset-0 bg-ink/70 transition-colors duration-700 group-hover:bg-ink/55" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-accent">Next shoot</p>
        <p className="mt-5 font-display text-5xl font-bold tracking-tight transition-colors duration-500 group-hover:text-accent sm:text-7xl">
          {project.title}
        </p>
        <p className="mt-4 text-muted">{project.category} · {project.location}</p>
        <span className="mt-10 flex h-14 w-14 items-center justify-center rounded-full border border-line text-xl transition-all duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-ink">
          →
        </span>
      </div>
    </Link>
  );
}
