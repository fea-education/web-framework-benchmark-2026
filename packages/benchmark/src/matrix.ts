import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Device, LatencyPreset } from './types.js';

export interface AppConfig {
  /** short slug matching docker-compose service name */
  name: string;
  /** internal port the app listens on inside Docker */
  port: number;
  /** human-readable label */
  label: string;
  /**
   * Base URL for benchmarking. Defaults to http://localhost:<port>.
   * Override via APP_BASE_<name> env var (e.g. APP_BASE_nextjs-app=http://nextjs-app:3000).
   * Hyphens in the env var name are converted to underscores by convention; both forms are checked.
   */
  baseUrl: string;
}

export interface PageConfig {
  /** short slug (used in output filenames/table) */
  name: string;
  /** URL path to benchmark */
  path: string;
}

export interface MatrixCell {
  app: AppConfig;
  page: PageConfig;
  latency: LatencyPreset;
  device: Device;
  /** Mode extracted from the app's STRATEGY.md (e.g. "SSG", "SSR", "CSR") */
  modeUsed: string;
}

/**
 * Resolves the base URL for an app. Checks APP_BASE_<name> env var first
 * (replacing hyphens with underscores for env var lookup), then falls back
 * to http://localhost:<port>.
 */
function resolveBaseUrl(name: string, port: number): string {
  // Try both the literal name and with hyphens replaced by underscores
  const envKey1 = `APP_BASE_${name}`;
  const envKey2 = `APP_BASE_${name.replace(/-/g, '_')}`;
  return process.env[envKey1] ?? process.env[envKey2] ?? `http://localhost:${port}`;
}

export const APPS: AppConfig[] = [
  { name: 'nextjs-app', port: 3001, label: 'Next.js App Router', baseUrl: resolveBaseUrl('nextjs-app', 3001) },
  { name: 'nextjs-pages', port: 3002, label: 'Next.js Pages Router', baseUrl: resolveBaseUrl('nextjs-pages', 3002) },
  { name: 'sveltekit', port: 3003, label: 'SvelteKit', baseUrl: resolveBaseUrl('sveltekit', 3003) },
  { name: 'nuxt', port: 3004, label: 'Nuxt 3', baseUrl: resolveBaseUrl('nuxt', 3004) },
  { name: 'astro-vanilla', port: 3005, label: 'Astro Vanilla', baseUrl: resolveBaseUrl('astro-vanilla', 3005) },
  { name: 'astro-solid', port: 3006, label: 'Astro + SolidJS', baseUrl: resolveBaseUrl('astro-solid', 3006) },
  { name: 'qwik', port: 3007, label: 'QwikCity', baseUrl: resolveBaseUrl('qwik', 3007) },
  { name: 'solidstart', port: 3008, label: 'SolidStart', baseUrl: resolveBaseUrl('solidstart', 3008) },
];

export const PAGES: PageConfig[] = [
  { name: 'listing', path: '/' },
  { name: 'detail', path: '/products/1' },
  { name: 'filter', path: '/filter' },
  { name: 'cart', path: '/cart' },
];

export const LATENCY_PRESETS: LatencyPreset[] = [0, 500, 1500];

export const DEVICES: Device[] = ['desktop', 'mobile'];

/**
 * Reads a STRATEGY.md file and extracts the rendering mode for a given page.
 * Returns a short label like "SSG", "SSR", "CSR", or "N/A" if not found.
 */
function extractMode(strategyPath: string, pageName: string): string {
  try {
    const content = readFileSync(strategyPath, 'utf-8');
    const pageAliases: Record<string, string[]> = {
      listing: ['listing', 'index', 'product list', 'products'],
      detail: ['detail', 'product detail', 'product page'],
      filter: ['filter', 'category'],
      cart: ['cart'],
    };
    const aliases = pageAliases[pageName] ?? [pageName];

    // Look for lines that mention the page and contain SSG/SSR/CSR
    const lines = content.split('\n');
    for (const line of lines) {
      const lower = line.toLowerCase();
      if (aliases.some((a) => lower.includes(a))) {
        const match = line.match(/\b(SSG|SSR|CSR|ISR|streaming|static|server|client)\b/i);
        if (match?.[1]) return match[1].toUpperCase();
      }
    }
    return 'N/A';
  } catch {
    return 'N/A';
  }
}

/**
 * Builds the full benchmark matrix: app × page × latency × device.
 * Reads STRATEGY.md from each app's package directory to populate modeUsed.
 */
export function buildMatrix(repoRoot: string): MatrixCell[] {
  const matrix: MatrixCell[] = [];

  for (const app of APPS) {
    const strategyPath = join(repoRoot, 'packages', app.name, 'STRATEGY.md');
    for (const page of PAGES) {
      const modeUsed = extractMode(strategyPath, page.name);
      for (const latency of LATENCY_PRESETS) {
        for (const device of DEVICES) {
          matrix.push({ app, page, latency, device, modeUsed });
        }
      }
    }
  }

  return matrix;
}
