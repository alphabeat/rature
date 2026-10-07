import { renderToReadableStream } from 'react-dom/server';
import { ServerRouter, type EntryContext } from 'react-router';

// Only used at build time to prerender public routes. Web streams instead of the default
// Node entry so the build runs under Bun (local and Docker).
export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) {
  let status = responseStatusCode;
  const body = await renderToReadableStream(
    <ServerRouter context={routerContext} url={request.url} />,
    {
      signal: request.signal,
      onError(error: unknown) {
        status = 500;
        console.error(error);
      },
    },
  );
  await body.allReady;

  responseHeaders.set('Content-Type', 'text/html');
  return new Response(body, { headers: responseHeaders, status });
}
