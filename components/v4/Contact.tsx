'use client';
import { site } from '@/content/site';
import { emailjsConfigured } from '@/lib/sendEnquiry';
import { useEnquiry } from '@/lib/useEnquiry';

/**
 * Version 4 books like a form in a records system: native selects instead
 * of chip rows, labels above fields, everything inside one bordered block.
 */
export default function Contact() {
  const e = useEnquiry();

  const field = 'w-full border border-line bg-ink px-3 py-2.5 text-sm outline-none transition focus:border-accent';
  const label = 'block text-[0.6rem] uppercase tracking-[0.2em] text-muted';

  return (
    <section id="contact" className="border-b border-line px-5 py-12 sm:px-8 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-14">
        <div>
          <h2 className="font-display text-3xl font-bold leading-[1.02] tracking-tight sm:text-5xl">
            Check your date
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">{site.contact.note}</p>
          <dl className="mt-8 border border-line text-sm">
            {[
              ['Phone', site.phone, `tel:${site.phone.replace(/\s/g, '')}`],
              ['Email', site.email, `mailto:${site.email}`],
              ['Studio', site.location, null],
            ].map(([k, v, href], i) => (
              <div key={k as string} className={`flex justify-between gap-6 p-3.5 ${i > 0 ? 'border-t border-line' : ''}`}>
                <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-muted">{k}</dt>
                <dd className="text-right">
                  {href ? (
                    <a href={href as string} className="hover:text-accent">{v}</a>
                  ) : (
                    <span className="text-muted">{v}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {e.sent ? (
          <div className="border border-accent/40 bg-accent/[0.04] p-6">
            <p className="font-display text-3xl text-accent">✓</p>
            <h3 className="mt-4 font-display text-xl font-semibold">Enquiry ready to send</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              WhatsApp should have opened with your details filled in. If it did not, use one of these.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={e.waHref}
                target="_blank"
                rel="noreferrer noopener"
                className="bg-accent px-5 py-2.5 font-display text-sm font-semibold text-ink"
              >
                Open WhatsApp
              </a>
              <a href={e.mailto} className="border border-line px-5 py-2.5 font-display text-sm font-semibold hover:border-white/40">
                Send by email
              </a>
            </div>
            <button type="button" onClick={e.restart} className="mt-6 text-xs text-muted underline hover:text-white">
              Start another enquiry
            </button>
          </div>
        ) : (
          <form onSubmit={e.submit} className="border border-line p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className={label}>Shoot</span>
                <select value={e.shoot} onChange={(ev) => e.setShoot(ev.target.value)} className={`${field} mt-2`}>
                  {e.types.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
              <label>
                <span className={label}>Where</span>
                <select value={e.city} onChange={(ev) => e.setCity(ev.target.value)} className={`${field} mt-2`}>
                  {e.cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label>
                <span className={label}>Budget</span>
                <select value={e.budget} onChange={(ev) => e.setBudget(ev.target.value)} className={`${field} mt-2`}>
                  {e.budgets.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </label>
              <label>
                <span className={label}>Date (optional)</span>
                <input
                  type="date"
                  className={`${field} mt-2 [color-scheme:dark]`}
                  value={e.form.date}
                  onChange={(ev) => e.setForm({ ...e.form, date: ev.target.value })}
                />
              </label>
              <label>
                <span className={label}>Name</span>
                <input
                  required autoComplete="name" className={`${field} mt-2`}
                  value={e.form.name} onChange={(ev) => e.setForm({ ...e.form, name: ev.target.value })}
                />
              </label>
              <label>
                <span className={label}>Phone / WhatsApp</span>
                <input
                  required type="tel" inputMode="tel" autoComplete="tel" className={`${field} mt-2`}
                  value={e.form.phone} onChange={(ev) => e.setForm({ ...e.form, phone: ev.target.value })}
                />
              </label>
              <label className="sm:col-span-2">
                <span className={label}>Anything we should know</span>
                <textarea
                  rows={3} className={`${field} mt-2 resize-none`}
                  placeholder="Venue, number of functions, timings"
                  value={e.form.message} onChange={(ev) => e.setForm({ ...e.form, message: ev.target.value })}
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-line pt-5">
              <button
                type="submit"
                disabled={!e.valid || e.sending}
                className="bg-accent px-6 py-3 font-display text-sm font-semibold text-ink transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                {e.sending ? 'Sending…' : 'Submit enquiry'}
              </button>
              <a href={e.mailto} className="font-display text-xs uppercase tracking-[0.2em] text-accent">
                Email instead
              </a>
            </div>

            <p className="mt-4 text-[0.7rem] leading-relaxed text-muted">
              We hold one date at a time, free, for seven days.
              {emailjsConfigured() ? '' : ' Your enquiry opens in WhatsApp — nothing is stored on this site.'}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
