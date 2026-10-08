// Rature Pro waitlist, collected by a Brevo subscription form. Only the email and the optional
// profession are sent, never document content. Unset in self-hosted builds: no waitlist is shown.
const FORM_URL: string | undefined = import.meta.env.VITE_BREVO_FORM_URL || undefined;

export const WAITLIST_ENABLED = Boolean(FORM_URL);

export const PROFESSIONS = ['avocat', 'dpo', 'juriste', 'autre'] as const;
export type Profession = (typeof PROFESSIONS)[number];

export type WaitlistSource = 'home' | 'export' | 'nav';

export type WaitlistResult = { ok: true } | { ok: false; reason: 'network' | 'rejected' };

export async function joinWaitlist(email: string, profession: Profession | '', lang: string): Promise<WaitlistResult> {
  if (!FORM_URL) return { ok: false, reason: 'rejected' };

  const body = new FormData();
  body.set('EMAIL', email);
  body.set('JOB_TITLE', profession);
  body.set('email_address_check', ''); // Brevo honeypot, must stay empty
  body.set('locale', lang);

  // Like Brevo's own embed script: `isAjax=1` in the query string gets a JSON reply instead of a 303 to its thank-you page.
  const url = new URL(FORM_URL);
  url.searchParams.set('isAjax', '1');

  let res: Response;
  try {
    res = await fetch(url, { method: 'POST', body });
  } catch {
    return { ok: false, reason: 'network' };
  }
  const data: unknown = await res.json().catch(() => null);
  const success = res.ok && typeof data === 'object' && data !== null && (data as { success?: unknown }).success === true;
  return success ? { ok: true } : { ok: false, reason: 'rejected' };
}
