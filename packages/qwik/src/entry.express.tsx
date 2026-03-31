/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for the Express HTTP server when building for production.
 *
 * Learn more about Node.js server integrations here:
 * - https://qwik.dev/docs/deployments/node/
 *
 */
import { createQwikCity } from '@builder.io/qwik-city/middleware/node';
import express from 'express';
import { join } from 'path';
import { fileURLToPath } from 'url';
import render from './entry.ssr';
import qwikCityPlan from '@qwik-city-plan';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

const distDir = join(__dirname, '..', 'dist');
const buildDir = join(distDir, 'build');

const { router, notFound, staticFile } = createQwikCity({
  render,
  qwikCityPlan,
  static: {
    root: distDir,
    cacheControl: 'public, max-age=31536000, immutable',
  },
});

const app = express();

app.use(staticFile);
app.use(router);
app.use(notFound);

const PORT = parseInt(process.env['PORT'] ?? '3000', 10);

app.listen(PORT, () => {
  console.log(`QwikCity server listening on http://0.0.0.0:${PORT}`);
});
