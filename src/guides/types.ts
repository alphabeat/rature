import type { ReactNode } from 'react';

import type { GuidePath } from '@/lib/publicPages.ts';

// Text fields below use a tiny inline markup: `**bold**`, `[label](href)` and `code`.
// Internal links start with `/` and point to the page in the guide's language. The same strings feed the page and the JSON-LD.
export interface GuideStep {
  title: string;
  text: string;
}

export interface GuideSection {
  id: string;
  title: string;
  content: ReactNode;
}

export interface Guide {
  // The French path, in both languages: the English URL is `localizedPath(path, 'en')`.
  path: GuidePath;
  title: string;
  description: string;
  ogTitle: string;
  heading: string;
  // Imported share image URL (1200x630) and its alt text; the site default when absent.
  ogImage?: { src: string; alt: string };
  breadcrumb: string;
  readingTime: number;
  // Title and one line shown on the hub and in "Read next".
  card: { title: string; line: string };
  summary: ReactNode;
  sections: GuideSection[];
  faq: { q: string; a: string }[];
  // Present when the guide has numbered steps: they also become the HowTo JSON-LD.
  howTo?: { name: string; steps: GuideStep[] };
  sources: string[];
  related: [GuidePath, GuidePath];
}
