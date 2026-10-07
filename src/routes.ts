import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('about', 'routes/about.tsx'),
  route('privacy-policy', 'routes/privacy-policy.tsx'),
  route('settings', 'routes/settings.tsx'),
  route('processing', 'routes/processing.tsx'),
  route('document', 'routes/document.tsx', [
    route('edition', 'routes/document.edition.tsx'),
    route('image-edition', 'routes/document.image-edition.tsx'),
    route('preview', 'routes/document.preview.tsx'),
  ]),
] satisfies RouteConfig;
