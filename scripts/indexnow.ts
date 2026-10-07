// Pings IndexNow (Bing, Yandex, etc.) with every public URL. Run after a deploy: `bun run indexnow`.
import { PRERENDER_PATHS, SITE_URL } from '../src/lib/publicPages.ts';

const KEY = '059bb7f762d6ffd7e4963bba12e8db0f';

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: new URL(SITE_URL).host,
    key: KEY,
    keyLocation: `${SITE_URL}/${KEY}.txt`,
    urlList: PRERENDER_PATHS.map((path) => `${SITE_URL}${path}`),
  }),
});

console.log(`IndexNow: ${response.status} ${response.statusText}`);
if (!response.ok) process.exit(1);
