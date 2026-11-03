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

function bucket(value: number, edges: number[]): string {
  const i = edges.findIndex((edge) => value < edge);
  if (i === -1) return `${edges[edges.length - 1]}+`;
  return i === 0 ? `<${edges[0]}` : `${edges[i - 1]}-${edges[i]}`;
}

export function pagesBucket(pages: number): string {
  return pages > 0 ? bucket(pages, [2, 6, 21, 51]) : 'unknown';
}

/** File size in MB, bucketed. */
export function sizeBucket(bytes: number): string {
  return bucket(bytes / 1_048_576, [1, 5, 20, 50, 100]);
}

/**
 * Coarse context for `analysis-failed`: the error class name and size buckets, never the message,
 * which can contain document text.
 */
export function failureDetail(err: unknown, pages: number, textLength?: number): EventData {
  const name = err instanceof Error || (typeof err === 'object' && err !== null && 'name' in err && typeof err.name === 'string')
    ? (err as { name: string }).name
    : typeof err;
  const detail: EventData = {
    error: name.slice(0, 40),
    pages: pagesBucket(pages),
  };
  if (textLength !== undefined) detail.chars = bucket(textLength, [5_000, 20_000, 100_000, 500_000]);
  return detail;
}
