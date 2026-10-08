/**
 * Where a booking enquiry goes.
 *
 * Out of the box the form needs no backend: it opens a prefilled WhatsApp
 * chat (and offers a `mailto:` fallback), which is what most studios actually
 * want — the enquiry lands in the same inbox they already answer from.
 *
 * To ALSO get a copy by email with no server of your own, set the three
 * EmailJS variables in `.env.local` and this posts to their REST API. No
 * extra npm package is needed.
 *
 *   NEXT_PUBLIC_EMAILJS_SERVICE_ID
 *   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
 *   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
 *
 * Note that these are NEXT_PUBLIC_ on purpose: EmailJS is a browser-side
 * service, so the public key ships in the bundle and anyone can read it.
 * That is how EmailJS is designed — lock it down in their dashboard with
 * domain allow-listing and a monthly quota. If you need a secret that never
 * reaches the browser, send the enquiry from a Next.js Server Action to
 * Resend/Postmark instead and delete this file.
 */

export type Enquiry = {
  name: string;
  phone: string;
  email?: string;
  shoot: string;
  city: string;
  date: string;
  budget: string;
  message: string;
};

export const emailjsConfigured = () =>
  Boolean(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID &&
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID &&
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
  );

/**
 * Posts the enquiry to EmailJS when configured.
 * Resolves `false` (never throws) when it is not set up or the call fails —
 * the WhatsApp hand-off is the real delivery path and must still happen.
 */
export async function sendByEmailJs(enquiry: Enquiry): Promise<boolean> {
  if (!emailjsConfigured()) return false;
  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        template_id: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        user_id: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
        template_params: { ...enquiry },
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
