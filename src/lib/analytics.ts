declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, string | number | boolean>) => void }
  }
}

type EventData = Record<string, string | number | boolean>;

// Events fired before the deferred Umami script has loaded (e.g. on mount), sent once it has.
const pending: [string, EventData | undefined][] = [];
const MAX_PENDING = 50;

function flush(): void {
  try {
    for (const [event, data] of pending.splice(0)) window.umami?.track(event, data);
  } catch {
    // analytics must never break the export flow
  }
}

export function track(event: string, data?: EventData): void {
  try {
    if (window.umami) {
      window.umami.track(event, data);
      return;
    }
    // If the script is blocked it never loads and the queue just stays capped.
    if (pending.length === 0) {
      document.querySelector('script[data-website-id]')?.addEventListener('load', flush, { once: true });
    }
    if (pending.length < MAX_PENDING) pending.push([event, data]);
  } catch {
    // analytics must never break the export flow
  }
}
