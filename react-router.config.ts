import { rename, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { Config } from '@react-router/dev/config';

import { localizedPath, PRERENDER_PATHS, PUBLIC_PATHS, SITE_URL } from './src/lib/publicPages.ts';

// Rendered by the splat route, then moved to `404.html` for nginx's `error_page`.
const NOT_FOUND_PATH = '/404';

function sitemap(): string {
  const urls = PUBLIC_PATHS.flatMap((path) => {
    const alternates = [
      ['fr', path],
      ['en', localizedPath(path, 'en')],
      ['x-default', path],
    ].map(([lang, href]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${SITE_URL}${href}"/>`).join('\n');

    return [path, localizedPath(path, 'en')].map((loc) => `  <url>\n    <loc>${SITE_URL}${loc}</loc>\n${alternates}\n  </url>`);
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
}

export default {
  appDirectory: 'src',
  ssr: false,
  prerender: [...PRERENDER_PATHS, NOT_FOUND_PATH],
  async buildEnd({ reactRouterConfig }) {
    const client = join(reactRouterConfig.buildDirectory, 'client');
    await rename(join(client, NOT_FOUND_PATH, 'index.html'), join(client, '404.html'));
    await rm(join(client, NOT_FOUND_PATH), { recursive: true });
    await writeFile(join(client, 'sitemap.xml'), sitemap());
  },
} satisfies Config;
