import type { ReactNode } from 'react';

import type { GuidePath } from '@/lib/publicPages.ts';

// Text fields below use a tiny inline markup: `**bold**`, `[label](href)` and `code`.
// Internal links start with `/`. The same strings feed the page and the JSON-LD.
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
  path: GuidePath;
  title: string;
  description: string;
  ogTitle: string;
  heading: string;
  // Share image in `public/guides/` (1200x630) and its alt text; the site default when absent.
  ogImage?: { file: string; alt: string };
  breadcrumb: string;
  readingTime: number;
  // Title and one line shown on the hub and in "À lire aussi".
  card: { title: string; line: string };
  summary: ReactNode;
  sections: GuideSection[];
  faq: { q: string; a: string }[];
  // Present when the guide has numbered steps: they also become the HowTo JSON-LD.
  howTo?: { name: string; steps: GuideStep[] };
  sources: string[];
  related: [GuidePath, GuidePath];
}
