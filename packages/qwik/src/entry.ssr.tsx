/*
 * WHAT IS THIS FILE?
 *
 * It's the SSR entry point for Qwik. This file is used by the server-side rendering process.
 * It exports the `render` function that renders the app to a stream.
 */
import { renderToStream, type RenderToStreamOptions } from '@builder.io/qwik/server';
import { manifest } from '@qwik-client-manifest';
import Root from './root';

export default function (opts: RenderToStreamOptions) {
  return renderToStream(<Root />, {
    manifest,
    ...opts,
    prefetchStrategy: {
      implementation: {
        linkInsert: 'html-append',
        workerFetchInsert: 'always',
        prefetchEvent: 'always',
      },
    },
  });
}
