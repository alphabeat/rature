// Rature Pro waitlist, collected by a Brevo subscription form. Only the email and the optional
// profession are sent, never document content. Unset in self-hosted builds: no waitlist is shown.
import { postBrevoForm, type BrevoResult } from '@/lib/brevo.ts';

const FORM_URL: string | undefined = import.meta.env.VITE_BREVO_FORM_URL || undefined;

export const WAITLIST_ENABLED = Boolean(FORM_URL);

export const PROFESSIONS = ['avocat', 'dpo', 'juriste', 'autre'] as const;
export type Profession = (typeof PROFESSIONS)[number];

export type WaitlistSource = 'home' | 'export' | 'nav';

export type WaitlistResult = BrevoResult;

export async function joinWaitlist(email: string, profession: Profession | '', lang: string): Promise<WaitlistResult> {
  if (!FORM_URL) return { ok: false, reason: 'rejected' };
  return postBrevoForm(FORM_URL, { EMAIL: email, JOB_TITLE: profession }, lang);
}
