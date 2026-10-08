'use client';
import { useMemo, useState } from 'react';
import { site } from '@/content/site';
import { usePreview } from '@/lib/preview';
import { sendByEmailJs, type Enquiry } from '@/lib/sendEnquiry';

const { types, budgets, cities } = site.contact;

/**
 * Booking-enquiry state, shared by all four versions' contact sections.
 *
 * Each version draws its own form — a three-step wizard, a single long
 * form, an overlay, a dense grid — but they all submit the same enquiry
 * through the same WhatsApp / EmailJS hand-off, so the delivery path is
 * written once.
 */
export function useEnquiry() {
  const { brand } = usePreview();
  const brandName = brand.name || site.name;

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [shoot, setShoot] = useState(types[0]);
  const [city, setCity] = useState(cities[0]);
  const [budget, setBudget] = useState(budgets[budgets.length - 1]);
  const [form, setForm] = useState({ date: '', name: '', phone: '', message: '' });

  const prettyDate = form.date
    ? new Date(form.date + 'T00:00:00').toLocaleDateString('en-IN', { dateStyle: 'full' })
    : 'date not fixed yet';

  const enquiry: Enquiry = useMemo(
    () => ({
      name: form.name,
      phone: form.phone,
      shoot,
      city,
      date: prettyDate,
      budget,
      message: form.message,
    }),
    [form.name, form.phone, form.message, shoot, city, budget, prettyDate]
  );

  const text =
    `Hi ${brandName}! I'm ${form.name}.\n` +
    `Shoot: ${shoot}\n` +
    `Date: ${prettyDate}\n` +
    `Where: ${city}\n` +
    `Budget: ${budget}\n` +
    `Phone: ${form.phone}\n\n` +
    `${form.message}`;

  const waHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(
    `${shoot} enquiry — ${prettyDate}`
  )}&body=${encodeURIComponent(text)}`;

  /** Name and a reachable number are the only things we insist on. */
  const valid = form.name.trim().length > 1 && form.phone.trim().length >= 6;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setSending(true);
    // Optional copy by email; the WhatsApp hand-off happens either way.
    await sendByEmailJs(enquiry);
    setSending(false);
    setSent(true);
    window.open(waHref, '_blank', 'noopener');
  };

  const restart = () => setSent(false);

  return {
    types, budgets, cities,
    shoot, setShoot,
    city, setCity,
    budget, setBudget,
    form, setForm,
    prettyDate, waHref, mailto,
    valid, sending, sent, submit, restart,
  };
}
