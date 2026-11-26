// Posts to a Brevo subscription form from the browser. Callers decide which fields to send;
// never pass document content.
export type BrevoResult = { ok: true } | { ok: false; reason: 'network' | 'rejected' };

export async function postBrevoForm(formUrl: string, fields: Record<string, string>, lang: string): Promise<BrevoResult> {
  const body = new FormData();
  for (const [key, value] of Object.entries(fields)) body.set(key, value);
  body.set('email_address_check', ''); // Brevo honeypot, must stay empty
  body.set('locale', lang);

  // Like Brevo's own embed script: `isAjax=1` in the query string gets a JSON reply instead of a 303 to its thank-you page.
  const url = new URL(formUrl);
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
