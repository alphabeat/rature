// One-time contact prompt for repeat users, shown after a download. Only a local download count
// and a "shown" flag are stored, in this browser. Unset in self-hosted builds: no prompt is shown.
const CALL_URL: string | undefined = import.meta.env.VITE_CONTACT_CALL_URL || undefined;

export const CONTACT_EMAIL = 'julien@rature.fr';
export const CONTACT_CALL_URL = CALL_URL;

const COUNT_KEY = 'rature-downloads';
const SHOWN_KEY = 'rature-contact-prompt-shown';
const MIN_DOWNLOADS = 2;

/** Counts a download of the user's own document (not the sample). */
export function recordDownload(): void {
  try {
    const count = Number(localStorage.getItem(COUNT_KEY)) || 0;
    localStorage.setItem(COUNT_KEY, String(count + 1));
  } catch {
    // storage blocked: the prompt just never shows
  }
}

/** True once, the first time the user has downloaded enough documents; marks the prompt as shown. */
export function claimContactPrompt(): boolean {
  if (!CALL_URL) return false;
  try {
    if (localStorage.getItem(SHOWN_KEY) === '1') return false;
    if ((Number(localStorage.getItem(COUNT_KEY)) || 0) < MIN_DOWNLOADS) return false;
    localStorage.setItem(SHOWN_KEY, '1');
    return true;
  } catch {
    return false;
  }
}
