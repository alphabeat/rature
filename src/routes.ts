import { index, prefix, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('about', 'routes/about.tsx'),
  route('privacy-policy', 'routes/privacy-policy.tsx'),
  ...prefix('en', [
    index('routes/home.tsx', { id: 'en/home' }),
    route('about', 'routes/about.tsx', { id: 'en/about' }),
    route('privacy-policy', 'routes/privacy-policy.tsx', { id: 'en/privacy-policy' }),
  ]),
  route('settings', 'routes/settings.tsx'),
  route('processing', 'routes/processing.tsx'),
  route('document', 'routes/document.tsx', [
    route('edition', 'routes/document.edition.tsx'),
    route('image-edition', 'routes/document.image-edition.tsx'),
    route('preview', 'routes/document.preview.tsx'),
  ]),
  route('*', 'routes/not-found.tsx'),
] satisfies RouteConfig;
