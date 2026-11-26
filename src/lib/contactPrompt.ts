// Contact prompt for repeat users, shown after a download: once at the 2nd download of their own
// documents, once more at the 5th. Only a local download count and the last threshold shown are
// stored, in this browser. Unset in self-hosted builds: no prompt is shown.
const CALL_URL: string | undefined = import.meta.env.VITE_CONTACT_CALL_URL || undefined;

export const CONTACT_EMAIL = 'julien@rature.fr';
export const CONTACT_CALL_URL = CALL_URL;

const COUNT_KEY = 'rature-downloads';
const LEVEL_KEY = 'rature-contact-prompt-level';
// Before the 5th-download reminder, a single flag marked the 2nd-download prompt as shown.
const LEGACY_SHOWN_KEY = 'rature-contact-prompt-shown';
const THRESHOLDS = [2, 5] as const;

/** Counts a download of the user's own document (not the sample). */
export function recordDownload(): void {
  try {
    const count = Number(localStorage.getItem(COUNT_KEY)) || 0;
    localStorage.setItem(COUNT_KEY, String(count + 1));
  } catch {
    // storage blocked: the prompt just never shows
  }
}

/**
 * Returns the download threshold reached (2 or 5) the first time the user gets there and marks it
 * as shown, or null. A user who skips past a threshold only sees the highest one reached.
 */
export function claimContactPrompt(): number | null {
  if (!CALL_URL) return null;
  try {
    const count = Number(localStorage.getItem(COUNT_KEY)) || 0;
    const level = Number(localStorage.getItem(LEVEL_KEY)) || (localStorage.getItem(LEGACY_SHOWN_KEY) === '1' ? THRESHOLDS[0] : 0);
    const reached = THRESHOLDS.filter(t => count >= t && t > level).at(-1);
    if (reached === undefined) return null;
    localStorage.setItem(LEVEL_KEY, String(reached));
    return reached;
  } catch {
    return null;
  }
}
