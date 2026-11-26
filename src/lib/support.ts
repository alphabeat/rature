// "Tell me what happened" messages after a stalled or failed analysis, collected by a separate
// Brevo form that emails Julien on each submission. Only the email, the user's own message and
// coarse context (stage, page bucket) are sent, never the file name or document content.
// Unset in self-hosted builds: no support form is shown.
import { postBrevoForm, type BrevoResult } from '@/lib/brevo.ts';

const FORM_URL: string | undefined = import.meta.env.VITE_SUPPORT_FORM_URL || undefined;

export const SUPPORT_ENABLED = Boolean(FORM_URL);

export const SUPPORT_MESSAGE_MAX = 500; // matches the MESSAGE field limit on the Brevo form

export type SupportKind = 'stalled' | 'failed';

export interface SupportContext {
  kind: SupportKind
  stage: string
  pages: string
}

export async function sendSupportMessage(email: string, message: string, context: SupportContext, lang: string): Promise<BrevoResult> {
  if (!FORM_URL) return { ok: false, reason: 'rejected' };
  return postBrevoForm(FORM_URL, {
    EMAIL: email,
    MESSAGE: message.slice(0, SUPPORT_MESSAGE_MAX),
    STAGE: `${context.kind}:${context.stage}:${context.pages}`,
  }, lang);
}
