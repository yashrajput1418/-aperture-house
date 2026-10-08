import type { ReactNode } from 'react';

/**
 * Small set of pieces the documentation page is built from. Deliberately
 * plain: server-rendered, no client JavaScript, so /docs stays readable
 * even when everything else on the site is switched off.
 */

export function Section({ id, n, title, children }: { id: string; n: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line pt-14">
      <p className="font-display text-xs uppercase tracking-[0.3em] text-accent">{n}</p>
      <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      <div className="mt-8 space-y-6">{children}</div>
    </section>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="max-w-3xl leading-relaxed text-muted">{children}</p>;
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="mt-12 font-display text-xl font-semibold">{children}</h3>;
}

/** Inline code: file names, keys, values. */
export function C({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md border border-line bg-ink-2 px-1.5 py-0.5 font-mono text-[0.85em] text-white/90">
      {children}
    </code>
  );
}

/** A block of code or a terminal transcript. */
export function Code({ children, label }: { children: string; label?: string }) {
  return (
    <div className="max-w-4xl overflow-hidden rounded-2xl border border-line bg-ink-2">
      {label && (
        <p className="border-b border-line px-4 py-2 font-display text-[0.65rem] uppercase tracking-[0.2em] text-muted">
          {label}
        </p>
      )}
      <pre className="overflow-x-auto p-4 text-[0.82rem] leading-relaxed">
        <code className="font-mono text-white/85">{children}</code>
      </pre>
    </div>
  );
}

export function Note({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'warn' }) {
  return (
    <div
      className={`max-w-3xl rounded-2xl border p-5 leading-relaxed ${
        tone === 'warn' ? 'border-amber-400/30 bg-amber-400/[0.06]' : 'border-accent/30 bg-accent/[0.05]'
      }`}
    >
      <p className="text-sm text-white/80">{children}</p>
    </div>
  );
}

export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="max-w-4xl overflow-x-auto rounded-2xl border border-line">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-ink-2">
            {head.map((h) => (
              <th key={h} className="whitespace-nowrap px-4 py-3 font-display text-[0.65rem] uppercase tracking-[0.2em] text-muted">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i > 0 ? 'border-t border-line' : ''}>
              {r.map((cell, j) => (
                <td key={j} className="px-4 py-3 align-top text-white/80">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Steps({ items }: { items: ReactNode[] }) {
  return (
    <ol className="max-w-3xl space-y-4">
      {items.map((item, i) => (
        <li key={i} className="flex gap-4">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent/50 font-display text-[0.7rem] text-accent">
            {i + 1}
          </span>
          <span className="leading-relaxed text-muted">{item}</span>
        </li>
      ))}
    </ol>
  );
}
