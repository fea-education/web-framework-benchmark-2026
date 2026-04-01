/**
 * Benchmark runner — orchestrates the full benchmark matrix.
 *
 * For each latency preset (0, 500, 1500 ms):
 *   - Sets LATENCY_MS on the API container via docker compose
 *   - Waits for API readiness
 *   - For each (app × page × device): runs Lighthouse 3 times via Playwright
 *
 * Outputs:
 *   - results/run-<timestamp>-<app>-<page>-<latency>-<device>.json  (raw)
 *   - results/results.md  (aggregated summary table)
 */

import { chromium } from 'playwright';
import lighthouse from 'lighthouse';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { aggregate } from './aggregator.js';
import { generateMarkdown } from './markdown.js';
import { buildMatrix } from './matrix.js';
import { MOBILE_CONFIG, DESKTOP_CONFIG } from './devices.js';
import type { RawRunResult, LatencyPreset } from './types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..', '..');
// Allow RESULTS_DIR to be overridden (e.g. to /results inside Docker)
const RESULTS_DIR = process.env['RESULTS_DIR'] ?? join(REPO_ROOT, 'results');
const RUNS_PER_CELL = 3;

// API service URL (inside Docker network or via exposed port in CI)
const API_BASE = process.env['API_BASE'] ?? 'http://localhost:3000';

function log(msg: string): void {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${msg}`);
}

/**
 * Sets LATENCY_MS on the running API container by restarting it with the new env var.
 * Uses `docker compose` CLI.
 */
function setLatency(latencyMs: LatencyPreset): void {
  log(`Setting LATENCY_MS=${latencyMs} on API container...`);
  try {
    // Set the env var and restart only the api service
    execSync(`docker compose -f "${join(REPO_ROOT, 'docker-compose.yml')}" up -d --no-deps -e LATENCY_MS=${latencyMs} api`, {
      stdio: 'pipe',
      env: { ...process.env, LATENCY_MS: String(latencyMs) },
    });
    // Brief pause to let the container restart
    execSync('sleep 3', { stdio: 'pipe' });
  } catch (e) {
    log(`Warning: Could not set latency via docker compose: ${String(e)}`);
    log('Proceeding — LATENCY_MS may have been set via environment variable externally.');
  }
}

/**
 * Polls GET /health until the API is ready (max 30 seconds).
 */
async function waitForApi(): Promise<void> {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) {
        log('API is ready.');
        return;
      }
    } catch {
      // not ready yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`API at ${API_BASE}/health did not become ready within 30s`);
}

interface LighthouseMetrics {
  lcp: number;
  fcp: number;
  tbt: number;
  inp: number;
  cls: number;
  ttfb: number;
  performanceScore: number;
  jsBundleSize: number;
}

/**
 * Runs a single Lighthouse audit against the given URL using an existing
 * Playwright Chromium browser instance. Returns extracted metrics.
 */
async function runLighthouse(url: string, device: 'desktop' | 'mobile'): Promise<LighthouseMetrics> {
  const deviceCfg = device === 'mobile' ? MOBILE_CONFIG : DESKTOP_CONFIG;

  // Use a fixed remote debugging port for Lighthouse to connect to
  const REMOTE_DEBUG_PORT = 9222 + Math.floor(Math.random() * 100); // avoid collisions on parallel runs

  const browser = await chromium.launch({
    args: [`--remote-debugging-port=${REMOTE_DEBUG_PORT}`],
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 }).catch(() => {
      // Ignore navigation errors — page may still be usable
    });

    // Lighthouse connects to the already-launched Chromium via remote debugging port
    const result = await lighthouse(url, {
      port: REMOTE_DEBUG_PORT,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance'],
      formFactor: deviceCfg.formFactor,
      screenEmulation: deviceCfg.screenEmulation,
      throttling: deviceCfg.throttling,
      throttlingMethod: deviceCfg.throttlingMethod,
    } as Parameters<typeof lighthouse>[1]);

    if (!result?.lhr) {
      throw new Error('Lighthouse returned no results');
    }

    const lhr = result.lhr;
    const audits = lhr.audits;

    // Extract JS bundle size from network requests audit
    let jsBundleSize = 0;
    const networkAudit = audits['network-requests'];
    if (networkAudit?.details && 'items' in networkAudit.details) {
      const items = networkAudit.details.items as Array<{
        resourceType?: string;
        transferSize?: number;
      }>;
      jsBundleSize = items
        .filter((item) => item.resourceType === 'Script')
        .reduce((sum, item) => sum + (item.transferSize ?? 0), 0);
    }

    return {
      lcp: (audits['largest-contentful-paint']?.numericValue ?? 0),
      fcp: (audits['first-contentful-paint']?.numericValue ?? 0),
      tbt: (audits['total-blocking-time']?.numericValue ?? 0),
      inp: (audits['interaction-to-next-paint']?.numericValue ?? 0),
      cls: (audits['cumulative-layout-shift']?.numericValue ?? 0),
      ttfb: (audits['server-response-time']?.numericValue ?? 0),
      performanceScore: Math.round((lhr.categories['performance']?.score ?? 0) * 100),
      jsBundleSize,
    };
  } finally {
    await browser.close();
  }
}

/**
 * Ensures the results directory exists.
 */
function ensureResultsDir(): void {
  mkdirSync(RESULTS_DIR, { recursive: true });
}

/**
 * Main entry point — runs the full benchmark matrix.
 */
export async function runBenchmark(): Promise<void> {
  ensureResultsDir();
  const matrix = buildMatrix(REPO_ROOT);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const allRuns: RawRunResult[] = [];

  // Group matrix cells by latency preset to minimise API restarts
  const latencyGroups = new Map<LatencyPreset, typeof matrix>();
  for (const cell of matrix) {
    const group = latencyGroups.get(cell.latency) ?? [];
    group.push(cell);
    latencyGroups.set(cell.latency, group);
  }

  for (const [latency, cells] of latencyGroups) {
    setLatency(latency);
    await waitForApi();

    for (const cell of cells) {
      const { app, page, device, modeUsed } = cell;
      const url = `${app.baseUrl}${page.path}`;
      log(`Benchmarking ${app.name}/${page.name} @ ${latency}ms latency (${device})...`);

      for (let run = 0; run < RUNS_PER_CELL; run++) {
        log(`  Run ${run + 1}/${RUNS_PER_CELL}...`);
        try {
          const metrics = await runLighthouse(url, device);
          const rawResult: RawRunResult = {
            app: app.name,
            page: page.name,
            latency,
            device,
            runIndex: run,
            metrics,
          };

          // Write raw result to individual file
          const filename = `run-${timestamp}-${app.name}-${page.name}-${latency}-${device}-${run}.json`;
          writeFileSync(join(RESULTS_DIR, filename), JSON.stringify(rawResult, null, 2));

          allRuns.push({ ...rawResult, ...(modeUsed ? { modeUsed } : {}) });
          log(`  Run ${run + 1} complete: LCP=${metrics.lcp.toFixed(0)}ms Score=${metrics.performanceScore}`);
        } catch (err) {
          log(`  Run ${run + 1} FAILED: ${String(err)}`);
          // Record zeroed metrics so the cell still appears in the output
          allRuns.push({
            app: app.name,
            page: page.name,
            latency,
            device,
            runIndex: run,
            metrics: { lcp: 0, fcp: 0, tbt: 0, inp: 0, cls: 0, ttfb: 0, performanceScore: 0, jsBundleSize: 0 },
          });
        }
      }
    }
  }

  // Aggregate and write Markdown summary
  const aggregated = aggregate(allRuns);

  // Attach modeUsed from the matrix lookup
  const modeMap = new Map<string, string>();
  for (const cell of matrix) {
    const key = `${cell.app.name}|${cell.page.name}`;
    if (!modeMap.has(key)) modeMap.set(key, cell.modeUsed);
  }
  for (const row of aggregated) {
    const key = `${row.app}|${row.page}`;
    row.modeUsed = modeMap.get(key) ?? 'N/A';
  }

  const markdown = generateMarkdown(aggregated);
  const mdPath = join(RESULTS_DIR, 'results.md');
  writeFileSync(mdPath, markdown);
  log(`Results written to ${mdPath}`);

  // Also write aggregated JSON
  const jsonPath = join(RESULTS_DIR, `aggregated-${timestamp}.json`);
  writeFileSync(jsonPath, JSON.stringify(aggregated, null, 2));
  log(`Aggregated JSON written to ${jsonPath}`);

  log('Benchmark complete.');
}

// Run if executed directly (not imported as a module)
runBenchmark().catch((err) => {
  console.error('Benchmark runner failed:', err);
  process.exit(1);
});
