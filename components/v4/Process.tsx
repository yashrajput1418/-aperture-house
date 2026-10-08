import { process } from '@/content/site';

/** Four cells, read left to right like a form's instructions. */
export default function Process() {
  return (
    <section id="process" className="border-b border-line px-5 py-12 sm:px-8 sm:py-16">
      <h2 className="font-display text-2xl font-bold tracking-tight sm:text-4xl">How a booking runs</h2>
      <ol className="mt-8 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {process.map((p) => (
          <li key={p.step} className="bg-ink p-6">
            <p className="font-display text-4xl font-bold text-white/10">{p.step}</p>
            <h3 className="mt-5 font-display text-lg font-semibold">{p.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{p.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
