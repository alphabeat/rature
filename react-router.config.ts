import type { Config } from '@react-router/dev/config';

import { PRERENDER_PATHS } from './src/lib/publicPages.ts';

export default {
  appDirectory: 'src',
  ssr: false,
  prerender: PRERENDER_PATHS,
} satisfies Config;
